import { createSlice } from '@reduxjs/toolkit';

export const recipientSlice = createSlice({
  name: 'RECIPIENT',
  initialState: [] as string[],
  reducers: {
    addRecipient: (state, action) => {
      const newRecipient = action.payload.toLowerCase();
      if (
        !state.map(recipient => recipient.toLowerCase()).includes(newRecipient)
      ) {
        return [...state, newRecipient];
      } else {
        return state;
      }
    },
    addRecipients: (state, action) => {
      const newRecipients = action.payload.map((recipient: string) =>
        recipient.toLowerCase()
      );
      const uniqueNewRecipients = newRecipients.filter(
        (recipient: string) =>
          !state.map(r => r.toLowerCase()).includes(recipient)
      );
      return [...state, ...uniqueNewRecipients];
    },
    removeRecipient: (state, action) => {
      const removedRecipient = action.payload.toLowerCase();
      return state.filter(
        recipient => recipient.toLowerCase() !== removedRecipient
      );
    },
    clearRecipients: () => []
  }
});

export const { addRecipient, addRecipients, removeRecipient, clearRecipients } =
  recipientSlice.actions;

export default recipientSlice.reducer;
