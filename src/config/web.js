import db from './db';
import { datetime } from './utils';

const baseUrl = 'http://localhost:5000';

const handleWebResponse = ({ success, message, debugMessage, ...resource }) => {
    if (!success) {
        if (message.startsWith('Invalid JWT')) {
            localStorage.setItem('access_token', '');
        }
        throw { message, debugMessage };
    }
    return resource;
};

const fetchGet = token => url => {
    return fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(handleWebResponse);
};

const fetchGetAll = token => url => {
    return fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(handleWebResponse);
};

const fetchPost = token => (url, obj = {}) => {
    const payload = {
        ...obj,
        lastSync: datetime()
    };
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(handleWebResponse);
};

const fetchPut = token => (url, obj = {}) => {
    const payload = {
        ...obj,
        lastSync: datetime()
    };
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(handleWebResponse);
};

const fetchDelete = token => url => {
    const payload = {
        lastSync: datetime()
    };
    return fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(handleWebResponse);
};

const sync = {
    getAll: function() {
        const token = localStorage.getItem('access_token');
        return fetchGet(token)(`${baseUrl}/sync`).then(({ sync }) => ({
            ...sync,
            lastUpdated: datetime(new Date(sync.lastUpdated))
        }));
    },
    updateAll: function(data) {
        const token = localStorage.getItem('access_token');
        const lastUpdated = localStorage.getItem('lastUpdated');
        return fetchPost(token)(`${baseUrl}/sync`, {
            sync: { lastUpdated, ...data }
        }).then(({ sync: { last_updated, ...sync } }) => ({
            ...sync,
            lastUpdated: last_updated
        }));
    }
};

