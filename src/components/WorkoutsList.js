import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import WorkoutCard from './WorkoutCard';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%'
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    }
}));

const WorkoutsList = ({ selectWorkout }) => {
    const classes = useStyles();
    const [workouts, setWorkouts] = useState();

    useEffect(() => {
        fetch('http://localhost:3001/workouts')
            .then(res => res.json())
            .then(json =>
                json.map(({ workoutName, ...workout }) => ({
                    workoutName:
                        workoutName.charAt(0).toUpperCase() +
                        workoutName.substring(1),
                    ...workout
                }))
            )
            .then(workouts => {
                setWorkouts(workouts);
                selectWorkout(workouts[0]);
            });
    }, []);

    return (
        <Container
            className={classes.container}
            style={{
                justifyContent: workouts ? 'normal' : 'center',
                alignItems: 'start'
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
                    <WorkoutCard
                        key={workout.workoutId}
                        workout={workout}
                        selectWorkout={() => selectWorkout(workout)}
                    />
                ))
            ) : (
                <CircularProgress />
            )}
            <Fab
                aria-label="add workout"
                className={classes.fab}
                color="secondary"
            >
                <AddIcon />
            </Fab>
        </Container>
    );
};

WorkoutsList.propTypes = {
    selectWorkout: PropTypes.func,
    user: PropTypes.object
};

export default WorkoutsList;
