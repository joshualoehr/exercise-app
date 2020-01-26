import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({}));

const ConfirmationDialogContent = ({
    cancelText = 'cancel',
    confirmText = 'confirm',
    cancelColor = 'primary',
    confirmColor = 'primary',
    onCancel,
    onConfirm,
    children
}) => {
    const classes = useStyles();

    return (
        <>
            <DialogContent>{children}</DialogContent>
            <DialogActions className={classes.actions}>
                <Button color={cancelColor} onClick={onCancel}>
                    {cancelText}
                </Button>
                <Button
                    color={confirmColor}
                    variant="outlined"
                    onClick={onConfirm}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </>
    );
};

ConfirmationDialogContent.propTypes = {
    cancelColor: PropTypes.string,
    cancelText: PropTypes.string,
    confirmColor: PropTypes.string,
    confirmText: PropTypes.string,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    children: PropTypes.object
};

const ConfirmationDialog = ({ open, ...props }) => (
    <Dialog open={open}>
        <ConfirmationDialogContent {...props}>
            {props.children}
        </ConfirmationDialogContent>
    </Dialog>
);

ConfirmationDialog.propTypes = {
    open: PropTypes.bool,
    children: PropTypes.object
};

export default ConfirmationDialog;
