import db from './db';
import web from './web';
import { mergeResources } from './utils';

/* Compose async database and web transactions */
const composeWrite = (dbTran, webTran, user, obj, primaryKey = 'id') =>
    dbTran(obj)
        .then(id => ({ ...obj, [primaryKey]: id }))
        .then(savedObj => (user ? webTran(savedObj) : savedObj));

const composeRead = (dbTran, webTran, user, id) =>
    dbTran
        .then(result => JSON.parse(JSON.stringify(result)))
        .then(result => (user ? webTran(id)(result) : result));

const composeDelete = (dbTran, webTran, user, id) =>
    dbTran(id).then(() => (user ? webTran(id) : void 0));

const createOperations = tableName => ({
    get: (user, id) =>
        composeRead(
            db[tableName].get.bind(db[tableName])(id),
            web[tableName].get,
            user,
            id
        ),
    // getAll: user =>
    //     composeRead(
    //         db[tableName].toArray.bind(db[tableName])(),
    //         web[tableName].getAll,
    //         user
    //     ),
    getAll: function(user) {
        const sync = () => Promise.resolve(user ? this.sync(user) : () => {});
        return sync().then(() =>
            db[tableName]
                .toArray()
                .then(result => JSON.parse(JSON.stringify(result)))
        );
    },
    getAllWhere: (user, criteria) =>
        composeRead(
            criteria
                ? Promise.resolve(
                      db[tableName].where
                          .bind(db[tableName])(criteria)
                          .toArray()
                  )
                : db[tableName].toArray.bind(db[tableName])(),
            web[tableName].getAll,
            user,
            criteria
        ),
    add: (user, workout) =>
        composeWrite(
            db[tableName].add.bind(db[tableName]),
            web[tableName].add,
            user,
            workout
        ),
    put: (user, workout) =>
        composeWrite(
            db[tableName].put.bind(db[tableName]),
            web[tableName].put,
            user,
            workout
        ),
    delete: (user, id) =>
        composeDelete(
            db[tableName].delete.bind(db[tableName]),
            web[tableName].delete,
            user,
            id
        ),
    sync: function(user) {
        return Promise.all([db[tableName].toArray(), web[tableName].getAll()])
            .then(mergeResources)
            .then(([fresh, stale]) => {
                fresh.forEach(({ _src, ...freshResource }) => {
                    if (_src === 'web') {
                        db[tableName].put(freshResource);
                    } else if (_src === 'db') {
                        web[tableName].put(freshResource);
                    }
                });
            });
    }
});

export default {
    exercises: createOperations('exercises'),
    workouts: {
        ...createOperations('workouts'),
        getAll: function(user) {
            const sync = () =>
                Promise.resolve(user ? this.sync(user) : () => {});

            return sync().then(() =>
                db.workouts.with({ exercises: 'exercises' }).then(results =>
                    results.map(result => ({
                        ...result.serialize(),
                        workoutExercises: result.exercises.map(ex =>
                            ex.serialize()
                        )
                    }))
                )
            );
        }
    },
    exerciseInstances: createOperations('exerciseInstances'),
    workoutInstances: {
        ...createOperations('workoutInstances'),
        getAllWhere: (user, criteria) =>
            db.workoutInstances
                .where(criteria)
                .with({ exerciseInstances: 'exerciseInstances' })
                .then(results =>
                    results.map(result => ({
                        ...result.serialize(),
                        exercises: result.exerciseInstances.map(ex =>
                            ex.serialize()
                        )
                    }))
                )
                .then(result =>
                    user
                        ? web.workoutInstances.getAll(criteria)(result)
                        : result
                )
    },
    users: createOperations('users'),
    syncAll: function(user) {
        return Promise.all([
            this.exercises.sync(user),
            this.workouts.sync(user),
            this.exerciseInstances.sync(user),
            this.workoutInstances.sync(user)
        ]);
    }
};
