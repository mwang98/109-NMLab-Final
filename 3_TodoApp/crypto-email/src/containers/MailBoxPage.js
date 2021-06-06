import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import "./MailBoxPage.css";
import MailBox from "../components/MailBox";
import MailPreview from "../components/MailPreview";
import { PAGE_TYPE } from "../constants/Page";

// mock data
import MockMailList from "../mock/mail.js";

import { ADDRESS, PORT, PROTOCOL } from "../constants/IPFS";

const { create } = require("ipfs-http-client");
const ipfs = create({ host: ADDRESS, port: PORT, protocol: PROTOCOL });

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
            selectedMid: "",
            mailMap: new Map(),
        };
        MockMailList.forEach((mail) => this.state.mailMap.set(mail.id, mail));
    }

    componentDidMount = async () => {};

    uploadFile = async (buffer) => {
        var result = await ipfs.add(buffer);
        return result.value.path;
    };

    onSelectMail = (event, mid) => {
        this.setState({ selectedMid: mid });
        if (this.props.type === PAGE_TYPE.INBOX) {
            let mail = this.state.mailMap.get(mid);
            mail.isOpen = true;
            this.onSaveMail(event, mail);
        }
    };
    onDeleteMail = (event) => {
        console.log("delete");
    };
    onSaveMail = async (event, mail) => {
        event.preventDefault();

        // ipfs
        console.log(ipfs.getEndpointConfig());
        console.log(ipfs);

        try {
            const { id, multiMediaContents } = mail;

            console.log(multiMediaContents);

            await Promise.all(
                multiMediaContents.map(async (content) => {
                    // const IPFSHash = await this.uploadFile(content.buffer);
                    const IPFSHash = "ipfs-hash-not-available";

                    // // upload to blockchain
                    // const { accounts, contract } = this.props;
                    // console.log(accounts);
                    // let status = await contract.methods
                    //     .Upload([this.state.fileName, this.state.fileType, mainIPFSHash, previewIPFSHash, accounts[0]])
                    //     .send({ from: accounts[0] });
                    // console.log("upload status", status);

                    content.IPFSHash = IPFSHash;

                    return content;
                })
            );

            console.log(multiMediaContents);

            // client
            this.setState((state) => {
                const newMailMap = new Map(state.mailMap);
                const newMail = {
                    ...newMailMap.get(id),
                    ...mail,
                };
                return { mailMap: newMailMap.set(id, newMail) };
            });

            console.log("FINISH!");
        } catch (err) {
            console.log(err);
        }
    };
    onSendMail = (event) => {};

    onUploadFile = (event) => {};

    render() {
        const { classes, type } = this.props;
        const { mailMap, selectedMid } = this.state;

        return (
            <div className={classes.root}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <Paper elevation={3} className={classes.paper}>
                            <MailPreview
                                mail={mailMap.get(selectedMid)}
                                pageType={type}
                                onSaveMail={this.onSaveMail}
                                onSendMail={this.onSendMail}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper elevation={3}>
                            <MailBox
                                mailList={[...mailMap.values()]}
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
