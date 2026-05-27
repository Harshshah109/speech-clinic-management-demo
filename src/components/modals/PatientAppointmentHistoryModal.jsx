import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  X,
  CalendarDays,
  UserRound,
  Clock3,
  ClipboardList
} from 'lucide-react'

import {
  getAppointments
} from '../../services/appointmentService'

export default function PatientAppointmentHistoryModal({
  patient,
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
          (item) =>
            (
              item.patient ||
              item.patientName
            ) === patient.name
        )

      setAppointments(filtered)
    }

  const getAppointmentDate =
    (item) => {

      if (!item.date)
        return null

      return item.date?.seconds
        ? new Date(
            item.date.seconds * 1000
          )
        : new Date(item.date)
    }

  const formatDate =
    (date) => {

      if (!date)
        return 'N/A'

      return date.toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      )
    }

  const formatTime =
    (item) => {

      if (item.time)
        return item.time

      if (item.appointmentTime)
        return item.appointmentTime

      if (item.startTime)
        return item.startTime

      return 'N/A'
    }

  const filteredAppointments =
    useMemo(() => {

      return appointments.filter(
        (item) => {

          const date =
            getAppointmentDate(item)

          if (!date)
            return false

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

  const sortedAppointments =
    useMemo(() => {

      return [...filteredAppointments]
        .sort((a, b) => {

          const dateA =
            getAppointmentDate(a)

          const dateB =
            getAppointmentDate(b)

          return dateB - dateA
        })

    }, [
      filteredAppointments
    ])

  const groupedData =
    Object.values(

      filteredAppointments.reduce(
        (acc, item) => {

          const therapist =
            item.therapist ||
            item.therapistName ||
            'Unknown'

          if (!acc[therapist]) {

            acc[therapist] = {

              therapist,
              count: 0
            }
          }

          acc[therapist].count += 1

          return acc

        }, {}
      )
    )

  return (

    <div
      id="patient-appointment-history-modal"
      className="
        fixed
        inset-0
        z-[9999]
        px-4
        py-6
        flex
        justify-center
        overflow-y-auto
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
          max-w-7xl
          rounded-[32px]
          border
          border-[#ece7ff]
          bg-white/95
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
            bg-white
            flex
            items-center
            justify-center
            hover:bg-[#faf8ff]
            transition-all
          "
        >

          <X size={18} />
        </button>

        {/* TITLE */}
        <div className="mb-6 pr-12">

          <h2 className="
            text-4xl
            font-bold
            text-[#1f1147]
            mb-2
          ">
            Appointment History
          </h2>

          <p className="
            text-[#7c6ca8]
            text-lg
          ">
            {patient.name}
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
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                    : 'border border-[#ece7ff] text-[#1f1147] bg-white'
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
            flex-wrap
            gap-4
            mb-6
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
                  bg-[#faf8ff]
                  text-[#1f1147]
                  outline-none
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
                bg-[#faf8ff]
                text-[#1f1147]
                outline-none
              "
            >

              {[2024, 2025, 2026, 2027, 2028]
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

        {/* SUMMARY CARDS */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
          mb-6
        ">

          <div className="
            bg-[#faf8ff]
            border
            border-[#ece7ff]
            rounded-3xl
            p-5
          ">

            <div className="
              flex
              items-center
              gap-3
              text-[#7c6ca8]
              mb-2
            ">
              <CalendarDays size={18} />
              Total Appointments
            </div>

            <h3 className="
              text-3xl
              font-bold
              text-[#1f1147]
            ">
              {filteredAppointments.length}
            </h3>
          </div>

          <div className="
            bg-[#faf8ff]
            border
            border-[#ece7ff]
            rounded-3xl
            p-5
          ">

            <div className="
              flex
              items-center
              gap-3
              text-[#7c6ca8]
              mb-2
            ">
              <UserRound size={18} />
              Therapists
            </div>

            <h3 className="
              text-3xl
              font-bold
              text-[#1f1147]
            ">
              {groupedData.length}
            </h3>
          </div>

          <div className="
            bg-[#faf8ff]
            border
            border-[#ece7ff]
            rounded-3xl
            p-5
          ">

            <div className="
              flex
              items-center
              gap-3
              text-[#7c6ca8]
              mb-2
            ">
              <ClipboardList size={18} />
              Current Filter
            </div>

            <h3 className="
              text-2xl
              font-bold
              text-[#1f1147]
              capitalize
            ">
              {filter}
            </h3>
          </div>
        </div>

        {/* THERAPIST COUNT TABLE */}
        <div className="
          overflow-hidden
          rounded-3xl
          border
          border-[#ece7ff]
          mb-7
        ">

          <div className="
            grid
            grid-cols-2
            bg-[#faf8ff]
            border-b
            border-[#ece7ff]
            px-6
            py-4
            font-bold
            text-[#1f1147]
          ">

            <div>
              Therapist Name
            </div>

            <div>
              No. Of Appointments
            </div>
          </div>

          {groupedData.length === 0 && (

            <div className="
              py-12
              text-center
              text-[#7c6ca8]
            ">
              No appointment history found
            </div>
          )}

          {groupedData.map((item) => (

            <div
              key={item.therapist}
              className="
                grid
                grid-cols-2
                px-6
                py-5
                border-b
                border-[#f3efff]
                items-center
              "
            >

              <div className="
                font-semibold
                text-[#1f1147]
              ">
                {item.therapist}
              </div>

              <div>

                <span className="
                  px-4
                  py-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-500
                  text-white
                  font-semibold
                ">
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* DATE WISE HISTORY */}
        <div className="
          rounded-3xl
          border
          border-[#ece7ff]
          overflow-hidden
        ">

          <div className="
            flex
            items-center
            justify-between
            bg-[#faf8ff]
            border-b
            border-[#ece7ff]
            px-6
            py-4
          ">

            <h3 className="
              text-xl
              font-bold
              text-[#1f1147]
            ">
              Date Wise Appointment Details
            </h3>

            <span className="
              text-sm
              text-[#8c84b3]
            ">
              {sortedAppointments.length} records
            </span>
          </div>

          <div className="
            overflow-x-auto
          ">

            <div className="
              min-w-[850px]
            ">

              <div className="
                grid
                grid-cols-5
                bg-white
                border-b
                border-[#ece7ff]
                px-6
                py-4
                font-bold
                text-[#1f1147]
              ">

                <div>
                  Date
                </div>

                <div>
                  Therapist
                </div>

                <div>
                  Session Type
                </div>

                <div>
                  Time
                </div>

                <div>
                  Status
                </div>
              </div>

              <div className={`
                ${
                  sortedAppointments.length > 20
                    ? 'max-h-[520px] overflow-y-auto custom-scrollbar'
                    : ''
                }
              `}>

                {sortedAppointments.length === 0 && (

                  <div className="
                    py-14
                    text-center
                    text-[#7c6ca8]
                  ">
                    No date-wise appointments found
                  </div>
                )}

                {sortedAppointments.map((item, index) => {

                  const date =
                    getAppointmentDate(item)

                  return (

                    <div
                      key={item.id || index}
                      className="
                        grid
                        grid-cols-5
                        px-6
                        py-4
                        border-b
                        border-[#f3efff]
                        items-center
                        text-[#433878]
                      "
                    >

                      <div className="
                        font-semibold
                        text-[#1f1147]
                      ">
                        {formatDate(date)}
                      </div>

                      <div>
                        {
                          item.therapist ||
                          item.therapistName ||
                          'Unknown'
                        }
                      </div>

                      <div>
                        {
                          item.sessionType ||
                          item.type ||
                          'Speech Therapy'
                        }
                      </div>

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">
                        <Clock3 size={15} />
                        {formatTime(item)}
                      </div>

                      <div>

                        <span className={`
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-semibold
                          ${
                            item.status === 'Cancelled'
                              ? 'bg-red-100 text-red-700'
                              : item.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-violet-100 text-violet-700'
                          }
                        `}>
                          {item.status || 'Scheduled'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}