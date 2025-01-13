import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './reducers/article.reducer';

export const store = configureStore({
  reducer: {
    article: articleReducer,
  }
});