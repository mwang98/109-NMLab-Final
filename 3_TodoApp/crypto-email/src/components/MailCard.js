import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
      width: '100%',
      // maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline'
    },
    card: {
        height: '100%'
    }
});

class MailCard extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { classes, mail, selectedMid, onSelectMail } = this.props;
        return (
        <ListItem 
            alignItems="flex-start"
            button
            selected={selectedMid === mail.id}
            onClick={event => onSelectMail(event, mail.id)}
            className={classes.card}>
        <ListItemAvatar>
            <Avatar alt={mail.sender} src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
            primary={mail.subject}
            secondary={
                <React.Fragment>
                    <Typography component="span" className={classes.inline} color="textPrimary">
                        {mail.sender}
                    </Typography>
                    <br />
                    <Typography component="span" className={classes.inline} color="textSecondary">
                       {'Content: ' + mail.contents}
                    </Typography>
                </React.Fragment>
        }
        />
    </ListItem>)
    }
}

export default withStyles(styles)(MailCard);