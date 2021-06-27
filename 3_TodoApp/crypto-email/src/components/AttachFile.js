import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import PreviewBlock from "./PreviewBlock";

import { getFileExtension } from "../utils/utils";

const styles = (theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        margin: theme.spacing(1),
        cursor: "pointer",
    },
});

class AttachFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewOpen: false,
            png: "none",
            pdf: "none",
            txt: "none",
            jpg: "none",
        };
    }
    onClick = (e) => {
        var fileExtension = getFileExtension(this.props.file["fileName"]);
        var state = { previewOpen: true };
        if (fileExtension === "png") {
            state.png = "block";
        }
        if (fileExtension === "txt") {
            state.txt = "block";
        }
        if (fileExtension === "jpg") {
            state.jpg = "block";
        }
        if (fileExtension === "pdf") {
            state.pdf = "block";
        }
        this.setState(state);
    };
    previewClose = (e) => {
        this.setState({ previewOpen: false });
    };

    render() {
        const { classes, filename, file } = this.props;
        return (
            <div className={classes.root}>
                <AttachFileIcon onClick={this.onClick} />
                <Typography onClick={this.onClick}> {filename.substring(0, 50)} </Typography>
                <PreviewBlock
                    open={this.state.previewOpen}
                    previewClose={this.previewClose}
                    file={file}
                    png={this.state.png}
                    jpg={this.state.jpg}
                    pdf={this.state.pdf}
                    txt={this.state.txt}
                />
            </div>
        );
    }
}

export default withStyles(styles)(AttachFile);
