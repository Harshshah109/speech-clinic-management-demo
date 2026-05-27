import {
  Plus,
  MessageSquare,
  Pencil,
  Trash2,
  Search,
  CalendarDays
} from 'lucide-react'

import {
  useEffect,
  useState
} from 'react'

import AddAppointmentModal
  from '../components/modals/AddAppointmentModal'

import {
  getAppointments,
  deleteAppointment
} from '../services/appointmentService'

import {
  getPatients
} from '../services/patientService'

function Appointments({
  role
}) {

  const [appointments, setAppointments] =
    useState([])

  const [patients, setPatients] =
    useState([])

  const [openModal, setOpenModal] =
    useState(false)

  const [selectedAppointment,
    setSelectedAppointment] =
      useState(null)

  const [search, setSearch] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState('All')

  const [selectedDate,
    setSelectedDate] =
      useState('')

  useEffect(() => {

    loadAppointments()

    loadPatients()

  }, [])

  const loadAppointments =
    async () => {

      try {

        const data =
          await getAppointments()

        setAppointments(
          Array.isArray(data)
            ? data
            : []
        )

      } catch {

        setAppointments([])
      }
    }

  const loadPatients =
    async () => {

      const data =
        await getPatients()

      setPatients(data || [])
    }

  const formatDate =
    (dateObj) => {

      return `${dateObj.getFullYear()}-${
        String(
          dateObj.getMonth() + 1
        ).padStart(2, '0')
      }-${
        String(
          dateObj.getDate()
        ).padStart(2, '0')
      }`
    }

  const getSmartMessageDate =
    (appointmentDate) => {

      if (!appointmentDate)
        return 'today'

      const appointmentDateString =
        appointmentDate?.seconds
          ? formatDate(
              new Date(
                appointmentDate.seconds * 1000
              )
            )
          : appointmentDate

      const todayDate =
        new Date()

      const todayString =
        formatDate(todayDate)

      const tomorrowDate =
        new Date()

      tomorrowDate.setDate(
        todayDate.getDate() + 1
      )

      const tomorrowString =
        formatDate(tomorrowDate)

      if (
        appointmentDateString ===
        todayString
      ) {

        return 'today'
      }

      if (
        appointmentDateString ===
        tomorrowString
      ) {

        return 'tomorrow'
      }

      const dateObject =
        appointmentDate?.seconds
          ? new Date(
              appointmentDate.seconds * 1000
            )
          : new Date(appointmentDate)

      return dateObject.toLocaleDateString(
        'en-IN',
        {
          weekday: 'long'
        }
      )
    }

  const today =
    formatDate(new Date())

  const tomorrowDate =
    new Date()

  tomorrowDate.setDate(
    tomorrowDate.getDate() + 1
  )

  const tomorrow =
    formatDate(tomorrowDate)

  const parseTime =
    (timeString) => {

      if (!timeString)
        return 0

      const [time, modifier] =
        timeString.split(' ')

      let [hours, minutes] =
        time.split(':').map(Number)

      if (
        modifier === 'PM' &&
        hours !== 12
      ) {
        hours += 12
      }

      if (
        modifier === 'AM' &&
        hours === 12
      ) {
        hours = 0
      }

      return (
        hours * 60 + minutes
      )
    }

  const getDateFromItem =
    (item) => {

      return item.date?.seconds
        ? (() => {

            const d =
              new Date(
                item.date.seconds * 1000
              )

            return formatDate(d)
          })()
        : item.date
    }

  const filteredAppointments =
    appointments

      .filter((item) => {

        const matchesSearch =
          (
            item.patient ||
            item.patientName ||
            ''
          )

            .toLowerCase()

            .includes(
              search.toLowerCase()
            )

        const matchesStatus =
          statusFilter === 'All'
            ? true
            : item.status === statusFilter

        return (
          matchesSearch &&
          matchesStatus
        )
      })

      .sort((a, b) =>
        parseTime(a.time) -
        parseTime(b.time)
      )

  const todayAppointments =
    filteredAppointments.filter(
      (item) =>
        getDateFromItem(item) === today
    )

  const tomorrowAppointments =
    filteredAppointments.filter(
      (item) =>
        getDateFromItem(item) === tomorrow
    )

  const selectedDateAppointments =
    selectedDate
      ? filteredAppointments.filter(
          (item) =>
            getDateFromItem(item) ===
            selectedDate
        )
      : []

  const AppointmentCard =
    ({ item }) => (

      <div
        className={`
          border
          rounded-3xl
          p-5
          flex
          flex-col
          md:flex-row
          md:items-center
          gap-5
          bg-white/75
          backdrop-blur-xl
          shadow-[0_10px_30px_rgba(124,58,237,0.08)]
          ${
            item.status === 'Cancelled'
              ? 'border-red-200 opacity-60'
              : 'border-[#ece7ff]'
          }
        `}
      >

        <div className="min-w-[120px]">

          <h3 className="text-xl font-bold text-[#1f1147]">
            {item.time}
          </h3>

          <p className="text-sm text-[#8c84b3] mt-1">
            {
              item.date?.seconds
                ? new Date(
                    item.date.seconds * 1000
                  ).toLocaleDateString()
                : item.date
            }
          </p>
        </div>

        <div className="
          w-14
          h-14
          rounded-full
          bg-gradient-to-br
          from-blue-500
          to-cyan-500
          text-white
          flex
          items-center
          justify-center
          font-bold
          uppercase
          shadow-lg
          shadow-blue-500/20
        ">
          {
            (
              item.patient ||
              item.patientName ||
              'PT'
            ).slice(0, 2)
          }
        </div>

        <div className="flex-1">

          <h3 className="text-xl font-bold mb-1 text-[#1f1147]">
            {
              item.patient ||
              item.patientName
            }
          </h3>

          <p className="text-[#7c6ca8]">
            {
              item.therapy ||
              'Speech Therapy'
            } • {
              item.therapist ||
              item.therapistName
            }
          </p>
        </div>

        {item.status === 'Pending'
          ? (

            <button
              onClick={async () => {

                const confirmStatus =
                  window.confirm(
                    'Confirm this appointment?'
                  )

                if (!confirmStatus)
                  return

                const {
                  updateAppointment
                } = await import(
                  '../services/appointmentService'
                )

                await updateAppointment(
                  item.id,
                  {
                    status: 'Confirmed'
                  }
                )

                loadAppointments()
              }}
              className="
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
                bg-amber-100
                text-amber-700
              "
            >
              Confirm Pending
            </button>

          ) : (

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                item.status === 'Confirmed'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {item.status}
            </span>
          )}

        <div className="flex gap-3">

          <button
            onClick={() => {

              const patientName =
                item.patient ||
                item.patientName

              const patientData =
                patients.find(
                  (p) =>
                    p.name === patientName
                )

              const phone =
                patientData?.phone ||
                item.patientPhone ||
                ''

              if (!phone) {

                alert(
                  'Phone not found'
                )

                return
              }

              const cleanPhone =
                phone
                  .replace(/\s+/g, '')
                  .replace('+', '')

              const messageDate =
                getSmartMessageDate(
                  item.date
                )

              const message =
`Hello,

Please confirm your therapy session ${messageDate}.

Time: ${item.time}
`

              window.open(
`https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`,
                '_blank'
              )
            }}
            className="
              w-12
              h-12
              rounded-2xl
              border
              border-emerald-200
              text-emerald-500
              flex
              items-center
              justify-center
              hover:bg-emerald-50
            "
          >
            <MessageSquare size={18} />
          </button>

          {role === 'admin' && (
            <>
              <button
                onClick={() =>
                  setSelectedAppointment(item)
                }
                className="
                  w-12
                  h-12
                  rounded-2xl
                  border
                  border-[#ece7ff]
                  flex
                  items-center
                  justify-center
                  hover:bg-[#f5f3ff]
                "
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={async () => {

                  const confirmDelete =
                    window.confirm(
                      'Delete appointment?'
                    )

                  if (!confirmDelete)
                    return

                  await deleteAppointment(
                    item.id
                  )

                  loadAppointments()
                }}
                className="
                  w-12
                  h-12
                  rounded-2xl
                  border
                  border-red-200
                  text-red-500
                  flex
                  items-center
                  justify-center
                  hover:bg-red-50
                "
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    )

  return (
    <div className="pb-10 text-[#1f1147]">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-5xl font-bold mb-2">
            Appointments
          </h1>

          <p className="text-[#7c6ca8] text-lg">
            Manage daily schedule and bookings
          </p>
        </div>

        {role === 'admin' && (

          <button
            onClick={() =>
              setOpenModal(true)
            }
            className="
              flex
              items-center
              gap-2
              border
              border-[#ece7ff]
              bg-white/75
              rounded-2xl
              px-6
              py-4
              hover:bg-[#f5f3ff]
              font-semibold
            "
          >
            <Plus size={20} />

            New Appointment
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="
          bg-white/75
          border
          border-[#ece7ff]
          rounded-2xl
          px-4
          h-14
          flex
          items-center
          gap-3
        ">

          <Search
            size={18}
            className="text-[#8c84b3]"
          />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              bg-transparent
              outline-none
              w-full
            "
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="
            bg-white/75
            border
            border-[#ece7ff]
            rounded-2xl
            px-4
            h-14
            outline-none
          "
        >
          <option>All</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Cancelled</option>
        </select>

        <div className="relative">

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
            className="
              w-full
              bg-white/75
              border
              border-[#ece7ff]
              rounded-2xl
              px-4
              h-14
              outline-none
              text-[#1f1147]
            "
            style={{
              colorScheme: 'light'
            }}
          />

          <style>
            {`
              input[type="date"]::-webkit-calendar-picker-indicator {
                filter:
                invert(27%)
                sepia(94%)
                saturate(2322%)
                hue-rotate(247deg)
                brightness(93%)
                contrast(95%);
                opacity: 1;
                cursor: pointer;
              }
            `}
          </style>
        </div>
      </div>

      {selectedDate ? (

        <div className="
          bg-white/75
          border
          border-[#ece7ff]
          rounded-3xl
          p-6
        ">

          <div className="flex items-center gap-3 mb-5">

            <CalendarDays size={22} />

            <div>

              <h2 className="text-2xl font-bold">
                {new Date(selectedDate)
                  .toLocaleDateString(
                    'en-IN',
                    {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }
                  )}
              </h2>

              <p className="text-[#7c6ca8] text-sm">
                {selectedDateAppointments.length} appointments
              </p>
            </div>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">

            {selectedDateAppointments.length === 0 && (

              <div className="text-[#8c84b3] text-center py-10">
                No appointments yet
              </div>
            )}

            {selectedDateAppointments.map((item) => (

              <AppointmentCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        </div>

      ) : (

        <>
          <div className="
            bg-white/75
            border
            border-[#ece7ff]
            rounded-3xl
            p-6
            mb-6
          ">

            <div className="flex items-center gap-3 mb-5">

              <CalendarDays size={22} />

              <div>

                <h2 className="text-2xl font-bold">
                  Today's Appointments
                </h2>

                <p className="text-[#7c6ca8] text-sm">
                  {todayAppointments.length} appointments
                </p>
              </div>
            </div>

            <div className="space-y-4 max-h-[750px] overflow-y-auto pr-2">

              {todayAppointments.length === 0 && (

                <div className="text-[#8c84b3] text-center py-10">
                  No appointments today
                </div>
              )}

              {todayAppointments.map((item) => (

                <AppointmentCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </div>

          <div className="
            bg-white/75
            border
            border-[#ece7ff]
            rounded-3xl
            p-6
          ">

            <div className="flex items-center gap-3 mb-5">

              <CalendarDays size={22} />

              <div>

                <h2 className="text-2xl font-bold">
                  Tomorrow's Appointments
                </h2>

                <p className="text-[#7c6ca8] text-sm">
                  {tomorrowAppointments.length} appointments
                </p>
              </div>
            </div>

            <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2">

              {tomorrowAppointments.length === 0 && (

                <div className="text-[#8c84b3] text-center py-10">
                  No appointments tomorrow
                </div>
              )}

              {tomorrowAppointments.map((item) => (

                <AppointmentCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {openModal && (
        <AddAppointmentModal
          close={() =>
            setOpenModal(false)
          }
          refresh={loadAppointments}
        />
      )}

      {selectedAppointment && (
        <AddAppointmentModal
          editData={selectedAppointment}
          isEdit={true}
          close={() =>
            setSelectedAppointment(null)
          }
          refresh={loadAppointments}
        />
      )}
    </div>
  )
}

export default Appointments