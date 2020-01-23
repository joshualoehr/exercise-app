import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';

const AppContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px;
    height: 100%;
`;

const Frame = ({ children }) => {
    return (
        <>
            <AppBar position="sticky">
                <Typography variant="h6" style={{ textAlign: 'center' }}>
                    ExerciseJL
                </Typography>
            </AppBar>
            <AppContent>{children}</AppContent>
        </>
    );
};

Frame.propTypes = {
    children: PropTypes.object
};

export default Frame;
