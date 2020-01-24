import React, { useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

import Theme from './Theme';
import {
    Frame,
    SignIn,
    SlidingPage,
    WorkoutsList,
    WorkoutPage
} from './components';
import './App.css';

const App = () => {
    const [user, setUser] = useState({});
    const [selectedWorkout, selectWorkout] = useState();

    const signOut = () => {
        setUser(null);
        selectWorkout(null);
    };

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
                                <IconButton>
                                    <EditIcon style={{ color: 'white' }} />
                                </IconButton>
                            )}
                        >
                            {selectedWorkout && (
                                <WorkoutPage workout={selectedWorkout} />
                            )}
                        </SlidingPage>
                    </>
                ) : (
                    <SignIn setUser={setUser} />
                )}
            </Frame>
        </ThemeProvider>
    );
};

export default App;
