import { createSlice } from '@reduxjs/toolkit';
import dao from '../../config/dao';
import { addOrReplace } from '../../config/utils';

const sortWorkoutInstances = workoutInstances => [
    ...Array.from(workoutInstances).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    )
];

const workoutsSlice = createSlice({
    name: 'workouts',
    initialState: {
        workouts: null,
        selectedWorkout: null,
        editedWorkout: null,
        editedExercise: null,
        workoutHistory: null,
        showDeleteDialog: false,
        nextTemporaryId: 1
    },
    reducers: {
        setWorkouts(state, action) {
            state.workouts = action.payload;
        },
        setSelectedWorkout(state, action) {
            state.selectedWorkout = action.payload;
        },
        setEditedWorkout(state, action) {
            const editedWorkout = action.payload;
            if (editedWorkout === null) {
                state.editedWorkout = null;
            } else {
                state.nextTemporaryId = 1;
                state.editedWorkout = {
                    ...editedWorkout,
                    workoutExercises: editedWorkout.workoutExercises.map(
                        ex => ({
                            ...ex,
                            temporaryId: state.nextTemporaryId++
                        })
                    ),
                    deletedExercises: []
                };
            }
        },
        setEditedExercise(state, action) {
            state.editedExercise = action.payload;
        },
        editWorkoutName(state, action) {
            state.editedWorkout.workoutName = action.payload;
        },
        reorderWorkoutExercises(state, action) {
            const { exercise, newIndex } = action.payload;
            let { workoutExercises } = state.editedWorkout;

            const currentIndex = workoutExercises.findIndex(
                e => e.temporaryId === exercise.temporaryId
            );

            if (newIndex === -1 && exercise.id) {
                state.editedWorkout.deletedExercises.push(exercise);
            }

            if (currentIndex !== newIndex) {
                workoutExercises = workoutExercises.reduce((acc, ex, i) => {
                    if (i === currentIndex) {
                        return acc;
                    } else if (i === newIndex) {
                        return [...acc, exercise, ex];
                    } else {
                        return [...acc, ex];
                    }
                }, []);
                if (newIndex === workoutExercises.length + 1) {
                    workoutExercises.push(exercise);
                }
                state.editedWorkout.workoutExercises = workoutExercises;
            }
        },
        setWorkoutHistory(state, action) {
            state.workoutHistory = action.payload;
        },
        setShowDeleteDialog(state, action) {
            state.showDeleteDialog = action.payload;
        },
        deleteWorkout(state, action) {
            const deletedWorkout = action.payload;
            state.workouts = state.workouts.reduce((acc, workout) => {
                if (workout.id === deletedWorkout.id) {
                    return acc;
                } else {
                    return [...acc, workout];
                }
            }, []);
        },
        saveEditedWorkout(state, action) {
            const savedWorkout = action.payload;
            state.workouts = addOrReplace(state.workouts, savedWorkout);

            if (
                state.selectedWorkout &&
                state.selectedWorkout.id === savedWorkout.id
            ) {
                state.selectedWorkout = savedWorkout;
            }
        },
        saveEditedExercise(state) {
            const savedExercise = state.editedExercise;

            if (!savedExercise.temporaryId) {
                savedExercise.temporaryId = state.nextTemporaryId++;
            }

            state.editedWorkout.workoutExercises = addOrReplace(
                state.editedWorkout.workoutExercises,
                savedExercise,
                'temporaryId'
            );
        },
        saveWorkoutInstance(state, action) {
            const savedWorkoutInstance = action.payload;
            state.workoutHistory = sortWorkoutInstances(
                addOrReplace(state.workoutHistory, savedWorkoutInstance)
            );
        }
    }
});

export const {
    setWorkouts,
    setSelectedWorkout,
    setEditedWorkout,
    setEditedExercise,
    editWorkoutName,
    reorderWorkoutExercises,
    setWorkoutHistory,
    setShowDeleteDialog,
    deleteWorkout,
    saveEditedWorkout,
    saveEditedExercise,
    saveWorkoutInstance
} = workoutsSlice.actions;

export const saveEditedWorkoutAsync = () => (dispatch, getState) => {
    const {
        workouts: { editedWorkout }
    } = getState();

    const {
        workoutExercises: exerciseRecords,
        deletedExercises,
        ...workoutRecord
    } = editedWorkout;

    const workoutOperation = workoutRecord.id
        ? dao.workouts.put
        : dao.workouts.add;

    const exerciseOperation = ex =>
        ex.id ? dao.exercises.put(ex) : dao.exercises.add(ex);

    const exerciseOperations = savedWorkout =>
        deletedExercises
            .map(ex => dao.exercises.delete(ex.id))
            .concat(
                exerciseRecords.map(ex => {
                    const copy = { ...ex };
                    delete copy.temporaryId;
                    copy.workoutId = savedWorkout.id;
                    return exerciseOperation(copy);
                })
            );

    // Create or update the workout record
    workoutOperation(workoutRecord)
        // Create/update/delete each exercise record
        .then(savedWorkout =>
            Promise.all(
                exerciseOperations(savedWorkout)
            ).then(workoutExercises => ({ workoutExercises, ...savedWorkout }))
        )
        // Update the state with the combined object
        .then(savedWorkout => dispatch(saveEditedWorkout(savedWorkout)))
        .catch(console.error);
};

export const fetchWorkouts = () => dispatch => {
    dispatch(setWorkouts(null));
    dao.workouts
        .getAllDeep()
        .then(workouts => dispatch(setWorkouts(workouts)))
        .catch(console.error);
};

export const deleteWorkoutAsync = () => (dispatch, getState) => {
    const {
        workouts: { editedWorkout }
    } = getState();

    const deleteExercises = workoutExercises =>
        workoutExercises.filter(ex => !!ex.id).map(dao.exercises.delete);

    Promise.all(deleteExercises(editedWorkout.workoutExercises)).then(() =>
        dao.workouts
            .delete(editedWorkout)
            .then(() => dispatch(deleteWorkout(editedWorkout)))
    );
};

export const fetchWorkoutHistory = workout => dispatch => {
    dao.workoutInstances
        .getAllDeep(workout.id)
        .then(sortWorkoutInstances)
        .then(workoutInstances =>
            dispatch(setWorkoutHistory(workoutInstances))
        );
};

export default workoutsSlice.reducer;
