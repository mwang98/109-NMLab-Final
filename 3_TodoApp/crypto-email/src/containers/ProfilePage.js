import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import uint8ArrayConcat from "uint8arrays/concat";

import { extractUserInfo, uploadFile, downloadFile, toUrlNBuffer } from "../utils/utils";

const styles = (theme) => ({
    container: {
        justifyContent: "center",
        padding: theme.spacing(5),
    },
    certified: {
        width: theme.spacing(30),
        height: theme.spacing(30),
        border: "5px solid #fbc02d",
    },
    uncertified: {
        width: theme.spacing(30),
        height: theme.spacing(30),
        border: "5px solid #E6E6E6",
    },
});

class CertifiedUserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: "",
            name: "",
            pubKey: "",
            description: "",
            iconIPFSHash: null,
            isCertified: false,
            isAdmin: false,
            imageUrl: "",
            imageBuffer: null,
            otherAddress: "",
        };
    }

    componentDidMount = async () => {
        const { accounts, contract, ipfsNode } = this.props;

        if (!accounts && !contract) return;
        const address = accounts[0];

        console.log(accounts, contract);

        // get user profile from eth
        const userInfo = await contract.methods.getUser(address).call();
        if (!userInfo) return;

        console.log(userInfo);
        const { name, pubKey, description, iconIPFSHash, isCertified, isAdmin } = extractUserInfo(userInfo);
        const { url, buffer } = await downloadFile(ipfsNode, iconIPFSHash);

        this.setState({
            address,
            name,
            pubKey,
            description,
            iconIPFSHash,
            isCertified,
            isAdmin,
            imageUrl: url,
            imageBuffer: buffer,
        });
    };

    onChangeName = (event) => {
        this.setState({ name: event.target.value });
    };

    onChangePubKey = (event) => {
        this.setState({ pubKey: event.target.value });
    };

    onChangeDescription = (event) => {
        this.setState({ description: event.target.value });
    };

    onChangeAddress = (event) => {
        this.setState({ otherAddress: event.target.value });
    };

    onSubmit = async (event) => {
        // set user profile to eth
        const { contract, ipfsNode } = this.props;
        const { address, name, pubKey, description, isCertified, imageBuffer } = this.state;

        const iconIPFSHash = imageBuffer ? await uploadFile(ipfsNode, imageBuffer) : "";

        await contract.methods
            .setUser(address, name, pubKey, description, iconIPFSHash, isCertified)
            .send({ from: address });

        this.setState({ iconIPFSHash });
    };

    onUploadIcon = (event) => {
        event.stopPropagation();
        event.preventDefault();

        const { ipfsNode } = this.props;
        const image = event.target.files[0];

        if (!image) return;

        let reader = new window.FileReader();
        reader.readAsArrayBuffer(image);
        reader.onloadend = async () => {
            const { url, buffer } = await toUrlNBuffer(reader.result);
            this.setState({ imageUrl: url, imageBuffer: buffer });
        };
    };

    onAddAdmin = async () => {
        const { contract } = this.props;
        const { address, otherAddress } = this.state;

        await contract.methods.addAdmin(otherAddress).send({ from: address });
    };

    render() {
        const { classes } = this.props;
        const { address, name, pubKey, description, isCertified, isAdmin, imageUrl, otherAddress } = this.state;

        return (
            <React.Fragment>
                <Grid container className={classes.container}>
                    <Grid container xs={4} className={classes.container}>
                        <input
                            accept="image/*"
                            type="file"
                            id="icon-upload"
                            style={{ display: "none" }}
                            onChange={this.onUploadIcon}
                        />
                        <label htmlFor="icon-upload">
                            <IconButton component="span">
                                <Avatar
                                    alt={name}
                                    src={imageUrl}
                                    className={isCertified ? classes.certified : classes.uncertified}
                                />
                            </IconButton>
                        </label>
                        <TextField
                            margin="dense"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={this.onChangeName}
                        />
                        <TextField
                            margin="dense"
                            label="Address"
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            fullWidth
                            value={address}
                        />
                        <TextField
                            margin="dense"
                            label="Public Key"
                            variant="outlined"
                            fullWidth
                            value={pubKey}
                            onChange={this.onChangePubKey}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            rowsMax={20}
                            rows={10}
                            variant="outlined"
                            fullWidth
                            multiline
                            value={description}
                            onChange={this.onChangeDescription}
                        />
                        <Button variant="outlined" onClick={this.onSubmit}>
                            submit
                        </Button>
                        {isAdmin ? (
                            <React.Fragment>
                                <TextField
                                    margin="dense"
                                    label="Address"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    value={otherAddress}
                                    onChange={this.onChangeAddress}
                                />
                                <Button variant="outlined" onClick={this.onAddAdmin}>
                                    Add Admin
                                </Button>
                            </React.Fragment>
                        ) : (
                            <></>
                        )}
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
export default withStyles(styles)(CertifiedUserPage);
