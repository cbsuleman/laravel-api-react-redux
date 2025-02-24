import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/axios.js";

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  status: "idle",
  errors: {},
};

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await api.get("api/user");
  return res.data;
});

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("api/register", formData);
      localStorage.setItem("token", res.data.token);
      return res.statusText;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" },
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("api/login", formData);
      if (res.data.errors) {
        return rejectWithValue({ errors: res.data.errors[0] });
      } else {
        localStorage.setItem("token", res.data.token);
        return res.data;
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" },
      );
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    const res = await api.post("api/logout");
    localStorage.removeItem("token");
    return res.data;
  } catch (error) {
    console.error(error);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errors = {};
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.errors = {};
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.errors = {};
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload.errors;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.errors = {};
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.errors = {};
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload.errors || {};
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
        state.errors = {};
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.token = localStorage.getItem("token");
        state.errors = {};
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.errors = "Logout failed";
      });
  },
});

export const { clearErrors } = authSlice.actions;
export default authSlice.reducer;
