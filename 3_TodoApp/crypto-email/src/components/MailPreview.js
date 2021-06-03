import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
});

class MailPreview extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { classes, mail } = this.props;
        console.log(mail)
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography align='left' color='primary' variant='h4'>
                        {mail.subject}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Avatar alt={mail.sender} src="/static/images/avatar/1.jpg" />
                </Grid>
                <Grid item xs={6}>
                    <Typography align='left' color='textPrimary' variant='body'>
                        {mail.sender}
                    </Typography>
                    <br />
                    <Typography align='left' color='textSecondary' variant='body'>
                        Send From: {mail.sender}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography align='left' color='textPrimary' variant='body'>
                        {mail.timestamp}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography align='left' color='textSecondary' variant='body'>
                        {mail.contents}
                    </Typography>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(MailPreview);