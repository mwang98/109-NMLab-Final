import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink, Switch, Route } from "react-router-dom";
import Button from "@material-ui/core/Button";

import "./App.css";
import { PAGE_TYPE } from "./constants/Page";
import NavigationBar from "./containers/NavigationBar";
import MailBoxPage from "./containers/MailBoxPage";
import CertifiedUserPage from "./containers/CertifiedUserPage";

import { getWeb3, getContract } from "react.js-web3";

import EmailSystemContract from "./build/contracts/EmailSystem.json";
import { strictEqual } from "assert";
const useStyles = makeStyles({
    link: {
        color: "white",
        textDecoration: "none",
    },
    routeBtn: {
        borderColor: "white",
    },
});

class App extends Component {
    constructor(props){
        super(props);
        this.sendMail = this.sendMail.bind(this);
        this.state = {web3: null, accounts: null, contract: null};
    }
    componentDidMount = async () => {
        try {
          const web3 = await getWeb3();
          const accounts = await web3.eth.getAccounts();
          const networkId = await web3.eth.net.getId();
          const deployedNetwork =  EmailSystemContract.networks[networkId];
          console.log(networkId, deployedNetwork);
          console.log(accounts)
          const instance = new web3.eth.Contract(
            EmailSystemContract.abi,
            deployedNetwork && deployedNetwork.address,
          );
          this.setState({ web3, accounts, contract: instance });
        } catch (error) {
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
    }
    multiMediaContentsToarray(_var){return [_var.fileName ,_var.fileType, _var.IPFSHash];}
    sendMail = async (mail) => {
        if( mail.senderAddr!==this.state.accounts[0]){
            console.log("sender should be the account!!!");
            return;
        }
        var mail_sol = [
            mail.id,
            mail.senderAddr,
            mail.receiverAddr,
            mail.subject,
            mail.timestamp,
            mail.contents,
            mail.multiMediaContents.map(this.multiMediaContentsToarray),
            mail.isOpen,
        ]
        console.log(mail_sol);
        await this.state.contract.methods.sendMail(mail_sol).send({ from: mail.senderAddr });
    }
    deleteMail = async(userAddress, mail) => {
        if( userAddress!==this.state.accounts[0]){
            console.log("userAddress should be the account!!!");
            return;
        }
        var mail_sol = [
            mail.id,
            mail.senderAddr,
            mail.receiverAddr,
            mail.subject,
            mail.timestamp,
            mail.contents,
            mail.multiMediaContents.map(this.multiMediaContentsToarray),
            mail.isOpen,
        ]
        await this.state.contract.methods.deleteMail(userAddress, mail_sol).send({ from: userAddress });
    }
    saveMail = async(userAddress, mail) => {
        if( userAddress!==this.state.accounts[0]){
            console.log("userAddress should be the account!!!");
            return;
        }
        var mail_sol = [
            mail.id,
            mail.senderAddr,
            mail.receiverAddr,
            mail.subject,
            mail.timestamp,
            mail.contents,
            mail.multiMediaContents.map(this.multiMediaContentsToarray),
            mail.isOpen,
        ]
        await this.state.contract.methods.saveMail(userAddress, mail_sol).send({ from: userAddress });
    }
    openMail = async(mail) => {
        if( mail.receiverAddr!==this.state.accounts[0]){
            console.log("receiver should be the account!!!");
            return;
        }
        var mail_sol = [
            mail.id,
            mail.senderAddr,
            mail.receiverAddr,
            mail.subject,
            mail.timestamp,
            mail.contents,
            mail.multiMediaContents.map(this.multiMediaContentsToarray),
            mail.isOpen,
        ]
        await this.state.contract.methods.openMail(mail_sol).send({ from: mail.receiverAddr });
    }
    getUserName = async(userAddress) => {
        if( userAddress!==this.state.accounts[0]){
            console.log("userAddress should be the account!!!");
            return;
        }
        var result = await this.state.contract.methods.getUserName(userAddress).call();
        console.log(result);
    }
    getInboxMails = async(userAddress) => {
        if( userAddress!==this.state.accounts[0]){
            console.log("userAddress should be the account!!!");
            return;
        }
        var result = await this.state.contract.methods.getInboxMails(userAddress).call();
        console.log(result);
    }
    getOutboxMails = async(userAddress) => {
        if( userAddress!==this.state.accounts[0]){
            console.log("userAddress should be the account!!!");
            return;
        }
        var result = await this.state.contract.methods.getOutboxMails(userAddress).call();
        console.log(result);
    }
    getDraftMails = async(userAddress) => {
        if( userAddress!==this.state.accounts[0]){
            console.log("userAddress should be the account!!!");
            return;
        }
        var result = await this.state.contract.methods.getDraftboxMails(userAddress).call();
        console.log(result);
    }
    render() {
        return (
            <div className="App">
                <NavigationBar>
                    <Button variant="outlined" className={makeStyles().routeBtn}>
                        <NavLink to="/inbox" className={makeStyles().link}>
                            Inbox
                        </NavLink>
                    </Button>
                    <Button variant="outlined" className={makeStyles().routeBtn}>
                        <NavLink to="/outbox" className={makeStyles().link}>
                            Outbox
                        </NavLink>
                    </Button>
                    <Button variant="outlined" className={makeStyles().routeBtn}>
                        <NavLink to="/draft" className={makeStyles().link}>
                            Draft
                        </NavLink>
                    </Button>
                    <Button variant="outlined" className={makeStyles().routeBtn}>
                        <NavLink to="/certified-users" className={makeStyles().link}>
                            Certified User
                        </NavLink>
                    </Button>
                </NavigationBar>
    
                <Switch>
                    <Route path='/inbox' component={() => <MailBoxPage type={PAGE_TYPE.INBOX} sendMail={this.sendMail}/>}/>
                    <Route path='/outbox' component={() => <MailBoxPage type={PAGE_TYPE.OUTBOX} sendMail={this.sendMail}/>}/>
                    <Route path='/draft' component={() => <MailBoxPage type={PAGE_TYPE.DRAFT} sendMail={this.sendMail}/>}/>
                    <Route paht="/certified-users" component={() => <CertifiedUserPage />} />
                </Switch>
            </div>
        );
    }
}
export default App;
