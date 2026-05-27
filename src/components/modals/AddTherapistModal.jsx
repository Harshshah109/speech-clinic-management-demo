import { useState } from 'react'

import {
  X,
  Plus,
  Save
} from 'lucide-react'

import {
  addTherapist,
  updateTherapist
} from '../../services/therapistService'

export default function AddTherapistModal({
  close,
  refresh,
  editData,
  isEdit
}) {

  const [form, setForm] = useState({

    firstName:
      editData?.name?.split(' ')[0] || '',

    lastName:
      editData?.name?.split(' ').slice(1).join(' ') || '',

    phone:
      editData?.phone || '',

    email:
      editData?.email || '',

    role:
      editData?.role || '',

    experience:
      editData?.experience || '',

    qualification:
      editData?.qualification || '',

    specialization: '',

    availability:
      editData?.availability || [],

    startTime:
      editData?.startTime || '09:00',

    endTime:
      editData?.endTime || '17:00',

    sessionsPerDay:
      editData?.sessionsPerDay || '6',

    status:
      editData?.status || 'Active',

    notes:
      editData?.notes || ''
  })

  const [specializations,
    setSpecializations] =
      useState(

        editData?.specialization
          ? editData.specialization.split(', ')
          : []
      )

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    })
  }

  const addSpecialization = () => {

    if (!form.specialization)
      return

    if (
      specializations.includes(
        form.specialization
      )
    ) return

    setSpecializations([
      ...specializations,
      form.specialization
    ])

    setForm({
      ...form,
      specialization: ''
    })
  }

  const removeSpecialization =
    (item) => {

      setSpecializations(

        specializations.filter(
          (spec) =>
            spec !== item
        )
      )
    }

  const handleSubmit =
    async (e) => {

      e.preventDefault()

      const therapistData = {

        name:
          `${form.firstName} ${form.lastName}`,

        phone:
          form.phone,

        email:
          form.email,

        role:
          form.role,

        experience:
          form.experience,

        qualification:
          form.qualification,

        specialization:
          specializations.join(', '),

        availability:
          form.availability,

        startTime:
          form.startTime,

        endTime:
          form.endTime,

        sessionsPerDay:
          form.sessionsPerDay,

        status:
          form.status,

        notes:
          form.notes
      }

      try {

        if (isEdit) {

          await updateTherapist(
            editData.id,
            therapistData
          )

        } else {

          await addTherapist({
            ...therapistData,
            createdAt:
              new Date()
          })
        }

        refresh()

        close()

      } catch (err) {

        console.log(err)

        alert(
          err.message ||
          'Error saving therapist'
        )
      }
    }

  return (
    <div className="
      fixed
      inset-0
      z-50
      bg-black/40
      backdrop-blur-md
      flex
      items-start
      justify-center
      p-3
      pt-10
      overflow-y-auto
    ">

      <div className="
        w-full
        max-w-3xl
        max-h-[92vh]
        overflow-y-auto
        bg-white/90
        border
        border-[#ece7ff]
        rounded-[32px]
        p-6
        md:p-7
        relative
        backdrop-blur-xl
        shadow-[0_10px_40px_rgba(124,58,237,0.12)]
      ">

        {/* CLOSE */}
        <button
          onClick={close}
          className="
            absolute
            top-5
            right-5
            w-11
            h-11
            rounded-2xl
            border
            border-[#ece7ff]
            flex
            items-center
            justify-center
            hover:bg-[#f5f3ff]
            transition-all
            text-[#1f1147]
          "
        >
          <X size={18} />
        </button>

        {/* TITLE */}
        <h2 className="
          text-4xl
          font-bold
          mb-8
          text-[#1f1147]
        ">

          {isEdit
            ? 'Edit Therapist'
            : 'Add New Therapist'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          {/* PERSONAL INFO */}
          <div>

            <h3 className="
              text-xs
              tracking-[0.2em]
              text-blue-500
              font-bold
              mb-5
            ">
              PERSONAL INFO
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* FIRST NAME */}
              <div>

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-medium
                  mb-2
                  block
                ">
                  First Name *
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="
                    w-full
                    h-14
                    bg-white/80
                    border
                    border-[#ece7ff]
                    rounded-2xl
                    px-5
                    outline-none
                    text-[#1f1147]
                  "
                  required
                />
              </div>

              {/* LAST NAME */}
              <div>

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-medium
                  mb-2
                  block
                ">
                  Last Name *
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="
                    w-full
                    h-14
                    bg-white/80
                    border
                    border-[#ece7ff]
                    rounded-2xl
                    px-5
                    outline-none
                    text-[#1f1147]
                  "
                  required
                />
              </div>

              {/* PHONE */}
              <div>

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-medium
                  mb-2
                  block
                ">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="
                    w-full
                    h-14
                    bg-white/80
                    border
                    border-[#ece7ff]
                    rounded-2xl
                    px-5
                    outline-none
                    text-[#1f1147]
                  "
                />
              </div>

              {/* EMAIL */}
              <div>

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-medium
                  mb-2
                  block
                ">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="
                    w-full
                    h-14
                    bg-white/80
                    border
                    border-[#ece7ff]
                    rounded-2xl
                    px-5
                    outline-none
                    text-[#1f1147]
                  "
                />
              </div>

              {/* ROLE */}
              <div>

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-medium
                  mb-2
                  block
                ">
                  Role / Title
                </label>

                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="
                    w-full
                    h-14
                    bg-white/80
                    border
                    border-[#ece7ff]
                    rounded-2xl
                    px-5
                    outline-none
                    text-[#1f1147]
                  "
                />
              </div>

              {/* EXPERIENCE */}
              <div>

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-medium
                  mb-2
                  block
                ">
                  Experience (Years)
                </label>

                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="
                    w-full
                    h-14
                    bg-white/80
                    border
                    border-[#ece7ff]
                    rounded-2xl
                    px-5
                    outline-none
                    text-[#1f1147]
                  "
                />
              </div>
            </div>

            {/* QUALIFICATION */}
            <div className="mt-4">

              <label className="
                text-sm
                text-[#7c6ca8]
                font-medium
                mb-2
                block
              ">
                Qualification
              </label>

              <input
                type="text"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                className="
                  w-full
                  h-14
                  bg-white/80
                  border
                  border-[#ece7ff]
                  rounded-2xl
                  px-5
                  outline-none
                  text-[#1f1147]
                "
              />
            </div>
          </div>

          {/* SPECIALIZATIONS */}
          <div>

            <h3 className="
              text-xs
              tracking-[0.2em]
              text-blue-500
              font-bold
              mb-5
            ">
              SPECIALIZATIONS
            </h3>

            <div className="flex gap-3">

              <select
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                className="
                  flex-1
                  h-14
                  bg-white/80
                  border
                  border-[#ece7ff]
                  rounded-2xl
                  px-5
                  outline-none
                  text-[#1f1147]
                "
              >

                <option value="">
                  — Add specialization —
                </option>

                <option>
                  Articulation Disorder
                </option>

                <option>
                  Voice Therapy
                </option>

                <option>
                  Speech Therapy
                </option>

                <option>
                  Stuttering Therapy
                </option>

                <option>
                  Language Development
                </option>
              </select>

              <button
                type="button"
                onClick={addSpecialization}
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-500
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  shadow-blue-500/20
                "
              >
                <Plus size={18} />
              </button>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mt-4">

              {specializations.map((item, index) => (

                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    removeSpecialization(item)
                  }
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-gradient-to-r
                    from-blue-500
                    to-cyan-500
                    text-white
                    text-sm
                    font-semibold
                    shadow-lg
                    shadow-blue-500/20
                  "
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* STATUS */}
          <div>

            <h3 className="
              text-xs
              tracking-[0.2em]
              text-blue-500
              font-bold
              mb-5
            ">
              STATUS
            </h3>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="
                w-full
                h-14
                bg-white/80
                border
                border-[#ece7ff]
                rounded-2xl
                px-5
                outline-none
                text-[#1f1147]
              "
            >

              <option>
                Active
              </option>

              <option>
                On Leave
              </option>

              <option>
                Inactive
              </option>
            </select>
          </div>

          {/* NOTES */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Notes
            </label>

            <textarea
              name="notes"
              rows="4"
              value={form.notes}
              onChange={handleChange}
              placeholder="Additional therapist notes..."
              className="
                w-full
                bg-white/80
                border
                border-[#ece7ff]
                rounded-2xl
                p-5
                outline-none
                resize-none
                text-[#1f1147]
                placeholder:text-[#8c84b3]
              "
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col md:flex-row gap-3 pt-2">

            <button
              type="submit"
              className="
                flex
                items-center
                justify-center
                gap-2
                px-6
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                text-white
                font-bold
                hover:opacity-90
                transition-all
                shadow-lg
                shadow-blue-500/20
              "
            >

              <Save size={16} />

              {isEdit
                ? 'Save Changes'
                : 'Create Therapist'}
            </button>

            <button
              type="button"
              onClick={close}
              className="
                px-6
                h-14
                rounded-2xl
                border
                border-[#ece7ff]
                bg-white/80
                hover:bg-[#f5f3ff]
                transition-all
                text-[#1f1147]
                font-semibold
              "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}