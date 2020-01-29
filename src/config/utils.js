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

export const truncateList = (list, max = 3) => {
    if (list.length <= max) return list;
    const extra = list.length - max;
    return [...list.slice(0, max), `...and ${extra} more`];
};
