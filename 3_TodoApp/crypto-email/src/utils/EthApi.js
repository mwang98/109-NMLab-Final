import { getWeb3 } from "react.js-web3";

import EmailSystemContract from "../build/contracts/EmailSystem.json";

class EthApi {
    constructor() {
        this.web3 = null;
        this.accounts = null;
        this.contract = null;
    }

    setup = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = EmailSystemContract.networks[networkId];
            console.log(networkId, deployedNetwork);
            console.log(accounts);
            const instance = new web3.eth.Contract(EmailSystemContract.abi, deployedNetwork && deployedNetwork.address);
            this.web3 = web3;
            this.accounts = accounts;
            this.contract = instance;
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`);
            console.error(error);
        }
    };

    multiMediaContentsToarray(_var) {
        return [_var.fileName, _var.fileType, _var.IPFSHash];
    }
    sendMail = async (mail) => {
        if (mail.senderAddr !== this.accounts[0]) {
            console.log(`sender should be the account!!! ${this.accounts[0]}`);
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
        ];
        console.log(mail_sol);
        await this.contract.methods.sendMail(mail_sol).send({ from: mail.senderAddr });
    };
    deleteMail = async (userAddress, mail) => {
        if (userAddress !== this.accounts[0]) {
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
        ];
        await this.contract.methods.deleteMail(userAddress, mail_sol).send({ from: userAddress });
    };
    saveMail = async (userAddress, mail) => {
        if (userAddress !== this.accounts[0]) {
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
        ];
        await this.contract.methods.saveMail(userAddress, mail_sol).send({ from: userAddress });
    };
    openMail = async (mail) => {
        if (mail.receiverAddr !== this.accounts[0]) {
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
        ];
        await this.contract.methods.openMail(mail_sol).send({ from: mail.receiverAddr });
    };
    setUser = async (userAddress, user) => { /*user example = {name:"Robert",
                                                               addr:"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
                                                               description:"nothing",
                                                               icon:{ fileName: "app.js", fileType: "text", IPFSHash: "cb3d0adb4559ae79568a8169d1b8d6" },
                                                               isCertified:true}*/
        if (userAddress !== this.state.accounts[0]) {
            console.log("userAddress should be the account!!!");
            return;
        }
        var user_sol = [
            user.name, 
            user.addr,
            user.description,
            this.multiMediaContentsToarray(user.icon),
            user.isCertified
        ];
        await this.state.contract.methods.setUser(userAddress, user_sol[0], user_sol[1], user_sol[2], user_sol[3], user_sol[4]).send({ from: userAddress });
    };
    getUser = async (userAddress) => {
        if (userAddress !== this.state.accounts[0]) {
            console.log("userAddress should be the account!!!");
            return;
        }
        var result = await this.state.contract.methods.getUser(userAddress).call();
        console.log(result);
    };
    getInboxMails = async (userAddress) => {
        if (userAddress !== this.accounts[0]) {
            console.log("userAddress should be the account!!!");
            return;
        }
        var result = await this.contract.methods.getInboxMails(userAddress).call();
        console.log(result);
    };
    getOutboxMails = async (userAddress) => {
        if (userAddress !== this.accounts[0]) {
            console.log("userAddress should be the account!!!");
            return;
        }
        var result = await this.contract.methods.getOutboxMails(userAddress).call();
        console.log(result);
    };
    getDraftMails = async (userAddress) => {
        if (userAddress !== this.accounts[0]) {
            console.log("userAddress should be the account!!!");
            return;
        }
        var result = await this.contract.methods.getDraftboxMails(userAddress).call();
        console.log(result);
    };
}

const getEthApi = async () => {
    const api = new EthApi();
    await api.setup();
    return api;
};

export { getEthApi };
