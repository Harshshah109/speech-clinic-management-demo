import {
  useEffect,
  useState
} from 'react'

import Calendar
  from 'react-calendar'

import {
  CalendarDays,
  Clock3,
  UserRound
} from 'lucide-react'

import {
  getAppointments
} from '../services/appointmentService'

export default function CalendarPage() {

  const [date, setDate] =
    useState(new Date())

  const [appointments, setAppointments] =
    useState([])

  useEffect(() => {

    loadAppointments()

  }, [])

  const loadAppointments =
    async () => {

      const data =
        await getAppointments()

      setAppointments(
        data || []
      )
    }

  const selectedDate =
    `${date.getFullYear()}-${
      String(
        date.getMonth() + 1
      ).padStart(2, '0')
    }-${
      String(
        date.getDate()
      ).padStart(2, '0')
    }`

  const filteredAppointments =
    appointments.filter(
      (item) => {

        const appointmentDate =
          item.date?.seconds
            ? (() => {

                const d =
                  new Date(
                    item.date.seconds * 1000
                  )

                return `${d.getFullYear()}-${
                  String(
                    d.getMonth() + 1
                  ).padStart(2, '0')
                }-${
                  String(
                    d.getDate()
                  ).padStart(2, '0')
                }`
              })()
            : item.date

        return (
          appointmentDate ===
          selectedDate
        )
      }
    )

  return (
    <div className="pb-10 text-[#1f1147]">

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-5xl font-bold mb-2">
          Clinic Calendar
        </h1>

        <p className="text-[#7c6ca8] text-lg">
          Manage appointments visually
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">

        {/* Calendar */}
        <div className="
          bg-white/75
          border
          border-[#ece7ff]
          rounded-3xl
          p-6
          h-fit
          backdrop-blur-xl
          shadow-[0_10px_30px_rgba(124,58,237,0.08)]
        ">

          <Calendar
            onChange={setDate}
            value={date}
            className="custom-calendar"
          />
        </div>

        {/* Right Side */}
        <div className="
          bg-white/75
          border
          border-[#ece7ff]
          rounded-3xl
          p-6
          backdrop-blur-xl
          shadow-[0_10px_30px_rgba(124,58,237,0.08)]
        ">

          {/* Selected Date */}
          <div className="flex items-center gap-3 mb-8">

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-br
              from-blue-500
              to-cyan-500
              text-white
              flex
              items-center
              justify-center
              shadow-lg
              shadow-blue-500/20
            ">

              <CalendarDays size={24} />
            </div>

            <div>

              <p className="text-[#7c6ca8] text-sm font-medium">
                Selected Date
              </p>

              <h2 className="text-3xl font-bold">
                {
                  new Date(selectedDate)
                    .toLocaleDateString(
                      'en-IN',
                      {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }
                    )
                }
              </h2>
            </div>
          </div>

          {/* Appointments */}
          <div className="space-y-4 max-h-[850px] overflow-y-auto pr-2 custom-scrollbar">

            {filteredAppointments.length === 0 && (

              <div className="
                bg-[#faf8ff]
                border
                border-[#ece7ff]
                rounded-3xl
                p-10
                text-center
              ">

                <div className="
                  w-20
                  h-20
                  rounded-3xl
                  bg-gradient-to-br
                  from-blue-500
                  to-cyan-500
                  text-white
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-5
                  shadow-lg
                  shadow-blue-500/20
                ">

                  <CalendarDays size={35} />
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  No Appointments
                </h2>

                <p className="text-[#8c84b3]">
                  No appointments scheduled on this date
                </p>
              </div>
            )}

            {filteredAppointments.map((item) => (

              <div
                key={item.id}
                className="
                  bg-[#faf8ff]
                  border
                  border-[#ece7ff]
                  rounded-3xl
                  p-5
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-center
                  gap-5
                  hover:bg-[#f5f3ff]
                  transition-all
                "
              >

                {/* Avatar */}
                <div className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-gradient-to-br
                  from-blue-500
                  to-cyan-500
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold
                  text-lg
                  uppercase
                  shadow-lg
                  shadow-blue-500/20
                ">

                  {(item.patient || 'PT').slice(0, 2)}
                </div>

                {/* Info */}
                <div className="flex-1">

                  <h3 className="text-2xl font-bold mb-2">
                    {item.patient}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-sm text-[#7c6ca8]">

                    <div className="flex items-center gap-2">

                      <Clock3 size={15} />

                      {item.time}
                    </div>

                    <div className="flex items-center gap-2">

                      <UserRound size={15} />

                      {item.therapist}
                    </div>
                  </div>

                  <p className="text-[#8c84b3] mt-3">
                    {item.therapy}
                  </p>
                </div>

                {/* Status */}
                <div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      item.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}