import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [
    // { isUser: true, content: "Hello" },
    {
      isUser: false,
      content: "Hi there, I am UMI! What would you like to know?",
      selection: [
        {
          title: "1) How to use UMI?",
          respond:
            "Just click on the messages, and you will see the answers! You can also click on the options below to see more answers about other questions!",
          nextSelections: [
            {
              title: "1.1) What can I know through UMI?",
              respond:
                "You can learn how to use MyTBCompanion and how it can help you in your treatment journey!",
              nextSelections: [{}],
            },
            {
              title: "2.1) Can I ask everything using UMI?",
              respond:
                "You can ask anything about MyTBCompanion, but if you have any medical questions, please consult your doctor!",
              nextSelections: [{}],
            },
          ],
        },
        {
          title: "2) About Video Upload",
          respond: "What would you like to know about video upload?",
          nextSelections: [
            {
              title: "2.1) What is video upload?",
              respond:
                "Video upload is a feature that allows you to upload a video of yourself taking your medication!",
            },
            {
              title: "2.2) Why should I upload a video?",
              respond:
                "Video upload make sure that you are taking your medication correctly, and it will help your doctor to monitor your progress!",
            },
            {
              title: "2.3) How to upload a video",
              respond:
                "In the home page, click on the upload button, select the way you want to upload a video (from storage or take a video) and press upload!",
            },
          ],
        },
        {
          title: "3) About Side Effect?",
          respond: "What would you like to know about side effect?",
          nextSelections: [
            {
              title: "3.1) What is side effect?",
              respond:
                "Side effect is a reaction that occurs when you take your medication!",
            },
            {
              title: "3.2) What should I do if I experience a side effect?",
              respond:
                "You can report your side effect to your doctor through MyTBCompanion!",
              nextSelections: [
                {
                  title: "3.2.1) How to report a side effect?",
                  respond:
                    "In the home page, click on the side effect button, fill in the date, time, and the side effect you are experiencing, and click on the submit button!\nYour doctor will be notified about your side effect!",
                },
              ],
            },
            {
              title: "3.3) How to report a side effect?",
              respond:
                "In the home page, click on the side effect button, fill in the date, time, and the side effect you are experiencing, and click on the submit button!\nYour doctor will be notified about your side effect!",
            },
          ],
        },
      ],
    },
  ],
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
    resetMessage: () => initialState,
  },
});

export const { createMessage, resetMessage } = umiChatSlice.actions;
export default umiChatSlice.reducer;
