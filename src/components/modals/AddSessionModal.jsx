import {
  useEffect,
  useState
} from 'react'

import {
  X,
  ClipboardPen
} from 'lucide-react'

import {
  addSession
} from '../../services/sessionService'

import {
  getTherapists
} from '../../services/therapistService'

export default function AddSessionModal({
  patient,
  close,
  refresh
}) {

  const [therapists, setTherapists] =
    useState([])

  const [form, setForm] =
    useState({
      therapist: '',
      notes: '',
      progress: '',
      nextGoal: '',
      sessionDate: '',
      sessionTime: ''
    })

  useEffect(() => {
    loadTherapists()
  }, [])

  const loadTherapists =
    async () => {

      const data =
        await getTherapists()

      setTherapists(data)
    }

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

      await addSession({

        ...form,

        patient:
          patient.name,

        createdAt:
          new Date()
      })

      refresh()
      close()
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
        max-w-2xl
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

        {/* Close */}
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
            bg-[#faf8ff]
            flex
            items-center
            justify-center
            hover:bg-[#f5f3ff]
            transition-all
          "
        >
          <X
            size={18}
            className="text-[#1f1147]"
          />
        </button>

        {/* Title */}
        <h2 className="
          text-4xl
          font-bold
          mb-2
          text-[#1f1147]
          pr-14
        ">
          Add Session Note
        </h2>

        <p className="
          text-[#7c6ca8]
          mb-8
          text-lg
        ">
          {patient.name}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Therapist */}
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
              required
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
            </select>
          </div>

          {/* Date */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Session Date
            </label>

            <input
              type="date"
              name="sessionDate"
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
              required
            />
          </div>

          {/* Time */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Session Time
            </label>

            <input
              type="time"
              name="sessionTime"
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
              required
            />
          </div>

          {/* Notes */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Session Notes
            </label>

            <textarea
              name="notes"
              rows="5"
              onChange={handleChange}
              placeholder="Describe today's therapy session..."
              className="
                w-full
                bg-[#faf8ff]
                border
                border-[#ece7ff]
                rounded-2xl
                px-5
                py-4
                outline-none
                resize-none
                text-[#1f1147]
              "
              required
            />
          </div>

          {/* Progress */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Progress
            </label>

            <textarea
              name="progress"
              rows="3"
              onChange={handleChange}
              placeholder="Patient showed improvement in..."
              className="
                w-full
                bg-[#faf8ff]
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

          {/* Goal */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Next Goal
            </label>

            <textarea
              name="nextGoal"
              rows="3"
              onChange={handleChange}
              placeholder="Next session focus..."
              className="
                w-full
                bg-[#faf8ff]
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

          {/* Buttons */}
          <div className="
            flex
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
                shadow-lg
                shadow-blue-500/20
                transition-all
              "
            >
              <ClipboardPen size={18} />

              Save Session
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
                text-[#1f1147]
                font-semibold
                hover:bg-[#faf8ff]
                transition-all
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