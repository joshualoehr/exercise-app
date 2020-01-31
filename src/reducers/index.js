import { combineReducers } from 'redux';
import dndReducer from '../features/common/dndSlice';
import settingsReducer from '../features/settings/settingsSlice';
import usersReducer from '../features/user/usersSlice';
import workoutsReducer from '../features/workouts/workoutsSlice';
import workoutInstanceReducer from '../features/workoutInstance/workoutInstanceSlice';

export default combineReducers({
    dnd: dndReducer,
    settings: settingsReducer,
    users: usersReducer,
    workouts: workoutsReducer,
    workoutInstance: workoutInstanceReducer
});
