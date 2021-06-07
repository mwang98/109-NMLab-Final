import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import UserBox from "../components/UserBox";

import certifiedUserList from "../mock/user";

const styles = (theme) => ({
    root: {
        justifyContent: "center",
        padding: theme.spacing(5),
    },
    paper: {
        padding: theme.spacing(5),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
});

class CertifiedUserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certifiedUserList: [],
        };
    }

    componentDidMount = async () => {
        this.retrieveCertifiedUsers();
    };

    retrieveCertifiedUsers = async () => {
        this.setState({
            certifiedUserList: certifiedUserList,
        });

        const state = "Code form solidty";
        // retrieve users from eth networks
    };

    render() {
        const { classes } = this.props;
        const { certifiedUserList } = this.state;

        return (
            <div className={classes.root}>
                <Grid container spacing={5}>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={6}>
                        <UserBox userList={certifiedUserList} />
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default withStyles(styles)(CertifiedUserPage);
