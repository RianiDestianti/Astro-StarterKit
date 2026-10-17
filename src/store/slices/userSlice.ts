import { createSlice } from '../toolkit';
import { deleteUser, getListUser, saveUser } from '../controllers/user.controller';
import type { UserState } from '../types/UserType';

const initialState: UserState = {
    users       : [],
    page        : 1,
    total       : {
        pages   : 0,
        data    : 0
    },
    response    : {
        action  : null,
        delete  : null
    },
    loading     : false,
    error       : null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetResponse (state) {
            state.response = {
                action  : null,
                delete  : null
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getListUser.pending , (state) => {
                state.loading = true
            })
            .addCase(getListUser.fulfilled , (state , action) => {
                state.loading = false

                if(action.payload.status == 200){
                    state.users = action.payload.data.data
                    state.page  = action.payload.data.page
                    state.total = action.payload.data.total
                    state.error = null
                }else{
                    state.error = action.payload.message
                }
            })
            .addCase(getListUser.rejected , (state , action) => {
                state.loading = false
                state.error   = action.error?.message ?? 'Network error'
            })

            .addCase(saveUser.pending, (state) => {
                state.loading = true
            })
            .addCase(saveUser.fulfilled, (state, action) => {
                state.loading           = false
                state.response.action   = action.payload
            })
            .addCase(saveUser.rejected , (state , action) => {
                state.loading = false
                state.error   = action.error?.message ?? 'Network error'
            })

            .addCase(deleteUser.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading           = false
                state.response.delete   = action.payload

                if(action.payload.status == 200){
                    const deletedId     = action.meta?.arg
                    state.users         = state.users.filter((item) => item.id != deletedId)
                    state.total.data    = Math.max(0, state.total.data - 1)
                }
            })
            .addCase(deleteUser.rejected , (state , action) => {
                state.loading = false
                state.error   = action.error?.message ?? 'Network error'
            })
    }
})

export const { resetResponse } = userSlice.actions;
export default userSlice.reducer;
