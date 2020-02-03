import db from './db';
import web from './web';

/* Compose async database and web transactions */
const composeWrite = (dbTran, webTran, user, obj, primaryKey = 'id') =>
    dbTran(obj)
        .then(id => ({ ...obj, [primaryKey]: id }))
        .then(savedObj => (user ? webTran(savedObj) : savedObj));

const composeRead = (dbTran, webTran, user, id) =>
    dbTran(id)
        .then(result => JSON.parse(JSON.stringify(result)))
        .then(result => (user ? webTran(id)(result) : result));

const composeDelete = (dbTran, webTran, user, id) =>
    dbTran(id).then(() => (user ? webTran(id) : void 0));

const createOperations = tableName => ({
    get: (user, id) =>
        composeRead(
            db[tableName].get.bind(db[tableName]),
            web[tableName].get,
            user,
            id
        ),
    getAll: user =>
        composeRead(
            db[tableName].toArray.bind(db[tableName]),
            web[tableName].getAll,
            user
        ),
    getAllWhere: (user, criteria) =>
        composeRead(
            criteria =>
                Promise.resolve(
                    db[tableName].where
                        .bind(db[tableName])(criteria)
                        .toArray()
                ),
            web[tableName].getAllWhere,
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
        )
});

export default {
    exercises: createOperations('exercises'),
    workouts: {
        ...createOperations('workouts'),
        getAll: user =>
            db.workouts
                .with({ exercises: 'exercises' })
                .then(results =>
                    results.map(result => ({
                        ...result.serialize(),
                        workoutExercises: result.exercises.map(ex =>
                            ex.serialize()
                        )
                    }))
                )
                .then(result => (user ? web.workouts.getAll()(result) : result))
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
    users: createOperations('users')
};
