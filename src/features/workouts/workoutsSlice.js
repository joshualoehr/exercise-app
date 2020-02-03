import { createSlice } from '@reduxjs/toolkit';
import dao from '../../config/dao';
import { addOrReplace } from '../../config/utils';

const workoutsSlice = createSlice({
    name: 'workouts',
    initialState: {
        workouts: null,
        selectedWorkout: null,
        editedWorkout: null,
        editedExercise: null,
        workoutHistory: null,
        showDeleteDialog: false
    },
    reducers: {
        setWorkouts(state, action) {
            state.workouts = action.payload;
        },
        setSelectedWorkout(state, action) {
            state.selectedWorkout = action.payload;
        },
        setEditedWorkout(state, action) {
            state.editedWorkout = action.payload;
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
                e => e.id === exercise.id
            );

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
            if (!savedExercise.id) {
                savedExercise.id = Math.floor(Math.random() * 10000);
                state.editedWorkout.workoutExercises.push(savedExercise);
            } else {
                state.editedWorkout.workoutExercises = state.editedWorkout.workoutExercises.reduce(
                    (acc, exercise) => {
                        if (exercise.id === savedExercise.id) {
                            return [...acc, savedExercise];
                        } else {
                            return [...acc, exercise];
                        }
                    },
                    []
                );
            }
        },
        saveWorkoutInstance(state, action) {
            const savedWorkoutInstance = action.payload;
            state.workoutHistory = addOrReplace(
                state.workoutHistory,
                savedWorkoutInstance
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
        settings: { user },
        workouts: { editedWorkout }
    } = getState();

    const {
        workoutExercises: exerciseRecords,
        ...workoutRecord
    } = editedWorkout;

    const workoutOperation = workoutRecord.id
        ? dao.workouts.put
        : dao.workouts.add;
    const exerciseOperation = ex =>
        ex.id ? dao.exercises.put(user, ex) : dao.exercises.add(user, ex);

    // Create or update the workout record
    workoutOperation(user, workoutRecord)
        // Add workoutId to each exercise record
        .then(savedWorkout => [
            exerciseRecords.map(ex => ({ ...ex, workoutId: savedWorkout.id })),
            savedWorkout
        ])
        // Create or update each exercise record
        .then(([exerciseRecords, savedWorkout]) =>
            Promise.all(exerciseRecords.map(exerciseOperation)).then(
                () => savedWorkout
            )
        )
        // Update the state with the combined object
        .then(savedWorkout =>
            dispatch(
                saveEditedWorkout({ ...editedWorkout, id: savedWorkout.id })
            )
        )
        .catch(console.error);
};

export const fetchWorkouts = () => (dispatch, getState) => {
    const {
        settings: { user }
    } = getState();

    dispatch(setWorkouts(null));
    dao.workouts
        .getAll(user)
        .then(workouts => dispatch(setWorkouts(workouts)))
        .catch(console.error);
};

export const deleteWorkoutAsync = () => (dispatch, getState) => {
    const {
        settings: { user },
        workouts: { editedWorkout }
    } = getState();

    dao.workouts
        .delete(user, editedWorkout.id)
        .then(() => dispatch(deleteWorkout(editedWorkout)));
};

const sortWorkoutInstances = workoutInstances => [
    ...Array.from(workoutInstances).sort((a, b) => b.date - a.date)
];
export const fetchWorkoutHistory = workout => (dispatch, getState) => {
    const {
        settings: { user }
    } = getState();

    dao.workoutInstances
        .getAllWhere(user, { workoutId: workout.id })
        .then(sortWorkoutInstances)
        .then(workoutInstances => {
            console.log(workoutInstances);
            return workoutInstances;
        })
        .then(workoutInstances =>
            dispatch(setWorkoutHistory(workoutInstances))
        );
};

export default workoutsSlice.reducer;
