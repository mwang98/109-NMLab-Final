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
        justifyContent: 'center',
        padding: theme.spacing(5)
    },
    paper: {
        padding: theme.spacing(5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }
});

class InboxPage extends Component{

    constructor(props){
        super(props);
        this.state = {
            selectedMid: '',
            mailMap: new Map()
        }
        MockMailList.forEach(mail => this.state.mailMap.set(mail.id, mail))
    }

    componentDidMount = async () => {

    }

    onSelectMail = (event, mid) => {
        this.setState({selectedMid: mid})
    }
    onSaveMail = (event, mail) => {
        this.setState(state => {
            const { id } = mail
            const newMailMap = new Map(state.mailMap)
            const newMail = {
                ...newMailMap.get(id),
                ...mail
            }
            return {mailMap: newMailMap.set(id, newMail)}
        })
    }
    onSendMail = event => {
        
    }


    render(){
        const { classes } = this.props;
        const { mailMap, selectedMid } = this.state

        return(
             <div className={classes.root}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <Paper elevation={3} className={classes.paper}>
                            <MailPreview mail={mailMap.get(selectedMid)}
                                         isInbox={false}
                                         readOnly={false}
                                         onSaveMail={this.onSaveMail}
                                         onSendMail={this.onSendMail}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper elevation={3}>
                            <MailBox 
                                mailList={[...mailMap.values()]} 
                                selectedMid={selectedMid}
                                onSelectMail={this.onSelectMail} />
                        </Paper>
                    </Grid>
                </Grid>
           </div>
        )
    }
}
export default withStyles(styles)(InboxPage);
