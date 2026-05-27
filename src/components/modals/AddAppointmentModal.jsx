import {
  useEffect,
  useState
} from 'react'

import {
  X,
  Check
} from 'lucide-react'

import {
  addAppointment,
  updateAppointment
} from '../../services/appointmentService'

import {
  getPatients
} from '../../services/patientService'

import {
  getTherapists
} from '../../services/therapistService'

import Select from 'react-select'

export default function AddAppointmentModal({
  close,
  refresh,
  editData,
  isEdit
}) {

  const [patients,
    setPatients] =
      useState([])

  const [therapists,
    setTherapists] =
      useState([])

  const [form, setForm] =
    useState({

      patient:
        editData?.patient || '',

      patientPhone:
        editData?.patientPhone || '',

      date:
        editData?.date || '',

      time:
        editData?.time || '09:00 AM',

      therapist:
        editData?.therapist || '',

      therapy:
  editData?.therapy || 'Speech Therapy',

      duration:
        editData?.duration || '30 min',

      status:
        editData?.status || 'Pending'
    })

  useEffect(() => {

    loadPatients()

    loadTherapists()

  }, [])

  const loadPatients =
    async () => {

      const data =
        await getPatients()

      setPatients(data || [])
    }

  const loadTherapists =
    async () => {

      const data =
        await getTherapists()

      setTherapists(data || [])
    }

  const handleChange = (e) => {

    const updatedForm = {

      ...form,
      [e.target.name]:
        e.target.value
    }

    if (
      e.target.name === 'patient'
    ) {

      const selectedPatient =
        patients.find(
          (p) =>
            p.name === e.target.value
        )

      updatedForm.patientPhone =
        selectedPatient?.phone || ''
    }

    setForm(updatedForm)
  }

  const handleSubmit =
    async (e) => {

      e.preventDefault()

      try {

        const selectedPatient =
          patients.find(
            (p) =>
              p.name === form.patient
          )

        const appointmentData = {

          ...form,

          patientPhone:
            selectedPatient?.phone || ''
        }

        if (isEdit) {

          await updateAppointment(
            editData.id,
            appointmentData
          )

        } else {

          await addAppointment({

            ...appointmentData,

            createdAt:
              new Date()
          })
        }

        refresh()

        close()

      } catch (err) {

        console.log(err)

        alert(
          'Error saving appointment'
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
          max-w-2xl
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

          {isEdit
            ? 'Edit Appointment'
            : 'New Appointment'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* PATIENT */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Patient
            </label>

            <Select
              options={patients.map((patient) => ({
                value: patient.name,
                label: patient.name
              }))}

              value={
                form.patient
                  ? {
                      value: form.patient,
                      label: form.patient
                    }
                  : null
              }

              onChange={(selected) => {

                const selectedPatient =
                  patients.find(
                    (p) =>
                      p.name === selected.value
                  )

                setForm({
                  ...form,

                  patient:
                    selected.value,

                  patientPhone:
                    selectedPatient?.phone || ''
                })
              }}

              placeholder="Search patient..."

              styles={{

                control: (base) => ({
                  ...base,
                  backgroundColor: '#faf8ff',
                  borderColor: '#ece7ff',
                  minHeight: 56,
                  borderRadius: 18,
                  boxShadow: 'none',
                  paddingLeft: 6
                }),

                menu: (base) => ({
                  ...base,
                  backgroundColor: '#ffffff',
                  border: '1px solid #ece7ff',
                  borderRadius: 18,
                  overflow: 'hidden'
                }),

                singleValue: (base) => ({
                  ...base,
                  color: '#1f1147'
                }),

                input: (base) => ({
                  ...base,
                  color: '#1f1147'
                }),

                option: (
                  base,
                  state
                ) => ({
                  ...base,
                  backgroundColor:
                    state.isFocused
                      ? '#f5f3ff'
                      : '#fff',

                  color: '#1f1147',
                  cursor: 'pointer'
                }),

                placeholder: (base) => ({
                  ...base,
                  color: '#8c84b3'
                })
              }}
            />
          </div>

          {/* DATE + TIME */}
          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          ">

            <div>

              <label className="
                text-sm
                text-[#7c6ca8]
                font-medium
                mb-2
                block
              ">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                style={{
                  colorScheme: 'light'
                }}
                className="
                  w-full
                  h-14
                  bg-[#faf8ff]
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

            <div>

              <label className="
                text-sm
                text-[#7c6ca8]
                font-medium
                mb-2
                block
              ">
                Time
              </label>

              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                className="
                  w-full
                  h-14
                  bg-[#faf8ff]
                  border
                  border-[#ece7ff]
                  rounded-2xl
                  px-5
                  outline-none
                  text-[#1f1147]
                "
              >

                {Array.from({ length: 49 }, (_, index) => {

                  const totalMinutes =
                    9 * 60 + index * 15

                  const hours =
                    Math.floor(totalMinutes / 60)

                  const minutes =
                    totalMinutes % 60

                  const formattedHours =
                    hours % 12 === 0
                      ? 12
                      : hours % 12

                  const ampm =
                    hours >= 12
                      ? 'PM'
                      : 'AM'

                  const time =
                    `${formattedHours}:${String(
                      minutes
                    ).padStart(2, '0')} ${ampm}`

                  return (
                    <option
                      key={time}
                      value={time}
                    >
                      {time}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          {/* THERAPIST */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Therapist
            </label>

            <select
              name="therapist"
              value={form.therapist}
              onChange={handleChange}
              className="
                w-full
                h-14
                bg-[#faf8ff]
                border
                border-[#ece7ff]
                rounded-2xl
                px-5
                outline-none
                text-[#1f1147]
              "
            >

              <option value="">
                Select Therapist
              </option>

             {therapists.map((item) => (

  <option
    key={item.id}
    value={item.name}
  >
    {item.name}
  </option>
))}

{/* COMBINED OPTIONS */}

<option value="Nirali / Khushali Thaker">
  Nirali / Khushali Thaker
</option>

<option value="Nirali / Drishi Lashkari">
  Nirali / Drishi Lashkari
</option>
            </select>
          </div>

          {/* SESSION TYPE */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Session Type
            </label>

            <select
  name="therapy"
  value={form.therapy}
  onChange={handleChange}
  className="
    w-full
    h-14
    bg-[#faf8ff]
    border
    border-[#ece7ff]
    rounded-2xl
    px-5
    outline-none
    text-[#1f1147]
  "
>

  <option>
    Speech Therapy
  </option>

  <option>
    Assessment
  </option>

</select>
          </div>

          

          {/* STATUS */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="
                w-full
                h-14
                bg-[#faf8ff]
                border
                border-[#ece7ff]
                rounded-2xl
                px-5
                outline-none
                text-[#1f1147]
              "
            >

              <option>
                Pending
              </option>

              <option>
                Confirmed
              </option>

              <option>
                Cancelled
              </option>
            </select>
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
                shadow-lg
                shadow-blue-500/20
                hover:opacity-90
                transition-all
              "
            >

              <Check size={18} />

              {isEdit
                ? 'Save Changes'
                : 'Book Appointment'}
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