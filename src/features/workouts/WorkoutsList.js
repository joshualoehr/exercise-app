import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import WorkoutCard from './WorkoutCard';
import { fetchWorkouts, setEditedWorkout } from './workoutsSlice';

const useStyles = makeStyles(theme => ({
    container: {
        alignItems: 'start',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    },
    progressContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

const WorkoutsList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const user = useSelector(state => state.users.user);
    const workouts = useSelector(state => state.workouts.workouts);

    useEffect(() => {
        if (user) {
            dispatch(fetchWorkouts(user));
        }
    }, [dispatch, user]);

    return (
        <Container
            className={classes.container}
            style={{
                justifyContent: workouts ? 'normal' : 'center'
            }}
        >
            <Typography
                variant="h4"
                style={{ marginTop: '20px', marginLeft: '10px' }}
            >
                Workouts
            </Typography>
            {workouts ? (
                workouts.map(workout => (
                    <WorkoutCard key={workout.id} workout={workout} />
                ))
            ) : (
                <div className={classes.progressContainer}>
                    <CircularProgress />
                </div>
            )}
            <Fab
                onClick={() =>
                    dispatch(setEditedWorkout({ workoutExercises: [] }))
                }
                aria-label="add workout"
                className={classes.fab}
                color="secondary"
            >
                <AddIcon />
            </Fab>
        </Container>
    );
};

export default WorkoutsList;
