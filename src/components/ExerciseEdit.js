import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';

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

const ExerciseEditContent = ({ exercise, onCancel, onSave }) => {
    const classes = useStyles();
    const [exerciseName, setExerciseName] = useState(exercise.exerciseName);
    const [numReps, setNumReps] = useState(exercise.numReps);
    const [numSets, setNumSets] = useState(exercise.numSets);
    const [weight, setWeight] = useState(exercise.weight);
    return (
        <>
            <DialogContent className={classes.dialogContent}>
                <TextField
                    autoFocus
                    fullWidth
                    defaultValue={exerciseName || ''}
                    placeholder={exerciseName || 'New Exercise'}
                    className={classes.nameInput}
                    onChange={e => setExerciseName(e.target.value)}
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
                        onChange={e => setNumSets(parseInt(e.target.value))}
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
                        onChange={e => setNumReps(parseInt(e.target.value))}
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
                        onChange={e => setWeight(parseInt(e.target.value))}
                    />
                </div>
            </DialogContent>
            <Divider />
            <DialogActions className={classes.dialogActions}>
                <Button color="primary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={() =>
                        onSave({
                            exerciseId: exercise.exerciseId,
                            exerciseName,
                            numSets,
                            numReps,
                            weight
                        })
                    }
                    disabled={
                        !(!!exerciseName && !!numSets && !!numReps && !!weight)
                    }
                >
                    Save
                </Button>
            </DialogActions>
        </>
    );
};

const ExerciseEdit = ({ exercise, onCancel, onSave }) => {
    const classes = useStyles();
    return (
        <Dialog
            open={!!exercise}
            aria-labelledby="add or edit exercise"
            className={classes.dialog}
        >
            {exercise && (
                <ExerciseEditContent
                    exercise={exercise}
                    onCancel={onCancel}
                    onSave={onSave}
                />
            )}
        </Dialog>
    );
};

ExerciseEditContent.propTypes = {
    exercise: PropTypes.object,
    onCancel: PropTypes.func,
    onSave: PropTypes.func
};

ExerciseEdit.propTypes = {
    exercise: PropTypes.object,
    onCancel: PropTypes.func,
    onSave: PropTypes.func
};

export default ExerciseEdit;
