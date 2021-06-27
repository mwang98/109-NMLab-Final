import React, { Component } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import ApplicationForm from "./ApplicationForm";

class ApplicationTable extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    schema = () => [
        { field: "id", headerName: "ID", width: 100 },
        { field: "status", headerName: "Status", width: 150 },
        { field: "description", headerName: "Description", width: 300 },
    ];

    render() {
        const { applicationList, onSubmitApplication } = this.props;

        return (
            <div style={{ height: 730, width: "100%" }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h4">My Application</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <DataGrid
                            rows={applicationList}
                            columns={this.schema()}
                            pageSize={10}
                            autoHeight
                            autoPageSize
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ApplicationForm onSubmit={onSubmitApplication} />
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default ApplicationTable;
