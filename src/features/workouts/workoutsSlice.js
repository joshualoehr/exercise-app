import { createSlice } from '@reduxjs/toolkit';

const workoutsSlice = createSlice({
    name: 'workouts',
    initialState: {
        workouts: null,
        selectedWorkout: null,
        editedWorkout: null,
        editedExercise: null,
        workoutHistory: null,
        workoutInstance: null,
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
                e => e.exerciseId === exercise.exerciseId
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
        setWorkoutInstance(state, action) {
            state.workoutInstance = action.payload;
        },
        setShowDeleteDialog(state, action) {
            state.showDeleteDialog = action.payload;
        },
        deleteWorkout(state) {
            const deletedWorkout = state.editedWorkout;
            state.workouts = state.workouts.reduce((acc, workout) => {
                if (workout.workoutId === deletedWorkout.workoutId) {
                    return acc;
                } else {
                    return [...acc, workout];
                }
            }, []);
        },
        saveEditedWorkout(state) {
            const savedWorkout = state.editedWorkout;
            if (!savedWorkout.workoutId) {
                savedWorkout.workoutId = Math.floor(Math.random() * 10000);
                state.workouts.push(savedWorkout);
            } else {
                state.workouts = state.workouts.reduce((acc, workout) => {
                    if (workout.workoutId === savedWorkout.workoutId) {
                        return [...acc, savedWorkout];
                    } else {
                        return [...acc, workout];
                    }
                }, []);

                if (
                    state.selectedWorkout.workoutId === savedWorkout.workoutId
                ) {
                    state.selectedWorkout = savedWorkout;
                }
            }
        },
        saveEditedExercise(state) {
            const savedExercise = state.editedExercise;
            if (!savedExercise.exerciseId) {
                savedExercise.exerciseId = Math.floor(Math.random() * 10000);
                state.editedWorkout.workoutExercises.push(savedExercise);
            } else {
                state.editedWorkout.workoutExercises = state.editedWorkout.workoutExercises.reduce(
                    (acc, exercise) => {
                        if (exercise.exerciseId === savedExercise.exerciseId) {
                            return [...acc, savedExercise];
                        } else {
                            return [...acc, exercise];
                        }
                    },
                    []
                );
            }
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
    setWorkoutInstance,
    setShowDeleteDialog,
    deleteWorkout,
    saveEditedWorkout,
    saveEditedExercise
} = workoutsSlice.actions;

export const fetchWorkouts = user => dispatch =>
    fetch('http://localhost:3001/workouts')
        .then(res => res.json())
        .then(json =>
            json.map(({ workoutName, ...workout }) => ({
                workoutName:
                    workoutName.charAt(0).toUpperCase() +
                    workoutName.substring(1),
                ...workout
            }))
        )
        .then(workouts => dispatch(setWorkouts(workouts)));

export const fetchWorkoutHistory = workout => dispatch =>
    fetch('http://localhost:3001/workoutHistory')
        .then(res => res.json())
        .then(workoutHistory => dispatch(setWorkoutHistory(workoutHistory)));

export default workoutsSlice.reducer;
