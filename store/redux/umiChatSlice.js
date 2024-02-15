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
            },
            {
              title: "2.1) Can I ask everything using UMI?",
              respond:
                "You can ask mostly anything about MyTBCompanion, but if you have any medical questions, please consult your doctor!",
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
                "In the home page, click on the upload button, record a video with your built-in camera and press upload!",
            },
            {
              title: "2.4) What should I do if my video gets rejected?",
              respond:
                "If your video gets rejected, you should check for the remarks from your doctor to understand the reason why your video is rejected.\nYou can also consult your doctor for more information!\nYou don't have to upload another video again if your video gets rejected!",
                nextSelections: [
                  {
                    title: "2.4.1) How to check for the remarks?",
                    respond:
                      "In the bottom of the home page, click on \"My Calendar\", and click on the video you have submitted, and you will see the remarks from your doctor!",
                  }
                ]
            },
            {
              title: "2.5) Can I preview my video after taking the video and right before uploading?",
              respond:
                "Yes, you can preview your video after taking the video and right before uploading!\nHowever, you can no longer view your video after uploading it!",
            },
            {
              title: "2.6) Can I delete my video after uploading?",
              respond:
                "No, you cannot delete your video after uploading it!\nYou also cannot review your video after uploading.",
            },
            {
              title: "2.7) Can I upload a video after the due date?",
              respond:
                "No, you cannot upload a video after the due date!",
            },
            {
              title: "2.8) Is it safe to upload my video? How my video will be used?",
              respond: "Yes, it is safe to upload your video!\nYour video will only be used by your doctor to monitor your progress and to make sure that you are taking your medication correctly!\nAfter the review, your video will be deleted from the server!",
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
