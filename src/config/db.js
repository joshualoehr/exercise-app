import Dexie from 'dexie';
import relationships from 'dexie-relationships';

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
        obj.lastUpdated = Math.floor(Date.now() / 1000);
    });
    db[tableName].hook('updating', function(mods) {
        return { ...mods, lastUpdated: Math.floor(Date.now() / 1000) };
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
    archived: Boolean,
    lastUpdated: Number
});
Exercise.prototype.serialize = function() {
    return JSON.parse(JSON.stringify(this));
};

export const Workout = db.workouts.defineClass({
    id: Number,
    workoutName: String,
    archived: Boolean,
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
    archived: Boolean,
    lastUpdated: Number
});
ExerciseInstance.prototype.serialize = function() {
    return JSON.parse(JSON.stringify(this));
};

export const WorkoutInstance = db.workoutInstances.defineClass({
    id: Number,
    workoutId: Number,
    date: String,
    archived: Boolean,
    lastUpdated: Number
});
WorkoutInstance.prototype.serialize = function() {
    return JSON.parse(JSON.stringify(this));
};

export const User = db.users.defineClass({
    id: Number,
    displayName: String,
    archived: Boolean,
    lastUpdated: Number
});
User.prototype.serialize = function() {
    return JSON.parse(JSON.stringify(this));
};

export default {
    exercises: {
        getAll: function(workoutId) {
            return db.exercises.where({ workoutId });
        },
        get: function(workoutId, id) {
            return db.exercises.where({ id, workoutId });
        },
        add: function(exercise) {
            return db.exercises.add(exercise);
        },
        put: function(exercise) {
            return db.exercises.put(exercise);
        },
        delete: function(exercise) {
            return db.exercises.delete(exercise.id);
        }
    },
    exerciseInstances: {
        getAll: function(workoutInstanceId) {
            return db.exerciseInstances.where({ workoutInstanceId });
        },
        get: function(workoutInstanceId, id) {
            return db.exerciseInstances.where({ id, workoutInstanceId });
        },
        add: function(exerciseInstance) {
            return db.exerciseInstances.add(exerciseInstance);
        },
        put: function(exerciseInstance) {
            return db.exerciseInstances.put(exerciseInstance);
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
            return db.workouts.toArray();
        },
        get: function(id) {
            return db.workouts.get(id);
        },
        add: function(workout) {
            return db.workouts.add(workout);
        },
        put: function(workout) {
            return db.workouts.put(workout);
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
            return db.workoutInstances.where({ workoutId });
        },
        get: function(workoutId, id) {
            return db.workoutInstances.where({ id, workoutId });
        },
        add: function(workoutInstance) {
            return db.workoutInstances.add(workoutInstance);
        },
        put: function(workoutInstance) {
            return db.workoutInstances.put(workoutInstance);
        },
        delete: function(workoutInstance) {
            return db.workoutInstances.delete(workoutInstance.id);
        }
    }
};
