import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
// import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';

import AttachFile from './AttachFile';

const styles = theme => ({
    root: {
        flexGrow: 1,
        alignItems: 'center'
    },
    flexStart: {
        alignItems: 'flext-start',
        justifyContent: 'space-between'
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        alignSelf: 'center'
    },
    submit:{
        justifyContent: 'flex-end'
    },
    upload: {
        justifyContent: 'flex-start'
    }
});

class MailPreview extends Component{
    constructor(props){
        super(props);
        
        const { readOnly, mail } = props

        this.state = {
            readOnly: readOnly,
            multiMedia: {
                pdfList: [],
                fileList: [],
                videoList: []
            },
            fileList: [],
            mail: mail
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(state.mail.id !== props.mail.id){
            return {...state, mail: props.mail}
        }
        return null
    }

    onUploadFile = event => {
        this.setState(state => ({
            fileList: [...state.fileList, ...event.target.files]
        }))
    }

    onChangeSubject = event => {
        this.setState(state => ({
            mail: {
                ...state.mail,
                subject: event.target.value
            }
        }))
    }
    onChangeContents = event => {
        this.setState(state => ({
            mail: {
                ...state.mail,
                contents: event.target.value
            }
        }))
    }
    onChangeReceiverAddr = event => {
        this.setState(state => ({
            mail: {
                ...state.mail,
                receiverAddr: event.target.value
            }
        }))
    }


    render(){
        const { classes, isInbox, onSaveMail, onSendMail } = this.props
        const { readOnly, mail } = this.state
        const { subject, senderAddr, senderName, receiverAddr, receiverName, timestamp, contents } = this.state.mail

        return (
            <Grid container spacing={3} className={classes.root}>
                <Grid item xs={12}>
                    <TextField
                        label="Subject"
                        value={subject}
                        InputProps={{ readOnly: readOnly }}
                        fullWidth 
                        onChange={this.onChangeSubject}
                        />
                </Grid>
                <Grid item xs={2}>
                    <Avatar alt={isInbox ? senderName: receiverName}
                            className={classes.large} 
                            src="../logo.png" />
                </Grid>
                <Grid item xs={10} container className={classes.flexStart}>
                    <Grid item xs={9}>
                        <TextField
                            label={isInbox ? "Sender": "Receiver"}
                            value={isInbox ? senderName: receiverName}
                            InputProps={{ readOnly: true }}
                            fullWidth />
                        
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label="Timestamp"
                            value={timestamp}
                            InputProps={{ readOnly: true }}
                            fullWidth />
                        
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            label="Address"
                            value={isInbox ? senderAddr: receiverAddr}
                            InputProps={{ readOnly: readOnly }}
                            fullWidth 
                            onChange={this.onChangeReceiverAddr}/> 
                    </Grid>
                    <Grid item xs={2}><Button>Read</Button></Grid>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Contents"
                        value={contents}
                        InputProps={{ readOnly: readOnly }}
                        fullWidth 
                        multiline
                        rowsMax={20}
                        rows={20}
                        variant="outlined"
                        className={classes.contents}/>
                </Grid>
                {!readOnly ? 
                <>
                <Grid item xs={12}>
                    {this.state.fileList.map(file => <AttachFile filename={file.name}/>)}
                </Grid>
                <Grid container xs={6} className={classes.upload}>
                    <Button><PictureAsPdfIcon color='primary'/><input type='file' accept='.pdf' onChange={this.onUploadFile}/></Button><br/>
                    <Button><InsertPhotoIcon color='primary'/><input type='file' accept='image/*' onChange={this.onUploadFile}/></Button><br/>
                    <Button><VideoLibraryIcon color='primary'/><input type='file' accept='video/*'onChange={this.onUploadFile}/></Button>
                </Grid>
                <Grid container xs={6} className={classes.submit}>
                    <Grid item xs={3}> <Button variant="outlined" color="primary" onClick={e => onSaveMail(e, mail)}> save </Button> </Grid>
                    <Grid item xs={3}> <Button variant="outlined" color="primary"> send </Button> </Grid>
                </Grid>
                </> : <></>
                }
                <Grid container xs={12} className={classes.submit}>
                    <Grid item xs={3}> <Button variant="outlined" color="primary"> reply </Button> </Grid>
                </Grid>
                
            </Grid>
        )
    }
}

export default withStyles(styles)(MailPreview);