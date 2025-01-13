import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './reducers/article.reducer';
import authReducer from './reducers/auth.reducer';

export const store = configureStore({
  reducer: {
    article: articleReducer,
    auth: authReducer
  }
});