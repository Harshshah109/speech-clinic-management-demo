import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  X,
  CalendarDays
} from 'lucide-react'

import {
  getAppointments
} from '../../services/appointmentService'

export default function TherapistAppointmentAnalyticsModal({
  therapist,
  close
}) {

  const [appointments,
    setAppointments] =
      useState([])

  const [filter,
    setFilter] =
      useState('monthly')

  const [selectedMonth,
    setSelectedMonth] =
      useState(
        new Date().getMonth()
      )

  const [selectedYear,
    setSelectedYear] =
      useState(
        new Date().getFullYear()
      )

  useEffect(() => {

    loadAppointments()

  }, [])

  const loadAppointments =
    async () => {

      const data =
        await getAppointments()

      const filtered =
  (data || []).filter(
    (item) => {

      const appointmentTherapist =
        item.therapist || ''

      const therapistName =
        therapist.name || ''

      /* DIRECT MATCH */

      if (
        appointmentTherapist ===
        therapistName
      ) {
        return true
      }

      /* COMBINED THERAPIST */

      if (
        appointmentTherapist.includes('/')
      ) {

        const splitNames =
          appointmentTherapist
            .split('/')
            .map((name) =>
              name.trim()
            )

        return splitNames.some(
  (name) => {

    const cleanedSplit =
      name
        .trim()
        .toLowerCase()

    const cleanedTherapist =
      therapistName
        .trim()
        .toLowerCase()

    return (
      cleanedTherapist.includes(
        cleanedSplit
      ) ||

      cleanedSplit.includes(
        cleanedTherapist
      )
    )
  }
)
      }

      return false
    }
  )

      setAppointments(filtered)
    }

  const filteredAppointments =
    useMemo(() => {

      return appointments.filter(
        (item) => {

          if (!item.date)
            return false

          const date =
            item.date?.seconds
              ? new Date(
                  item.date.seconds * 1000
                )
              : new Date(item.date)

          const now =
            new Date()

          if (
            filter === 'weekly'
          ) {

            const diff =
              (now - date) /
              (1000 * 60 * 60 * 24)

            return diff <= 7
          }

          if (
            filter === 'monthly'
          ) {

            return (
              date.getMonth() ===
                Number(selectedMonth) &&
              date.getFullYear() ===
                Number(selectedYear)
            )
          }

          if (
            filter === 'yearly'
          ) {

            return (
              date.getFullYear() ===
              Number(selectedYear)
            )
          }

          return true
        }
      )

    }, [
      appointments,
      filter,
      selectedMonth,
      selectedYear
    ])

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

      <div
        className="
          relative
          w-full
          max-w-3xl
          rounded-[32px]
          border
          border-[#ece7ff]
          bg-white
          p-6
          shadow-2xl
        "
      >

        {/* CLOSE */}
        <button
          onClick={close}
          className="
            absolute
            top-5
            right-5
            w-10
            h-10
            rounded-xl
            border
            border-[#ece7ff]
            flex
            items-center
            justify-center
          "
        >

          <X size={18} />
        </button>

        {/* TITLE */}
        <div className="mb-6">

          <h2 className="
            text-4xl
            font-bold
            text-[#1f1147]
          ">
            Appointment Analytics
          </h2>

          <p className="
            text-[#7c6ca8]
            mt-2
          ">
            {therapist.name}
          </p>
        </div>

        {/* FILTERS */}
        <div className="
          flex
          flex-wrap
          gap-3
          mb-6
        ">

          {[
            'weekly',
            'monthly',
            'yearly'
          ].map((item) => (

            <button
              key={item}
              onClick={() =>
                setFilter(item)
              }
              className={`
                px-5
                h-11
                rounded-2xl
                font-semibold
                capitalize
                transition-all
                ${
                  filter === item
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                    : 'border border-[#ece7ff] text-[#1f1147]'
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>

        {/* MONTH + YEAR */}
        {filter !== 'weekly' && (

          <div className="
            flex
            gap-4
            mb-8
          ">

            {filter === 'monthly' && (

              <select
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value
                  )
                }
                className="
                  h-12
                  px-4
                  rounded-2xl
                  border
                  border-[#ece7ff]
                "
              >

                {[
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December'
                ].map((month, index) => (

                  <option
                    key={month}
                    value={index}
                  >
                    {month}
                  </option>
                ))}
              </select>
            )}

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(
                  e.target.value
                )
              }
              className="
                h-12
                px-4
                rounded-2xl
                border
                border-[#ece7ff]
              "
            >

              {[2024, 2025, 2026, 2027]
                .map((year) => (

                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* TOTAL */}
        <div className="
          rounded-3xl
          border
          border-[#ece7ff]
          p-7
          bg-[#faf8ff]
        ">

          <div className="
            flex
            items-center
            gap-4
          ">

            <div className="
              w-16
              h-16
              rounded-3xl
              bg-gradient-to-br
              from-blue-600
              to-cyan-500
              text-white
              flex
              items-center
              justify-center
            ">

              <CalendarDays size={28} />
            </div>

            <div>

              <p className="
                text-[#7c6ca8]
                text-sm
                mb-1
              ">
                Total Appointments
              </p>

              <h3 className="
                text-5xl
                font-black
                text-[#1f1147]
              ">
                {
                  filteredAppointments.length
                }
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}