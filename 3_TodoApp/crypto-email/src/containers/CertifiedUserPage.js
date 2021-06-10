import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import ReviewTable from "../components/ReviewTable";
import ApplicationTable from "../components/ApplicationTable";
import UserBox from "../components/UserBox";

import Status from "../constants/ApplicationStatus.json";

import certifiedUserList from "../mock/user.json";
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

    // admin
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

    // user
    onSubmitApplication = async (description) => {
        const new_application = this.createApplication(description);

        const msg = "Send to blockchain";

        this.setState((state) => ({
            applicationList: [...state.applicationList, new_application],
        }));
    };

    createApplication = (description) => ({
        id: "123" + description,
        address: "myAddr",
        name: "myName",
        description: description,
        status: Status.PENDING,
    });

    render() {
        const { classes } = this.props;
        const { applicationList, certifiedUserList } = this.state;

        let pendingApplicationList = applicationList.filter((doc) => doc.status === Status.PENDING);

        return (
            <div className={classes.root}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        {false ? (
                            <ReviewTable
                                pendingApplicationList={pendingApplicationList}
                                onAgreeApplication={this.onAgreeApplication}
                                onRejectApplication={this.onRejectApplication}
                            />
                        ) : (
                            <ApplicationTable
                                applicationList={applicationList}
                                onSubmitApplication={this.onSubmitApplication}
                            />
                        )}
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
