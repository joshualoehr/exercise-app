import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { TOP_BAR_HEIGHT } from '../../config/constants';
import SlidingPage from '../common/SlidingPage';
import {
    syncKeepLocal,
    syncKeepRemote,
    syncCancel
} from '../../features/settings/settingsSlice';

const useStyles = makeStyles(theme => ({
    syncIcon: {
        marginTop: theme.spacing(4),
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
    }
}));

const SyncConfirmationContent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <Container className={classes.innerContainer}>
            <svg
                className={classes.syncIcon}
                id="Capa_1"
                enableBackground="new 0 0 551.13 551.13"
                height="512"
                viewBox="0 0 551.13 551.13"
                width="512"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="m258.342 378.902h34.448v34.446h-34.448z" />
                <path d="m258.342 137.782h34.446v206.674h-34.446z" />
                <path d="m68.891 275.565c0-102.134 74.738-186.382 172.228-202.94v30.712l68.891-51.668-68.89-51.669v37.235c-116.654 16.805-206.674 117.119-206.674 238.33 0 87.119 46.608 163.375 116.048 205.749l29.947-22.46c-66.186-34.49-111.549-103.631-111.55-183.289z" />
                <path d="m400.637 69.816-29.947 22.46c66.186 34.49 111.549 103.631 111.549 183.289 0 102.162-74.7 186.655-172.228 203.175v-30.949l-68.891 51.668 68.891 51.671v-37.26c116.645-16.807 206.674-117.095 206.674-238.304 0-87.12-46.609-163.376-116.048-205.75z" />
            </svg>
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
                    dispatch(syncKeepLocal());
                }}
                className={classes.button}
            >
                Data On This Device
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    dispatch(syncKeepRemote());
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
