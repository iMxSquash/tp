import { configureStore } from '@reduxjs/toolkit'
import Article from './reducers/article.reducer'

export default configureStore({
  reducer: {
    article: Article
  }
})