import { useEffect, useRef, useState } from 'react'
import {
  Users,
  Camera,
  Image as ImageIcon,
  ShieldCheck,
  X,
} from 'lucide-react'
import TextInput from '../components/common/TextInput'
import PhoneInput from '../components/common/PhoneInput'
import TextArea from '../components/common/TextArea'
import SelectInput from '../components/common/SelectInput'
import Button from '../components/common/Button'
import ErrorMessage from '../components/common/ErrorMessage'
import AddHelpersSuccess from '../components/add-helper/AddHelpersSuccess'
import ContactPicker from '../components/add-helper/ContactPicker'
import { getCategories, getServiceTypes } from '../services/categoryService'
import { submitHelper } from '../services/submissionService'
import { uploadImage } from '../services/cloudinaryService'

const blank = {
  name: '',
  mobile: '',
  whatsapp: '',
  categoryId: '',
  serviceTypeId: '',
  area: '',
  description: '',
  submittedName: '',
  photoUrl: '',
}

export default function AddHelperPage() {
  const [categories, setCategories] = useState([])
  const [types, setTypes] = useState([])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(blank)

  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)

 // const photoInputRef = useRef(null)
  const cameraInputRef = useRef(null)
const galleryInputRef = useRef(null)

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    if (form.categoryId) {
      getServiceTypes(form.categoryId).then(setTypes)
    } else {
      setTypes([])
    }
  }, [form.categoryId])

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

  const handlePhotoChange = (e) => {
  const file = e.target.files?.[0]

  if (!file) return

  setError('')

  if (!file.type.startsWith('image/')) {
    setError('Please select an image file.')
    e.target.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    setError('Photo size should be less than 5 MB.')
    e.target.value = ''
    return
  }

  if (photoPreview) {
    URL.revokeObjectURL(photoPreview)
  }

  setPhotoFile(file)
  setPhotoPreview(URL.createObjectURL(file))
}

  const removePhoto = () => {
  if (photoPreview) {
    URL.revokeObjectURL(photoPreview)
  }

  setPhotoFile(null)
  setPhotoPreview('')

  if (cameraInputRef.current) {
    cameraInputRef.current.value = ''
  }

  if (galleryInputRef.current) {
    galleryInputRef.current.value = ''
  }
}

  const submit = async (e) => {
    e.preventDefault()

    if (submitting) return

    setError('')
    setSuccess(false)
    setSubmitting(true)

    try {
      let photoUrl = ''

      if (photoFile) {
        photoUrl = await uploadImage(photoFile)
      }

      await submitHelper({
        ...form,
        photoUrl,
      })

      setSuccess(true)
      setForm(blank)
     setPhotoFile(null)
setPhotoPreview('')

if (cameraInputRef.current) {
  cameraInputRef.current.value = ''
}

if (galleryInputRef.current) {
  galleryInputRef.current.value = ''
}
    } catch (err) {
      setError(err?.message || 'Unable to submit helper.')
    } finally {
      setSubmitting(false)
    }
  }

  const picked = (contacts) => {
    const c = contacts?.[0]

    if (c) {
      setForm((f) => ({
        ...f,
        name: c.name?.[0] || '',
        mobile: c.tel?.[0] || '',
      }))
    }
  }

  return (
    <div className="px-4 py-5">
      <h1 className="text-[22px] font-black text-[#19212d]">
        Add Helpers
      </h1>

      <p className="mt-1 text-xs leading-5 text-[#69717b]">
        Select contacts from your phone and share their details to help the
        community.
      </p>

      <div className="mt-4 rounded-[16px] border border-[#d9ebdc] bg-[#eef9f0] p-3 text-[11px] leading-5 text-[#4d6253]">
        <div className="flex gap-2">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-[#159447]"
          />

          <span>
            We only read contacts you select. Nothing is saved without your
            approval.
          </span>
        </div>
      </div>

      <div className="mt-4">
        <ContactPicker onPick={picked} />
      </div>

      <div className="my-4 flex items-center gap-3 text-[10px] text-[#9a9da1]">
        <span className="h-px flex-1 bg-[#e5e1db]" />
        OR
        <span className="h-px flex-1 bg-[#e5e1db]" />
      </div>

      {success && (
        <div className="mb-4">
          <AddHelpersSuccess />
        </div>
      )}

      <div className="mb-4 flex items-center gap-3 rounded-[16px] bg-[#fff4e2] p-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#e28419]">
          <Users size={20} />
        </span>

        <div>
          <b className="text-[12px] text-[#333943]">
            Help our community grow
          </b>

          <p className="mt-0.5 text-[10px] leading-4 text-[#777d84]">
            Add a trusted service provider so others can benefit.
          </p>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="space-y-3 rounded-[18px] border border-[#ece7df] bg-white p-4 shadow-sm"
      >
        <TextInput
          label="Name *"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          required
        />

        <PhoneInput
          label="Mobile Number *"
          value={form.mobile}
          onChange={(e) =>
            setForm({
              ...form,
              mobile: e.target.value,
            })
          }
          required
        />

        <PhoneInput
          label="WhatsApp Number"
          value={form.whatsapp}
          onChange={(e) =>
            setForm({
              ...form,
              whatsapp: e.target.value,
            })
          }
        />

        <SelectInput
          label="Category *"
          value={form.categoryId}
          onChange={(e) =>
            setForm({
              ...form,
              categoryId: e.target.value,
              serviceTypeId: '',
            })
          }
          required
        >
          <option value="">Select category</option>

          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_en}
            </option>
          ))}
        </SelectInput>

        <SelectInput
          label="Service Type *"
          value={form.serviceTypeId}
          onChange={(e) =>
            setForm({
              ...form,
              serviceTypeId: e.target.value,
            })
          }
          required
        >
          <option value="">Select service type</option>

          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name_en}
            </option>
          ))}
        </SelectInput>

        <TextInput
          label="Area *"
          value={form.area}
          onChange={(e) =>
            setForm({
              ...form,
              area: e.target.value,
            })
          }
          placeholder="e.g. Zadeshwar"
          required
        />

        <TextArea
          label="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          rows={3}
          placeholder="Short description (optional)"
        />

        {/* Photo Upload */}
      {/* Photo Upload */}
