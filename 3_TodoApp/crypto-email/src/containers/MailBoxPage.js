import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import "./MailBoxPage.css";
import MailBox from "../components/MailBox";
import MailPreview from "../components/MailEditor";
import { PAGE_TYPE } from "../constants/Page";
import uint8ArrayConcat from "uint8arrays/concat";

const styles = (theme) => ({
    root: {
        justifyContent: "center",
        padding: theme.spacing(5),
    },
    paper: {
        padding: theme.spacing(5),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
});

class MailBoxPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userAddr: "",
            userPubKey: "",
            selectedMid: null,
            mailMap: new Map(),
        };
    }

    componentDidMount = async () => {
        const { accounts, contract } = this.props;
        if (!accounts || !contract) return;

        let profile = await contract.methods.getUser(accounts[0]).call();

        this.setState({
            userAddr: accounts[0],
            userName: profile[0],
            userPubKey: profile[1],
        });

        await this.updateMyMailBox();
    };

    updateMyMailBox = async () => {
        const { userAddr } = this.state;
        const { contract, type } = this.props;

        let mailBox = [];
        let newMailMap = new Map();
        switch (type) {
            case PAGE_TYPE.INBOX:
                mailBox = await contract.methods.getInboxMails(userAddr).call();
                break;
            case PAGE_TYPE.OUTBOX:
                mailBox = await contract.methods.getOutboxMails(userAddr).call();
                break;
            case PAGE_TYPE.DRAFT:
                mailBox = await contract.methods.getDraftboxMails(userAddr).call();
        }
        await Promise.all(
            mailBox.map(async (mail) => {
                const receiverName = (await contract.methods.getUser(mail.receiverAddr).call())[0];
                const senderName = (await contract.methods.getUser(mail.senderAddr).call())[0];
                const timestamp = parseInt(mail.timestamp, 10);
                newMailMap.set(mail.uuid, { ...mail, timestamp, receiverName, senderName });
            })
        );
        this.setState({
            mailMap: newMailMap,
        });
    };

    uploadFile = async (buffer) => {
        const { ipfsNode } = this.props;
        const { path } = await ipfsNode.add(buffer);
        return path;
    };

    downloadFile = async (IPFSHash) => {
        const { ipfsNode } = this.props;

        console.log("IPFS", IPFSHash);

        let content = [];
        for await (const chunk of ipfsNode.cat(IPFSHash)) {
            content.push(chunk);
        }

        const contentRaw = uint8ArrayConcat(content);
        const buffer = await Buffer.from(contentRaw);

        return buffer;
    };

    mediaContentsJS2Sol = (contents) => contents.map((c) => [c.fileName, c.fileType, c.IPFSHash]);
    mediaContentsSol2JS = (contents) => contents.map((c) => ({ fileName: c[0], fileType: c[1], IPFSHash: c[2] }));

    onSelectMail = async (event, mid) => {
        const { userAddr, mailMap } = this.state;
        const { contract, type } = this.props;
        const mail = mailMap.get(mid);

        if (type === PAGE_TYPE.INBOX && !mail.isOpen) {
            await contract.methods.openMail(mid).send({ from: userAddr });
            mail.isOpen = true;
        }

        if (mail.multiMediaContents.length && mail.multiMediaContents[0] instanceof Array) {
            console.log(mail.multiMediaContents);
            mail.multiMediaContents = this.mediaContentsSol2JS(mail.multiMediaContents);

            await Promise.all(
                mail.multiMediaContents.map(async (content) => {
                    content.buffer = await this.downloadFile(content.IPFSHash);
                })
            );
        }

        this.setState({ selectedMid: mid });
    };

    onSendMail = async (event, mail) => {
        const { contract } = this.props;

        await contract.methods
            .sendMail([
                mail.uuid,
                mail.senderAddr,
                mail.receiverAddr,
                mail.subject,
                mail.timestamp,
                mail.contents,
                this.mediaContentsJS2Sol(mail.multiMediaContents),
                mail.isOpen,
            ])
            .send({ from: mail.senderAddr });
    };

    onDeleteMail = async (event, mail) => {
        const { userAddr } = this.state;
        const { contract } = this.props;

        await contract.methods
            .deleteMail(userAddr, [
                mail.uuid,
                mail.senderAddr,
                mail.receiverAddr,
                mail.subject,
                mail.timestamp,
                mail.contents,
                this.mediaContentsJS2Sol(mail.multiMediaContents),
                mail.isOpen,
            ])
            .send({ from: userAddr });

        // client
        this.setState((state) => {
            state.mailMap.delete(mail.uuid);
            return state;
        });
    };

    onSaveMail = async (event, mail) => {
        event.preventDefault();

        const { userAddr } = this.state;
        const { contract } = this.props;

        // receiver exsit
        try {
            var receiverProfile = await contract.methods.getUser(mail.receiverAddr).call();
            if (receiverProfile[0] === "") {
                throw `${mail.receiverAddr} not exists`;
            }
            mail.receiverName = receiverProfile[0];
        } catch (err) {
            alert(receiverProfile ? `${mail.receiverAddr} not exists` : `${mail.receiverAddr} is invalid address`);
            return;
        }

        try {
            const { id, multiMediaContents } = mail;

            await Promise.all(
                multiMediaContents.map(async (content) => {
                    content.IPFSHash = await this.uploadFile(content.buffer);
                })
            );

            // eth network
            await contract.methods
                .saveMail(userAddr, [
                    mail.uuid,
                    mail.senderAddr,
                    mail.receiverAddr,
                    mail.subject,
                    mail.timestamp,
                    mail.contents,
                    this.mediaContentsJS2Sol(mail.multiMediaContents),
                    mail.isOpen,
                ])
                .send({ from: userAddr });

            // client
            this.setState((state) => ({ mailMap: state.mailMap.set(id, mail) }));
        } catch (err) {
            console.log(err);
        }
    };

    onCreateMail = (event) => {
        const { userName, userAddr } = this.state;

        // create new mail
        const mid = uuidv4();
        const newMail = {
            uuid: mid,
            subject: "<subject>",
            senderAddr: userAddr,
            senderName: userName,
            receiverAddr: "",
            receiverName: "",
            timestamp: Date.now(),
            contents: "",
            multiMediaContents: [],
            isOpen: false,
        };

        this.setState((state) => ({
            selectedMid: mid,
            mailMap: state.mailMap.set(mid, newMail),
        }));
    };

    render() {
        const { classes, type } = this.props;
        const { mailMap, selectedMid } = this.state;

        return (
            <div className={classes.root}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <Paper elevation={3} className={classes.paper}>
                            {type === PAGE_TYPE.DRAFT ? (
                                <Button letiant="outlined" onClick={this.onCreateMail}>
                                    new mail
                                </Button>
                            ) : (
                                <></>
                            )}
                            {selectedMid ? (
                                <MailPreview
                                    mail={mailMap.get(selectedMid)}
                                    pageType={type}
                                    onSaveMail={this.onSaveMail}
                                    onSendMail={this.onSendMail}
                                />
                            ) : (
                                <></>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper elevation={3}>
                            <MailBox
                                mailList={[...Array.from(mailMap.values()).reverse()]}
                                pageType={type}
                                selectedMid={selectedMid}
                                onSelectMail={this.onSelectMail}
                                onDeleteMail={this.onDeleteMail}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default withStyles(styles)(MailBoxPage);
