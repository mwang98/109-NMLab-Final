import React, { Component } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { NavLink, Switch, Route } from "react-router-dom";
import Button from '@material-ui/core/Button';

import logo from './logo.svg';
import './App.css';
import { PAGE_TYPE } from './constants/Page';
import MailBoxPage from './containers/MailBoxPage';
import NavigationBar from './containers/NavigationBar';

const useStyles = makeStyles({
    link: {
        color: 'white',
        textDecoration: 'none'
    },
    routeBtn: {
        borderColor: 'white'
    }
})

function App() {
    const classes = useStyles();
    return (
        <div className="App">
            <NavigationBar>
                <Button variant="outlined" className={classes.routeBtn}><NavLink to="/inbox" className={classes.link}>Inbox</NavLink></Button>
                <Button variant="outlined" className={classes.routeBtn}><NavLink to="/outbox" className={classes.link}>Outbox</NavLink></Button>
                <Button variant="outlined" className={classes.routeBtn}><NavLink to="/draft" className={classes.link}>Draft</NavLink></Button>
            </NavigationBar>


            <Switch>
                <Route path='/inbox' component={() => <MailBoxPage type={PAGE_TYPE.INBOX}/>}/>
                <Route path='/outbox' component={() => <MailBoxPage type={PAGE_TYPE.OUTBOX}/>}/>
                <Route path='/draft' component={() => <MailBoxPage type={PAGE_TYPE.DRAFT}/>}/>
            </Switch>
        </div>
    );
}

export default App;
