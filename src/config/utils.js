export const newWorkoutInstance = (workout, userWeight) => ({
    date: new Date().toISOString(),
    exercises: workout.workoutExercises.map(exercise => ({
        id: exercise.id,
        exerciseName: exercise.exerciseName,
        weight: exercise.weight,
        maxReps: exercise.numReps,
        sets: new Array(exercise.numSets).fill({
            completedReps: null
        })
    })),
    recordedWeight: userWeight
});
