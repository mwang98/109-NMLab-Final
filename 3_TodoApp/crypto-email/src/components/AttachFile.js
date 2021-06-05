import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AttachFileIcon from '@material-ui/icons/AttachFile';

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row'
    }
});

class AttachFile extends Component{
    constructor(props){
        super(props);

    }

    render(){
        const { classes, filename } = this.props;
        return (
            <div className={classes.root}>
                <AttachFileIcon />
                <Typography> {filename} </Typography>
            </div>
        )
    }
}

export default withStyles(styles)(AttachFile);