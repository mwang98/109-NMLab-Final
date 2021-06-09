import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import ReviewTable from "../components/ReviewTable";
import UserBox from "../components/UserBox";

import certifiedUserList from "../mock/user";
import applicationList from "../mock/application";

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
            applicationList: [],
            certifiedUserList: [],
        };
    }

    componentDidMount = async () => {
        this.retrieveCertifiedUsers();
        this.retrieveApplications();
    };

    retrieveCertifiedUsers = async () => {
        this.setState({
            certifiedUserList: certifiedUserList,
        });

        const state = "Code form solidty";
        // retrieve users from eth networks
    };

    retrieveApplications = async () => {
        this.setState({
            applicationList: applicationList,
        });
    };

    onAgreeApplication = async (selectedIds) => {
        this.setState((state) => ({
            applicationList: state.applicationList.filter((doc) => !selectedIds.includes(doc.id)),
        }));
    };

    onRejectApplication = async (selectedIds) => {
        this.setState((state) => ({
            applicationList: state.applicationList.filter((doc) => !selectedIds.includes(doc.id)),
        }));
    };

    render() {
        const { classes } = this.props;
        const { applicationList, certifiedUserList } = this.state;

        return (
            <div className={classes.root}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <ReviewTable
                            applicationList={applicationList}
                            onAgreeApplication={this.onAgreeApplication}
                            onRejectApplication={this.onRejectApplication}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <UserBox userList={certifiedUserList} />
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default withStyles(styles)(CertifiedUserPage);
