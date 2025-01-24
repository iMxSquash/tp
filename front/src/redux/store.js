import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './reducers/article.reducer';
import userReducer from './reducers/user.reducer';

export const store = configureStore({
  reducer: {
    article: articleReducer,
    user: userReducer,
  }
});