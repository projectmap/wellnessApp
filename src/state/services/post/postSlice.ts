import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostState {
  posts: any; // TODO: set type or remove
}

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    storePosts(state, action: PayloadAction<any[]>) {
      state.posts = action.payload;
    },
    addPost(state, action: PayloadAction<any>) {
      state.posts = [action.payload, ...state.posts.filter((post: any) => post.id !== action.payload.id)];
    },
    removePost(state, action: PayloadAction<string>) {
      state.posts = state.posts.filter((post: any) => post.id !== action.payload);
    },
  },
});

export const { storePosts, addPost, removePost } = postSlice.actions;

export default postSlice.reducer;
