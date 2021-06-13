import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import ReviewTable from "../components/ReviewTable";
import ApplicationTable from "../components/ApplicationTable";
import UserBox from "../components/UserBox";

import Status from "../constants/ApplicationStatus.json";
import { extractUserInfo, extractApplicaiton } from "../utils/utils";

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
            address: "",
            name: "",
            isAdmin: false,
            applicationList: [],
            certifiedUserList: [],
        };
    }

    componentDidMount = async () => {
        const { accounts, contract } = this.props;
        if (!accounts && !contract) return;

        const address = accounts[0];
        const userInfo = await contract.methods.getUser(address).call();
        const { name, isAdmin } = extractUserInfo(userInfo);

        this.setState({ address, name, isAdmin });

        await this.retrieveCertifiedUsers();
        await this.retrieveApplications();
    };

    retrieveCertifiedUsers = async () => {
        const { contract } = this.props;

        const certifiedAddress = await contract.methods.getCertifiedUsers().call();
        const certifiedUserList = await Promise.all(
            certifiedAddress.map(async (addr) => {
                const userInfo = await contract.methods.getUser(addr).call();
                const { name, address, description, iconIPFSHash } = extractUserInfo(userInfo);
                return { name, address, description, iconIPFSHash };
            })
        );
        console.log(certifiedUserList);

        this.setState({ certifiedUserList });
    };

    retrieveApplications = async () => {
        console.log("retrieveApplications");
        const { contract } = this.props;
        const { address } = this.state;

        if (this.state.isAdmin) {
            const application = await contract.methods.getAllApp().call();
            console.log("application", application);
        } else {
            const result = await contract.methods.getUserApp(address).call();
            const applicationList = result.map((a) => extractApplicaiton(a));
            this.setState({ applicationList });
        }
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
        const { contract } = this.props;
        const { address } = this.state;

        const app = this.createApplication(description);

        await contract.methods
            .submitApp([app.id, app.name, app.address, app.description, app.status])
            .send({ from: address });

        this.setState((state) => ({
            applicationList: [...state.applicationList, app],
        }));
    };

    createApplication = (description) => ({
        id: this.state.applicationList.length,
        address: this.state.address,
        name: this.state.name,
        description: description,
        status: Status.PENDING,
    });

    render() {
        const { classes } = this.props;
        const { isAdmin, applicationList, certifiedUserList } = this.state;

        let pendingApplicationList = applicationList.filter((doc) => doc.status === Status.PENDING);

        return (
            <div className={classes.root}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        {isAdmin ? (
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
