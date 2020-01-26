import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import SlidingPage from './SlidingPage';
import { TOP_BAR_HEIGHT } from '../config/constants';

const useStyles = makeStyles(theme => ({
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
    card: {
        cursor: 'pointer',
        width: '100%',
        marginTop: theme.spacing(2),
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.1)'
        }
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    historyContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(51, 147, 136, 0.2)',
        padding: '8px',
        borderRadius: '6px',
        marginTop: '24px'
    }
}));

const WorkoutPageContent = ({ workout }) => {
    const classes = useStyles();
    const [workoutHistory, setWorkoutHistory] = useState();

    useEffect(() => {
        fetch('http://localhost:3001/workoutHistory')
            .then(res => res.json())
            .then(workoutHistory => setWorkoutHistory(workoutHistory));
    }, []);

    return (
        <Container className={classes.container}>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
            >
                <Typography variant="h5">Begin</Typography>
            </Button>
            <div style={{ width: '100%' }}>
                {workout.workoutExercises.map(exercise => (
                    <div
                        key={exercise.exerciseId}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}
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
            <div className={classes.historyContainer}>
                <Typography variant="h6">History</Typography>
                {workoutHistory ? (
                    workoutHistory.length ? (
                        workoutHistory.map(workout => (
                            <Card
                                key={workout.workoutId}
                                className={classes.card}
                            >
                                <CardContent className={classes.cardContent}>
                                    <Typography>{workout.date}</Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography style={{ opacity: 0.7 }}>
                            Nothing here yet
                        </Typography>
                    )
                ) : (
                    <CircularProgress />
                )}
            </div>
        </Container>
    );
};

const WorkoutPage = ({ workout, show, hide, setEditingWorkout }) => (
    <SlidingPage
        show={show}
        hide={hide}
        Title={() => (
            <Typography style={{ fontSize: '20px' }}>
                {workout && workout.workoutName}
            </Typography>
        )}
        RightSide={() => (
            <IconButton onClick={() => setEditingWorkout(workout)}>
                <EditIcon style={{ color: 'white' }} />
            </IconButton>
        )}
    >
        {workout && <WorkoutPageContent workout={workout} />}
    </SlidingPage>
);

WorkoutPageContent.propTypes = {
    workout: PropTypes.object
};

WorkoutPage.propTypes = {
    workout: PropTypes.object,
    show: PropTypes.bool,
    hide: PropTypes.func,
    setEditingWorkout: PropTypes.func
};

export default WorkoutPage;
