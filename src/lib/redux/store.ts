// src/lib/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import jobSlice from "./slices/jobSlice";
import applicationSlice from "./slices/applicationSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    jobs: jobSlice,
    applications: applicationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
