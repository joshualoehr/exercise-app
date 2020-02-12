import { createSlice } from '@reduxjs/toolkit';
import { fetchWorkouts } from '../workouts/workoutsSlice';
import dao from '../../config/dao';
import web from '../../config/web';

let onSyncKeepLocal = null;
let onSyncKeepRemote = null;

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

export const setOnSyncKeepLocal = func => (onSyncKeepLocal = func);
export const setOnSyncKeepRemote = func => (onSyncKeepRemote = func);

export const {
    setShowAppSettings,
    setShowSignInPage,
    setShowSyncConfirmation,
    setUser
} = settingsSlice.actions;

export const setUserAsync = user => dispatch => {
    web.login('johnsmith@gmail.com', 'Abc123!')
        .then(() => {
            console.log('Successfully logged in');
            dispatch(setUser(user));
            dispatch(fetchWorkouts(user));
        })
        .catch(console.error);
};

const handleSyncConfirmation = syncHandler => () => dispatch => {
    dispatch(setSyncing(true));
    dispatch(setShowSyncError(false));
    syncHandler()
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

export const syncKeepLocal = handleSyncConfirmation(onSyncKeepLocal);
export const syncKeepRemote = handleSyncConfirmation(onSyncKeepRemote);

export default settingsSlice.reducer;