export default {
    online: () => !!localStorage.getItem('access_token'),
    login: function(email, password) {
        return fetchPost()(`${baseUrl}/login`, {
            email,
            password
        }).then(({ auth_token }) => {
            localStorage.setItem('access_token', auth_token);
        });
    },
    register: function(email, password) {
        const token = localStorage.getItem('access_token');
        return fetchPost(token)(`${baseUrl}/register`, {
            email,
            password
        }).then(({ auth_token }) => {
            localStorage.setItem('access_token', auth_token);
        });
    },
    logout: function() {
        const token = localStorage.getItem('access_token');
        return fetchPost(token)(`${baseUrl}/logout`).then(() => {
            localStorage.setItem('access_token', '');
        });
    },
    me() {
        const token = localStorage.getItem('access_token');
        return fetchGet(token)(`${baseUrl}/users/me`).then(({ user }) => {
            const lastUpdate = parseInt(localStorage.getItem('lastUpdated'));
            const lastRemoteUpdate = datetime(new Date(user.last_updated));

            if (lastUpdate !== lastRemoteUpdate) {
                const keepLocal = () =>
                    db.sync
                        .getAll()
                        .then(data => sync.updateAll(data))
                        .then(data => {
                            localStorage.setItem(
                                'lastUpdated',
                                data.lastUpdated
                            );
                        });
                const keepRemote = () =>
                    sync.getAll().then(data =>
                        db.sync.updateAll(data).then(data => {
                            localStorage.setItem(
                                'lastUpdated',
                                data.lastUpdated
                            );
                        })
                    );

                return [
                    user,
                    {
                        keepLocal: keepLocal,
                        keepRemote: keepRemote
                    }
                ];
            }

            return [user, null];
        });
    },
    getLastUpdated: function() {
        this.me().then(user => user.last_updated);
    },
    exercises: {
        getAll: function() {
            const token = localStorage.getItem('access_token');
            return fetchGetAll(token)(
                `${baseUrl}/workouts/${exercise.workoutId}/exercises`
            ).then(({ workouts }) => workouts);
        },
        get: function(id) {
            const token = localStorage.getItem('access_token');
            return fetchGet(token)(
                `${baseUrl}/workouts/${exercise.workoutId}/exercises/${id}`
            ).then(({ workout }) => workout);
        },
        add: function(exercise) {
            const token = localStorage.getItem('access_token');
            return fetchPost(token)(
                `${baseUrl}/workouts/${exercise.workoutId}/exercises/${exercise.id}`,
                exercise
            ).then(({ workout }) => workout);
        },
        put: function(exercise) {
            const token = localStorage.getItem('access_token');
            return fetchPut(token)(
                `${baseUrl}/workouts/${exercise.workoutId}/exercises/${exercise.id}`,
                exercise
            ).then(({ workout }) => workout);
        },
        delete: function(exercise) {
            const token = localStorage.getItem('access_token');
            return fetchDelete(token)(
                `${baseUrl}/workouts/${exercise.workoutId}/exercises/${exercise.id}`
            );
        }
    },
    exerciseInstances: {
        getAll: function(workoutId, workoutInstanceId) {
            const token = localStorage.getItem('access_token');
            return fetchGetAll(token)(
                `${baseUrl}/workouts/${workoutId}/workoutInstances/${workoutInstanceId}/exerciseInstances`
            ).then(({ exerciseInstances }) => exerciseInstances);
        },
        get: function(workoutId, workoutInstanceId, id) {
            const token = localStorage.getItem('access_token');
            return fetchGet(token)(
                `${baseUrl}/workouts/${workoutId}/workoutInstances/${workoutInstanceId}/exerciseInstances/${id}`
            ).then(({ exerciseInstance }) => exerciseInstance);
        },
        add: function(workoutId, exerciseInstance) {
            const token = localStorage.getItem('access_token');
            return fetchPost(token)(
                `${baseUrl}/workouts/${workoutId}/workoutInstances/${exerciseInstance.workoutInstanceId}/exerciseInstances/${exerciseInstance.id}`,
                exerciseInstance
            ).then(({ exerciseInstance }) => exerciseInstance);
        },
        put: function(workoutId, exerciseInstance) {
            const token = localStorage.getItem('access_token');
            return fetchPut(token)(
                `${baseUrl}/workouts/${workoutId}/workoutInstances/${exerciseInstance.workoutInstanceId}/exerciseInstances/${exerciseInstance.id}`,
                exerciseInstance
            ).then(({ exerciseInstance }) => exerciseInstance);
        },
        delete: function(workoutId, exerciseInstance) {
            const token = localStorage.getItem('access_token');
            return fetchDelete(token)(
                `${baseUrl}/workouts/${workoutId}/workoutInstances/${exerciseInstance.workoutInstanceId}/exerciseInstances/${exerciseInstance.id}`
            );
        }
    },
    workouts: {
        getAll: function() {
            const token = localStorage.getItem('access_token');
            return fetchGetAll(token)(`${baseUrl}/workouts`).then(
                ({ workouts }) => workouts
            );
        },
        get: function(id) {
            const token = localStorage.getItem('access_token');
            return fetchGet(token)(`${baseUrl}/workouts/${id}`).then(
                ({ workout }) => workout
            );
        },
        add: function(workout) {
            const token = localStorage.getItem('access_token');
            return fetchPost(token)(
                `${baseUrl}/workouts/${workout.id}`,
                workout
            ).then(({ workout }) => workout);
        },
        put: function(workout) {
            const token = localStorage.getItem('access_token');
            return fetchPut(token)(
                `${baseUrl}/workouts/${workout.id}`,
                workout
            ).then(({ workout }) => workout);
        },
        delete: function(workout) {
            const token = localStorage.getItem('access_token');
            return fetchDelete(token)(`${baseUrl}/workouts/${workout.id}`);
        }
    },
    workoutInstances: {
        getAll: function(workoutId) {
            const token = localStorage.getItem('access_token');
            return fetchGetAll(token)(
                `${baseUrl}/workouts/${workoutId}/workoutInstances`
            ).then(({ workoutInstances }) => workoutInstances);
        },
        get: function(workoutId, id) {
            const token = localStorage.getItem('access_token');
            return fetchGet(token)(
                `${baseUrl}/workouts/${workoutId}/workoutInstances/${id}`
            ).then(({ workoutInstance }) => workoutInstance);
        },
        add: function(workoutInstance) {
            const token = localStorage.getItem('access_token');
            return fetchPost(token)(
                `${baseUrl}/workouts/${workoutInstance.workoutId}/workoutInstances/${workoutInstance.id}`,
                workoutInstance
            ).then(({ workoutInstance }) => workoutInstance);
        },
        put: function(workoutInstance) {
            const token = localStorage.getItem('access_token');
            return fetchPut(token)(
                `${baseUrl}/workouts/${workoutInstance.workoutId}/workoutInstances/${workoutInstance.id}`,
                workoutInstance
            ).then(({ workoutInstance }) => workoutInstance);
        },
        delete: function(workoutInstance) {
            const token = localStorage.getItem('access_token');
            return fetchDelete(token)(
                `${baseUrl}/workouts/${workoutInstance.workoutId}/workoutInstances/${workoutInstance.id}`
            );
        }
    },
    sync
};
