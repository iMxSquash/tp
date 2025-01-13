import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: [],
    loading: false,
    error: null
}

export const Article = createSlice({
    name: "Article",
    initialState,
    reducers: {
        FETCH_ARTICLE_START: (state) => {
            state.loading = true;
        },

        FETCH_ARTICLE_SUCCESS: (state, action) => {
            state.data = action.payload;
            state.loading = false;
            state.error = null;
        },

    }
})

export const { FETCH_ARTICLE_START, FETCH_ARTICLE_SUCCESS } = Article.actions
export default Article.reducer