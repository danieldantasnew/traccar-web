import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "devices",
  initialState: {
    items: {},
    selectedId: null,
    selectedIds: [],
    loading: true,
  },
  reducers: {
    loading(state, action) {
      state.loading = action.payload;
    },
    refresh(state, action) {
      state.items = {};
      action.payload.forEach((item) => (state.items[item.id] = item));
    },
    update(state, action) {
      action.payload.forEach((item) => (state.items[item.id] = item));
    },
    updateUniqueItem(state, action) {
      const updatedDevice = action.payload;
      state.items[updatedDevice.id] = updatedDevice;
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
