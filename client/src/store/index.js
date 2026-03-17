import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/auth.api";
import { accountApi } from "../services/account.api";
import { transitionApi } from "../services/transition.api";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [transitionApi.reducerPath]: transitionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      accountApi.middleware,
      transitionApi.middleware,
    ),
});
