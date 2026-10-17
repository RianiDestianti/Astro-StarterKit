import { createSlice } from '../toolkit';
import { getProfile, handleActionLogin, handleActionRegister } from '../controllers/auth.controller';
import type { AuthState } from '../types/AuthType';

const initialState: AuthState = {
    loading             : false,
    responseLogin       : null,
    responseRegister    : null,
    error               : null,
    errorFields         : null,
    errorCode           : null,
    profile             : null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        handleCleanResponse (state) {
            state.responseLogin     = null
            state.responseRegister  = null
            state.error             = null
            state.errorFields       = null
        },
        handleLogout (state) {
            state.profile           = null
            state.errorCode         = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(handleActionLogin.pending , (state) => {
                state.loading       = true
                state.error         = null
                state.errorFields   = null
            })
            .addCase(handleActionLogin.fulfilled , (state , action) => {
                state.loading       = false
                const response      = action.payload

                if(response.status == 200){
                    state.responseLogin = response.data
                    state.error         = null
                }else{
                    state.error         = response.message
                    state.errorFields   = response.status == 422 ? response.data : null
                }
            })
            .addCase(handleActionLogin.rejected , (state , action) => {
                state.loading       = false
                state.error         = action.error?.message ?? 'Network error'
            })

            .addCase(handleActionRegister.pending , (state) => {
                state.loading       = true
                state.error         = null
                state.errorFields   = null
            })
            .addCase(handleActionRegister.fulfilled , (state , action) => {
                state.loading       = false
                const response      = action.payload

                if(response.status == 200){
                    state.responseRegister  = response.data
                    state.error             = null
                }else{
                    state.error         = response.message
                    state.errorFields   = response.status == 422 ? response.data : null
                }
            })
            .addCase(handleActionRegister.rejected , (state , action) => {
                state.loading       = false
                state.error         = action.error?.message ?? 'Network error'
            })

            .addCase(getProfile.pending , (state) => {
                state.loading       = true
            })
            .addCase(getProfile.fulfilled , (state , action) => {
                state.loading       = false
                state.errorCode     = action.payload.status
                state.profile       = action.payload.status == 200 ? action.payload.data : null
            })
            .addCase(getProfile.rejected , (state , action) => {
                state.loading       = false
                state.error         = action.error?.message ?? 'Network error'
            })
    }
})

export const { handleCleanResponse, handleLogout } = authSlice.actions
export default authSlice.reducer;
