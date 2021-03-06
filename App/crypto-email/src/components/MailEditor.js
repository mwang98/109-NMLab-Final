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
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import AttachFile from "./AttachFile";
import SaveNSendDialog from "./SaveNSendDialog";
import { decryptMail, formatTimestamp } from "../utils/utils";
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
            isMailSaved: true,
            isMailSent: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.mail || !state.mail) return null;
        if (state.mail.uuid !== props.mail.uuid) {
            const fileList = new Map();
            return { mail: props.mail, fileList, isMailSaved: true, isMailSent: false };
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
            return { fileList: newFileList.set(id, newFile), isMailSaved: false };
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
            isMailSaved: false,
        }));
    };

    onChangeContents = (event) => {
        this.setState((state) => ({
            mail: {
                ...state.mail,
                contents: event.target.value,
            },
            isMailSaved: false,
        }));
    };

    onChangeReceiverAddr = (event) => {
        this.setState((state) => ({
            mail: {
                ...state.mail,
                receiverAddr: event.target.value,
            },
            isMailSaved: false,
        }));
    };

    onDecryptMail = async (e) => {
        let prikey = prompt("Please enter your private key", "");
        let mail = await decryptMail(prikey, this.state.mail);
        this.setState({ mail });
    };
    onSaveMail = (event, crypto) => {
        const { mail } = this.state;
        this.setState({ isMailSaved: true });
        mail.multiMediaContents = [...mail.multiMediaContents.values(), ...this.state.fileList.values()];
        this.setState({ fileList: new Map() });
        this.props.onSaveMail(event, mail, crypto);
    };

    onSendMail = (event, crypto) => {
        const { mail } = this.state;
        this.setState({ isMailSent: true });
        mail.multiMediaContents = [...mail.multiMediaContents.values(), ...this.state.fileList.values()];
        this.setState({ fileList: new Map() });
        this.props.onSendMail(event, mail, crypto);
    };

    render() {
        const { classes, pageType } = this.props;
        const { mail, isMailSaved, isMailSent } = this.state;
        const {
            subject,
            senderAddr,
            senderName,
            receiverAddr,
            receiverName,
            timestamp,
            contents,
            isOpen,
            isCertified,
            imageUrl,
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
                        variant="outlined"
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
                <Grid container xs={12} spcaing={1} direction="column">
                    {Array.from(mail.multiMediaContents.values()).map((file) => (
                        <AttachFile filename={file.fileName} file={file} />
                    ))}
                    {Array.from(this.state.fileList.values()).map((file) => (
                        <AttachFile filename={file.fileName} file={file} />
                    ))}
                </Grid>
                {!readOnly ? (
                    <React.Fragment>
                        <Grid container xs={5} className={classes.upload}>
                            <Button>
                                <PictureAsPdfIcon />
                                <input type="file" onChange={this.onUploadFile} />
                            </Button>
                        </Grid>
                        <Grid container xs={7} spacing={1} className={classes.submit}>
                            <Grid item>
                                <SaveNSendDialog
                                    onSubmit={this.onSaveMail}
                                    type="save"
                                    variant={isMailSaved ? "outlined" : "contained"}
                                    disabled={isMailSent}
                                    startIcon={<SaveAltIcon />}
                                />
                            </Grid>
                            <Grid item>
                                <SaveNSendDialog
                                    onSubmit={this.onSendMail}
                                    type="send"
                                    variant={isMailSaved ? "outlined" : "contained"}
                                    disabled={isMailSent}
                                    startIcon={<SendIcon />}
                                />
                            </Grid>
                        </Grid>
                    </React.Fragment>
                ) : (
                    <></>
                )}
            </Grid>
        );
    }
}

export default withStyles(styles)(MailEditor);
