import api from "@/services/api";
import { createAsyncThunk } from "../toolkit";
import type { UserPayload, UserQuery } from "../types/UserType";

export const getListUser = createAsyncThunk('user/getList', async ({ keyword = '', page = '1', limit = '10' }: UserQuery) => {
    const response = await api.get(`/admin/users?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`)
    return response
})

export const saveUser = createAsyncThunk('user/saveUser', async (payload: UserPayload) => {
    const response = await api.post(`/admin/user/action`, payload)
    return response
})

export const deleteUser = createAsyncThunk('user/deleteUser', async (id: number) => {
    const response = await api.get(`/admin/user/delete/${id}`)
    return response
})
