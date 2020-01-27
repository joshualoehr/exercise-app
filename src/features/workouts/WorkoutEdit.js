import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
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

import { TOP_BAR_HEIGHT, DND_ITEM_TYPES } from '../../config/constants';
import ConfirmationDialog from '../common/ConfirmationDialog';
import SlidingPage from '../common/SlidingPage';
import WorkoutExerciseEditDialog from './WorkoutExerciseEditDialog';
import { setDraggedExercise } from '../common/dndSlice';
import {
    setSelectedWorkout,
    setEditedWorkout,
    setEditedExercise,
    editWorkoutName,
    reorderWorkoutExercises,
    setShowDeleteDialog,
    deleteWorkout,
    saveEditedWorkout
} from './workoutsSlice';

const useStyles = makeStyles(theme => ({
    topSubcontainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
    },
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

const WorkoutExerciseCard = ({ exercise }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [{ isDragging }, drag] = useDrag({
        item: { type: DND_ITEM_TYPES.CARD },
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    });

    useEffect(() => {
        if (isDragging) {
            dispatch(setDraggedExercise(exercise));
        }
    }, [isDragging]);

    return (
        <Card
            ref={drag}
            className={classes.card}
            onClick={() => dispatch(setEditedExercise(exercise))}
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
    exercise: PropTypes.object
};

const WorkoutExerciseReorderDrop = ({ index }) => {
    const dispatch = useDispatch();
    const draggedExercise = useSelector(state => state.dnd.draggedExercise);

    const [{ isOver }, drop] = useDrop({
        accept: DND_ITEM_TYPES.CARD,
        drop: () => {
            dispatch(
                reorderWorkoutExercises({
                    exercise: draggedExercise,
                    newIndex: index
                })
            );
            dispatch(setDraggedExercise(null));
        },
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

WorkoutExerciseReorderDrop.propTypes = {
    index: PropTypes.number
};

const WorkoutExerciseDeleteDrop = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const draggedExercise = useSelector(state => state.dnd.draggedExercise);

    const [{ isOver }, drop] = useDrop({
        accept: DND_ITEM_TYPES.CARD,
        drop: () => {
            dispatch(
                reorderWorkoutExercises({
                    exercise: draggedExercise,
                    newIndex: -1
                })
            );
            dispatch(setDraggedExercise(null));
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    });

    return (
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
    );
};

const AddExerciseButton = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <Button
            className={classes.add}
            onClick={() => dispatch(setEditedExercise({}))}
        >
            <AddIcon fontSize="large" style={{ opacity: 0.5 }} />
        </Button>
    );
};

const DeleteWorkoutButton = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <Button
            color="secondary"
            variant="outlined"
            className={classes.delete}
            onClick={() => dispatch(setShowDeleteDialog(true))}
        >
            Delete
        </Button>
    );
};

const DeleteWorkoutDialog = () => {
    const dispatch = useDispatch();
    const editedWorkout = useSelector(state => state.workouts.editedWorkout);
    const showDeleteDialog = useSelector(
        state => state.workouts.showDeleteDialog
    );

    return (
        <ConfirmationDialog
            open={showDeleteDialog}
            onCancel={() => dispatch(setShowDeleteDialog(false))}
            onConfirm={() => {
                dispatch(deleteWorkout());
                dispatch(setShowDeleteDialog(false));
                dispatch(setEditedWorkout(null));
                dispatch(setSelectedWorkout(null));
            }}
            confirmColor="secondary"
            confirmText="Delete"
        >
            <Typography>
                Are you sure you want to delete {editedWorkout.workoutName}?
            </Typography>
        </ConfirmationDialog>
    );
};

const WorkoutEditContent = () => {
    const classes = useStyles();

    const draggedExercise = useSelector(state => state.dnd.draggedExercise);
    const editedWorkout = useSelector(
        state => state.workouts.editedWorkout,
        shallowEqual
    );

    const workoutExercises = editedWorkout
        ? editedWorkout.workoutExercises
        : [];

    return (
        <Container className={classes.container}>
            <div className={classes.topSubcontainer}>
                <Typography className={classes.helpText}>
                    Tap to edit, drag to reorder
                </Typography>
                <WorkoutExerciseReorderDrop index={0} />
                {workoutExercises.map((exercise, i) => (
                    <Fragment key={i}>
                        <WorkoutExerciseCard
                            key={exercise.exerciseId}
                            exercise={exercise}
                        />
                        <WorkoutExerciseReorderDrop key={i} index={i + 1} />
                    </Fragment>
                ))}
                {draggedExercise ? (
                    <WorkoutExerciseDeleteDrop />
                ) : (
                    <AddExerciseButton />
                )}
            </div>
            {editedWorkout.workoutId && <DeleteWorkoutButton />}
            <WorkoutExerciseEditDialog />
            <DeleteWorkoutDialog />
        </Container>
    );
};

const WorkoutEditTitle = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const editedWorkout = useSelector(state => state.workouts.editedWorkout);
    const workoutName = editedWorkout ? editedWorkout.workoutName : null;

    return (
        <TextField
            variant="filled"
            className={classes.editWorkoutNameRoot}
            placeholder={workoutName || 'New Workout'}
            value={workoutName || ''}
            inputProps={{
                className: classes.editWorkoutNameInput
            }}
            InputProps={{ disableUnderline: true }}
            onChange={e => dispatch(editWorkoutName(e.target.value))}
            autoFocus
        />
    );
};

const WorkoutEdit = () => {
    const dispatch = useDispatch();
    const editedWorkout = useSelector(state => state.workouts.editedWorkout);

    const saveDisabled = !(
        editedWorkout &&
        editedWorkout.workoutName &&
        editedWorkout.workoutExercises &&
        editedWorkout.workoutExercises.length > 0
    );

    return (
        <SlidingPage
            direction="up"
            show={!!editedWorkout}
            hide={() => dispatch(setEditedWorkout(null))}
            Title={() => <WorkoutEditTitle />}
            RightSide={() => (
                <IconButton
                    onClick={() => {
                        dispatch(saveEditedWorkout());
                        dispatch(setEditedWorkout(null));
                    }}
                    disabled={saveDisabled}
                >
                    <CheckIcon
                        style={saveDisabled ? null : { color: 'white' }}
                    />
                </IconButton>
            )}
            BackIcon={CloseIcon}
        >
            {editedWorkout && <WorkoutEditContent />}
        </SlidingPage>
    );
};

export default WorkoutEdit;
