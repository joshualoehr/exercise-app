import { combineReducers } from 'redux';
import dndReducer from '../features/common/dndSlice';
import usersReducer from '../features/user/usersSlice';
import workoutsReducer from '../features/workouts/workoutsSlice';
import workoutInstanceReducer from '../features/workoutInstance/workoutInstanceSlice';

export default combineReducers({
    dnd: dndReducer,
    users: usersReducer,
    workouts: workoutsReducer,
    workoutInstance: workoutInstanceReducer
});
