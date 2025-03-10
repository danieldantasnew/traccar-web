import { createSlice } from '@reduxjs/toolkit';

const colors = [
  ["rgb(189, 12, 18)", "white", "rgb(255, 0, 8)"],
  ["rgb(214, 164, 0)", "white", "rgb(151, 103, 0)"],
  ["rgb(28, 160, 133)", "white", "rgb(0, 105, 84)"],
  ["rgba(238, 0, 159, 0.81)", "white", "rgb(173, 0, 116)"],
  ["rgb(3, 221, 39)", "white", "rgb(0, 150, 25)"],
  ["rgb(0, 0, 0)","white", "rgb(136, 136, 136)"],
  ["rgb(69, 92, 219)","white", "rgb(0, 28, 189)"],
  ["rgb(142, 67, 173)","white", "rgb(82, 0, 117)"],
  ["rgb(104, 203, 208)", "black", "rgb(0, 157, 165)"],
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
      const randomIndex = Math.floor(Math.random() * colors.length);
      action.payload.forEach((item, index) => {
        state.items[item.id] = {
          ...item,
          bgColor: colors[index] ? colors[index][0] : colors[randomIndex][0],
          color: colors[index] ? colors[index][1] : colors[randomIndex][1],
          subColor: colors[index] ? colors[index][2] : colors[randomIndex][2],
        }
      });
    },
    update(state, action) {
      action.payload.forEach((item) => {
        const existingItem = state.items[item.id];
        state.items[item.id] = {
          ...item,
          bgColor: existingItem.bgColor,
          color: existingItem.color,
          subColor: existingItem.subColor,
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
