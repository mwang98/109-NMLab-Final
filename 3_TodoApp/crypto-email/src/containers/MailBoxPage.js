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
    onSendMail = (event) => {};

    onUploadFile = (event) => {
        
    }

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
