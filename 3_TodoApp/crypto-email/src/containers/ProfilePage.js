import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import mockUsers from "../mock/user.json";

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
            name: null,
            address: null,
            description: "",
            isCertified: false,
        };
    }

    componentDidMount = async () => {
        const { accounts } = this.props;

        if (!accounts) return;
        const address = accounts[0];

        // get user profile from eth

        // mock data
        const user = mockUsers[0];
        this.setState({
            name: user.name,
            address: address,
            description: user.description,
            isCertified: user.isCertified,
        });
    };

    onChangeName = (event) => {
        this.setState({ name: event.target.value });
    };

    onChangeDescription = (event) => {
        this.setState({ description: event.target.value });
    };

    onSubmit = (event) => {
        // set user profile to eth
    };

    render() {
        const { classes } = this.props;
        const { name, address, description } = this.state;

        return (
            <div>
                <Grid container className={classes.container}>
                    <Grid container xs={4} className={classes.container}>
                        <Avatar alt={name} src="/static/images/avatar/1.jpg" className={classes.large} />
                        <TextField
                            margin="dense"
                            label="Name"
                            variant="outlined"
                            autoFocus
                            fullWidth
                            value={name}
                            onChange={this.onChangeName}
                        />
                        <TextField
                            margin="dense"
                            label="Address"
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            autoFocus
                            fullWidth
                            value={address}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            rowsMax={20}
                            rows={10}
                            variant="outlined"
                            autoFocus
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
