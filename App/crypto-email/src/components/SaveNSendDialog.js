import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function FormDialog(props) {
    const [open, setOpen] = React.useState(false);
    const { type, ...other } = props;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = (e, isEncrypt) => {
        setOpen(false);
        props.onSubmit(e, isEncrypt);
    };

    return (
        <React.Fragment>
            <Button onClick={handleClickOpen} {...other}>
                {type}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Encrypt Your Mail</DialogTitle>
                <DialogContent>
                    <DialogContentText>Some Description ...</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={(e) => onSubmit(e, false)}>
                        {type}
                    </Button>
                    <Button variant="outlined" onClick={(e) => onSubmit(e, true)}>
                        {type} with encryption
                    </Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
