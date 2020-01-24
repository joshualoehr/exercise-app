import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';

import { TOP_BAR_HEIGHT } from '../config/constants';

const AppContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
`;

const useStyles = makeStyles(() => ({
    topBar: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: TOP_BAR_HEIGHT
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
}));

const Frame = ({ children, showSignOut, signOut }) => {
    const classes = useStyles();

    return (
        <>
            <AppBar className={classes.topBar}>
                <Toolbar className={classes.toolbar}>
                    <Typography edge="start" variant="h6">
                        ExerciseJL
                    </Typography>
                    {showSignOut && (
                        <IconButton
                            edge="end"
                            aria-label="sign out"
                            onClick={signOut}
                        >
                            <ExitToAppIcon style={{ color: 'white' }} />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
            <div style={{ height: TOP_BAR_HEIGHT }}></div>
            <AppContent>{children}</AppContent>
        </>
    );
};

Frame.propTypes = {
    children: PropTypes.object,
    showSignOut: PropTypes.bool,
    signOut: PropTypes.func
};

export default Frame;
