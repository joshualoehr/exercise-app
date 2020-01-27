import { createSlice } from '@reduxjs/toolkit';

const dndSlice = createSlice({
    name: 'dnd',
    initialState: {
        draggedExercise: null
    },
    reducers: {
        setDraggedExercise(state, action) {
            state.draggedExercise = action.payload;
        }
    }
});

export const { setDraggedExercise } = dndSlice.actions;

export default dndSlice.reducer;
