import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';

import SlidingPage from '../common/SlidingPage';
import { setShowSignInPage } from '../../features/settings/settingsSlice';
import {
    login,
    register,
    setLoginError,
    setShowRegistration
} from './usersSlice';

const EMAIL_REGEX = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

const useStyles = makeStyles(theme => ({
    link: {
        marginTop: theme.spacing(1)
    },
    linkContainer: {
        margin: `${theme.spacing(2)}px 0`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        marginBottom: theme.spacing(2)
    },
    textInput: {
        marginTop: theme.spacing(2),
        minWidth: '70%'
    },
    button: {
        minWidth: '70%',
        marginTop: theme.spacing(4),
        height: theme.spacing(6)
    },
    buttonText: {
        fontSize: '1.2rem'
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

    const loginError = useSelector(state => state.users.loginError);
    const loggingIn = useSelector(state => state.users.loggingIn);
    const showRegistration = useSelector(state => state.users.showRegistration);

    const [email, setEmail] = useState({
        value: '',
        dirty: false,
        error: false,
        helperText: null
    });
    const [password, setPassword] = useState({
        value: '',
        dirty: false,
        error: false
    });
    const [confirmPassword, setConfirmPassword] = useState({
        value: '',
        dirty: false,
        error: false
    });

    const setPasswords = (newPassword, newConfirmPassword) => {
        setPassword(newPassword);
        setConfirmPassword(newConfirmPassword);
    };

    const checkPasswords = (newValue, password, otherPassword) =>
        new Promise(resolve => {
            if (!showRegistration) {
                resolve([
                    {
                        value: newValue,
                        dirty: true,
                        error: password.dirty && !newValue
                    },
                    otherPassword
                ]);
                return;
            }

            let passwordMismatch = false;
            if (password.dirty && otherPassword.dirty) {
                passwordMismatch = newValue !== otherPassword.value;
            }

            resolve([
                {
                    value: newValue,
                    dirty: password.dirty || newValue,
                    error: !newValue || passwordMismatch,
                    helperText: passwordMismatch ? 'Passwords must match' : null
                },
                {
                    ...otherPassword,
                    error: !otherPassword.value || passwordMismatch,
                    helperText: passwordMismatch ? 'Passwords must match' : null
                }
            ]);
        });

    return (
        <Container className={classes.container}>
            <Typography variant="h4" className={classes.header}>
                {showRegistration ? 'Register' : 'Sign In'}
            </Typography>
            {loginError && (
                <Typography variant="subtitle1" color="secondary">
                    {loginError}
                </Typography>
            )}
            <TextField
                id="email"
                className={classes.textInput}
                label="Email"
                variant="outlined"
                type="email"
                value={email.value}
                error={email.dirty && email.error}
                helperText={email.helperText}
                onFocus={() =>
                    setEmail({
                        ...email,
                        error: false,
                        helperText: null
                    })
                }
                onBlur={e => {
                    let wellFormed = e.target.value.match(EMAIL_REGEX);
                    setEmail({
                        ...email,
                        error: !wellFormed || !e.target.value,
                        helperText:
                            e.target.value && !wellFormed
                                ? 'Invalid Email'
                                : null
                    });
                }}
                onChange={e =>
                    setEmail({
                        value: e.target.value,
                        dirty: true,
                        error: false
                    })
                }
            ></TextField>
            <TextField
                id="password"
                className={classes.textInput}
                label="Password"
                variant="outlined"
                type="password"
                value={password.value}
                error={password.dirty && password.error}
                helperText={password.helperText}
                onFocus={() =>
                    setPassword({
                        ...password,
                        error: false
                    })
                }
                onBlur={e =>
                    checkPasswords(
                        e.target.value,
                        password,
                        confirmPassword
                    ).then(([newPassword, newConfirmPassword]) =>
                        setPasswords(newPassword, newConfirmPassword)
                    )
                }
                onChange={e =>
                    setPassword({
                        value: e.target.value,
                        dirty: true,
                        error: false
                    })
                }
            ></TextField>
            {showRegistration && (
                <TextField
                    id="confirmPassword"
                    className={classes.textInput}
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    value={confirmPassword.value}
                    error={confirmPassword.dirty && confirmPassword.error}
                    helperText={confirmPassword.helperText}
                    onFocus={() =>
                        setConfirmPassword({
                            ...confirmPassword,
                            error: false,
                            helperText: null
                        })
                    }
                    onBlur={e =>
                        checkPasswords(
                            e.target.value,
                            confirmPassword,
                            password
                        ).then(([newConfirmPassword, newPassword]) =>
                            setPasswords(newPassword, newConfirmPassword)
                        )
                    }
                    onChange={e =>
                        setConfirmPassword({
                            value: e.target.value,
                            dirty: true,
                            error: false
                        })
                    }
                ></TextField>
            )}
            <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={() => {
                    if (!email.value || !password.value) {
                        setEmail({
                            value: email.value,
                            dirty: true,
                            error: !email.value
                        });
                        setPassword({
                            value: password.value,
                            dirty: true,
                            error: !password.value
                        });
                    } else if (showRegistration) {
                        if (password.value === confirmPassword.value) {
                            dispatch(register(email.value, password.value));
                        }
                    } else {
                        dispatch(login(email.value, password.value));
                    }
                }}
            >
                {loggingIn ? (
                    <CircularProgress
                        style={{
                            color: 'white',
                            width: '30px',
                            height: '30px'
                        }}
                    />
                ) : (
                    <Typography className={classes.buttonText}>
                        Continue
                    </Typography>
                )}
            </Button>
            <div className={classes.linkContainer}>
                <Link
                    className={classes.link}
                    onClick={() => {
                        dispatch(setLoginError(null));
                        dispatch(setShowRegistration(!showRegistration));
                    }}
                >
                    {showRegistration ? 'Sign In' : 'Register'}
                </Link>
                <Link className={classes.link}>Use a Demo User</Link>
            </div>
        </Container>
    );
};

const SignIn = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const showSignInPage = useSelector(state => state.settings.showSignInPage);

    return (
        <SlidingPage
            direction="up"
            show={showSignInPage}
            hide={() => dispatch(setShowSignInPage(false))}
            BackIcon={CloseIcon}
        >
            <div className={classes.outerContainer}>
                <SignInContent />
            </div>
        </SlidingPage>
    );
};

export default SignIn;
