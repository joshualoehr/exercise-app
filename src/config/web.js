import { toQueryParams } from './utils';

const fetchGet = (url, dbResult) =>
    fetch(url)
        .then(res => res.json())
        .then(result => {
            return result.lastUpdated > dbResult.lastUpdated
                ? result
                : dbResult;
        });

const fetchGetAll = url => fetch(url).then(res => res.json());

const fetchPost = (url, obj) =>
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    }).then(() => obj);

const fetchPut = (url, obj) =>
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    }).then(() => obj);

const fetchDelete = url =>
    fetch(url, {
        method: 'DELETE'
    }).then(() => {});

const createOperations = resourceName => ({
    get: id => resource =>
        fetchGet(`http://localhost:3001/${resourceName}/${id}`, resource),
    getAll: (criteria = {}) =>
        fetchGetAll(
            `http://localhost:3001/${resourceName}${toQueryParams(criteria)}`
        ),
    add: resource =>
        fetchPost(`http://localhost:3001/${resourceName}`, resource),
    put: resource =>
        fetchPut(
            `http://localhost:3001/${resourceName}/${resource.id}`,
            resource
        ),
    delete: id => fetchDelete(`http://localhost:3001/${resourceName}/${id}`)
});

export default {
    exercises: createOperations('exercises'),
    workouts: createOperations('workouts'),
    exerciseInstances: createOperations('exerciseInstances'),
    workoutInstances: createOperations('workoutInstances'),
    users: createOperations('users')
};
