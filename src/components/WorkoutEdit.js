import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import ConfirmationDialog from './ConfirmationDialog';
import ExerciseEdit from './ExerciseEdit';
import SlidingPage from './SlidingPage';
import { TOP_BAR_HEIGHT, DND_ITEM_TYPES } from '../config/constants';

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
        justifyContent: 'space-between',
        overflow: 'auto'
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        cursor: 'pointer',
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
        padding: '10px',
        borderRadius: '3px'
    },
    deleteExercise: {
        marginTop: theme.spacing(3),
        backgroundColor: 'inherit',
        border: `2px dashed ${theme.palette.secondary.main}`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        borderRadius: '3px'
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
        minHeight: '56px'
    }
}));

const WorkoutExerciseCard = ({
    exercise,
    setDraggedExercise,
    setSelectedExercise
}) => {
    const classes = useStyles();
    const [{ isDragging }, drag] = useDrag({
        item: { type: DND_ITEM_TYPES.CARD },
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    });

    if (isDragging) {
        setDraggedExercise(exercise);
    }

    return (
        <Card
            ref={drag}
            className={classes.card}
            onClick={() => setSelectedExercise(exercise)}
            style={{
                opacity: isDragging ? 0.7 : 1.0,
                backgroundColor: isDragging ? '#E5EAFB' : null,
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
        >
            <Typography>{exercise.exerciseName}</Typography>
            <div style={{ display: 'flex' }}>
                <Typography>
                    {exercise.numSets}x{exercise.numReps} {exercise.weight}lbs
                </Typography>
                <DragIndicatorIcon className={classes.dragIcon} />
            </div>
        </Card>
    );
};

WorkoutExerciseCard.propTypes = {
    exercise: PropTypes.object,
    setDraggedExercise: PropTypes.func,
    setSelectedExercise: PropTypes.func
};

const WorkoutExerciseDivider = ({ index, reorderExercise }) => {
    const [{ isOver }, drop] = useDrop({
        accept: DND_ITEM_TYPES.CARD,
        drop: () => reorderExercise(index),
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    });

    return (
        <div
            ref={drop}
            style={{
                alignSelf: 'center',
                height: isOver ? '56px' : '24px',
                transition: 'height 0.2s ease-in-out',
                width: '100%',
                padding: isOver ? '12px 0' : 0
            }}
        >
            <div
                style={{
                    border: '2px dashed royalblue',
                    height: '90%',
                    borderRadius: '3px',
                    opacity: isOver ? 0.7 : 0,
                    transition: 'opacity 0.2s'
                }}
            ></div>
        </div>
    );
};

WorkoutExerciseDivider.propTypes = {
    index: PropTypes.number,
    reorderExercise: PropTypes.func
};

const WorkoutExerciseDeleteDrop = ({
    reorderExercise,
    setSelectedExercise
}) => {
    const classes = useStyles();
    const [{ isDragging, isOver }, drop] = useDrop({
        accept: DND_ITEM_TYPES.CARD,
        drop: () => reorderExercise(-1),
        collect: monitor => ({
            isDragging: !!monitor.getItem(),
            isOver: !!monitor.isOver()
        })
    });

    return isDragging ? (
        <div
            ref={drop}
            className={classes.deleteExercise}
            style={{ opacity: isOver ? 1.0 : 0.5 }}
        >
            <DeleteIcon
                fontSize="large"
                style={{ opacity: isOver ? 1.0 : 0.5 }}
                color="secondary"
            />
        </div>
    ) : (
        <Button className={classes.add} onClick={() => setSelectedExercise({})}>
            <AddIcon fontSize="large" style={{ opacity: 0.5 }} />
        </Button>
    );
};

WorkoutExerciseDeleteDrop.propTypes = {
    reorderExercise: PropTypes.func,
    setSelectedExercise: PropTypes.func
};

const WorkoutEditContent = ({ workout, setWorkout, deleteWorkout }) => {
    const classes = useStyles();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

    const [draggedExercise, setDraggedExercise] = useState();

    const reorderExercises = (exercise, newIndex) => {
        const currentIndex = workoutExercises.findIndex(
            e => e.exerciseId === exercise.exerciseId
        );

        if (currentIndex === newIndex) return;

        let reorderedExercises = workoutExercises.reduce((acc, ex, i) => {
            if (i === currentIndex) {
                return acc;
            } else if (i === newIndex) {
                return [...acc, exercise, ex];
            } else {
                return [...acc, ex];
            }
        }, []);
        if (newIndex === workoutExercises.length) {
            reorderedExercises.push(exercise);
        }
        setWorkoutExercises(reorderedExercises);
    };

    return (
        <Container className={classes.container}>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch'
                }}
            >
                <Typography className={classes.helpText}>
                    Tap to edit, drag to reorder
                </Typography>
                <WorkoutExerciseDivider
                    index={0}
                    reorderExercise={() => reorderExercises(draggedExercise, 0)}
                />
                {workoutExercises.map((exercise, i) => (
                    <Fragment key={i}>
                        <WorkoutExerciseCard
                            key={exercise.exerciseId}
                            exercise={exercise}
                            setDraggedExercise={setDraggedExercise}
                            setSelectedExercise={setSelectedExercise}
                        />
                        <WorkoutExerciseDivider
                            key={i}
                            index={i + 1}
                            reorderExercise={index =>
                                reorderExercises(draggedExercise, index)
                            }
                        />
                    </Fragment>
                ))}
                <WorkoutExerciseDeleteDrop
                    reorderExercise={index =>
                        reorderExercises(draggedExercise, index)
                    }
                    setSelectedExercise={setSelectedExercise}
                />
            </div>
            <Button
                color="secondary"
                variant="outlined"
                className={classes.delete}
                onClick={() => setShowDeleteDialog(true)}
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
            <ConfirmationDialog
                open={showDeleteDialog}
                onCancel={() => setShowDeleteDialog(false)}
                onConfirm={deleteWorkout}
                confirmColor="secondary"
                confirmText="Delete"
            >
                <Typography>
                    Are you sure you want to delete {workout.workoutName}?
                </Typography>
            </ConfirmationDialog>
        </Container>
    );
};

WorkoutEditContent.propTypes = {
    workout: PropTypes.object,
    setWorkout: PropTypes.func,
    deleteWorkout: PropTypes.func
};

const WorkoutEdit = ({ show, hide, workout, onSave, deleteWorkout }) => {
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
                    deleteWorkout={deleteWorkout}
                />
            )}
        </SlidingPage>
    );
};

WorkoutEdit.propTypes = {
    show: PropTypes.bool,
    hide: PropTypes.func,
    workout: PropTypes.object,
    onSave: PropTypes.func,
    deleteWorkout: PropTypes.func
};

export default WorkoutEdit;
