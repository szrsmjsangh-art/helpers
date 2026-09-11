export default function HelperPhotoGallery({ photoUrl, name }) { return photoUrl ? <img src={photoUrl} alt={name} className="h-52 w-full rounded-2xl object-cover"/> : null }
