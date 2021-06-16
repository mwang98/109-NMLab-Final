import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import PdfPreview from "./PdfPreview";
import { ab2str, downloadURL, getFileExtension } from "../utils/utils";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

class CustomizedDialogs extends Component {
    constructor(props) {
        super(props);
    }
    handleClose = (e) => {
        this.props.previewClose(e);
    };
    handleDownload = (e) => {
        const { fileName, fileType, buffer } = this.props.file;
        const blob = new Blob([buffer], { type: fileType });
        const url = URL.createObjectURL(blob);
        downloadURL(url, fileName);

        setTimeout(() => URL.revokeObjectURL(url), 1000);
        this.handleClose();
    };
    render() {
        const { file } = this.props;
        const { fileName, buffer } = file;

        var fileExtension = getFileExtension(fileName);
        if (fileExtension === "png") {
            var img_url = URL.createObjectURL(new Blob([buffer], { type: "image/png" } /* (1) */));
        }
        if (fileExtension === "jpg") {
            var img_url = URL.createObjectURL(new Blob([buffer], { type: "image/jpg" } /* (1) */));
        }
        if (fileExtension === "txt") {
            if (buffer) {
                var txtContent = new ab2str(buffer);
            }
        }
        return (
            <div>
                <Dialog onClose={this.handleClose} open={this.props.open} fullWidth={true} maxWidth={"md"}>
                    <DialogTitle onClose={this.handleClose}>{fileName}</DialogTitle>
                    <DialogContent dividers>
                        <div style={{ display: this.props.png }}>
                            <img src={img_url} alt="image preview" width="800"></img>
                        </div>
                        <div style={{ display: this.props.jpg }}>
                            <img src={img_url} alt="image preview" width="800"></img>
                        </div>
                        <div style={{ display: this.props.txt }}>
                            <Typography>{txtContent}</Typography>
                        </div>
                        <div id="pdfContainer" style={{ display: this.props.pdf }}>
                            <PdfPreview file={file}></PdfPreview>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={this.handleDownload} color="primary">
                            download
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
export default withStyles(styles)(CustomizedDialogs);
