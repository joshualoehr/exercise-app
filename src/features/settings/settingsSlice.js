import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        showAppSettings: null,
        showSignInPage: false,
        user: null
    },
    reducers: {
        setShowAppSettings(state, action) {
            state.showAppSettings = action.payload;
        },
        setShowSignInPage(state, action) {
            state.showSignInPage = action.payload;
        },
        setUser(state, action) {
            state.user = action.payload;
        }
    }
});

export const {
    setShowAppSettings,
    setShowSignInPage,
    setUser
} = settingsSlice.actions;

export default settingsSlice.reducer;
