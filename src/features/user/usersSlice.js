import { createSlice } from '@reduxjs/toolkit';

import web from '../../config/web';
import {
    setUser,
    setShowSignInPage,
    setShowSyncConfirmation,
    setOnSyncKeepLocal,
    setOnSyncKeepRemote,
    setOnSyncCancel
} from '../settings/settingsSlice';

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        loginError: null,
        loggingIn: false,
        showRegistration: false,
        users: null
    },
    reducers: {
        setLoginError(state, action) {
            state.loginError = action.payload;
        },
        setLoggingIn(state, action) {
            state.loggingIn = action.payload;
        },
        setShowRegistration(state, action) {
            state.showRegistration = action.payload;
        },
        setUsers(state, action) {
            state.users = action.payload;
        }
    }
});

export const {
    setLoginError,
    setLoggingIn,
    setShowRegistration,
    setUsers
} = usersSlice.actions;

export const handleSync = ([user, syncOps]) => dispatch => {
    if (syncOps) {
        const { keepLocal, keepRemote } = syncOps;
        setOnSyncKeepLocal(() =>
            keepLocal().then(() => dispatch(setUser(user)))
        );
        setOnSyncKeepRemote(() =>
            keepRemote().then(() => dispatch(setUser(user)))
        );
        setOnSyncCancel(() => web.logout());
        dispatch(setShowSyncConfirmation(true));
    } else {
        dispatch(setUser(user));
    }
    dispatch(setShowSignInPage(false));
    dispatch(setLoggingIn(false));
};

export const fetchUsers = () => dispatch =>
    fetch('http://localhost:3001/users')
        .then(res => res.json())
        .then(users => dispatch(setUsers(users)));

export const login = (email, password) => dispatch => {
    dispatch(setLoggingIn(true));
    dispatch(setLoginError(false));
    web.login(email, password)
        .then(web.me)
        .then(res => dispatch(handleSync(res)))
        .catch(err => {
            dispatch(setLoginError(err.message));
            dispatch(setLoggingIn(false));
        });
};

export const register = (email, password) => dispatch => {
    dispatch(setLoggingIn(true));
    dispatch(setLoginError(false));
    web.register(email, password)
        .then(web.me)
        .then(res => dispatch(handleSync(res)))
        .catch(err => {
            dispatch(setLoginError(err.message));
            dispatch(setLoggingIn(false));
        });
};

export default usersSlice.reducer;
