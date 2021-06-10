import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Avatar from "@material-ui/core/Avatar";

const styles = (theme) => ({
    grow: {
        flexGrow: 1,
    },
    title: {
        display: "none",
        margin: theme.spacing(2),
        [theme.breakpoints.up("sm")]: {
            display: "block",
        },
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex",
        },
    },
    routeBtn: {
        "& > *": {
            margin: theme.spacing(2),
        },
    },
    newMailBtn: {
        margin: theme.spacing(2),
        color: "white",
        borderColor: "white",
    },
});

class NavigationBar extends Component {
    constructor(props) {
        super(props);
    }

    handleProfileMenuOpen = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    render() {
        const { children, classes } = this.props;
        return (
            <div className={classes.grow}>
                <AppBar position="static">
                    <Toolbar>
                        <Avatar alt="logo" src="/logo.png" />
                        <Typography className={classes.title} variant="h5" noWrap>
                            {" "}
                            Crypto Mail{" "}
                        </Typography>
                        <div className={classes.routeBtn}>{children}</div>
                        <div className={classes.grow} />
                        <Button className={classes.newMailBtn} variant="outlined">
                            new mail
                        </Button>
                        <div className={classes.sectionDesktop}>
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-haspopup="true"
                                onClick={this.handleProfileMenuOpen}
                                color="inherit"
                            >
                                <NavLink to="/profile">
                                    <AccountCircle />
                                </NavLink>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(NavigationBar);
