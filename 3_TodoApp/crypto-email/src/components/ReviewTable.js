import React, { Component } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

class ReviewTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIds: [],
        };
    }

    schema = () => [
        { field: "id", headerName: "ID", width: 100 },
        { field: "name", headerName: "Name", width: 130 },
        { field: "address", headerName: "Address", width: 300 },
        { field: "description", headerName: "Description", width: 300 },
    ];

    onRowSelect = (params) => {
        const { data, isSelected } = params;
        const { id } = data;
        if (isSelected) {
            this.setState((state) => {
                state.selectedIds.push(id);
                return state;
            });
        } else {
            this.setState((state) => ({
                selectedIds: state.selectedIds.filter((e) => e != id),
            }));
        }
    };

    render() {
        const { selectedIds } = this.state;
        const { pendingApplicationList, onAgreeApplication, onRejectApplication } = this.props;

        console.log(pendingApplicationList)

        return (
            <div style={{ height: 730, width: "100%" }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h4">User Application</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <DataGrid
                            rows={pendingApplicationList}
                            columns={this.schema()}
                            pageSize={10}
                            autoHeight
                            autoPageSize
                            checkboxSelection
                            onRowSelected={this.onRowSelect}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ButtonGroup color="primary" variant={selectedIds.length ? "contained" : "outlined"}>
                            <Button onClick={() => onAgreeApplication(selectedIds)}>Agree</Button>
                            <Button onClick={() => onRejectApplication(selectedIds)}>Reject</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default ReviewTable;
