import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import ExerciseEdit from './ExerciseEdit';
import SlidingPage from './SlidingPage';
import { TOP_BAR_HEIGHT } from '../config/constants';

const useStyles = makeStyles(theme => ({
    editWorkoutNameRoot: {
        padding: 0
    },
    editWorkoutNameInput: {
        textAlign: 'center',
        padding: '6px',
        color: 'white',
        fontSize: '20px'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
        height: `calc(100% - ${TOP_BAR_HEIGHT * 2}px)`,
        justifyContent: 'space-between'
    },
    divider: {
        margin: '24px 0',
        width: '100%'
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        cursor: 'pointer',
        marginTop: theme.spacing(2),
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.1)'
        },
        padding: '16px'
    },
    add: {
        width: '100%',
        marginTop: theme.spacing(3),
        backgroundColor: 'inherit',
        border: '2px dashed rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px'
    },
    dragIcon: {
        marginLeft: theme.spacing(2),
        opacity: 0.5
    },
    helpText: {
        textAlign: 'center',
        opacity: 0.7
    },
    delete: {
        width: '100%',
        marginTop: theme.spacing(3),
        height: '56px'
    }
}));

const WorkoutEditContent = ({ workout, setWorkout }) => {
    const classes = useStyles();

    const [workoutExercises, setWorkoutExercises] = useState(
        workout.workoutExercises
    );
    const [selectedExercise, setSelectedExercise] = useState();

    const saveExercise = savedExercise => {
        if (!savedExercise.exerciseId) {
            setWorkoutExercises([...workoutExercises, savedExercise]);
        } else {
            setWorkoutExercises(
                workoutExercises.reduce((acc, exercise) => {
                    return [
                        ...acc,
                        exercise.exerciseId === savedExercise.exerciseId
                            ? savedExercise
                            : exercise
                    ];
                }, [])
            );
        }
        setSelectedExercise(null);
        setWorkout({ ...workout, workoutExercises });
    };

    return (
        <Container className={classes.container}>
            <div style={{ width: '100%' }}>
                <Typography className={classes.helpText}>
                    Tap to edit, drag to reorder
                </Typography>
                {workoutExercises.map(exercise => (
                    <Card
                        key={exercise.exerciseId}
                        className={classes.card}
                        onClick={() => setSelectedExercise(exercise)}
                    >
                        <Typography>{exercise.exerciseName}</Typography>
                        <div style={{ display: 'flex' }}>
                            <Typography>
                                {exercise.numSets}x{exercise.numReps}{' '}
                                {exercise.weight}lbs
                            </Typography>
                            <DragIndicatorIcon className={classes.dragIcon} />
                        </div>
                    </Card>
                ))}
                <Button
                    className={classes.add}
                    onClick={() => setSelectedExercise({})}
                >
                    <AddIcon fontSize="large" style={{ opacity: 0.5 }} />
                </Button>
            </div>
            <Button
                color="secondary"
                variant="outlined"
                className={classes.delete}
            >
                Delete
            </Button>
            {selectedExercise && (
                <ExerciseEdit
                    exercise={selectedExercise}
                    onCancel={() => setSelectedExercise(null)}
                    onSave={saveExercise}
                />
            )}
        </Container>
    );
};

const WorkoutEdit = ({ show, hide, workout, onSave }) => {
    const classes = useStyles();
    const [editedWorkout, setEditedWorkout] = useState(workout);
    if (workout && !editedWorkout) {
        setEditedWorkout(workout);
    }
    const saveDisabled = !(
        !!editedWorkout &&
        !!editedWorkout.workoutName &&
        !!editedWorkout.workoutExercises &&
        editedWorkout.workoutExercises.length > 0
    );
    return (
        <SlidingPage
            direction="up"
            show={show}
            hide={hide}
            Title={() => (
                <TextField
                    className={classes.editWorkoutNameRoot}
                    placeholder={workout ? null : 'New Workout'}
                    inputProps={{
                        className: classes.editWorkoutNameInput
                    }}
                    InputProps={{ disableUnderline: true }}
                    variant="filled"
                    value={editedWorkout ? editedWorkout.workoutName : null}
                    onChange={e =>
                        setEditedWorkout({
                            ...editedWorkout,
                            workoutName: e.target.value
                        })
                    }
                    autoFocus
                />
            )}
            RightSide={() => (
                <IconButton
                    onClick={() => onSave(editedWorkout)}
                    disabled={saveDisabled}
                >
                    <CheckIcon
                        style={saveDisabled ? null : { color: 'white' }}
                    />
                </IconButton>
            )}
            BackIcon={CloseIcon}
        >
            {workout && (
                <WorkoutEditContent
                    workout={workout}
                    setWorkout={setEditedWorkout}
                />
            )}
        </SlidingPage>
    );
};

WorkoutEditContent.propTypes = {
    workout: PropTypes.object,
    setWorkout: PropTypes.func
};

WorkoutEdit.propTypes = {
    show: PropTypes.bool,
    hide: PropTypes.func,
    workout: PropTypes.object,
    onSave: PropTypes.func
};

export default WorkoutEdit;
