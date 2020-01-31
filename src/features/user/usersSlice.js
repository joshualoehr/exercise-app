import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: null
    },
    reducers: {
        setUsers(state, action) {
            state.users = action.payload;
        }
    }
});

export const { setUsers } = usersSlice.actions;

export const fetchUsers = () => dispatch =>
    fetch('http://localhost:3001/users')
        .then(res => res.json())
        .then(users => dispatch(setUsers(users)));

export default usersSlice.reducer;
