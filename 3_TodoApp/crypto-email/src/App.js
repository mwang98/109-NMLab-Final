import React, { Component } from "react";
import { getWeb3 } from "react.js-web3";
import { withStyles } from "@material-ui/core/styles";
import { NavLink, Switch, Route } from "react-router-dom";
import Button from "@material-ui/core/Button";

import "./App.css";
import { PAGE_TYPE } from "./constants/Page";
import NavigationBar from "./containers/NavigationBar";
import ProfilePage from "./containers/ProfilePage";
import MailBoxPage from "./containers/MailBoxPage";
import CertifiedUserPage from "./containers/CertifiedUserPage";

import { getIPFSserver } from "./utils/ipfsServer";
import EmailSystemContract from "./build/contracts/EmailSystem.json";

const styles = (theme) => ({
    link: {
        color: "white",
        textDecoration: "none",
    },
    routeBtn: {
        borderColor: "white",
    },
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { web3: null, accounts: null, contract: null, ipfsNode: null };
    }

    componentDidMount = async () => {
        console.log("componentDidMount");
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = EmailSystemContract.networks[networkId];
            console.log("network", networkId, deployedNetwork);
            console.log("accounts", accounts);
            const instance = new web3.eth.Contract(EmailSystemContract.abi, deployedNetwork && deployedNetwork.address);
            const ipfsNode = await getIPFSserver();
            this.setState({ web3, accounts, contract: instance, ipfsNode });
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`);
            console.error(error);
        }
        console.log("componentDidMount", this.state);
    };
    render() {
        const { classes } = this.props;
        const { web3, accounts, contract, ipfsNode } = this.state;

        return (
            <div className="App">
                <NavigationBar accounts={accounts}>
                    <Button variant="outlined" className={classes.routeBtn}>
                        <NavLink to="/inbox" className={classes.link}>
                            Inbox
                        </NavLink>
                    </Button>
                    <Button variant="outlined" className={classes.routeBtn}>
                        <NavLink to="/outbox" className={classes.link}>
                            Outbox
                        </NavLink>
                    </Button>
                    <Button variant="outlined" className={classes.routeBtn}>
                        <NavLink to="/draft" className={classes.link}>
                            Draft
                        </NavLink>
                    </Button>
                    <Button variant="outlined" className={classes.routeBtn}>
                        <NavLink to="/certified-users" className={classes.link}>
                            Certified User
                        </NavLink>
                    </Button>
                </NavigationBar>

                <Switch>
                    <Route
                        path="/profile"
                        component={() => (
                            <ProfilePage web3={web3} accounts={accounts} contract={contract} ipfsNode={ipfsNode} />
                        )}
                    />
                    <Route
                        path="/inbox"
                        component={() => (
                            <MailBoxPage
                                type={PAGE_TYPE.INBOX}
                                web3={web3}
                                accounts={accounts}
                                contract={contract}
                                ipfsNode={ipfsNode}
                            />
                        )}
                    />
                    <Route
                        path="/outbox"
                        component={() => (
                            <MailBoxPage
                                type={PAGE_TYPE.OUTBOX}
                                web3={web3}
                                accounts={accounts}
                                contract={contract}
                                ipfsNode={ipfsNode}
                            />
                        )}
                    />
                    <Route
                        path="/draft"
                        component={() => (
                            <MailBoxPage
                                type={PAGE_TYPE.DRAFT}
                                web3={web3}
                                accounts={accounts}
                                contract={contract}
                                ipfsNode={ipfsNode}
                            />
                        )}
                    />
                    <Route
                        paht="/certified-users"
                        component={() => <CertifiedUserPage web3={web3} accounts={accounts} contract={contract} />}
                    />
                </Switch>
            </div>
        );
    }
}
export default withStyles(styles)(App);
