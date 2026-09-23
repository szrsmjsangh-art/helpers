import { useEffect, useRef, useState } from 'react'
import {
  Users,
  Camera,
  Image as ImageIcon,
  ShieldCheck,
  X,
  Trash2,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react'

import TextInput from '../components/common/TextInput'
import PhoneInput from '../components/common/PhoneInput'
import TextArea from '../components/common/TextArea'
import SelectInput from '../components/common/SelectInput'
import Button from '../components/common/Button'
import ErrorMessage from '../components/common/ErrorMessage'
import AddHelpersSuccess from '../components/add-helper/AddHelpersSuccess'
import ContactPicker from '../components/add-helper/ContactPicker'

import {
  getCategories,
  getServiceTypes,
  getAllServiceTypes,
} from '../services/categoryService'

import { submitHelper } from '../services/submissionService'
import { uploadImage } from '../services/cloudinaryService'
import { suggestHelperService } from '../utils/helperCategoryMatcher'

const blank = {
  name: '',
  mobile: '',
  whatsapp: '',
  categoryId: '',
  serviceTypeId: '',
  area: ' ',
  description: '',
  submittedName: '',
  photoUrl: '',
}

function getContactName(contact) {
  if (Array.isArray(contact?.name)) {
    return contact.name[0] || ''
  }

  return contact?.name || ''
}

function getContactPhone(contact) {
  if (Array.isArray(contact?.tel)) {
    return contact.tel[0] || ''
  }

  return contact?.tel || ''
}

function cleanPhone(value = '') {
  let digits = String(value).replace(/\D/g, '')

  // +91XXXXXXXXXX / 91XXXXXXXXXX
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2)
  }

  // 0XXXXXXXXXX
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1)
  }

  // Safety: if extra prefix exists, keep last 10 digits
  if (digits.length > 10) {
    digits = digits.slice(-10)
  }

  return digits
}

