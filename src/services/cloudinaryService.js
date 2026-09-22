import { cloudinaryConfig } from '../lib/cloudinary'

export async function uploadImage(file) {
  if (!file) return null

  const { cloudName, uploadPreset } = cloudinaryConfig

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data?.error?.message || 'Photo upload failed. Please try again.'
    )
  }

  if (!data.secure_url) {
    throw new Error('Photo uploaded but image URL was not received.')
  }

  return data.secure_url
}