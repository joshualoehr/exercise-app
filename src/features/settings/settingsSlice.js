import { createSlice } from '@reduxjs/toolkit';
import { fetchWorkouts } from '../workouts/workoutsSlice';
import web from '../../config/web';

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        showAppSettings: null,
        showSignInPage: false,
        showSyncConfirmation: false,
        showSyncError: false,
        syncing: false,
        user: null
    },
    reducers: {
        setShowAppSettings(state, action) {
            state.showAppSettings = action.payload;
        },
        setShowSignInPage(state, action) {
            state.showSignInPage = action.payload;
        },
        setShowSyncConfirmation(state, action) {
            state.showSyncConfirmation = action.payload;
        },
        setShowSyncError(state, action) {
            state.showSyncError = action.payload;
        },
        setSyncing(state, action) {
            state.syncing = action.payload;
        },
        setUser(state, action) {
            state.user = action.payload;
        }
    }
});

let onSyncKeepLocal = null;
let onSyncKeepRemote = null;
let onSyncCancel = null;

export const setOnSyncKeepLocal = func => (onSyncKeepLocal = func);
export const setOnSyncKeepRemote = func => (onSyncKeepRemote = func);
export const setOnSyncCancel = func => (onSyncCancel = func);
export const {
    setShowAppSettings,
    setShowSignInPage,
    setShowSyncConfirmation,
    setShowSyncError,
    setSyncing,
    setUser
} = settingsSlice.actions;

export const setUserAsync = user => dispatch => {
    web.login('johnsmith@gmail.com', 'Abc123!')
        .then(web.me)
        .then(({ user }) => {
            console.log('Successfully logged in', user);
            dispatch(setUser(user));
            dispatch(fetchWorkouts(user));
        })
        .catch(console.error);
};

export const syncKeepLocal = () => dispatch => {
    dispatch(setSyncing(true));
    dispatch(setShowSyncError(false));
    onSyncKeepLocal()
        .then(() => {
            dispatch(setShowSyncConfirmation(false));
            dispatch(setSyncing(false));
        })
        .catch(err => {
            console.error(err);
            dispatch(setShowSyncError(true));
            throw err;
        });
};
export const syncKeepRemote = () => dispatch => {
    dispatch(setSyncing(true));
    dispatch(setShowSyncError(false));
    onSyncKeepRemote()
        .then(() => {
            dispatch(setShowSyncConfirmation(false));
            dispatch(setSyncing(false));
        })
        .catch(err => {
            console.error(err);
            dispatch(setShowSyncError(true));
            throw err;
        });
};
export const syncCancel = () => dispatch => {
    dispatch(setSyncing(true));
    dispatch(setShowSyncError(false));
    onSyncCancel()
        .then(() => {
            dispatch(setShowSyncConfirmation(false));
            dispatch(setSyncing(false));
        })
        .catch(err => {
            console.error(err);
            dispatch(setShowSyncError(true));
            throw err;
        });
};

export default settingsSlice.reducer;
