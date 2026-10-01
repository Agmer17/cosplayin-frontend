
export function resolveMediaUrl(url : string) {

    if (url.startsWith("https://")) {
        return url
    } 

    return `${process.env.NEXT_PUBLIC_BACKEND_API_UPLOADS}${url}` 
    
}
export function resolvePublicMedia(url : string) {

    if (url.startsWith("https://")) {
        return url
    } 

    return `${process.env.NEXT_PUBLIC_BACKEND_API_UPLOADS_PUBLIC}/${url}` 
    
}