export default function AddHelperPage() {
  const [categories, setCategories] = useState([])
  const [types, setTypes] = useState([])
  const [allServiceTypes, setAllServiceTypes] = useState([])

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(blank)

  // Photo
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)

  // Multiple contact import
  const [importedContacts, setImportedContacts] = useState([])
  const [importError, setImportError] = useState('')
  const [savingContacts, setSavingContacts] = useState(false)
  const [importSuccessCount, setImportSuccessCount] = useState(0)

  // Load categories + all service types
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoryData, serviceTypeData] = await Promise.all([
          getCategories(),
          getAllServiceTypes(),
        ])

        setCategories(categoryData || [])
        setAllServiceTypes(serviceTypeData || [])
      } catch (err) {
        setError(err?.message || 'Unable to load categories.')
      }
    }

    loadInitialData()
  }, [])

  // Manual form service types
  useEffect(() => {
    if (!form.categoryId) {
      setTypes([])
      return
    }

    getServiceTypes(form.categoryId)
      .then((data) => {
        setTypes(data || [])
      })
      .catch((err) => {
        setError(err?.message || 'Unable to load service types.')
      })
  }, [form.categoryId])

  // Clean preview URL
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

  // -----------------------------
  // PHOTO
  // -----------------------------

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

  // -----------------------------
  // MANUAL SUBMIT
  // -----------------------------

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
    } catch (err) {
      setError(err?.message || 'Unable to submit helper.')
    } finally {
      setSubmitting(false)
    }
  }

  // -----------------------------
  // CONTACT IMPORT
  // -----------------------------

  const picked = (contacts) => {
    if (!contacts?.length) return

    setImportError('')
    setImportSuccessCount(0)

    const preparedContacts = contacts
      .map((contact, index) => {
        const name = getContactName(contact).trim()
        const mobile = cleanPhone(getContactPhone(contact))

        const suggestion = suggestHelperService(
          name,
          allServiceTypes
        )

        return {
  localId: `${Date.now()}-${index}`,
  name,
  mobile,

  categoryId: suggestion?.categoryId || '',
  serviceTypeId: suggestion?.serviceTypeId || '',

  suggested: Boolean(suggestion),
}
      })
      .filter((contact) => contact.name || contact.mobile)

    if (!preparedContacts.length) {
      setImportError('No usable contacts were selected.')
      return
    }

    setImportedContacts(preparedContacts)
  }

  const updateImportedContact = (localId, field, value) => {
    setImportedContacts((current) =>
      current.map((contact) => {
        if (contact.localId !== localId) {
          return contact
        }

        // If category changes, reset service type.
        if (field === 'categoryId') {
          return {
            ...contact,
            categoryId: value,
            serviceTypeId: '',
            suggested: false,
          }
        }

        if (field === 'serviceTypeId') {
          return {
            ...contact,
            serviceTypeId: value,
            suggested: false,
          }
        }

        return {
          ...contact,
          [field]: value,
        }
      })
    )
  }

  const removeImportedContact = (localId) => {
    setImportedContacts((current) =>
      current.filter(
        (contact) => contact.localId !== localId
      )
    )
  }

  const clearImportedContacts = () => {
    setImportedContacts([])
    setImportError('')
    setImportSuccessCount(0)
  }

  const getTypesForCategory = (categoryId) => {
    if (!categoryId) return []

    return allServiceTypes.filter(
      (type) => type.category_id === categoryId
    )
  }

  const getCategoryName = (categoryId) => {
    return (
      categories.find(
        (category) => category.id === categoryId
      )?.name_en || ''
    )
  }

  const getServiceTypeName = (serviceTypeId) => {
    return (
      allServiceTypes.find(
        (type) => type.id === serviceTypeId
      )?.name_en || ''
    )
  }

  // Apply one area to every selected contact
  const applyAreaToAll = (area) => {
    setImportedContacts((current) =>
      current.map((contact) => ({
        ...contact,
        area,
      }))
    )
  }

  const submitImportedContacts = async () => {
    if (!importedContacts.length || savingContacts) {
      return
    }

    setImportError('')
    setImportSuccessCount(0)

const invalidContact = importedContacts.find(
  (contact) =>
    !contact.name.trim() ||
    !/^[6-9]\d{9}$/.test(contact.mobile) ||
    !contact.categoryId ||
    !contact.serviceTypeId
)
   if (invalidContact) {
  setImportError(
    'Please complete Name, valid 10-digit Mobile Number, Category and Service Type for every contact.'
  )
  return
}

    setSavingContacts(true)

    let savedCount = 0

    try {
      for (const contact of importedContacts) {
        await submitHelper({
  name: contact.name.trim(),
  mobile: contact.mobile,
  whatsapp: null,
  categoryId: contact.categoryId,
  serviceTypeId: contact.serviceTypeId,
  area: null,
  description: null,
  submittedName: null,
  photoUrl: null,
})

        savedCount += 1
        setImportSuccessCount(savedCount)
      }

      setImportedContacts([])
      setImportSuccessCount(savedCount)
    } catch (err) {
      setImportError(
        `${savedCount} helper(s) saved. ${
          err?.message || 'Unable to save remaining helpers.'
        }`
      )
    } finally {
      setSavingContacts(false)
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

      {/* MULTIPLE CONTACT REVIEW */}
      {importedContacts.length > 0 && (
        <div className="mt-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-black text-[#19212d]">
                Review Selected Contacts
              </h2>

              <p className="mt-1 text-[10px] text-[#777d84]">
                Check the suggested service before saving.
              </p>
            </div>

            <button
              type="button"
              onClick={clearImportedContacts}
              disabled={savingContacts}
              className="shrink-0 text-[10px] font-bold text-[#d04a42] disabled:opacity-50"
            >
              Clear All
            </button>
          </div>

          {/* COMMON AREA */}
         

          <div className="space-y-3">
            {importedContacts.map((contact, index) => {
              const availableTypes =
                getTypesForCategory(contact.categoryId)

              const categoryName =
                getCategoryName(contact.categoryId)

              const serviceTypeName =
                getServiceTypeName(contact.serviceTypeId)

              return (
                <div
                  key={contact.localId}
                  className="rounded-[16px] border border-[#e8e3dc] bg-white p-3 shadow-sm"
                >
                  <div className="mb-3 flex items-start gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef7f1] text-[11px] font-black text-[#0c9b45]">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-black text-[#19212d]">
                        {contact.name || 'Unnamed Contact'}
                      </div>

                      <div className="mt-0.5 text-[10px] text-[#747c85]">
                        {contact.mobile || 'No mobile number'}
                      </div>

                      {contact.suggested &&
                        categoryName &&
                        serviceTypeName && (
                          <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#eef9f0] px-2 py-1 text-[9px] font-semibold text-[#168443]">
                            <Sparkles size={11} />
                            Suggested: {categoryName} • {serviceTypeName}
                          </div>
                        )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeImportedContact(contact.localId)
                      }
                      disabled={savingContacts}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff3f1] text-[#cf4e45] disabled:opacity-50"
                      aria-label="Remove contact"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <TextInput
                      label="Name *"
                      value={contact.name}
                      onChange={(e) =>
                        updateImportedContact(
                          contact.localId,
                          'name',
                          e.target.value
                        )
                      }
                      required
                    />

                    <PhoneInput
                      label="Mobile Number *"
                      value={contact.mobile}
                      onChange={(e) =>
                        updateImportedContact(
                          contact.localId,
                          'mobile',
                          e.target.value
                        )
                      }
                      required
                    />

                    <PhoneInput
                      label="WhatsApp Number"
                      value={contact.whatsapp}
                      onChange={(e) =>
                        updateImportedContact(
                          contact.localId,
                          'whatsapp',
                          e.target.value
                        )
                      }
                    />

                    <SelectInput
                      label="Category *"
                      value={contact.categoryId}
                      onChange={(e) =>
                        updateImportedContact(
                          contact.localId,
                          'categoryId',
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="">Select category</option>

                      {categories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name_en}
                        </option>
                      ))}
                    </SelectInput>

                    <SelectInput
                      label="Service Type *"
                      value={contact.serviceTypeId}
                      onChange={(e) =>
                        updateImportedContact(
                          contact.localId,
                          'serviceTypeId',
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="">Select service type</option>

                      {availableTypes.map((type) => (
                        <option
                          key={type.id}
                          value={type.id}
                        >
                          {type.name_en}
                        </option>
                      ))}
                    </SelectInput>

                    <TextInput
                      label="Area *"
                      value={contact.area}
                      onChange={(e) =>
                        updateImportedContact(
                          contact.localId,
                          'area',
                          e.target.value
                        )
                      }
                      placeholder="e.g. Zadeshwar"
                      
                    />

                    <TextArea
                      label="Description"
                      value={contact.description}
                      onChange={(e) =>
                        updateImportedContact(
                          contact.localId,
                          'description',
                          e.target.value
                        )
                      }
                      rows={2}
                      placeholder="Short description (optional)"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {importError && (
            <div className="mt-3">
              <ErrorMessage message={importError} />
            </div>
          )}

          {importSuccessCount > 0 && savingContacts && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#eef9f0] px-3 py-2 text-[10px] font-semibold text-[#168443]">
              <CheckCircle2 size={14} />
              {importSuccessCount} helper
              {importSuccessCount !== 1 ? 's' : ''} saved...
            </div>
          )}

          <button
            type="button"
            onClick={submitImportedContacts}
            disabled={savingContacts}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#0c9b45] px-4 py-3.5 text-sm font-bold text-white shadow-[0_5px_14px_rgba(15,150,70,.2)] disabled:bg-[#9ca3a8] disabled:shadow-none"
          >
            {savingContacts ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving Helpers...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Submit All Helpers ({importedContacts.length})
              </>
            )}
          </button>
        </div>
      )}

      {/* MANUAL FORM */}
      {importedContacts.length === 0 && (
        <>
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

            {/* PHOTO UPLOAD */}
            <div>
              <div className="mb-1 text-[11px] font-semibold text-[#333943]">
                Photo (optional)
              </div>

              {/* Back camera */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
                className="hidden"
              />

              {/* Gallery */}
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

              {!photoPreview ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      cameraInputRef.current?.click()
                    }
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

                  <button
                    type="button"
                    onClick={() =>
                      galleryInputRef.current?.click()
                    }
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

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        cameraInputRef.current?.click()
                      }
                      className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#dfe5e9] bg-white text-[10px] font-semibold text-[#4f91c7]"
                    >
                      <Camera size={14} />
                      Take Again
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        galleryInputRef.current?.click()
                      }
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
                  📷 If asked, allow camera permission. If the back camera
                  does not open, use{' '}
                  <span className="font-semibold">
                    Choose Photo
                  </span>{' '}
                  to select or take a photo using your phone.
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
        </>
      )}
    </div>
  )
}