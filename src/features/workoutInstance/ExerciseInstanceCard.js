import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { decrementSetInstanceReps } from './workoutInstanceSlice';

const useStyles = makeStyles(theme => ({
    card: {
        width: '100%',
        marginTop: theme.spacing(2)
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: theme.spacing(1)
    },
    sets: {
        display: 'flex',
        flexDirection: 'row',
        overflow: 'auto',
        padding: theme.spacing(2)
    },
    set: {
        display: 'flex',
        height: '48px',
        width: '48px',
        borderRadius: '30px',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        marginRight: theme.spacing(2)
    },
    emptySet: {
        height: '48px',
        width: '48px',
        borderRadius: '30px',
        border: `1px solid ${theme.palette.primary.main}`,
        marginRight: theme.spacing(2)
    }
}));

const SetInstance = ({ set, decrementReps }) => {
    const classes = useStyles();

    return set.completedReps !== null ? (
        <div className={classes.set} onClick={decrementReps}>
            <Typography style={{ margin: 'auto' }} variant="h5">
                {set.completedReps}
            </Typography>
        </div>
    ) : (
        <div className={classes.emptySet} onClick={decrementReps}></div>
    );
};

SetInstance.propTypes = {
    set: PropTypes.object,
    decrementReps: PropTypes.func
};

const ExerciseInstanceCard = ({ exerciseInstance }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const decrementReps = index =>
        dispatch(
            decrementSetInstanceReps({ exercise: exerciseInstance, index })
        );

    return (
        <Card className={classes.card}>
            <CardContent>
                <div className={classes.header}>
                    <Typography>{exerciseInstance.exerciseName}</Typography>
                    <Typography>
                        {exerciseInstance.sets.length}x
                        {exerciseInstance.maxReps}
                        {' \u2014 '}
                        {exerciseInstance.weight}lbs
                    </Typography>
                </div>
                <div className={classes.sets}>
                    <div
                        style={{
                            width: 'fit-content',
                            display: 'flex',
                            flexDirection: 'row'
                        }}
                    >
                        {exerciseInstance.sets.map((set, i) => (
                            <SetInstance
                                key={i}
                                set={set}
                                decrementReps={() => decrementReps(i)}
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

ExerciseInstanceCard.propTypes = {
    exerciseInstance: PropTypes.object
};

export default ExerciseInstanceCard;
