import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";

const styles = (theme) => ({
    container: {
        justifyContent: "center",
        padding: theme.spacing(5),
    },
    large: {
        width: theme.spacing(30),
        height: theme.spacing(30),
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
            iconContent: null,
            isCertified: false,
        };
    }

    componentDidMount = async () => {
        const { accounts, contract } = this.props;

        if (!accounts && !contract) return;
        const address = accounts[0];

        console.log(accounts, contract);

        // get user profile from eth
        var profile = await contract.methods.getUser(address).call();

        this.setState({
            address: address,
            name: profile[0],
            pubKey: profile[1],
            description: profile[2],
            iconContent: profile[3],
            isCertified: profile[4],
        });
    };

    onChangeName = (event) => {
        this.setState({ name: event.target.value });
    };

    onChangeDescription = (event) => {
        this.setState({ description: event.target.value });
    };

    onSubmit = async (event) => {
        // set user profile to eth
        const { contract } = this.props;
        const { address, name, pubKey, description, iconContent, isCertified } = this.state;

        await contract.methods
            .setUser(address, name, pubKey, description, iconContent, isCertified)
            .send({ from: address });
    };

    render() {
        const { classes } = this.props;
        const { name, address, description } = this.state;

        console.log(this.state);
        return (
            <div>
                <Grid container className={classes.container}>
                    <Grid container xs={4} className={classes.container}>
                        <Avatar alt={name} src="/static/images/avatar/1.jpg" className={classes.large} />
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
                            onChange={this.onChangeName}
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
            </div>
        );
    }
}
export default withStyles(styles)(CertifiedUserPage);
