import { createSlice } from "@reduxjs/toolkit";

export const adminTask = createSlice({
    name: 'adminTask',
    initialState: {
        tasks: []
    },
    reducers: {
        setInitialTasks: (state, action) => {
            state.tasks = action.payload
        },
        addTask: (state, action) => {
            state.tasks.push(action.payload);
        },

        removeTask: (state, action) => {
            const taskId = action.payload;
            state.tasks = state.tasks.filter((task, index) => task.taskId !== taskId);
        },

        updateTask: (state, action) => {
            removeTask(action.payload.taskId);
            addTask(action.payload);
        }
    }
})

export const {addTask, removeTask, updateTask, setInitialTasks} = adminTask.actions;

export default adminTask.reducer;