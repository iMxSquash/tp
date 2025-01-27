import { createSlice } from "@reduxjs/toolkit";

const articleSlice = createSlice({
    name: "article",
    initialState: {
        articles: [],
        currentArticle: null,
        loading: false,
        error: null,
    },
    reducers: {
        FETCH_ARTICLE_START: (state) => {
            state.loading = true;
            state.error = null;
        },
        FETCH_ARTICLE_SUCCESS: (state, action) => {
            state.articles = action.payload;
            state.loading = false;
        },
        FETCH_SINGLE_ARTICLE_SUCCESS: (state, action) => {
            state.currentArticle = action.payload;
            state.loading = false;
        },
        FETCH_ARTICLE_ERROR: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        ADD_ARTICLE_SUCCESS: (state, action) => {
            state.articles.push(action.payload);
        },
        UPDATE_ARTICLE_SUCCESS: (state, action) => {
            const updatedArticle = action.payload;
            state.currentArticle = updatedArticle;
            const index = state.articles.findIndex((article) => article._id === updatedArticle._id);
            if (index !== -1) {
                state.articles[index] = updatedArticle;
            }
        },
        DELETE_ARTICLE_SUCCESS: (state, action) => {
            state.articles = state.articles.filter((article) => article._id !== action.payload);
        },
        UPDATE_ARTICLE_FIELD: (state, action) => {
            if (state.currentArticle) {
                state.currentArticle = {
                    ...state.currentArticle,
                    ...action.payload,
                };
            }
        },
        RESET_CURRENT_ARTICLE: (state) => {
            state.currentArticle = null;
        },
    },
});

export const {
    FETCH_ARTICLE_START,
    FETCH_ARTICLE_SUCCESS,
    FETCH_SINGLE_ARTICLE_SUCCESS,
    FETCH_ARTICLE_ERROR,
    ADD_ARTICLE_SUCCESS,
    UPDATE_ARTICLE_SUCCESS,
    DELETE_ARTICLE_SUCCESS,
    UPDATE_ARTICLE_FIELD,
    RESET_CURRENT_ARTICLE,
} = articleSlice.actions;

export default articleSlice.reducer;
