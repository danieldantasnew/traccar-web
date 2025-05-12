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
      state.items.unshift(...action.payload);
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
      const novo = action.payload;
      const jaExiste = state.reads.some((r) => r.id === novo.id);

      if (!jaExiste) {
        state.reads.push(novo);
      }
    },

    markAllAsRead(state) {
      state.reads = [...state.items];
      state.unreads = [];
    },

    addUnreads(state, action) {
      state.unreads = [...action.payload].sort(
        (a, b) => new Date(a.eventTime) - new Date(b.eventTime)
      );
    },

    removeUnread(state, action) {
      state.unreads = state.unreads.filter(
        (item) => item.id !== action.payload.id
      );
    },
    
    mergeUnreads(state, action) {
      const newUnreads = action.payload.filter(
        (novo) =>
          !state.unreads.some((u) => u.id === novo.id) &&
          !state.reads.some((r) => r.id === novo.id)
      );

      const combined = [...state.unreads, ...newUnreads];

      state.unreads = combined.sort(
        (a, b) => new Date(a.eventTime) - new Date(b.eventTime)
      );
    },
  },
});

export { actions as eventsActions };
export { reducer as eventsReducer };
