import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);

export const datetime = (date = new Date()) =>
    Math.floor(date.getTime() / 1000);

export const newWorkoutInstance = (workout, userWeight) => ({
    workoutId: workout.id,
    date: datetime(),
    exercises: workout.workoutExercises.map(exercise => ({
        exerciseName: exercise.exerciseName,
        weight: exercise.weight,
        maxReps: exercise.numReps,
        recordedWeight: exercise.recordedWeight,
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

export const addOrReplace = (list, obj, key = 'id') => {
    let replaced = false;

    list = list.reduce((acc, el) => {
        if (el[key] === obj[key]) {
            el = obj;
            replaced = true;
        }
        return [...acc, el];
    }, []);

    if (!replaced) {
        list.push(obj);
    }

    return list;
};
