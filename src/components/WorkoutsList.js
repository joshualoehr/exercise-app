import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import WorkoutTile from './WorkoutTile';

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%'
    }
}));

const WorkoutsList = () => {
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
                setTimeout(() => setWorkouts(workouts), 500);
            });
    }, []);

    return (
        <Container
            className={classes.container}
            style={{ justifyContent: workouts ? 'normal' : 'center' }}
        >
            {workouts ? (
                workouts.map(workout => (
                    <WorkoutTile key={workout.workoutId} workout={workout} />
                ))
            ) : (
                <CircularProgress />
            )}
        </Container>
    );
};

WorkoutsList.propTypes = {
    user: PropTypes.object
};

export default WorkoutsList;
