import React, { useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';

import Theme from './Theme';
import { Frame, SignIn, SlidingPage, WorkoutsList } from './components';
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
                        >
                            <div></div>
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
