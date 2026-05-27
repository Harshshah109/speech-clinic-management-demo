import { useState } from 'react'

import {
  X,
  Save
} from 'lucide-react'

import {
  addPatient
} from '../../services/patientService'

export default function AddPatientModal({
  close,
  refresh
}) {

  const [form, setForm] =
    useState({

      name: '',
      birthDate: '',
      gender: '',
      phone: '',
      parentName: '',
      address: '',
      condition: '',
      otherCondition: '',
      category: 'Assessment',
      notes: ''
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

        await addPatient({

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
            form.notes,

          createdAt:
            new Date()
        })

        refresh()

        close()

      } catch (err) {

        console.log(err)

        alert(
          'Error adding patient'
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

      {/* MODAL */}
      <div
        className="
          relative
          w-full
          max-w-3xl
          max-h-[85vh]
          overflow-y-auto
          custom-scrollbar
          rounded-[32px]
          border
          border-[#ece7ff]
          bg-white
          p-6
          md:p-7
          shadow-2xl
          mt-2
        "
      >

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
            bg-white
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
          Add New Patient
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          {/* SECTION */}
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

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            ">

              {/* NAME */}
              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-[#7c6ca8]
                  mb-2
                ">
                  Patient Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                  required
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-[#ece7ff]
                    bg-[#faf8ff]
                    px-5
                    text-[#1f1147]
                    outline-none
                  "
                />
              </div>

              {/* DOB */}
              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-[#7c6ca8]
                  mb-2
                ">
                  Birth Date *
                </label>

                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  required
                  style={{
                    colorScheme: 'light'
                  }}
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-[#ece7ff]
                    bg-[#faf8ff]
                    px-5
                    text-[#1f1147]
                    outline-none
                  "
                />
              </div>

              {/* GENDER */}
              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-[#7c6ca8]
                  mb-2
                ">
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  style={{
                    colorScheme: 'light'
                  }}
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-[#ece7ff]
                    bg-[#faf8ff]
                    px-5
                    text-[#1f1147]
                    outline-none
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
                  block
                  text-sm
                  font-medium
                  text-[#7c6ca8]
                  mb-2
                ">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-[#ece7ff]
                    bg-[#faf8ff]
                    px-5
                    text-[#1f1147]
                    outline-none
                  "
                />
              </div>

              {/* PARENT */}
              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-[#7c6ca8]
                  mb-2
                ">
                  Parent / Guardian Name
                </label>

                <input
                  type="text"
                  name="parentName"
                  value={form.parentName}
                  onChange={handleChange}
                  placeholder="Enter parent name"
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-[#ece7ff]
                    bg-[#faf8ff]
                    px-5
                    text-[#1f1147]
                    outline-none
                  "
                />
              </div>

              {/* CONDITION */}
              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-[#7c6ca8]
                  mb-2
                ">
                  Condition
                </label>

                <select
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  style={{
                    colorScheme: 'light'
                  }}
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-[#ece7ff]
                    bg-[#faf8ff]
                    px-5
                    text-[#1f1147]
                    outline-none
                  "
                >

                  <option value="">
                    Select Condition
                  </option>

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
                  block
                  text-sm
                  font-medium
                  text-[#7c6ca8]
                  mb-2
                ">
                  Specify Condition
                </label>

                <input
                  type="text"
                  name="otherCondition"
                  value={form.otherCondition}
                  onChange={handleChange}
                  placeholder="Enter custom condition"
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-[#ece7ff]
                    bg-[#faf8ff]
                    px-5
                    text-[#1f1147]
                    outline-none
                  "
                />
              </div>
            )}

            {/* ADDRESS */}
            <div className="mt-4">

              <label className="
                block
                text-sm
                font-medium
                text-[#7c6ca8]
                mb-2
              ">
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                placeholder="Enter address"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#ece7ff]
                  bg-[#faf8ff]
                  px-5
                  py-4
                  text-[#1f1147]
                  outline-none
                  resize-none
                "
              />
            </div>

            {/* CATEGORY */}
            <div className="mt-4">

              <label className="
                block
                text-sm
                font-medium
                text-[#7c6ca8]
                mb-2
              ">
                Patient Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={{
                  colorScheme: 'light'
                }}
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-[#ece7ff]
                  bg-[#faf8ff]
                  px-5
                  text-[#1f1147]
                  outline-none
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
                block
                text-sm
                font-medium
                text-[#7c6ca8]
                mb-2
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
                  rounded-2xl
                  border
                  border-[#ece7ff]
                  bg-[#faf8ff]
                  px-5
                  py-4
                  text-[#1f1147]
                  outline-none
                  resize-none
                "
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="
            flex
            flex-col
            md:flex-row
            gap-3
            pt-2
          ">

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

              Add Patient
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
                bg-white
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