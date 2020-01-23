import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

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

const SignIn = ({ setUser }) => {
    const classes = useStyles();
    const [users, setUsers] = useState();

    useEffect(() => {
        fetch('http://localhost:3001/users')
            .then(res => res.json())
            .then(json => {
                setTimeout(() => setUsers(json), 500);
            });
    }, []);

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
                            key={user.userId}
                            onClick={() => setUser(user)}
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

SignIn.propTypes = {
    setUser: PropTypes.func
};

export default SignIn;
