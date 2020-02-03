import React from 'react';
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
import './App.css';

const App = () => {
    return (
        <DndProvider backend={Backend} options={{ enableMouseEvents: true }}>
            <ThemeProvider theme={Theme}>
                <Frame>
                    <>
                        <AppSettings />
                        <SignIn />
                        <WorkoutsList />
                        <WorkoutPage />
                        <WorkoutEdit />
                        <WorkoutInstance />
                    </>
                </Frame>
            </ThemeProvider>
        </DndProvider>
    );
};

export default App;
