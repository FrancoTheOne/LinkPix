import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SettingState {
  isKeyShortcutDisabled: boolean;
}

const initialState: SettingState = {
  isKeyShortcutDisabled: false,
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    activateKeyShortcut: (state) => {
      state.isKeyShortcutDisabled = false;
    },
    deactivateKeyShortcut: (state) => {
      state.isKeyShortcutDisabled = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { activateKeyShortcut, deactivateKeyShortcut } =
  settingSlice.actions;

export default settingSlice.reducer;
