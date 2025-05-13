import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "events",
  initialState: {
    items: [],
    reads: [],
    unreads: [],
  },
  reducers: {
    add(state, action) {
      const newItems = action.payload.filter(
        (item) => !state.items.some((existing) => existing.id === item.id)
      );
      state.items.unshift(...newItems);
      state.items.splice(50);
    },

    delete(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },

    deleteAll(state) {
      state.items = [];
      state.reads = [];
      state.unreads = [];
    },

    addReads(state, action) {
      const newRead = action.payload;
      const exists = state.reads.some((r) => r.id === newRead.id);

      if (!exists) {
        state.reads.push(newRead);
      }

      state.reads = state.reads.sort(
        (a, b) => new Date(b.eventTime) - new Date(a.eventTime)
      );
    },

    removeRead(state, action) {
      state.reads = state.reads.filter((item) => item.id !== action.payload.id);
    },

    markAllAsRead(state) {
      state.reads = [...state.items].sort(
        (a, b) => new Date(b.eventTime) - new Date(a.eventTime)
      );
      state.unreads = [];
    },

    addUnreads(state, action) {
      state.unreads = [...action.payload].sort(
        (a, b) => new Date(b.eventTime) - new Date(a.eventTime)
      );
    },

    removeUnread(state, action) {
      state.unreads = state.unreads.filter(
        (item) => item.id !== action.payload.id
      );
    },

    markAllAsUnread(state) {
      state.unreads = [...state.items].sort(
        (a, b) => new Date(b.eventTime) - new Date(a.eventTime)
      );
      state.reads = [];
    },

    mergeUnreads(state, action) {
      const newUnreads = action.payload.filter(
        (novo) =>
          !state.unreads.some((u) => u.id === novo.id) &&
          !state.reads.some((r) => r.id === novo.id)
      );

      for (const item of newUnreads) {
        state.unreads.push(item);
      }

      state.unreads.sort(
        (a, b) => new Date(b.eventTime) - new Date(a.eventTime)
      );
    },
  },
});

export { actions as eventsActions };
export { reducer as eventsReducer };
