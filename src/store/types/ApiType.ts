export interface ApiResponse<Data = any> {
    status      : number
    message     : string
    data?       : Data
}
