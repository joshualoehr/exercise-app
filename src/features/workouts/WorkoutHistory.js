import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';

import { setWorkoutInstance } from '../workoutInstance/workoutInstanceSlice';

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

const WorkoutHistory = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const workoutHistory = useSelector(state => state.workouts.workoutHistory);

    return (
        <div className={classes.historyContainer}>
            <Typography variant="h6">History</Typography>
            {workoutHistory ? (
                workoutHistory.length ? (
                    workoutHistory.map(workout => (
                        <Card
                            key={workout.id}
                            className={classes.card}
                            onClick={() =>
                                dispatch(setWorkoutInstance(workout))
                            }
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
    );
};

export default WorkoutHistory;
