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
        this.state = {
            png: "none",
            pdf: "none",
            txt: "none",
            jpg: "none",
        };
    }
    handleClose = (e) => {
        this.props.previewClose(e);
    };
    getFileExtension(filename) {
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
    }
    componentDidMount() {
        var fileExtension = this.getFileExtension(this.props.file["fileName"]);
        if (fileExtension === "png") {
            this.setState({ png: "block" });
        }
        if (fileExtension === "txt") {
            this.setState({ txt: "block" });
        }
        if (fileExtension === "jpg") {
            this.setState({ jpg: "block" });
        }
        if (fileExtension === "pdf") {
            this.setState({ pdf: "block" });
        }
    }
    render() {
        var fileExtension = this.getFileExtension(this.props.file["fileName"]);
        var img_url = "";
        var txtContent = "";
        if (fileExtension === "png") {
            img_url = URL.createObjectURL(new Blob([this.props.file["buffer"]], { type: "image/png" } /* (1) */));
        }
        if (fileExtension === "jpg") {
            img_url = URL.createObjectURL(new Blob([this.props.file["buffer"]], { type: "image/jpg" } /* (1) */));
        }
        if (fileExtension === "txt") {
            if (this.props.file["buffer"]) {
                txtContent = new TextDecoder().decode(this.props.file["buffer"]);
            }
        }
        return (
            <div>
                <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.props.open}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                        {this.props.filename}
                    </DialogTitle>
                    <DialogContent dividers>
                        <div style={{ display: this.state.png }}>
                            <img src={img_url} alt="image preview" width="500"></img>
                        </div>
                        <div style={{ display: this.state.jpg }}>
                            <img src={img_url} alt="image preview" width="500"></img>
                        </div>
                        <div style={{ display: this.state.txt }}>
                            <Typography>{txtContent}</Typography>
                        </div>
                        <div id="pdfContainer" style={{ display: this.state.pdf }}>
                            <PdfPreview file={this.props.file}></PdfPreview>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={this.handleClose} color="primary">
                            close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
export default withStyles(styles)(CustomizedDialogs);
