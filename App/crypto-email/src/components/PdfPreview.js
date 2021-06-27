import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const options = {
    cMapUrl: "cmaps/",
    cMapPacked: true,
};

class PdfPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            pdf: "",
        };
    }
    componentDidMount() {
        var pdfData = new Blob([this.props.file["buffer"]], { type: "application/pdf" });
        this.setState({ pdf: pdfData });
    }

    onDocumentLoadSuccess = (res) => {
        this.setState({
            numPages: res.numPages,
            pageNumber: 1,
        });
    };

    handleClick = (dir) => {
        this.setState((state) => {
            let newPageNumber = state.pageNumber;
            if (dir === "prev" && state.pageNumber > 1) newPageNumber = state.pageNumber - 1;
            else if (dir === "next" && state.pageNumber < state.numPages) newPageNumber = state.pageNumber + 1;
            return { pageNumber: newPageNumber };
        });
    };

    render() {
        return (
            <div className="wrapper">
                <div style={{ textAlign: "center" }}>
                    <div style={{ display: "inline-block", verticalAlign: "top" }} className="buttons">
                        <div
                            style={{ cursor: "pointer" }}
                            onClick={() => this.handleClick("prev")}
                            className="page-button"
                        >
                            &#8592;
                        </div>
                    </div>
                    <div style={{ display: "inline-block", verticalAlign: "top" }}>
                        <Document
                            className="doc"
                            file={this.state.pdf}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                            options={options}
                            height={1000}
                        >
                            <Page
                                height={980}
                                pageNumber={this.state.pageNumber}
                                renderTextLayer={false}
                                renderInteractiveForms={false}
                            />
                        </Document>
                    </div>
                    <div style={{ display: "inline-block", verticalAlign: "top" }} className="buttons">
                        <div
                            style={{ cursor: "pointer" }}
                            onClick={() => this.handleClick("next")}
                            className="page-button"
                        >
                            &#8594;
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withStyles(styles)(PdfPreview);
