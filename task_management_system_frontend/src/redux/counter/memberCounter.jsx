import { createSlice } from "@reduxjs/toolkit";

export const memberCounter = createSlice({
    name: 'memberCounter',
    initialState: {
        members: []
    },
    reducers: {
        setInitialMembers: (state, action) => {
            state.members = action.payload
        },
        addMember: (state, action) => {
            state.members.push(action.payload);
        },

        removeMember: (state, action) => {
            const memberId = action.payload;
            state.members = state.members.filter((member, index) => member.memberId !== memberId);
        },

        updateMember: (state, action) => {
            removeMember(action.payload.memberId);
            addMember(action.payload);
        }
    }
})

export const {addMember, removeMember, updateMember, setInitialMembers} = memberCounter.actions;

export default memberCounter.reducer;