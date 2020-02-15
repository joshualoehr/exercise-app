import db from './db';
import web from './web';

if (!localStorage.getItem('lastUpdated')) {
    localStorage.setItem('lastUpdated', 0);
}
if (!localStorage.getItem('lastSync')) {
    localStorage.setItem('lastSync', 0);
}

export default {
    exercises: {
        getAll: workoutId => db.exercises.getAll(workoutId),
        get: (workoutId, id) => db.exercises.get(workoutId, id),
        add: exercise =>
            db.exercises.add(exercise).then(id => ({ id, ...exercise })),
        put: exercise =>
            db.exercises.put(exercise).then(id => ({ id, ...exercise })),
        delete: exercise => db.exercises.delete(exercise)
    },
    exerciseInstances: {
        getAll: workoutInstanceId =>
            db.exerciseInstances.getAll(workoutInstanceId),
        get: (workoutInstanceId, id) =>
            db.exerciseInstances.get(workoutInstanceId, id),
        add: exerciseInstance =>
            db.exerciseInstances
                .add(exerciseInstance)
                .then(id => ({ id, ...exerciseInstance })),
        put: exerciseInstance =>
            db.exerciseInstances
                .put(exerciseInstance)
                .then(id => ({ id, ...exerciseInstance })),
        delete: exerciseInstance =>
            db.exerciseInstances.delete(exerciseInstance)
    },
    workouts: {
        getAllDeep: () => db.workouts.getAllDeep(),
        getAll: () => db.workouts.getAll(),
        get: id => db.workouts.get(id),
        add: workout =>
            db.workouts.add(workout).then(id => ({ id, ...workout })),
        put: workout =>
            db.workouts.put(workout).then(id => ({ id, ...workout })),
        delete: workout => db.workouts.delete(workout)
    },
    workoutInstances: {
        getAllDeep: workoutId => db.workoutInstances.getAllDeep(workoutId),
        getAll: workoutId => db.workoutInstances.getAll(workoutId),
        get: (workoutId, id) => db.workoutInstances.get(workoutId, id),
        add: workoutInstance =>
            db.workoutInstances
                .add(workoutInstance)
                .then(id => ({ id, ...workoutInstance })),
        put: workoutInstance =>
            db.workoutInstances
                .put(workoutInstance)
                .then(id => ({ id, ...workoutInstance })),
        delete: workoutInstance => db.workoutInstances.delete(workoutInstance)
    }
};
