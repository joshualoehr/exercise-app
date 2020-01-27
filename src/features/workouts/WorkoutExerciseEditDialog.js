import React from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';

import { setEditedExercise, saveEditedExercise } from './workoutsSlice';

const useStyles = makeStyles(theme => ({
    dialog: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2)
    },
    dialogContent: {
        paddingBottom: theme.spacing(2)
    },
    dialogActions: {
        justifyContent: 'space-between',
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    nameInput: {
        marginBottom: theme.spacing(1)
    },
    numberInput: {
        width: '74px'
    }
}));

const WorkoutExerciseEditDialogContent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    let editedExercise = useSelector(
        state => state.workouts.editedExercise,
        shallowEqual
    );
    if (editedExercise === null) editedExercise = {};
    const { exerciseName, numReps, numSets, weight } = editedExercise;

    const updateEditedExercise = (key, changeEvent, convert = i => i) =>
        dispatch(
            setEditedExercise({
                ...editedExercise,
                [key]: convert(changeEvent.target.value)
            })
        );
    const updateName = e => updateEditedExercise('exerciseName', e);
    const updateSets = e => updateEditedExercise('numSets', e, parseInt);
    const updateReps = e => updateEditedExercise('numReps', e, parseInt);
    const updateWeight = e => updateEditedExercise('weight', e, parseInt);

    return (
        <>
            <DialogContent className={classes.dialogContent}>
                <TextField
                    autoFocus
                    fullWidth
                    defaultValue={exerciseName || ''}
                    placeholder={exerciseName || 'New Exercise'}
                    className={classes.nameInput}
                    onChange={updateName}
                />
                <div className={classes.inputContainer}>
                    <Typography>Sets:</Typography>
                    <TextField
                        type="number"
                        defaultValue={numSets || null}
                        className={classes.numberInput}
                        inputProps={{
                            style: { textAlign: 'right' }
                        }}
                        onChange={updateSets}
                    />
                </div>
                <div className={classes.inputContainer}>
                    <Typography>Reps:</Typography>
                    <TextField
                        type="number"
                        defaultValue={numReps || null}
                        className={classes.numberInput}
                        inputProps={{
                            style: { textAlign: 'right' }
                        }}
                        onChange={updateReps}
                    />
                </div>
                <div className={classes.inputContainer}>
                    <Typography>Weight:</Typography>
                    <TextField
                        type="number"
                        defaultValue={weight || null}
                        className={classes.numberInput}
                        inputProps={{
                            style: { textAlign: 'right' }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    lbs
                                </InputAdornment>
                            )
                        }}
                        onChange={updateWeight}
                    />
                </div>
            </DialogContent>
            <Divider />
            <DialogActions className={classes.dialogActions}>
                <Button
                    color="primary"
                    onClick={() => dispatch(setEditedExercise(null))}
                >
                    Cancel
                </Button>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                        dispatch(saveEditedExercise());
                        dispatch(setEditedExercise(null));
                    }}
                    disabled={!(exerciseName && numSets && numReps && weight)}
                >
                    Save
                </Button>
            </DialogActions>
        </>
    );
};

const WorkoutExerciseEditDialog = () => {
    const classes = useStyles();
    const editedExercise = useSelector(state => state.workouts.editedExercise);
    return (
        <Dialog
            open={!!editedExercise}
            aria-labelledby="add or edit exercise"
            className={classes.dialog}
        >
            <WorkoutExerciseEditDialogContent />
        </Dialog>
    );
};

export default WorkoutExerciseEditDialog;
