import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import { formatTimer } from '../../config/utils';
import { setShowTimer } from './workoutInstanceSlice';

const useStyles = makeStyles(theme => ({
    appBar: {
        top: 'auto',
        bottom: 0
    },
    timerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `0 ${theme.spacing(1)}px`
    },
    timer: {
        fontSize: '1.2rem',
        marginLeft: theme.spacing(1)
    }
}));

const TimerBarContent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const timeRemaining = useSelector(
        state => state.workoutInstance.timeRemaining
    );

    return (
        <AppBar position="fixed" color="primary" className={classes.appBar}>
            <div className={classes.timerContainer}>
                <Typography className={classes.timer}>
                    {formatTimer(timeRemaining)}
                </Typography>
                {timeRemaining < 0 && (
                    <Typography>Time to start the next set!</Typography>
                )}
                <IconButton
                    onClick={() => {
                        dispatch(setShowTimer(false));
                    }}
                >
                    <HighlightOffIcon style={{ color: 'white' }} />
                </IconButton>
            </div>
        </AppBar>
    );
};

const TimerBar = () => {
    const showTimer = useSelector(state => state.workoutInstance.showTimer);

    return (
        <Slide direction="up" in={showTimer} mountOnEnter unmountOnExit>
            <div
                style={{
                    display: showTimer ? 'block' : 'none',
                    height: '48px'
                }}
            >
                <TimerBarContent />
            </div>
        </Slide>
    );
};

export default TimerBar;
