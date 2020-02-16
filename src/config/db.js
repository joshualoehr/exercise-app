import Dexie from 'dexie';
import relationships from 'dexie-relationships';
import { datetime } from './utils';

const db = new Dexie('LiftJL', { addons: [relationships] });
db.version(1).stores({
    workouts: '++id',
    workoutInstances: '++id, workoutId -> workout.id',
    exercises: '++id, workoutId -> workouts.id',
    exerciseInstances: '++id, workoutInstanceId -> workoutInstances.id',
    users: '++id'
});

[
    'exerciseInstances',
    'exercises',
    'workoutInstances',
    'workouts',
    'users'
].forEach(tableName => {
    db[tableName].hook('creating', function(primaryKey, obj) {
        const now = datetime();
        obj.lastUpdated = now;
        localStorage.setItem('lastUpdated', now);
    });
    db[tableName].hook('updating', function(mods) {
        const now = datetime();
        localStorage.setItem('lastUpdated', now);
        return { ...mods, lastUpdated: now };
    });
});

/** Define Schema */

export const Exercise = db.exercises.defineClass({
    id: Number,
    workoutId: Number,
    exerciseName: String,
    numSets: Number,
    numReps: Number,
    weight: Number,
    lastUpdated: Number
});
Exercise.prototype.serialize = function() {
    return JSON.parse(JSON.stringify(this));
};

export const Workout = db.workouts.defineClass({
    id: Number,
    workoutName: String,
    lastUpdated: Number
});
Workout.prototype.serialize = function() {
    return JSON.parse(JSON.stringify(this));
};

export const ExerciseInstance = db.exerciseInstances.defineClass({
    id: Number,
    workoutInstanceId: Number,
    exerciseName: String,
    maxReps: Number,
    weight: Number,
    sets: [
        {
            completedReps: Number
        }
    ],
    lastUpdated: Number
});
ExerciseInstance.prototype.serialize = function() {
    return JSON.parse(JSON.stringify(this));
};

export const WorkoutInstance = db.workoutInstances.defineClass({
    id: Number,
    workoutId: Number,
    date: String,
    recordedWeight: Number,
    lastUpdated: Number
});
WorkoutInstance.prototype.serialize = function() {
    return JSON.parse(JSON.stringify(this));
};

export const User = db.users.defineClass({
    id: Number,
    displayName: String,
    lastUpdated: Number
});
User.prototype.serialize = function() {
    return JSON.parse(JSON.stringify(this));
};

const serialize = resources => {
    if (resources.length) {
        return resources.map(resource => resource.serialize());
    } else {
        return resource.serialize();
    }
};

export default {
    exercises: {
        getAll: function(workoutId) {
            return db.exercises
                .where({ workoutId })
                .toArray()
                .then(serialize);
        },
        get: function(workoutId, id) {
            return db.exercises
                .where({ id, workoutId })
                .first()
                .then(serialize);
        },
        add: function(exercise) {
            return db.exercises.add(exercise).then(id => ({ id, ...exercise }));
        },
        put: function(exercise) {
            return db.exercises.put(exercise).then(id => ({ id, ...exercise }));
        },
        delete: function(exercise) {
            return db.exercises.delete(exercise.id);
        }
    },
    exerciseInstances: {
        getAll: function(workoutInstanceId) {
            return db.exerciseInstances
                .where({ workoutInstanceId })
                .toArray()
                .then(serialize);
        },
        get: function(workoutInstanceId, id) {
            return db.exerciseInstances
                .where({ id, workoutInstanceId })
                .first()
                .then(serialize);
        },
        add: function(exerciseInstance) {
            return db.exerciseInstances
                .add(exerciseInstance)
                .then(id => ({ id, ...exerciseInstance }));
        },
        put: function(exerciseInstance) {
            return db.exerciseInstances
                .put(exerciseInstance)
                .then(id => ({ id, ...exerciseInstance }));
        },
        delete: function(exerciseInstance) {
            return db.exerciseInstances.delete(exerciseInstance.id);
        }
    },
    workouts: {
        getAllDeep: function() {
            return db.workouts.with({ exercises: 'exercises' }).then(results =>
                results.map(result => ({
                    ...result.serialize(),
                    workoutExercises: result.exercises.map(ex => ex.serialize())
                }))
            );
        },
        getAll: function() {
            return db.workouts.toArray().then(serialize);
        },
        get: function(id) {
            return db.workouts.get(id);
        },
        add: function(workout) {
            return db.workouts.add(workout).then(id => ({ id, ...workout }));
        },
        put: function(workout) {
            return db.workouts.put(workout).then(id => ({ id, ...workout }));
        },
        delete: function(workout) {
            return db.workouts.delete(workout.id);
        }
    },
    workoutInstances: {
        getAllDeep: function(workoutId) {
            return db.workoutInstances
                .where({ workoutId })
                .with({ exerciseInstances: 'exerciseInstances' })
                .then(results =>
                    results.map(result => ({
                        ...result.serialize(),
                        exercises: result.exerciseInstances.map(ex =>
                            ex.serialize()
                        )
                    }))
                );
        },
        getAll: function(workoutId) {
            return db.workoutInstances
                .where({ workoutId })
                .toArray()
                .then(serialize);
        },
        get: function(workoutId, id) {
            return db.workoutInstances
                .where({ id, workoutId })
                .first()
                .then(serialize);
        },
        add: function(workoutInstance) {
            return db.workoutInstances
                .add(workoutInstance)
                .then(id => ({ id, ...workoutInstance }));
        },
        put: function(workoutInstance) {
            return db.workoutInstances
                .put(workoutInstance)
                .then(id => ({ id, ...workoutInstance }));
        },
        delete: function(workoutInstance) {
            return db.workoutInstances.delete(workoutInstance.id);
        }
    },
    sync: {
        getAll: function() {
            const lastUpdated = localStorage.getItem('lastUpdated');
            return Promise.all([
                db.exercises.toArray(),
                db.exerciseInstances.toArray(),
                db.workouts.toArray(),
                db.workoutInstances.toArray()
            ]).then(
                ([
                    exercises,
                    exerciseInstances,
                    workouts,
                    workoutInstances
                ]) => ({
                    lastUpdated,
                    exercises,
                    exerciseInstances,
                    workouts,
                    workoutInstances
                })
            );
        },
        updateAll: function({
            lastUpdated,
            exercises,
            exerciseInstances,
            workouts,
            workoutInstances
        }) {
            const exerciseIds = exercises.map(exercise => exercise.id);
            const exerciseInstanceIds = exerciseInstances.map(
                exerciseInstance => exerciseInstance.id
            );
            const workoutIds = workouts.map(workout => workout.id);
            const workoutInstanceIds = workoutInstances.map(
                workoutInstance => workoutInstance.id
            );

            return Promise.all([
                db.exercises.bulkDelete(exerciseIds),
                db.exerciseInstances.bulkDelete(exerciseInstanceIds),
                db.workouts.bulkDelete(workoutIds),
                db.workoutInstances.bulkDelete(workoutInstanceIds)
            ])
                .then(() =>
                    Promise.all([
                        db.exercises.bulkAdd(exercises),
                        db.exerciseInstances.bulkAdd(exerciseInstances),
                        db.workouts.bulkAdd(workouts),
                        db.workoutInstances.bulkAdd(workoutInstances)
                    ])
                )
                .then(() => {
                    localStorage.setItem('lastUpdated', lastUpdated);
                    localStorage.setItem('lastSync', lastUpdated);
                    return {
                        lastUpdated,
                        exercises,
                        exerciseInstances,
                        workouts,
                        workoutInstances
                    };
                });
        }
    }
};
