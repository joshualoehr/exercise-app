import { createSlice } from '@reduxjs/toolkit';

import web from '../../config/web';
import { setUser, setShowSignInPage } from '../settings/settingsSlice';

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

export const fetchUsers = () => dispatch =>
    fetch('http://localhost:3001/users')
        .then(res => res.json())
        .then(users => dispatch(setUsers(users)));

export const login = (email, password) => dispatch => {
    dispatch(setLoggingIn(true));
    dispatch(setLoginError(false));
    web.login(email, password)
        .then(user => {
            dispatch(setUser(user));
            dispatch(setShowSignInPage(false));
            dispatch(setLoggingIn(false));
        })
        .catch(err => {
            dispatch(setLoginError(err.message));
            dispatch(setLoggingIn(false));
        });
};

export const register = (email, password) => dispatch => {
    dispatch(setLoggingIn(true));
    dispatch(setLoginError(false));
    web.register(email, password)
        .then(user => {
            dispatch(setUser(user));
            dispatch(setShowSignInPage(false));
            dispatch(setLoggingIn(false));
        })
        .catch(err => {
            dispatch(setLoginError(err.message));
            dispatch(setLoggingIn(false));
        });
};

export default usersSlice.reducer;
