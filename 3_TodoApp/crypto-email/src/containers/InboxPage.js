import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import MailBox from '../components/MailBox';
import MailPreview from '../components/MailPreview'

import MockMailList from '../mock/mail.js'

import './InboxPage.css';

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

class InboxPage extends Component{

    constructor(props){
        super(props);
        this.state = {
            selectedMid: ''
        }
    }

    componentDidMount = async () => {

    }

    onSelectMail = (event, mid) => {
        this.setState({selectedMid: mid})
        console.log(mid)
    }


    render(){
        const { classes } = this.props;
        var mailMap = new Map();
        MockMailList.forEach(mail => mailMap.set(mail.id, mail))

        return(
             <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>xs=12</Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <MailPreview mail={mailMap.get(this.state.selectedMid)} />
                    </Grid>
                    <Grid item xs={6}>
                        <MailBox 
                            mailList={MockMailList} 
                            selectedMid={this.state.selectedMid}
                            onSelectMail={this.onSelectMail} />
                    </Grid>
                </Grid>
           </div>
        )
    }
}
export default withStyles(styles)(InboxPage);
