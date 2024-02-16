import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const umiChatSlice = createSlice({
  name: "umiChat",
  initialState: initialState,
  reducers: {
    createMessage: (state, action) => {
      const newMessage = {
        ...action.payload,
      };
      state.messages.push(newMessage);
    },
    resetMessage: (state, action) => {
      const newMessage = {
        ...action.payload,
      };
      state.messages = [];
      state.messages.push(newMessage);
    },
  },
});

export const { createMessage, resetMessage } = umiChatSlice.actions;
export default umiChatSlice.reducer;
