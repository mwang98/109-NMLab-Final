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

function createData(name, address, description) {
    return {
        name,
        address,
        description,
    };
}

const users = [
    createData("Frozen yoghurt", "test@Frozen-yoghurt.com", "no desciprtion"),
    createData("Ice cream sandwich", "test@Ice.cream.sandwich.com", "no desciprtion"),
    createData("Google", "test@google.com", "no desciprtion"),
    createData("Amazon", "test@amazon.com", "no desciprtion"),
    createData("Microsoft", "test@microsoft.com", "no desciprtion"),
    createData("Yahoo", "test@yahoo.com", "no desciprtion"),
];

class UserBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: users,
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
        const { searchKey, userList, page, rowsPerPage } = this.state;
        return (
            <>
                <SearchBar title={"Certified User"} badgeContent={0} onSearchChange={this.onSearchChange} />
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
                                    <UserRow key={user.name} user={user} />
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
            </>
        );
    }
}

export default UserBox;
