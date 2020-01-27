import React from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-touch-backend';

import Theme from './Theme';
import WorkoutEdit from './features/workouts/WorkoutEdit';
import WorkoutsList from './features/workouts/WorkoutsList';
import WorkoutPage from './features/workouts/WorkoutPage';
import Frame from './features/common/Frame';
import SignIn from './features/user/SignIn';
import { fetchUsers } from './features/user/usersSlice';
import './App.css';

const App = () => {
    const dispatch = useDispatch();
    const { users, user } = useSelector(state => state.users, shallowEqual);

    return (
        <DndProvider backend={Backend} options={{ enableMouseEvents: true }}>
            <ThemeProvider theme={Theme}>
                <Frame>
                    {user ? (
                        <>
                            <WorkoutsList />
                            <WorkoutPage />
                            <WorkoutEdit />
                        </>
                    ) : (
                        <SignIn users={users} />
                    )}
                </Frame>
            </ThemeProvider>
        </DndProvider>
    );
};

export default App;
