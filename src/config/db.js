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
        obj.lastUpdated = Date.now();
    });
    db[tableName].hook('updating', function(mods) {
        return { ...mods, lastUpdated: Date.now() };
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

export default db;
