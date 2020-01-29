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

import { setEditedExercise, saveEditedExercise } from './workoutInstanceSlice';

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
    numberInput: {
        width: '74px'
    }
}));

const WeightOverrideDialogContent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    let editedExercise = useSelector(
        state => state.workoutInstance.editedExercise,
        shallowEqual
    );
    if (editedExercise === null) {
        editedExercise = {};
    }

    const updateWeight = e =>
        dispatch(
            setEditedExercise({
                ...editedExercise,
                weight: parseInt(e.target.value)
            })
        );

    return (
        <>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h6">Override Weight</Typography>
                <div className={classes.inputContainer}>
                    <Typography>Weight:</Typography>
                    <TextField
                        type="number"
                        defaultValue={editedExercise.weight || null}
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
                    disabled={
                        !editedExercise.weight || editedExercise.weight <= 0
                    }
                >
                    Save
                </Button>
            </DialogActions>
        </>
    );
};

const WeightOverrideDialog = () => {
    const classes = useStyles();
    const editedExercise = useSelector(
        state => state.workoutInstance.editedExercise
    );
    return (
        <Dialog
            open={!!editedExercise}
            aria-labelledby="override exercise weight"
            className={classes.dialog}
        >
            <WeightOverrideDialogContent />
        </Dialog>
    );
};

export default WeightOverrideDialog;
