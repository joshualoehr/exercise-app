import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        showAppSettings: null,
        user: null
    },
    reducers: {
        setShowAppSettings(state, action) {
            state.showAppSettings = action.payload;
        },
        setUser(state, action) {
            state.user = action.payload;
        }
    }
});

export const { setShowAppSettings, setUser } = settingsSlice.actions;

export default settingsSlice.reducer;
