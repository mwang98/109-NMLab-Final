import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import uint8ArrayConcat from "uint8arrays/concat";

import { extractUserInfo } from "../utils/utils";

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
            pubKey: null,
            description: "",
            iconIPFSHash: null,
            isCertified: false,
            isAdmin: false,
            imageUrl: "",
            imageBuffer: null,
        };
    }

    componentDidMount = async () => {
        const { accounts, contract } = this.props;

        if (!accounts && !contract) return;
        const address = accounts[0];

        console.log(accounts, contract);

        // get user profile from eth
        const userInfo = await contract.methods.getUser(address).call();
        const { name, pubKey, description, iconIPFSHash, isCertified, isAdmin } = extractUserInfo(userInfo);
        const { imageUrl, imageBuffer } = await this.downloadImage(iconIPFSHash);

        console.log(userInfo);

        this.setState({
            address,
            name,
            pubKey,
            description,
            iconIPFSHash,
            isCertified,
            isAdmin,
            imageUrl,
            imageBuffer,
        });
    };

    downloadImage = async (IPFSHash) => {
        const { imageUrl, imageBuffer } = this.state;
        const { ipfsNode } = this.props;

        console.log("IPFSHash", IPFSHash);
        if (!IPFSHash.includes("Qm")) return { imageUrl, imageBuffer };

        let content = [];
        for await (const chunk of ipfsNode.cat(IPFSHash)) {
            content.push(chunk);
        }
        const imageRaw = uint8ArrayConcat(content);
        return await this.getImage(imageRaw.buffer);
    };

    uploadImage = async (buffer) => {
        const { ipfsNode } = this.props;
        const { path } = await ipfsNode.add(buffer);
        return path;
    };

    getImage = async (arrBuf) => {
        const blob = new Blob([arrBuf]);
        const imageUrl = URL.createObjectURL(blob);
        const imageBuffer = await Buffer.from(arrBuf);
        return { imageUrl, imageBuffer };
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

    onSubmit = async (event) => {
        // set user profile to eth
        const { contract } = this.props;
        const { address, name, pubKey, description, isCertified, imageBuffer } = this.state;

        const iconIPFSHash = imageBuffer ? await this.uploadImage(imageBuffer) : this.state.iconIPFSHash;

        // await contract.methods
        //     .setUser(address, name, pubKey, description, iconIPFSHash, isCertified)
        //     .send({ from: address });
        await contract.methods.setUser(address, name, pubKey, description, iconIPFSHash, true).send({ from: address });

        this.setState({ iconIPFSHash });
    };

    onUploadIcon = (event) => {
        event.stopPropagation();
        event.preventDefault();

        const image = event.target.files[0];

        if (!image) return;

        let reader = new window.FileReader();
        reader.readAsArrayBuffer(image);
        reader.onloadend = async () => {
            const { imageUrl, imageBuffer } = await this.getImage(reader.result);
            this.setState({ imageUrl, imageBuffer });
        };
    };

    render() {
        const { classes } = this.props;
        const { address, name, pubKey, description, isCertified, imageUrl } = this.state;

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
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
export default withStyles(styles)(CertifiedUserPage);
