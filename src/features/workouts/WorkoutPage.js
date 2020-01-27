import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import { TOP_BAR_HEIGHT } from '../../config/constants';
import SlidingPage from '../common/SlidingPage';
import WorkoutHistory from './WorkoutHistory';
import {
    setSelectedWorkout,
    setEditedWorkout,
    setWorkoutInstance,
    fetchWorkoutHistory
} from './workoutsSlice';

const useStyles = makeStyles(() => ({
    button: {
        width: '100%',
        height: '60px',
        marginBottom: '24px'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
        height: `calc(100% - ${TOP_BAR_HEIGHT * 2}px)`,
        overflowY: 'auto'
    },
    workoutExerciseContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
    }
}));

const WorkoutPageContent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selectedWorkout = useSelector(
        state => state.workouts.selectedWorkout
    );

    return (
        <Container className={classes.container}>
            <Button
                onClick={() => dispatch(setWorkoutInstance(selectedWorkout))}
                variant="contained"
                color="primary"
                className={classes.button}
            >
                <Typography variant="h5">Begin</Typography>
            </Button>
            <div style={{ width: '100%' }}>
                {selectedWorkout.workoutExercises.map(exercise => (
                    <div
                        key={exercise.exerciseId}
                        className={classes.workoutExerciseContainer}
                    >
                        <Typography style={{ fontWeight: 'bold' }}>
                            {exercise.exerciseName}
                        </Typography>
                        <Typography>
                            {exercise.numSets}x{exercise.numReps}
                            {' \u2014 '}
                            {exercise.weight}lbs
                        </Typography>
                    </div>
                ))}
            </div>
            <WorkoutHistory />
        </Container>
    );
};

const WorkoutPage = () => {
    const dispatch = useDispatch();
    const selectedWorkout = useSelector(
        state => state.workouts.selectedWorkout,
        shallowEqual
    );

    useEffect(() => {
        dispatch(fetchWorkoutHistory(selectedWorkout));
    }, [dispatch, selectedWorkout]);

    return (
        <SlidingPage
            show={!!selectedWorkout}
            hide={() => {
                dispatch(setEditedWorkout(null));
                dispatch(setSelectedWorkout(null));
            }}
            Title={() => (
                <Typography style={{ fontSize: '20px' }}>
                    {selectedWorkout && selectedWorkout.workoutName}
                </Typography>
            )}
            RightSide={() => (
                <IconButton
                    onClick={() => dispatch(setEditedWorkout(selectedWorkout))}
                >
                    <EditIcon style={{ color: 'white' }} />
                </IconButton>
            )}
        >
            {selectedWorkout && (
                <WorkoutPageContent workout={selectedWorkout} />
            )}
        </SlidingPage>
    );
};

export default WorkoutPage;
