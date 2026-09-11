export function digitsOnly(value=''){ return value.replace(/\D/g,'') }
export function normalizeIndianMobile(value=''){ let d=digitsOnly(value); if(d.length===12&&d.startsWith('91')) d=d.slice(2); if(d.length===11&&d.startsWith('0')) d=d.slice(1); return d }
