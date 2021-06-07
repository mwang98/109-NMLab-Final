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

const styles = (theme) => ({
    cardUnread: {
        backgroundColor: "#FAE8E0",
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
                selected={selectedMid === mail.id}
                onClick={(event) => onSelectMail(event, mail.id)}
                className={pageType === PAGE_TYPE.DRAFT || mail.isOpen ? {} : classes.cardUnread}
            >
                <ListItemAvatar>
                    <Avatar alt={mail.senderName} src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                    primary={mail.subject}
                    secondary={
                        <React.Fragment>
                            <Typography component="span" color="textPrimary">
                                {mail.senderName}
                            </Typography>
                        </React.Fragment>
                    }
                />
                <ListItemSecondaryAction>
                    <IconButton onClick={(event) => onDeleteMail(event, mail.id)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default withStyles(styles)(MailCard);
