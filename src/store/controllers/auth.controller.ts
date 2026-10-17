import api from "@/services/api";
import { createAsyncThunk } from "../toolkit";
import type { LoginRequest, RegisterRequest } from "../types/AuthType";

export const handleActionLogin = createAsyncThunk('auth/login', async (payload: LoginRequest) => {
    const response = await api.post(`/login`, payload)
    return response
})

export const handleActionRegister = createAsyncThunk('auth/register', async (payload: RegisterRequest) => {
    const response = await api.post(`/register`, payload)
    return response
})

export const getProfile = createAsyncThunk('auth/profile', async () => {
    const response = await api.get(`/check-auth`)
    return response
})
