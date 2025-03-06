import { createSlice } from '@reduxjs/toolkit';

const colors = ["red", "blue", "green", "orange", "#27ae60", "#9b9b9b", "#1ca085", "#68cbd0", "#8e43ad"];

const { reducer, actions } = createSlice({
  name: 'devices',
  initialState: {
    items: {},
    selectedId: null,
    selectedIds: [],
  },
  reducers: {
    refresh(state, action) {
      state.items = {};
      action.payload.forEach((item, index) => {
        state.items[item.id] = {
          ...item,
          color: colors[index] || 'blue'
        }
      });
    },
    update(state, action) {
      action.payload.forEach((item, index) => {
        state.items[item.id] = {
          ...item,
          color: colors[index] || 'blue'
        }
      });
    },
    selectId(state, action) {
      state.selectTime = Date.now();
      state.selectedId = action.payload;
      state.selectedIds = state.selectedId ? [state.selectedId] : [];
    },
    selectIds(state, action) {
      state.selectTime = Date.now();
      state.selectedIds = action.payload;
      [state.selectedId] = state.selectedIds;
    },
    remove(state, action) {
      delete state.items[action.payload];
    },
  },
});

export { actions as devicesActions };
export { reducer as devicesReducer };
