import React, { useState } from 'react';
import { Frame, SignIn, WorkoutsList } from './components';
import Theme from './Theme';
import { ThemeProvider } from '@material-ui/core/styles';
import './App.css';

const App = () => {
    const [user, setUser] = useState();

    return (
        <ThemeProvider theme={Theme}>
            <Frame>
                {user ? (
                    <WorkoutsList user={user} />
                ) : (
                    <SignIn setUser={setUser} />
                )}
            </Frame>
        </ThemeProvider>
    );
};

export default App;