<div>
  <div className="mb-1 text-[11px] font-semibold text-[#333943]">
    Photo (optional)
  </div>

  {/* Mobile camera - opens back camera where supported */}
  <input
    ref={cameraInputRef}
    type="file"
    accept="image/*"
    capture="environment"
    onChange={handlePhotoChange}
    className="hidden"
  />

  {/* Gallery / existing photo */}
  <input
    ref={galleryInputRef}
    type="file"
    accept="image/*"
    onChange={handlePhotoChange}
    className="hidden"
  />

  {!photoPreview ? (
    <div className="grid grid-cols-2 gap-2">
      {/* Take Photo */}
      <button
        type="button"
        onClick={() => cameraInputRef.current?.click()}
        className="flex h-20 items-center justify-center rounded-xl border border-dashed border-[#ccd5dd] bg-[#fafbfc] text-[#4f91c7]"
      >
        <div className="text-center">
          <Camera size={22} className="mx-auto" />

          <div className="mt-1 text-[10px] font-semibold">
            Take Photo
          </div>

          <div className="mt-0.5 text-[9px] text-[#8a949e]">
            Use camera
          </div>
        </div>
      </button>

      {/* Choose Photo */}
      <button
        type="button"
        onClick={() => galleryInputRef.current?.click()}
        className="flex h-20 items-center justify-center rounded-xl border border-dashed border-[#ccd5dd] bg-[#fafbfc] text-[#4f91c7]"
      >
        <div className="text-center">
          <ImageIcon size={22} className="mx-auto" />

          <div className="mt-1 text-[10px] font-semibold">
            Choose Photo
          </div>

          <div className="mt-0.5 text-[9px] text-[#8a949e]">
            From gallery
          </div>
        </div>
      </button>
    </div>
  ) : (
    <div className="rounded-xl border border-[#e1e5e9] bg-[#fafbfc] p-3">
      <div className="flex items-center gap-3">
        <img
          src={photoPreview}
          alt="Helper preview"
          className="h-16 w-16 shrink-0 rounded-full object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-[#333943]">
            Photo selected
          </div>

          <div className="mt-1 text-[9px] text-[#8a949e]">
            Ready to upload
          </div>
        </div>

        <button
          type="button"
          onClick={removePhoto}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#777] shadow-sm"
          aria-label="Remove photo"
        >
          <X size={16} />
        </button>
      </div>

      {/* Change photo options */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#dfe5e9] bg-white text-[10px] font-semibold text-[#4f91c7]"
        >
          <Camera size={14} />
          Take Again
        </button>

        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#dfe5e9] bg-white text-[10px] font-semibold text-[#4f91c7]"
        >
          <ImageIcon size={14} />
          Choose Another
        </button>
      </div>
    </div>
  )}

 <div className="mt-2 rounded-lg bg-[#f7f9fb] px-3 py-2">
  <p className="text-[9px] leading-4 text-[#7b858f]">
    Photo is optional. Maximum size 5 MB.
  </p>

 <p className="mt-1 text-[9px] leading-4 text-[#7b858f]">
  📷 Camera permission પૂછે તો <b>Allow</b> કરો. Camera ન ખૂલે તો
  <b> Choose Photo</b> નો ઉપયોગ કરો.
</p>
</div>
</div>

        <TextInput
          label="Your Name (optional)"
          value={form.submittedName}
          onChange={(e) =>
            setForm({
              ...form,
              submittedName: e.target.value,
            })
          }
        />

        <ErrorMessage message={error} />

        <Button
          type="submit"
          className="w-full"
          disabled={submitting}
        >
          {submitting
            ? photoFile
              ? 'Uploading & Saving...'
              : 'Saving...'
            : 'Submit Helper'}
        </Button>
      </form>
    </div>
  )
}