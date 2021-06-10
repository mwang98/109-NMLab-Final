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
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import AttachFile from "./AttachFile";
import { PAGE_TYPE } from "../constants/Page";
import { DummyMail } from "../constants/Mail";

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        alignItems: "center",
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        alignSelf: "center",
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
        if (state.mail.id !== props.mail.id) {
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

    onSaveMail = (event, mail) => {
        this.setState({ mailIsSaved: true });
        mail.multiMediaContents = [...this.state.fileList.values()];
        this.props.onSaveMail(event, mail);
    };

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
        } = this.state.mail;

        const readOnly = pageType !== PAGE_TYPE.DRAFT;
        const isInbox = pageType === PAGE_TYPE.INBOX;

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
                    <Avatar alt={isInbox ? senderName : receiverName} className={classes.large} src="../logo.png" />
                </Grid>
                <Grid item xs={10} container spacing={1}>
                    <Grid item xs={9}>
                        <TextField
                            label={isInbox ? "Sender" : "Receiver"}
                            value={isInbox ? senderName : receiverName}
                            InputProps={{ readOnly: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField label="Timestamp" value={timestamp} InputProps={{ readOnly: true }} fullWidth />
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
                    <Grid item xs={2}>
                        <Button
                            variant={isOpen ? "contained" : "outlined"}
                            startIcon={isOpen ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        >
                            {isOpen ? "read" : "unread"}
                        </Button>
                    </Grid>
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
                            {[...this.state.fileList.values()].map((file) => (
                                <AttachFile filename={file.fileName} />
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
                                    onClick={(e) => this.onSaveMail(e, mail)}
                                >
                                    save
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    disabled={mailIsSaved ? false : true}
                                    startIcon={<SendIcon />}
                                    onClick={(e) => onSendMail(e, mail)}
                                >
                                    send
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid item xs={12}>
                            {[...multiMediaContents.values()].map((file) => (
                                <AttachFile filename={file.fileName} />
                            ))}
                        </Grid>
                    </>
                )}
            </Grid>
        );
    }
}

export default withStyles(styles)(MailEditor);
