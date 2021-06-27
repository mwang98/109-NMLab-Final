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
import { extractUserInfo, uploadFile, downloadFile, validateAddr, encryptMail } from "../utils/utils";

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
            name: "",
            address: "",
            pubKey: "",
            selectedMid: null,
            mailMap: new Map(),
        };
    }

    componentDidMount = async () => {
        const { accounts, contract, ipfsNode } = this.props;
        if (!accounts || !contract || !ipfsNode) return;

        const address = accounts[0];
        const userInfo = await contract.methods.getUser(address).call();
        if (!userInfo) return;

        const { name, pubKey } = extractUserInfo(userInfo);

        this.setState({ address, name, pubKey });

        await this.updateMyMailBox();
    };

    updateMyMailBox = async () => {
        const { address } = this.state;
        const { contract, type, ipfsNode } = this.props;
        console.log(address);
        let mailBox = [];
        let newMailMap = new Map();
        switch (type) {
            case PAGE_TYPE.INBOX:
                mailBox = await contract.methods.getInboxMails(address).call();
                break;
            case PAGE_TYPE.OUTBOX:
                mailBox = await contract.methods.getOutboxMails(address).call();
                break;
            case PAGE_TYPE.DRAFT:
                mailBox = await contract.methods.getDraftboxMails(address).call();
        }
        await Promise.all(
            mailBox.map(async (mail) => {
                const receiverProfile = extractUserInfo(await contract.methods.getUser(mail.receiverAddr).call());
                const senderProfile = extractUserInfo(await contract.methods.getUser(mail.senderAddr).call());
                const receiverName = receiverProfile.name;
                const senderName = senderProfile.name;
                const timestamp = parseInt(mail.timestamp, 10);

                const profile = type === PAGE_TYPE.INBOX ? senderProfile : receiverProfile;

                let { url } = await downloadFile(ipfsNode, profile.iconIPFSHash);
                let { isCertified } = profile;

                newMailMap.set(mail.uuid, { ...mail, timestamp, receiverName, senderName, imageUrl: url, isCertified });
            })
        );
        this.setState({
            mailMap: newMailMap,
        });
    };

    uploadMultiMediaContents = async (contents) => {
        const { ipfsNode } = this.props;
        await Promise.all(
            contents.map(async (content) => {
                content.IPFSHash = await uploadFile(ipfsNode, content.buffer);
            })
        );
    };

    mediaContentsJS2Sol = (contents) => contents.map((c) => [c.fileName, c.fileType, c.IPFSHash]);
    mediaContentsSol2JS = (contents) => contents.map((c) => ({ fileName: c[0], fileType: c[1], IPFSHash: c[2] }));

    onSelectMail = async (event, mid) => {
        const { address, mailMap } = this.state;
        const { contract, type, ipfsNode } = this.props;
        const mail = mailMap.get(mid);

        if (type === PAGE_TYPE.INBOX && !mail.isOpen) {
            await contract.methods.openMail(mid).send({ from: address });
            mail.isOpen = true;
        }

        if (mail.multiMediaContents.length && mail.multiMediaContents[0] instanceof Array) {
            mail.multiMediaContents = this.mediaContentsSol2JS(mail.multiMediaContents);

            await Promise.all(
                mail.multiMediaContents.map(async (content) => {
                    const { buffer } = await downloadFile(ipfsNode, content.IPFSHash);
                    content.buffer = buffer;
                })
            );
        }

        this.setState({ selectedMid: mid });
    };

    onSendMail = async (event, mail, crypto) => {
        const { contract } = this.props;

        if (!(await validateAddr(mail.receiverAddr))) {
            alert(`Invalid receiver address: ${mail.receiverAddr}`);
            return;
        }

        const receiverInfo = await contract.methods.getUser(mail.receiverAddr).call();
        if (!receiverInfo) return;

        const { pubKey } = extractUserInfo(receiverInfo);
        if (!pubKey) {
            alert("Please provide your public key");
            return;
        }

        const newMail = crypto ? await encryptMail(pubKey, mail) : mail;
        await this.uploadMultiMediaContents(newMail.multiMediaContents);

        await contract.methods
            .sendMail([
                newMail.uuid,
                newMail.senderAddr,
                newMail.receiverAddr,
                newMail.subject,
                Date.now(),
                newMail.contents,
                this.mediaContentsJS2Sol(newMail.multiMediaContents),
                newMail.isOpen,
            ])
            .send({ from: newMail.senderAddr });
        await this.updateMyMailBox();
    };

    onDeleteMail = async (event, mail) => {
        const { address } = this.state;
        const { contract } = this.props;

        try {
            await contract.methods
                .deleteMail(address, [
                    mail.uuid,
                    mail.senderAddr,
                    mail.receiverAddr,
                    mail.subject,
                    mail.timestamp,
                    mail.contents,
                    this.mediaContentsJS2Sol(mail.multiMediaContents),
                    mail.isOpen,
                ])
                .send({ from: address });
        } catch (e) {
        } finally {
            // client
            this.setState((state) => {
                state.mailMap.delete(mail.uuid);
                return state;
            });
        }
    };

    onSaveMail = async (event, mail, crypto) => {
        event.preventDefault();

        const { address, pubKey } = this.state;
        const { contract } = this.props;

        if (!(await validateAddr(mail.receiverAddr))) {
            alert(`Invalid receiver address: ${mail.receiverAddr}`);
            return;
        }
        if (!pubKey) {
            alert("Please provide your public key");
            return;
        }

        var { name } = extractUserInfo(await contract.methods.getUser(mail.receiverAddr).call());
        mail.receiverName = name;

        const newMail = crypto ? await encryptMail(pubKey, mail) : mail;
        await this.uploadMultiMediaContents(newMail.multiMediaContents);

        await contract.methods
            .saveMail(address, [
                newMail.uuid,
                newMail.senderAddr,
                newMail.receiverAddr,
                newMail.subject,
                newMail.timestamp,
                newMail.contents,
                this.mediaContentsJS2Sol(newMail.multiMediaContents),
                newMail.isOpen,
            ])
            .send({ from: address });
        await this.updateMyMailBox();
    };

    onCreateMail = (event) => {
        const { name, address } = this.state;

        // create new mail
        const mid = uuidv4();
        const newMail = {
            uuid: mid,
            subject: "<subject>",
            senderAddr: address,
            senderName: name,
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

        const mailList = Array.from(mailMap.values());
        mailList.sort((a, b) => b.timestamp - a.timestamp);

        return (
            <div className={classes.root}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <Paper elevation={3} className={classes.paper}>
                            {type === PAGE_TYPE.DRAFT ? (
                                <Button variant="outlined" color="primary" onClick={this.onCreateMail}>
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
                                mailList={mailList}
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
