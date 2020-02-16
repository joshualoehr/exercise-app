import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';

import { setWorkoutInstance } from '../workoutInstance/workoutInstanceSlice';
import { truncateList } from '../../config/utils';

const useStyles = makeStyles(theme => ({
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
        flexDirection: 'column'
    },
    historyContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(51, 147, 136, 0.2)',
        padding: '8px',
        borderRadius: '6px',
        marginTop: '24px',
        width: '100%'
    },
    exerciseInstanceContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        whiteSpace: 'nowrap'
    },
    exerciseInstanceText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    extraText: {
        opacity: 0.7
    }
}));

const ExerciseInstance = ({ exerciseInstance }) => {
    const classes = useStyles();
    const { maxReps, exerciseName, sets, weight } = exerciseInstance;

    const perfectExercise = sets.every(
        ({ completedReps }) => completedReps === maxReps
    );

    const concatSets = perfectExercise
        ? `${sets.length}x${maxReps}`
        : sets.map(({ completedReps }) => completedReps).join('/');

    return (
        <div className={classes.exerciseInstanceContainer}>
            <Typography
                className={classes.exerciseInstanceText}
                style={{ marginRight: '8px' }}
            >
                {exerciseName}
            </Typography>
            <div style={{ display: 'flex' }}>
                <Typography
                    className={classes.exerciseInstanceText}
                    style={{ marginRight: '6px' }}
                >
                    {concatSets}
                </Typography>
                {' \u2014 '}
                <Typography
                    className={classes.exerciseInstanceText}
                    style={{ marginLeft: '6px' }}
                >
                    {weight} lbs
                </Typography>
            </div>
        </div>
    );
};

ExerciseInstance.propTypes = {
    exerciseInstance: PropTypes.object
};

const WorkoutHistory = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const workoutHistory = useSelector(state => state.workouts.workoutHistory);

    return (
        <div className={classes.historyContainer}>
            <Typography variant="h5">History</Typography>
            {workoutHistory ? (
                workoutHistory.length ? (
                    workoutHistory.map(workoutInstance => (
                        <Card
                            key={workoutInstance.id}
                            className={classes.card}
                            onClick={() =>
                                dispatch(setWorkoutInstance(workoutInstance))
                            }
                        >
                            <CardContent className={classes.cardContent}>
                                <Typography
                                    style={{
                                        marginBottom: '8px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {moment(workoutInstance.date).calendar()}
                                </Typography>
                                {truncateList(workoutInstance.exercises).map(
                                    (exerciseInstance, idx) =>
                                        typeof exerciseInstance === 'string' ? (
                                            <Typography
                                                key={-1}
                                                className={classes.extraText}
                                            >
                                                {exerciseInstance}
                                            </Typography>
                                        ) : (
                                            <ExerciseInstance
                                                key={idx}
                                                exerciseInstance={
                                                    exerciseInstance
                                                }
                                            />
                                        )
                                )}
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
    );
};

export default WorkoutHistory;
