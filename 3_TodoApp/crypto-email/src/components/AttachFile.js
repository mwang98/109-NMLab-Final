import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import PreviewBlock from "./PreviewBlock"

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
        this.state={
            previewOpen:false,
            file:""
        }
    }
    onClick = (e) =>{
        this.setState({previewOpen:true})
    }
    previewClose = (e) => {
        this.setState({previewOpen:false})
    }

    render() {
        const { classes, filename } = this.props;
        return (
            <div className={classes.root} style={{cursor:"pointer"}}>
                <AttachFileIcon  onClick={this.onClick} />
                <Typography  onClick={this.onClick} > {filename} </Typography>
                <PreviewBlock filename={filename} 
                              open={this.state.previewOpen} 
                              previewClose={this.previewClose}
                              file = {this.props.file}/>    
            </div>
        );
    }
}

export default withStyles(styles)(AttachFile);
