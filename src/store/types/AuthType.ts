export interface ResponseLoginType {
    key     : string,
    email   : string
}

export interface LoginRequest {
    email       : string
    password?   : string
}

export interface RegisterRequest {
    name        : string
    email       : string
    password    : string
}

export interface DataAuthType {
    id          : number
    name        : string
    email       : string
    role        : string
    avatar      : string | null
    verified    : boolean
}

export interface AuthState {
    loading             : boolean
    responseLogin       : ResponseLoginType | null
    responseRegister    : ResponseLoginType | null
    error               : string | null
    errorFields         : Record<string, string[]> | null
    errorCode           : number | null
    profile             : DataAuthType | null
}
