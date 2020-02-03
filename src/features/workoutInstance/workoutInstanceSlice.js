import { createSlice } from '@reduxjs/toolkit';
import { saveWorkoutInstance } from '../workouts/workoutsSlice';
import dao from '../../config/dao';

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
            let hideTimer = false;
            state.workoutInstance.exercises = state.workoutInstance.exercises.reduce(
                (acc, ex) => {
                    if (ex.id === exercise.id) {
                        let completedReps = ex.sets[index].completedReps;
                        switch (completedReps) {
                            case null:
                                completedReps = ex.maxReps;
                                break;
                            case 0:
                                hideTimer = true;
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

            if (hideTimer) {
                state.showTimer = false;
                if (state.intervalID !== null) {
                    clearInterval(state.intervalID);
                    state.intervalID = null;
                }
            }
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
        setIntervalID(state, action) {
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
    setShowTimer,
    decrementTimeRemaining,
    resetTimer,
    setIntervalID
} = workoutInstanceSlice.actions;

export const restartTimer = timeRemaining => dispatch => {
    dispatch(resetTimer(timeRemaining));

    const intervalID = setInterval(() => {
        dispatch(workoutInstanceSlice.actions.decrementTimeRemaining());
    }, 1000);

    dispatch(setIntervalID(intervalID));
};

export const saveWorkoutInstanceAsync = () => (dispatch, getState) => {
    const {
        workoutInstance: { workoutInstance },
        settings: { user }
    } = getState();

    const {
        exercises: exerciseInstanceRecords,
        ...workoutInstanceRecord
    } = workoutInstance;

    const workoutInstanceOperation = workoutInstanceRecord.id
        ? dao.workoutInstances.put
        : dao.workoutInstances.add;
    const exerciseInstanceOperation = ex =>
        ex.id
            ? dao.exerciseInstances.put(user, ex)
            : dao.exerciseInstances.add(user, ex);

    // Create or update the workoutInstance record
    workoutInstanceOperation(user, workoutInstanceRecord)
        // Add workoutInstanceId to each exerciseInstance record
        .then(savedWorkoutInstance => [
            exerciseInstanceRecords.map(ex => ({
                ...ex,
                workoutInstanceId: savedWorkoutInstance.id
            })),
            savedWorkoutInstance
        ])
        // Create or update each exerciseInstance record
        .then(([exerciseInstanceRecords, savedWorkoutInstance]) =>
            Promise.all(
                exerciseInstanceRecords.map(exerciseInstanceOperation)
            ).then(() => savedWorkoutInstance)
        )
        // Update the state with the combined object
        .then(savedWorkoutInstance =>
            dispatch(
                saveWorkoutInstance({
                    ...workoutInstance,
                    id: savedWorkoutInstance.id
                })
            )
        )
        .catch(console.error);
};

export default workoutInstanceSlice.reducer;
