import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/axios.js";

const initialState = {
  posts: [],
  post: null,
  status: "idle",
  errors: {},
  currentPage: 1,
  postsPerPage: 5, // Default 5 posts per page
  searchTerm: "", // Add this for search
};

export const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
  const res = await api.get("api/posts");
  return res.data;
});

export const fetchPost = createAsyncThunk("post/fetchPost", async (id) => {
  try {
    const res = await api.get(`api/posts/${id}`);
    return res.data.post;
  } catch (error) {
    console.error(error);
  }
});

export const deletePost = createAsyncThunk("post/deletePost", async (id) => {
  try {
    const res = await api.delete(`api/posts/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
});

export const createPost = createAsyncThunk(
  "post/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post(`api/posts`, formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.errors);
    }
  },
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ formData, id }, { rejectWithValue }) => {
    try {
      const res = await api.put(`api/posts/${id}`, formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.errors);
    }
  },
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errors = {};
      state.status = "idle";
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPostsPerPage: (state, action) => {
      state.postsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing items per page
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      })
      .addCase(fetchPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.post = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      })
      .addCase(deletePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.post = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      })
      .addCase(updatePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.post = action.payload.post;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.post = action.payload.post;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      });
  },
});

export const { clearErrors, setCurrentPage, setPostsPerPage, setSearchTerm } =
  postSlice.actions;

export default postSlice.reducer;
