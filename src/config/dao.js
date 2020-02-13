import db from './db';
import web from './web';

if (!localStorage.getItem('lastUpdated')) {
    localStorage.setItem('lastUpdated', 0);
}
if (!localStorage.getItem('lastSync')) {
    localStorage.setItem('lastSync', 0);
}

const synchronized = async dbOperation => {
    if (!web.online()) {
        return [null, await dbOperation()];
    }

    const lastSync = localStorage.getItem('lastSync');
    const lastRemoteUpdate = await web.getLastUpdated();

    if (lastRemoteUpdate === null) {
        return [null, await dbOperation()];
    }

    if (lastSync !== lastRemoteUpdate) {
        // TODO: do the sync
        return [
            {
                keepLocal: dbOperation,
                keepRemote: dbOperation,
                cancel: dbOperation
            },
            null
        ];
    }

    return [null, await dbOperation()];
};

export default {
    exercises: {
        getAll: workoutId => synchronized(() => db.exercises.getAll(workoutId)),
        get: (workoutId, id) =>
            synchronized(() => db.exercises.get(workoutId, id)),
        add: exercise => synchronized(() => db.exercises.add(exercise)),
        put: exercise => synchronized(() => db.exercises.put(exercise)),
        delete: exercise => synchronized(() => db.exercises.delete(exercise))
    },
    exerciseInstances: {
        getAll: workoutInstanceId =>
            synchronized(() => db.exerciseInstances.getAll(workoutInstanceId)),
        get: (workoutInstanceId, id) =>
            synchronized(() => db.exerciseInstances.get(workoutInstanceId, id)),
        add: exerciseInstance =>
            synchronized(() => db.exerciseInstances.add(exerciseInstance)),
        put: exerciseInstance =>
            synchronized(() => db.exerciseInstances.put(exerciseInstance)),
        delete: exerciseInstance =>
            synchronized(() => db.exerciseInstances.delete(exerciseInstance))
    },
    workouts: {
        getAllDeep: () => synchronized(() => db.workouts.getAllDeep()),
        getAll: () => synchronized(() => db.workouts.getAll()),
        get: id => synchronized(() => db.workouts.get(id)),
        add: workout => synchronized(() => db.workouts.add(workout)),
        put: workout => synchronized(() => db.workouts.put(workout)),
        delete: workout => synchronized(() => db.workouts.delete(workout))
    },
    workoutInstances: {
        getAllDeep: workoutId =>
            synchronized(() => db.workoutInstances.getAllDeep(workoutId)),
        getAll: workoutId =>
            synchronized(() => db.workoutInstances.getAll(workoutId)),
        get: (workoutId, id) =>
            synchronized(() => db.workoutInstances.get(workoutId, id)),
        add: workoutInstance =>
            synchronized(() => db.workoutInstances.add(workoutInstance)),
        put: workoutInstance =>
            synchronized(() => db.workoutInstances.put(workoutInstance)),
        delete: workoutInstance =>
            synchronized(() => db.workoutInstances.delete(workoutInstance))
    }
};
