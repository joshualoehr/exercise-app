import { createSlice } from '@reduxjs/toolkit';
import { fetchWorkouts } from '../workouts/workoutsSlice';
import dao from '../../config/dao';

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

export const setUserAsync = user => dispatch => {
    dao.syncAll(user).then(() => {
        dispatch(setUser(user));
        dispatch(fetchWorkouts(user));
    });
};

export default settingsSlice.reducer;
