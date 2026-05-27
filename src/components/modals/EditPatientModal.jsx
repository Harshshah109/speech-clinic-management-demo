import { useState } from 'react'

import {
  X,
  Save
} from 'lucide-react'

import {
  updatePatient
} from '../../services/patientService'

export default function EditPatientModal({
  patient,
  close,
  refresh
}) {

  const [form, setForm] =
    useState({

      name:
        patient?.name || '',

      birthDate:
        patient?.birthDate || '',

      gender:
        patient?.gender || '',

      phone:
        patient?.phone || '',

      parentName:
        patient?.parentName || '',

      address:
        patient?.address || '',

      condition:
        [
          'Articulation Disorder',
          'Speech Delay',
          'Autism Spectrum Disorder',
          'Stuttering',
          'Voice Disorder',
          'Language Disorder'
        ].includes(patient?.condition)
          ? patient.condition
          : 'Other',

      otherCondition:
        [
          'Articulation Disorder',
          'Speech Delay',
          'Autism Spectrum Disorder',
          'Stuttering',
          'Voice Disorder',
          'Language Disorder'
        ].includes(patient?.condition)
          ? ''
          : patient?.condition || '',

      category:
        patient?.category || 'Assessment',

      notes:
        patient?.notes || ''
    })

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    })
  }

  const handleSubmit =
    async (e) => {

      e.preventDefault()

      try {

        const today =
          new Date()

        const dob =
          new Date(form.birthDate)

        let age =
          today.getFullYear() -
          dob.getFullYear()

        const monthDiff =
          today.getMonth() -
          dob.getMonth()

        if (
          monthDiff < 0 ||
          (
            monthDiff === 0 &&
            today.getDate() < dob.getDate()
          )
        ) {
          age--
        }

        await updatePatient(
          patient.id,
          {

            name:
              form.name,

            birthDate:
              form.birthDate,

            age:
              age,

            gender:
              form.gender,

            phone:
              form.phone,

            parentName:
              form.parentName,

            address:
              form.address,

            condition:
              form.condition === 'Other'
                ? form.otherCondition
                : form.condition,

            category:
              form.category,

            notes:
              form.notes
          }
        )

        refresh()

        close()

      } catch (err) {

        console.log(err)

        alert(
          'Error updating patient'
        )
      }
    }

  return (

    <div
      className="
        fixed
        inset-0
        z-[9999]
        overflow-y-auto
        px-4
        py-10
        flex
        justify-center
      "
      style={{
        alignItems: 'flex-start',

        background:
          'rgba(15,15,25,0.35)',

        backdropFilter:
          'blur(4px)'
      }}
    >

      <div className="
        relative
        w-full
        max-w-3xl
        max-h-[85vh]
        overflow-y-auto
        custom-scrollbar
        bg-white/90
        border
        border-[#ece7ff]
        rounded-[32px]
        p-6
        md:p-7
        backdrop-blur-xl
        shadow-[0_10px_40px_rgba(124,58,237,0.12)]
        mt-2
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
            bg-white
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
          Edit Patient
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

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

              {/* NAME */}
              <div>

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-medium
                  mb-2
                  block
                ">
                  Patient Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
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

              {/* DOB */}
              <div>

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-medium
                  mb-2
                  block
                ">
                  Birth Date *
                </label>

                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
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
                  style={{
                    colorScheme: 'light'
                  }}
                  required
                />
              </div>

              {/* GENDER */}
              <div>

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-medium
                  mb-2
                  block
                ">
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
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

                  <option value="">
                    Select Gender
                  </option>

                  <option>
                    Male
                  </option>

                  <option>
                    Female
                  </option>

                  <option>
                    Other
                  </option>
                </select>
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
                  Phone Number
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

              {/* PARENT */}
              <div>

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-medium
                  mb-2
                  block
                ">
                  Parent / Guardian Name
                </label>

                <input
                  type="text"
                  name="parentName"
                  value={form.parentName}
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

              {/* CONDITION */}
              <div>

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-medium
                  mb-2
                  block
                ">
                  Condition
                </label>

                <select
                  name="condition"
                  value={form.condition}
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
                    Articulation Disorder
                  </option>

                  <option>
                    Speech Delay
                  </option>

                  <option>
                    Autism Spectrum Disorder
                  </option>

                  <option>
                    Stuttering
                  </option>

                  <option>
                    Voice Disorder
                  </option>

                  <option>
                    Language Disorder
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>
            </div>

            {/* OTHER CONDITION */}
            {form.condition === 'Other' && (

              <div className="mt-4">

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-medium
                  mb-2
                  block
                ">
                  Specify Condition
                </label>

                <input
                  type="text"
                  name="otherCondition"
                  value={form.otherCondition}
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
            )}

            {/* ADDRESS */}
            <div className="mt-4">

              <label className="
                text-sm
                text-[#7c6ca8]
                font-medium
                mb-2
                block
              ">
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="
                  w-full
                  bg-white/80
                  border
                  border-[#ece7ff]
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  resize-none
                  text-[#1f1147]
                "
              />
            </div>

            {/* CATEGORY */}
            <div className="mt-4">

              <label className="
                text-sm
                text-[#7c6ca8]
                font-medium
                mb-2
                block
              ">
                Patient Category
              </label>

              <select
                name="category"
                value={form.category}
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
                  Assessment
                </option>

                <option>
                  Finished
                </option>
              </select>
            </div>

            {/* NOTES */}
            <div className="mt-4">

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
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Additional patient information..."
                className="
                  w-full
                  bg-white/80
                  border
                  border-[#ece7ff]
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  resize-none
                  text-[#1f1147]
                  placeholder:text-[#8c84b3]
                "
              />
            </div>
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

              Save Changes
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