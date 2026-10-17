import { configureStore } from "./toolkit"
import authSlice from "./slices/authSlice"
import userSlice from "./slices/userSlice"

export const store = configureStore({
  reducer: {
    auth      : authSlice,
    user      : userSlice,
  }
});

export type RootState = ReturnType<typeof store.getState>
