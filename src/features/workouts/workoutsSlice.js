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
        setWorkoutInstance(state, action) {
            state.workoutInstance = action.payload;
        },
        setShowDeleteDialog(state, action) {
            state.showDeleteDialog = action.payload;
        },
        deleteWorkout(state) {
            const deletedWorkout = state.editedWorkout;
            state.workouts = state.workouts.reduce((acc, workout) => {
                if (workout.id === deletedWorkout.id) {
                    return acc;
                } else {
                    return [...acc, workout];
                }
            }, []);

            fetch(`http://localhost:3001/workouts/${deletedWorkout.id}`, {
                method: 'DELETE'
            });
        },
        saveEditedWorkout(state) {
            const savedWorkout = state.editedWorkout;
            if (!savedWorkout.id) {
                savedWorkout.id = Math.floor(Math.random() * 10000);
                state.workouts.push(savedWorkout);

                fetch(`http://localhost:3001/workouts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(savedWorkout)
                });
            } else {
                state.workouts = state.workouts.reduce((acc, workout) => {
                    if (workout.id === savedWorkout.id) {
                        return [...acc, savedWorkout];
                    } else {
                        return [...acc, workout];
                    }
                }, []);

                if (state.selectedWorkout.id === savedWorkout.id) {
                    state.selectedWorkout = savedWorkout;
                }

                fetch(`http://localhost:3001/workouts/${savedWorkout.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(savedWorkout)
                });
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
