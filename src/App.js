import React, { useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Theme from './Theme';
import {
    Frame,
    SignIn,
    SlidingPage,
    WorkoutEdit,
    WorkoutsList,
    WorkoutPage
} from './components';
import './App.css';

const App = () => {
    const [user, setUser] = useState({});
    const [selectedWorkout, selectWorkout] = useState();
    const [editingWorkout, setEditingWorkout] = useState();

    const signOut = () => {
        setUser(null);
        selectWorkout(null);
        setEditingWorkout(null);
    };

    const saveWorkout = () => {};

    return (
        <ThemeProvider theme={Theme}>
            <Frame showSignOut={!!user} signOut={signOut}>
                {user ? (
                    <>
                        <WorkoutsList
                            user={user}
                            selectWorkout={selectWorkout}
                        />
                        <SlidingPage
                            show={!!selectedWorkout}
                            hide={() => selectWorkout(null)}
                            title={
                                selectedWorkout
                                    ? selectedWorkout.workoutName
                                    : ''
                            }
                            RightSide={() => (
                                <IconButton
                                    onClick={() =>
                                        setEditingWorkout(selectedWorkout)
                                    }
                                >
                                    <EditIcon style={{ color: 'white' }} />
                                </IconButton>
                            )}
                        >
                            {selectedWorkout && (
                                <WorkoutPage
                                    workout={selectedWorkout}
                                    editWorkout={() =>
                                        setEditingWorkout(selectedWorkout)
                                    }
                                />
                            )}
                        </SlidingPage>
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
