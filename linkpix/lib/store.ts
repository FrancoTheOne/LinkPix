import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter/counterSlice";
import { albumApi } from "@/services/album";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      [albumApi.reducerPath]: albumApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(albumApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
