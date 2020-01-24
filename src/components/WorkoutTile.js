import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

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
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    extraText: {
        opacity: 0.7
    },
    iconContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }
}));

const truncateExercises = (exercises, max = 3) => {
    if (exercises.length <= max) return exercises;
    const extra = exercises.length - max;
    return [...exercises.slice(0, max), `...and ${extra} more`];
};

const WorkoutTile = ({ selectWorkout, workout }) => {
    const classes = useStyles();

    return (
        <Card className={classes.card} onClick={selectWorkout}>
            <CardContent className={classes.cardContent}>
                <div>
                    <Typography variant="h5">{workout.workoutName}</Typography>
                    {truncateExercises(workout.workoutExercises).map(exercise =>
                        typeof exercise === 'string' ? (
                            <Typography
                                variant="body2"
                                key="extra"
                                className={classes.extraText}
                            >
                                {exercise}
                            </Typography>
                        ) : (
                            <Typography
                                variant="body2"
                                key={exercise.exerciseId}
                            >
                                {exercise.exerciseName} {exercise.numSets}x
                                {exercise.numReps}
                            </Typography>
                        )
                    )}
                </div>
                <div>
                    <ArrowForwardIosIcon
                        color="primary"
                        fontSize="large"
                        className={classes.iconContainer}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

WorkoutTile.propTypes = {
    selectWorkout: PropTypes.func,
    workout: PropTypes.object
};

export default WorkoutTile;
