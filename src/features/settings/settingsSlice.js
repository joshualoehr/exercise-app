import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        confirmationDialogType: null,
        showAppSettings: null,
        showSignInPage: false,
        showSyncConfirmation: false,
        showSyncConfirmationDialog: false,
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
        setShowSyncConfirmationDialog(state, action) {
            state.showSyncConfirmationDialog = action.payload;
        },
        setConfirmationDialogType(state, action) {
            state.confirmationDialogType = action.payload;
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

export const {
    setShowAppSettings,
    setShowSignInPage,
    setShowSyncConfirmation,
    setShowSyncConfirmationDialog,
    setConfirmationDialogType,
    setShowSyncError,
    setSyncing,
    setUser
} = settingsSlice.actions;

let onSyncKeepLocal = null;
let onSyncKeepRemote = null;
let onSyncCancel = null;

export const setOnSyncKeepLocal = func => (onSyncKeepLocal = func);
export const setOnSyncKeepRemote = func => (onSyncKeepRemote = func);
export const setOnSyncCancel = func => (onSyncCancel = func);

export const confirmSync = () => (dispatch, getState) => {
    const {
        settings: { confirmationDialogType }
    } = getState();

    dispatch(setShowSyncConfirmationDialog(false));

    if (confirmationDialogType === 'keepLocal') {
        dispatch(syncKeepLocal());
    } else {
        dispatch(syncKeepRemote());
    }
};

export const promptForConfirmation = type => dispatch => {
    dispatch(setConfirmationDialogType(type));
    dispatch(setShowSyncConfirmationDialog(true));
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
    dispatch(setShowSyncError(false));
    onSyncCancel()
        .then(() => {
            dispatch(setShowSyncConfirmation(false));
            dispatch(setSyncing(false));
            dispatch(setUser(null));
        })
        .catch(err => {
            console.error(err);
            dispatch(setShowSyncError(true));
            throw err;
        });
};

export default settingsSlice.reducer;
