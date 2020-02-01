import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);

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

export const formatTimer = timeRemaining => {
    let timeRemainingDisplay = moment
        .duration(timeRemaining, 'seconds')
        .format('mm:ss');

    if (timeRemaining < 60) {
        if (timeRemaining < 0) {
            timeRemainingDisplay = '0:00';
        } else {
            timeRemainingDisplay = `0:${timeRemainingDisplay}`;
        }
    }

    return timeRemainingDisplay;
};
