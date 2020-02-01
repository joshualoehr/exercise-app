import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';

import SlidingPage from '../common/SlidingPage';
import {
    setUser,
    setShowSignInPage
} from '../../features/settings/settingsSlice';
import { fetchUsers } from './usersSlice';

const useStyles = makeStyles(theme => ({
    button: {
        width: '66%',
        marginTop: theme.spacing(2),
        '&:first-child': {
            marginTop: 0
        }
    },
    buttonWithSpacing: {
        marginTop: theme.spacing(2)
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '80vh',
        justifyContent: 'center'
    },
    progressContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

const SignInContent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const users = useSelector(state => state.users.users);

    return (
        <Container className={classes.container}>
            {users ? (
                <>
                    <Typography variant="h4">Sign In</Typography>
                    <Typography variant="subtitle1">
                        as one of these users
                    </Typography>
                    {users.map((user, i) => (
                        <Button
                            variant="contained"
                            color="primary"
                            key={user.id}
                            onClick={() => {
                                dispatch(setShowSignInPage(false));
                                dispatch(setUser(user));
                            }}
                            className={classes.button}
                        >
                            {user.displayName}
                        </Button>
                    ))}
                </>
            ) : (
                <CircularProgress />
            )}
        </Container>
    );
};

const SignIn = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const showSignInPage = useSelector(state => state.settings.showSignInPage);
    const users = useSelector(state => state.users.users);

    useEffect(() => {
        if (!users) {
            dispatch(fetchUsers());
        }
    }, [dispatch, users]);

    return (
        <SlidingPage
            direction="up"
            show={showSignInPage}
            hide={() => dispatch(setShowSignInPage(false))}
            BackIcon={CloseIcon}
        >
            <div className={classes.outerContainer}>
                {users ? (
                    <SignInContent />
                ) : (
                    <div className={classes.progressContainer}>
                        <CircularProgress />
                    </div>
                )}
            </div>
        </SlidingPage>
    );
};

export default SignIn;
