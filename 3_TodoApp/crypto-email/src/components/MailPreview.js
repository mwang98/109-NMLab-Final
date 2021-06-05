import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
// import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';


import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import SendIcon from '@material-ui/icons/Send';
import ReplyIcon from '@material-ui/icons/Reply';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import AttachFile from './AttachFile';
import { PAGE_TYPE } from '../constants/Page';

const styles = theme => ({
    root: {
        flexGrow: 1,
        alignItems: 'center'
    },
    flexStart: {
        alignItems: 'flext-start',
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
        
        const { mail } = props

        this.state = {
            multiMedia: {
                pdfList: [],
                fileList: [],
                videoList: []
            },
            fileList: [],
            mail: mail,
            mailIsSaved: true,
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
                subject: event.target.value,
            },
            mailIsSaved: false
        }))
    }
    onChangeContents = event => {
        this.setState(state => ({
            mail: {
                ...state.mail,
                contents: event.target.value,
            },
            mailIsSaved: false
        }))
    }
    onChangeReceiverAddr = event => {
        this.setState(state => ({
            mail: {
                ...state.mail,
                receiverAddr: event.target.value,
            },
            mailIsSaved: false
        }))
    }
    onSaveMail = (event, mail) => {
        this.setState({mailIsSaved: true})
        this.props.onSaveMail(event, mail)
    }


    render(){
        const { classes, pageType, onSendMail } = this.props
        const { mail, mailIsSaved } = this.state
        const { subject, senderAddr, senderName, receiverAddr, receiverName, timestamp, contents, isOpen } = this.state.mail

        const readOnly = pageType !== PAGE_TYPE.DRAFT
        const isInbox = pageType === PAGE_TYPE.INBOX

        console.log(pageType, readOnly, isInbox)

        return (
            <Grid container spacing={3} className={classes.root}>
                <Grid item xs={12}>
                    <TextField
                        label='Subject'
                        value={subject}
                        InputProps={{ readOnly: readOnly }}
                        fullWidth 
                        onChange={this.onChangeSubject}
                        />
                </Grid>
                <Grid item xs={2}>
                    <Avatar alt={isInbox ? senderName: receiverName}
                            className={classes.large} 
                            src='../logo.png' />
                </Grid>
                <Grid item xs={10} container spacing={1} className={classes.flexStart}>
                    <Grid item xs={9}>
                        <TextField
                            label={isInbox ? 'Sender': 'Receiver'}
                            value={isInbox ? senderName: receiverName}
                            InputProps={{ readOnly: true }}
                            fullWidth />
                        
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label='Timestamp'
                            value={timestamp}
                            InputProps={{ readOnly: true }}
                            fullWidth />
                        
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            label='Address'
                            value={isInbox ? senderAddr: receiverAddr}
                            InputProps={{ readOnly: readOnly }}
                            fullWidth 
                            onChange={this.onChangeReceiverAddr}/> 
                    </Grid>
                    <Grid item xs={2}>
                        <Button color='primary'
                                variant={isOpen ? 'contained' : 'outlined'}
                                startIcon={isOpen ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                >
                            {isOpen ? 'read' : 'unread'}
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label='Contents'
                        value={contents}
                        InputProps={{ readOnly: readOnly }}
                        fullWidth 
                        multiline
                        rowsMax={20}
                        rows={20}
                        variant='outlined'
                        className={classes.contents}
                        onChange={this.onChangeContents}/>
                </Grid>
                {!readOnly ? 
                    <>
                    <Grid item xs={12}>
                        {this.state.fileList.map(file => <AttachFile filename={file.name}/>)}
                    </Grid>
                    <Grid container xs={5} className={classes.upload}>
                        <Button><PictureAsPdfIcon color='primary'/><input type='file' accept='.pdf' onChange={this.onUploadFile}/></Button><br/>
                        <Button><InsertPhotoIcon color='primary'/><input type='file' accept='image/*' onChange={this.onUploadFile}/></Button><br/>
                        <Button><VideoLibraryIcon color='primary'/><input type='file' accept='video/*'onChange={this.onUploadFile}/></Button>
                    </Grid>
                    <Grid container xs={7} spacing={1} className={classes.submit}>
                        <Grid item><Button variant={mailIsSaved ? 'outlined' : 'contained'} color='primary' startIcon={<SaveAltIcon />} onClick={e => this.onSaveMail(e, mail)}>save</Button> </Grid>
                        <Grid item><Button variant='outlined' color='primary' startIcon={<SendIcon />}>send</Button> </Grid>
                    </Grid>
                    </> :
                    <Grid container xs={12} className={classes.submit}>
                        <Grid item xs={3}> <Button variant='outlined' color='primary' startIcon={<ReplyIcon />}>reply</Button></Grid>
                    </Grid>
                }
            </Grid>
        )
    }
}

export default withStyles(styles)(MailPreview);