import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./pages/auth/authSlice.js";
import { postSlice } from "./pages/posts/postSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    post: postSlice.reducer,
  },
});
