import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import ReviewTable from "../components/ReviewTable";
import ApplicationTable from "../components/ApplicationTable";
import UserBox from "../components/UserBox";

import Status from "../constants/ApplicationStatus.json";
import { extractUserInfo, extractApplicaiton, downloadFile } from "../utils/utils";

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
        if (!userInfo) return;

        const { name, isAdmin } = extractUserInfo(userInfo);

        this.setState({ address, name, isAdmin });

        await this.retrieveCertifiedUsers();
        await this.retrieveApplications();
    };

    retrieveCertifiedUsers = async () => {
        const { contract, ipfsNode } = this.props;

        const certifiedAddress = await contract.methods.getCertifiedUsers().call();
        const certifiedUserList = await Promise.all(
            certifiedAddress.map(async (address) => {
                const userInfo = await contract.methods.getUser(address).call();
                const { name, description, iconIPFSHash } = extractUserInfo(userInfo);
                const { url } = await downloadFile(ipfsNode, iconIPFSHash);
                return { name, address, description, iconIPFSHash, url };
            })
        );
        this.setState({ certifiedUserList });
    };

    retrieveApplications = async () => {
        const { contract } = this.props;
        const { address } = this.state;

        if (this.state.isAdmin) {
            const result = await contract.methods.getAllApp().call();
            var applicationList = result.map((a) => extractApplicaiton(a)).filter((a) => a.status === Status.PENDING);
        } else {
            const result = await contract.methods.getUserApp(address).call();
            var applicationList = result.map((a) => extractApplicaiton(a));
        }
        this.setState({ applicationList });
    };

    // admin
    onReviewApplication = async (intent, selectedIds) => {
        const { address } = this.state;
        const { contract } = this.props;

        switch (intent) {
            case "accept":
                await Promise.all(
                    selectedIds.map(async (id) => contract.methods.acceptApp(id).send({ from: address }))
                );
                break;
            case "reject":
                await Promise.all(
                    selectedIds.map(async (id) => contract.methods.rejectApp(id).send({ from: address }))
                );
                break;
            default:
                console.err("Invalid intent");
        }
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

        return (
            <div className={classes.root}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        {isAdmin ? (
                            <ReviewTable
                                pendingApplicationList={applicationList}
                                onReviewApplication={this.onReviewApplication}
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
