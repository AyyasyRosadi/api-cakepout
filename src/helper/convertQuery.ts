export const queryToString = (query: any):string=>{
    let queryConvert:string | undefined = typeof(query)==='string' ? query : ""
    return queryConvert
}