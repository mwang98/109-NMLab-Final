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
            selectedMid: null,
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

        // retrieve data from eth networks
    };

    uploadFile = async (buffer) => {
        var result = await ipfs.add(buffer);
        return result.value.path;
    };

    onSelectMail = (event, mid) => {
        this.setState({ selectedMid: mid });
    };

    onSaveMail = (event, mail) => {
        this.setState((state) => {
            const { id } = mail;
            const newMailMap = new Map(state.mailMap);
            const newMail = {
                ...newMailMap.get(id),
                ...mail,
            };
            return { mailMap: newMailMap.set(id, newMail) };
        });
    };

    onSendMail = async (event, mail) => {
        const { contract, accounts } = this.props;

        console.log(contract, accounts);
        console.log(mail);

        if (this.props.type === PAGE_TYPE.INBOX) {
            mail.isOpen = true;

            const state = "Code form solidty";
            // open mail
        }
    };
    onDeleteMail = (event, mid) => {
        const state = "Code form solidty";
        // delete from database

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

    onUploadFile = (event) => {};

    onCreateMail = (event) => {
        const { accounts } = this.props;
        if (!accounts) return;

        // create new mail
        console.log("create new mail");
        const mid = uuidv4();
        const newMail = {
            id: mid,
            subject: "New Mail",
            senderAddr: accounts[0],
            senderName: "NOT_IMPLEMENTED", // getUserProfile -> name
            receiverAddr: "",
            receiverName: "",
            timestamp: "",
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
                                <Button variant="outlined" onClick={this.onCreateMail}>
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
