import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import "./MailBoxPage.css";
import MailBox from "../components/MailBox";
import MailPreview from "../components/MailPreview";
import { PAGE_TYPE } from "../constants/Page";
import { DummyMail } from "../constants/Mail";

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
    }

    componentDidMount = async () => {
        console.log("componentDidMount");
        this.updateMyMailBox();
    };

    updateMyMailBox = async () => {
        this.setState({
            mailMap: new Map(MockMailList.map((mail) => [mail.id, mail])),
        });

        const state = "Code form solidty";
        // retrieve data from eth networks
        // switch (this.props.type) {
        //     case PAGE_TYPE.INBOX:
        //         "Inbox";
        //         break;
        //     case PAGE_TYPE.OUTBOX:
        //         "Outbox";
        //         break;
        //     case PAGE_TYPE.DRAFT:
        //         "Draft";
        //         break;
        // }
    };

    uploadFile = async (buffer) => {
        var result = await ipfs.add(buffer);
        return result.value.path;
    };

    onSelectMail = (event, mid) => {
        this.setState({ selectedMid: mid });

        if (this.props.type === PAGE_TYPE.INBOX) {
            let mail = this.state.mailMap.get(mid);
            mail.isOpen = true;

            const state = "Code form solidty";
            // open mail
        }
    };
    onDeleteMail = (event, mid) => {
        const state = "Code form solidty";
        // delete from database
        // switch (this.props.type) {
        //     case PAGE_TYPE.INBOX:
        //         "Inbox";
        //         break;
        //     case PAGE_TYPE.OUTBOX:
        //         "Outbox";
        //         break;
        //     case PAGE_TYPE.DRAFT:
        //         "Draft";
        //         break;
        // }

        // client
        this.setState((state) => {
            state.mailMap.delete(mid);
            return state;
        });
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

                    const state = "Code form solidty";
                    // upload to blockchain
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
                const newMail = {
                    ...mail,
                    multiMediaContents: multiMediaContents,
                };
                return { mailMap: state.mailMap.set(id, newMail) };
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
        const mail = mailMap.has(selectedMid) ? mailMap.get(selectedMid) : DummyMail;

        return (
            <div className={classes.root}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <Paper elevation={3} className={classes.paper}>
                            <MailPreview
                                mail={mail}
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
