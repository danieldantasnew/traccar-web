import { createSlice } from '@reduxjs/toolkit';

const colors = [
  ["rgb(218, 97, 101)", "white", "rgb(232, 54, 59)"],
  ["rgba(42, 66, 202, 0.88)","white", "rgb(0, 28, 189)"],
  ["rgba(3, 221, 39, 0.72)", "white", "rgb(0, 150, 25)"],
  ["rgba(253, 173, 0, 0.83)", "white", "rgba(151, 103, 0, 0.83)"],
  ["rgba(238, 0, 159, 0.81)", "white", "rgb(173, 0, 116)"],
  ["rgb(104, 203, 208)", "black", "rgb(0, 157, 165)"],
  ["rgb(28, 160, 133)", "black", "rgb(0, 105, 84)"],
  ["rgb(142, 67, 173)","white", "rgb(82, 0, 117)"],
];

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
          bgColor: colors[index][0] || 'rgb(218, 97, 101)',
          color: colors[index][1] || 'black',
          subColor: colors[index][2] || 'rgb(232, 54, 59)',
        }
      });
    },
    update(state, action) {
      action.payload.forEach((item, index) => {
        state.items[item.id] = {
          ...item,
          bgColor: colors[index][0] || 'rgb(218, 97, 101)',
          color: colors[index][1] || 'black',
          subColor: colors[index][2] || 'rgb(232, 54, 59)',
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
