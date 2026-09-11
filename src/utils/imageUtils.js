export function isValidImage(file){ return !file || (file.type.startsWith('image/') && file.size <= 5*1024*1024) }
