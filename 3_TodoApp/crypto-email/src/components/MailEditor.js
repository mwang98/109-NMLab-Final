import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import SendIcon from "@material-ui/icons/Send";
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import AttachFile from "./AttachFile";
import { ab2str, str2ab, decryptWithPrivateKey, formatTimestamp } from "../utils/utils";
import { PAGE_TYPE } from "../constants/Page";
import { DummyMail } from "../constants/Mail";

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        alignItems: "center",
    },
    certified: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        border: "5px solid #fbc02d",
    },
    uncertified: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        border: "5px solid #E6E6E6",
    },
    submit: {
        justifyContent: "flex-end",
    },
    upload: {
        justifyContent: "flex-start",
    },
});

class MailEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mail: DummyMail, // for render
            fileList: new Map(),
            mailIsSaved: true,
        };
        
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.mail || !state.mail) return null;
        if (state.mail.uuid !== props.mail.uuid) {
            return { mail: props.mail, fileList: new Map(), mailIsSaved: true };
        }
        return null;
    }

    getFileType = (typeStr) => {
        let filetype = typeStr.split("/");
        if (filetype[0] === "text") return "text";
        else if (filetype[0] === "video") return "video";
        else if (filetype[0] === "image") return "image";
        else if (filetype[1] === "pdf") return "pdf";
        return null;
    };

    toBuffer = async (id, reader) => {
        const buffer = await Buffer.from(reader.result);
        this.setState((state) => {
            const newFileList = new Map(state.fileList);
            const newFile = newFileList.get(id);
            newFile.buffer = buffer;
            return { fileList: newFileList.set(id, newFile) };
        });
    };

    onUploadFile = (event) => {
        event.stopPropagation();
        event.preventDefault();

        const file = event.target.files[0];
        const id = uuidv4();

        let fileType = this.getFileType(file.type);

        if (fileType === null) {
            alert(`${file.type} not supported !`);
            return;
        }

        this.setState((state) => {
            const newFileList = new Map(state.fileList);
            const newFile = {
                fileName: file.name,
                fileType: fileType,
                buffer: null,
                IPFSHash: null,
            };
            return { fileList: newFileList.set(id, newFile), mailIsSaved: false };
        });

        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => this.toBuffer(id, reader);
    };

    onChangeSubject = (event) => {
        this.setState((state) => ({
            mail: {
                ...state.mail,
                subject: event.target.value,
            },
            mailIsSaved: false,
        }));
    };

    onChangeContents = (event) => {
        this.setState((state) => ({
            mail: {
                ...state.mail,
                contents: event.target.value,
            },
            mailIsSaved: false,
        }));
    };

    onChangeReceiverAddr = (event) => {
        this.setState((state) => ({
            mail: {
                ...state.mail,
                receiverAddr: event.target.value,
            },
            mailIsSaved: false,
        }));
    };

    onSaveMail = (event, mail, crypto) => {
        this.setState({ mailIsSaved: true });
        mail.multiMediaContents = [...mail.multiMediaContents.values(), ...this.state.fileList.values()];
        this.setState({fileList: new Map()});
        console.log(mail.multiMediaContents);
        this.props.onSaveMail(event, mail, crypto);
    };

    onDecryptMail = async (e) => {
        var mail = this.state.mail;
        var prikey = prompt("please enter your private key", "")
        mail.contents = await decryptWithPrivateKey(prikey, mail.contents);
        mail.subject = await decryptWithPrivateKey(prikey, mail.subject);
        console.log(mail.multiMediaContents)
        var enc = new TextEncoder()
        var dec = new TextDecoder()
        await Promise.all(
            mail.multiMediaContents.map(async(content) => {
                console.log(content.buffer);
                var s = await ab2str(content.buffer);
                console.log(s);
                s = await decryptWithPrivateKey(prikey, s);
                console.log(s);
                content.buffer = await str2ab(s)
                console.log(content.buffer)
                content.fileName = await decryptWithPrivateKey(prikey, content.fileName);
                content.fileType = await decryptWithPrivateKey(prikey, content.fileType);
            })
        );
        this.setState({mail:mail});
    }

    render() {
        const { classes, pageType, onSendMail } = this.props;
        const { mail, mailIsSaved } = this.state;
        const {
            subject,
            senderAddr,
            senderName,
            receiverAddr,
            receiverName,
            timestamp,
            contents,
            multiMediaContents,
            isOpen,
            isCertified,
            imageUrl,
        } = this.state.mail;

        const readOnly = pageType !== PAGE_TYPE.DRAFT;
        const isInbox = pageType === PAGE_TYPE.INBOX;
        console.log(multiMediaContents);

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
                    <Avatar
                        alt={isInbox ? senderName : receiverName}
                        src={imageUrl}
                        className={isCertified ? classes.certified : classes.uncertified}
                    />
                </Grid>
                <Grid item xs={10} container spacing={2}>
                    <Grid item xs={9}>
                        <TextField
                            label="Timestamp"
                            value={formatTimestamp(timestamp)}
                            InputProps={{ readOnly: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant={isOpen ? "contained" : "outlined"}
                            startIcon={isOpen ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        >
                            {isOpen ? "read" : "unread"}
                        </Button>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            label={isInbox ? "Sender" : "Receiver"}
                            value={isInbox ? senderName : receiverName}
                            InputProps={{ readOnly: true }}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={9}>
                        <TextField
                            label="Address"
                            value={isInbox ? senderAddr : receiverAddr}
                            InputProps={{ readOnly: readOnly }}
                            fullWidth
                            onChange={this.onChangeReceiverAddr}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Button
                        variant={mailIsSaved ? "outlined" : "contained"}
                        startIcon={<DoubleArrowIcon />}
                        onClick={(e) => this.onDecryptMail(e, mail, false)}
                    >
                        decrypt
                    </Button>
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
                        className={classes.contents}
                        onChange={this.onChangeContents}
                    />
                </Grid>
                {!readOnly ? (
                    <>
                        <Grid container xs={12}>
                            {[...multiMediaContents.values()].map((file) => (
                                <AttachFile filename={file.fileName} file={file} />
                            ))}
                            {Array.from(this.state.fileList.values()).map((file) => (
                                <AttachFile filename={file.fileName} file={file} />
                            ))}
                        </Grid>
                        <Grid container xs={5} className={classes.upload}>
                            <Button>
                                <PictureAsPdfIcon />
                                <input type="file" onChange={this.onUploadFile} />
                            </Button>
                        </Grid>
                        <Grid container xs={7} spacing={1} className={classes.submit}>
                            <Grid item>
                                <Button
                                    variant={mailIsSaved ? "outlined" : "contained"}
                                    startIcon={<SaveAltIcon />}
                                    onClick={(e) => this.onSaveMail(e, mail, false)}
                                >
                                    save
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant={mailIsSaved ? "outlined" : "contained"}
                                    startIcon={<SaveAltIcon />}
                                    onClick={(e) => this.onSaveMail(e, mail, true)}
                                >
                                    save with encryption
                                </Button>
                            </Grid>   
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    disabled={mailIsSaved ? false : true}
                                    startIcon={<SendIcon />}
                                    onClick={(e) => onSendMail(e, mail, false)}
                                >
                                    send
                                </Button>
                            </Grid> 
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    disabled={mailIsSaved ? false : true}
                                    startIcon={<SendIcon />}
                                    onClick={(e) => onSendMail(e, mail, true)}
                                >
                                    send with encryption
                                </Button>
                            </Grid> 
                        </Grid> 
                    </>
                ) : (
                    <>
                        <Grid item xs={12}>
                            {[...multiMediaContents.values()].map((file) => (
                                <AttachFile filename={file.fileName} file={file} />
                            ))}
                        </Grid>
                    </>
                )}
            </Grid>
        );
    }
}

export default withStyles(styles)(MailEditor);
