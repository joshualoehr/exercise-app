import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);

export const newWorkoutInstance = (workout, userWeight) => ({
    workoutId: workout.id,
    date: new Date().toISOString(),
    exercises: workout.workoutExercises.map((exercise, idx) => ({
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

export const toQueryParams = criteria => {
    let queryParams = [];

    Object.entries(criteria).forEach(([key, value]) => {
        queryParams.push(`${key}=${value}`);
    });

    queryParams = queryParams.join('&');

    return queryParams !== '' ? `?${queryParams}` : queryParams;
};

export const mergeResources = ([dbResources, webResources]) => {
    dbResources.sort((a, b) => a.id - b.id);
    webResources.sort((a, b) => a.id - b.id);

    console.log(dbResources);
    console.log(webResources);

    let fresh = [],
        stale = [];

    let dbIdx = 0,
        webIdx = 0;
    while (dbIdx < dbResources.length || webIdx < webResources.length) {
        let dbResource = dbResources[dbIdx]
            ? { ...dbResources[dbIdx], _src: 'db' }
            : null;
        let webResource = webResources[webIdx]
            ? { ...webResources[webIdx], _src: 'web' }
            : null;

        if (!dbResource) {
            fresh.push(webResource);
            webIdx++;
        } else if (!webResource) {
            fresh.push(dbResource);
            dbIdx++;
        } else if (dbResource.id < webResource.id) {
            fresh.push(dbResource);
            dbIdx++;
        } else if (dbResource.id > webResource.id) {
            fresh.push(webResource);
            webIdx++;
        } else {
            if (dbResource.lastUpdated < webResource.lastUpdated) {
                fresh.push(webResource);
                stale.push({ freshResource: webResource, _src: 'db' });
            } else if (dbResource.lastUpdated > webResource.lastUpdated) {
                fresh.push(dbResource);
                stale.push({ freshResource: dbResource, _src: 'web' });
            } else {
                fresh.push(dbResource);
            }
            dbIdx++;
            webIdx++;
        }
    }

    console.log('fresh', fresh);
    console.log('stale', stale);

    return [fresh, stale];
};
