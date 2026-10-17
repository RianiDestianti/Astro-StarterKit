export interface User {
    id          : number
    name        : string
    phone       : string | null
    email       : string
    avatar      : string | null
    role        : string
}

export interface UserTotal {
    pages       : number
    data        : number
}

export interface UserState {
    users       : User[]
    page        : number
    total       : UserTotal
    loading     : boolean
    response    : {
        action  : any
        delete  : any
    }
    error       : string | null
}

export interface UserPayload {
    id?         : number | null
    name        : string
    email       : string
    phone?      : string
    role        : number | string
    password?   : string
}

export interface UserQuery {
    page?       : number | string
    limit?      : number | string
    keyword?    : string
}
