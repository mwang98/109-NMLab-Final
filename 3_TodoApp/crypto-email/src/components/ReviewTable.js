import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";

class ReviewTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applicationList: [],
        };
    }

    componentDidMount = async () => {
        console.log("componentDidMount");
        await this.setState(
            {
                applicationList: this.props.testProp,
            },
            () => console.log("after setsate", this.state.applicationList, this.props.applicationList)
        );
        console.log("after mount", this.state.applicationList);
    };

    schema = () => [
        { field: "id", headerName: "ID", width: 100 },
        { field: "name", headerName: "Name", width: 130 },
        { field: "address", headerName: "Address", width: 300 },
        { field: "description", headerName: "Description", width: 300 },
    ];

    render() {
        const { applicationList } = this.state;
        console.log("render state", this.state);
        console.log("render prop", this.props);
        return (
            <div style={{ height: 730, width: "100%" }}>
                <DataGrid
                    rows={applicationList}
                    columns={this.schema()}
                    pageSize={10}
                    autoHeight
                    autoPageSize
                    checkboxSelection
                />
            </div>
        );
    }
}
export default ReviewTable;
