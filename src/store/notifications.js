import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "notifications",
  initialState: {
    items: [],
  },
  reducers: {
    add(state, action) {
      state.items = action.payload;
    },

    delete(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export { actions as notificationsActions };
export { reducer as notificationsReducer };
