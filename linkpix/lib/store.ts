import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter/counterSlice";
import settingReducer from "./setting/settingSlice";
import { albumApi } from "@/services/album";
import { repositoryApi } from "@/services/repository";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      setting: settingReducer,
      [albumApi.reducerPath]: albumApi.reducer,
      [repositoryApi.reducerPath]: repositoryApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        albumApi.middleware,
        repositoryApi.middleware
      ),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
