import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import PreviewBlock from "./PreviewBlock";

const styles = (theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        margin: theme.spacing(1),
    },
});

class AttachFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewOpen: false,
            file: "",
            png: "none",
            pdf: "none",
            txt: "none",
            jpg: "none",
        };
    }
    onClick = (e) => {
        this.setState({ previewOpen: true });
        var fileExtension = this.getFileExtension(this.props.file["fileName"]);
        console.log(fileExtension);
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
    };
    previewClose = (e) => {
        this.setState({ previewOpen: false });
    };

    getFileExtension(filename) {
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
    }
    render() {
        const { classes, filename } = this.props;
        return (
            <div className={classes.root} style={{ cursor: "pointer" }}>
                <AttachFileIcon onClick={this.onClick} />
                <Typography onClick={this.onClick}> {filename} </Typography>
                <PreviewBlock
                    filename={filename}
                    open={this.state.previewOpen}
                    previewClose={this.previewClose}
                    file={this.props.file}
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
