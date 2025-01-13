import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: {
            email: '',
            password: '',
            username: '',
            confirmPassword: '',
            isActive: true
        },
        loading: false,
        error: null
    },
    reducers: {
        UPDATE_AUTH_FIELD: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        SET_AUTH_ERROR: (state, action) => {
            state.error = action.payload;
        },
        RESET_AUTH_FORM: (state) => {
            state.user = {
                email: '',
                password: '',
                username: '',
                confirmPassword: '',
                isActive: true
            };
            state.error = null;
        }
    }
});

export const { UPDATE_AUTH_FIELD, SET_AUTH_ERROR, RESET_AUTH_FORM } = authSlice.actions;
export default authSlice.reducer;
