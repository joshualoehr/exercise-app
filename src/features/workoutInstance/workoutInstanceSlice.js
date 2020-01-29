import { createSlice } from '@reduxjs/toolkit';

const workoutInstanceSlice = createSlice({
    name: 'workoutInstance',
    initialState: {
        workoutInstance: null,
        editedExercise: null,
        showWeightOverrideDialog: false
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
        }
    }
});

export const {
    setWorkoutInstance,
    setEditedExercise,
    decrementSetInstanceReps,
    saveEditedExercise,
    updateRecordedWeight
} = workoutInstanceSlice.actions;

export default workoutInstanceSlice.reducer;