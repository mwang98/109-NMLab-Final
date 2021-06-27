import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";

import UserRow from "./UserRow";
import SearchBar from "./SearchBar";

class UserBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKey: "",
            page: 0,
            rowsPerPage: 10,
        };
    }

    onChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    onChangeRowsPerPage = (event) => {
        this.setState({
            page: 0,
            rowsPerPage: parseInt(event.target.value, 10),
        });
    };

    onSearchChange = (event) => {
        this.setState({
            searchKey: event.target.value.toLowerCase(),
        });
    };

    render() {
        const { userList } = this.props;
        const { searchKey, page, rowsPerPage } = this.state;
        return (
            <React.Fragment>
                <SearchBar title="Certified User" badgeContent={0} onSearchChange={this.onSearchChange} />
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell />
                                <TableCell>User Name</TableCell>
                                <TableCell>Address</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userList
                                .filter((user) => user.name.toLowerCase().includes(searchKey))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user) => (
                                    <UserRow key={user.address} user={user} />
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={userList.length}
                        page={page}
                        onChangePage={this.onChangePage}
                        rowsPerPage={rowsPerPage}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                    />
                </TableContainer>
            </React.Fragment>
        );
    }
}

export default UserBox;
