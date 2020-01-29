import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

import { TOP_BAR_HEIGHT } from '../../config/constants';
import SlidingPage from '../common/SlidingPage';
import ExerciseInstanceCard from './ExerciseInstanceCard';
import BodyWeightCard from './BodyWeightCard';
import WeightOverrideDialog from './WeightOverrideDialog';
import { setWorkoutInstance } from './workoutInstanceSlice';

const useStyles = makeStyles(() => ({
    outerContainer: {
        overflow: 'auto',
        height: `calc(100% - ${TOP_BAR_HEIGHT * 2}px)`
    },
    innerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
        justifyContent: 'space-between',
        overflow: 'auto'
    }
}));

const WorkoutInstanceContent = () => {
    const classes = useStyles();
    const workoutInstance = useSelector(
        state => state.workoutInstance.workoutInstance
    );

    return (
        <Container className={classes.innerContainer}>
            {workoutInstance.exercises.map(exerciseInstance => (
                <ExerciseInstanceCard
                    key={exerciseInstance.id}
                    exerciseInstance={exerciseInstance}
                />
            ))}
            <BodyWeightCard />
            <WeightOverrideDialog />
        </Container>
    );
};

const WorkoutInstance = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selectedWorkout = useSelector(
        state => state.workouts.selectedWorkout
    );
    const workoutInstance = useSelector(
        state => state.workoutInstance.workoutInstance
    );

    const atLeastOneSetComplete =
        workoutInstance && workoutInstance.exercises
            ? workoutInstance.exercises.reduce(
                  (acc, exercise) =>
                      acc ||
                      exercise.sets.some(set => set.completedReps !== null),
                  false
              )
            : false;

    return (
        <SlidingPage
            direction="up"
            show={!!workoutInstance}
            hide={() => dispatch(setWorkoutInstance(null))}
            Title={() => (
                <Typography variant="h5">
                    {selectedWorkout.workoutName}
                </Typography>
            )}
            RightSide={() => (
                <Button
                    onClick={() => {
                        dispatch(saveWorkoutInstance());
                        dispatch(setWorkoutInstance(null));
                    }}
                    disabled={!atLeastOneSetComplete}
                    style={{ color: atLeastOneSetComplete ? 'white' : null }}
                >
                    Finish
                </Button>
            )}
            BackIcon={CloseIcon}
        >
            <div className={classes.outerContainer}>
                {workoutInstance && <WorkoutInstanceContent />}
            </div>
        </SlidingPage>
    );
};

export default WorkoutInstance;
