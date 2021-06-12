import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import { PAGE_TYPE } from "../constants/Page";
import { formatTimestamp } from "../utils/utils";

const styles = (theme) => ({
    cardUnread: {
        backgroundColor: "#EAF6E9",
    },
    bold: {
        fontWeight: 600,
    },
});

class MailCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, mail, pageType, selectedMid, onSelectMail, onDeleteMail } = this.props;
        return (
            <ListItem
                button
                alignItems="flex-start"
                selected={selectedMid === mail.uuid}
                onClick={(event) => onSelectMail(event, mail.uuid)}
                className={pageType === PAGE_TYPE.DRAFT || mail.isOpen ? {} : classes.cardUnread}
            >
                <ListItemAvatar>
                    <Avatar alt={mail.senderName} src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                    primary={mail.subject}
                    secondary={
                        <Typography component="span" color="textPrimary" className={classes.bold}>
                            {`${pageType === PAGE_TYPE.DRAFT ? "receiver: " : ""} ${mail.senderName}`}
                        </Typography>
                    }
                />
                <ListItemText primary={formatTimestamp(mail.timestamp)} />
                <ListItemSecondaryAction>
                    <IconButton onClick={(event) => onDeleteMail(event, mail)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default withStyles(styles)(MailCard);
