import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-touch-backend';

import Theme from './Theme';
import AppSettings from './features/settings/AppSettings';
import WorkoutEdit from './features/workouts/WorkoutEdit';
import WorkoutsList from './features/workouts/WorkoutsList';
import WorkoutPage from './features/workouts/WorkoutPage';
import WorkoutInstance from './features/workoutInstance/WorkoutInstance';
import Frame from './features/common/Frame';
import SignIn from './features/user/SignIn';
import SyncConfirmation from './features/settings/SyncConfirmation';
import web from './config/web';
import { handleSync } from './features/user/usersSlice';
import './App.css';

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            web.me().then(res => dispatch(handleSync(res)));
        }
    }, []);

    return (
        <DndProvider backend={Backend} options={{ enableMouseEvents: true }}>
            <ThemeProvider theme={Theme}>
                <AppSettings />
                <Frame>
                    <>
                        <WorkoutsList />
                        <WorkoutPage />
                        <WorkoutEdit />
                        <WorkoutInstance />
                    </>
                </Frame>
                <SignIn />
                <SyncConfirmation />
            </ThemeProvider>
        </DndProvider>
    );
};

export default App;
