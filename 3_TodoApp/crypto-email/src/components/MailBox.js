import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import TablePagination from '@material-ui/core/TablePagination';

import MailCard from './MailCard';
import SearchBar from './SearchBar'

const styles = theme => ({
    root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper
        }
});

class MailBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 10,
            searchKey: ''
        }
    }

    onChangePage = (event, newPage) => {
        this.setState({page: newPage})
    }

    onChangeRowsPerPage = (event) => {
        this.setState({
            page: 0,
            rowsPerPage: parseInt(event.target.value, 10)
        })
    }

    onSearchChange = (event) => {
        this.setState({
            searchKey: event.target.value.toLowerCase()
        })
    }

    render(){
        const { classes, mailList, pageType, selectedMid, onSelectMail } = this.props;
        const { page, rowsPerPage, searchKey } = this.state;
        return (
            <div>
                <SearchBar title={pageType} onSearchChange={this.onSearchChange}/>
                <List className={classes.root}>
                    {mailList
                    .filter(mail => mail.subject.toLowerCase().includes(searchKey))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(mail => 
                        <MailCard mail={mail}
                                selectedMid={selectedMid}
                                onSelectMail={onSelectMail}/>)}
                </List>
                <TablePagination
                    component="div"
                    count={mailList.length}
                    page={page}
                    onChangePage={this.onChangePage}
                    rowsPerPage={rowsPerPage}
                    onChangeRowsPerPage={this.onChangeRowsPerPage} />
            </div>
            
        );
    }
}


MailBox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MailBox);