import { createSlice } from '@reduxjs/toolkit';

const workoutInstanceSlice = createSlice({
    name: 'workoutInstance',
    initialState: {
        workoutInstance: null,
        editedExercise: null,
        showWeightOverrideDialog: false,
        showTimer: false,
        timeRemaining: 0,
        intervalID: null
    },
    reducers: {
        setWorkoutInstance(state, action) {
            state.workoutInstance = action.payload;
        },
        setEditedExercise(state, action) {
            state.editedExercise = action.payload;
        },
        setShowWeightOverrideDialog(state, action) {
            state.showWeightOverrideDialog = action.payload;
        },
        decrementSetInstanceReps(state, action) {
            const { exercise, index } = action.payload;
            state.workoutInstance.exercises = state.workoutInstance.exercises.reduce(
                (acc, ex) => {
                    if (ex.id === exercise.id) {
                        let completedReps = ex.sets[index].completedReps;
                        switch (completedReps) {
                            case null:
                                completedReps = ex.maxReps;
                                break;
                            case 0:
                                completedReps = null;
                                break;
                            default:
                                completedReps--;
                        }
                        ex.sets[index].completedReps = completedReps;
                    }
                    return [...acc, ex];
                },
                []
            );
        },
        saveEditedExercise(state) {
            state.workoutInstance.exercises = state.workoutInstance.exercises.reduce(
                (acc, ex) => [
                    ...acc,
                    ex.id === state.editedExercise.id
                        ? state.editedExercise
                        : ex
                ],
                []
            );
        },
        updateRecordedWeight(state, action) {
            state.workoutInstance.recordedWeight = action.payload;
        },
        saveWorkoutInstance() {
            console.log('TODO: save workoutInstance to backend');
        },
        setShowTimer(state, action) {
            state.showTimer = action.payload;
            if (state.showTimer === false && state.intervalID !== null) {
                clearInterval(state.intervalID);
                state.intervalID = null;
            }
        },
        decrementTimeRemaining(state) {
            state.timeRemaining--;
            if (state.timeRemaining <= -1 && state.intervalID !== null) {
                clearInterval(state.intervalID);
                state.intervalID = null;
            }
        },
        resetTimer(state, action) {
            state.timeRemaining = action.payload;
            if (state.intervalID !== null) {
                clearInterval(state.intervalID);
            }
        },
        setintervalID(state, action) {
            state.intervalID = action.payload;
        }
    }
});

export const {
    setWorkoutInstance,
    setEditedExercise,
    decrementSetInstanceReps,
    saveEditedExercise,
    updateRecordedWeight,
    saveWorkoutInstance,
    setShowTimer,
    decrementTimeRemaining,
    resetTimer,
    setintervalID
} = workoutInstanceSlice.actions;

export const restartTimer = timeRemaining => dispatch => {
    dispatch(resetTimer(timeRemaining));

    const intervalID = setInterval(() => {
        dispatch(workoutInstanceSlice.actions.decrementTimeRemaining());
    }, 1000);

    dispatch(setintervalID(intervalID));
};

export default workoutInstanceSlice.reducer;
