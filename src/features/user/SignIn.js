import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import { setUser } from '../../features/settings/settingsSlice';
import { fetchUsers } from './usersSlice';

const useStyles = makeStyles(theme => ({
    button: {
        width: '66%'
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
    }
}));

const SignIn = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const users = useSelector(state => state.users.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

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
                            onClick={() => dispatch(setUser(user))}
                            className={`${classes.button} ${
                                i !== users.length
                                    ? classes.buttonWithSpacing
                                    : ''
                            }`}
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

export default SignIn;
