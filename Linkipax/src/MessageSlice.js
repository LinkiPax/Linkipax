import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: [],
  reducers: {
    // Replace the entire messages state with the payload
    setMessages: (state, action) => action.payload,
    
    // Add a new message to the existing messages array
    addMessage: (state, action) => {
      state.push(action.payload); // Immer handles immutability
    },
  },
});

export const { setMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
