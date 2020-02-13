import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SyncProblemIcon from '@material-ui/icons/SyncProblem';
import WarningIcon from '@material-ui/icons/Warning';

import { TOP_BAR_HEIGHT } from '../../config/constants';
import ConfirmationDialog from '../common/ConfirmationDialog';
import SlidingPage from '../common/SlidingPage';
import {
    confirmSync,
    promptForConfirmation,
    syncCancel,
    setShowSyncConfirmationDialog
} from '../../features/settings/settingsSlice';

const useStyles = makeStyles(theme => ({
    syncIcon: {
        fill: theme.palette.primary.main,
        width: '10rem',
        height: '10rem'
    },
    text: {
        textAlign: 'center',
        width: '85%',
        margin: `${theme.spacing(2)}px 0`
    },
    outerContainer: {
        overflow: 'auto',
        height: `calc(100% - ${TOP_BAR_HEIGHT * 2}px)`
    },
    innerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
        justifyContent: 'space-between',
        overflow: 'auto'
    },
    button: {
        width: '66%',
        marginTop: theme.spacing(2),
        '&:first-child': {
            marginTop: 0
        }
    },
    warning: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing(1)
    }
}));

const SyncConfirmationContent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const confirmationDialogType = useSelector(
        state => state.settings.confirmationDialogType
    );
    const showSyncConfirmationDialog = useSelector(
        state => state.settings.showSyncConfirmationDialog
    );

    return (
        <Container className={classes.innerContainer}>
            <SyncProblemIcon className={classes.syncIcon} />
            <Typography className={classes.text}>
                The data on this device is out of sync with your online data.
                <br />
                <br />
                Which data would you like to keep?
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    dispatch(promptForConfirmation('keepLocal'));
                }}
                className={classes.button}
            >
                Data On This Device
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    dispatch(promptForConfirmation('keepRemote'));
                }}
                className={classes.button}
            >
                Online Data
            </Button>
            <Button
                color="primary"
                onClick={() => {
                    dispatch(syncCancel());
                }}
                className={classes.button}
            >
                Cancel and Sign out
            </Button>
            <ConfirmationDialog
                open={showSyncConfirmationDialog}
                onConfirm={() => dispatch(confirmSync())}
                onCancel={() => dispatch(setShowSyncConfirmationDialog(false))}
                confirmColor={'secondary'}
                confirmText={'Continue'}
            >
                <>
                    <div className={classes.warning}>
                        <WarningIcon color="secondary" />
                        <Typography variant="h6" color="secondary">
                            WARNING
                        </Typography>
                    </div>
                    <Typography>
                        {confirmationDialogType === 'keepLocal'
                            ? 'This will overwrite your online data.'
                            : 'You will lose any unsaved changes on this device.'}
                    </Typography>
                </>
            </ConfirmationDialog>
        </Container>
    );
};

const SyncConfirmation = () => {
    const classes = useStyles();

    const showSyncConfirmation = useSelector(
        state => state.settings.showSyncConfirmation
    );

    return (
        <SlidingPage direction="up" show={showSyncConfirmation}>
            <div className={classes.outerContainer}>
                <SyncConfirmationContent />
            </div>
        </SlidingPage>
    );
};

export default SyncConfirmation;
