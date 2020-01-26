import React, { useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';

import Theme from './Theme';
import {
    Frame,
    SignIn,
    WorkoutEdit,
    WorkoutsList,
    WorkoutPage
} from './components';
import './App.css';

const App = () => {
    const [user, setUser] = useState({});
    const [selectedWorkout, setSelectedWorkout] = useState();
    const [editingWorkout, setEditingWorkout] = useState();

    const signOut = () => {
        setUser(null);
        setSelectedWorkout(null);
        setEditingWorkout(null);
    };

    const saveWorkout = () => {
        setEditingWorkout(null);
    };

    return (
        <ThemeProvider theme={Theme}>
            <Frame showSignOut={!!user} signOut={signOut}>
                {user ? (
                    <>
                        <WorkoutsList
                            user={user}
                            selectWorkout={setSelectedWorkout}
                        />
                        <WorkoutPage
                            show={!!selectedWorkout}
                            hide={() => setSelectedWorkout(null)}
                            workout={selectedWorkout}
                            setEditingWorkout={setEditingWorkout}
                        />
                        <WorkoutEdit
                            show={!!editingWorkout}
                            hide={() => setEditingWorkout(null)}
                            workout={editingWorkout}
                            onSave={saveWorkout}
                        />
                    </>
                ) : (
                    <SignIn setUser={setUser} />
                )}
            </Frame>
        </ThemeProvider>
    );
};

export default App;
