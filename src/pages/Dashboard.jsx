import { useEffect, useState } from 'react'

import StatsCards
  from '../components/dashboard/StatsCards'

import TeamOverview
  from '../components/dashboard/TeamOverview'

import QuickActions
  from '../components/dashboard/QuickActions'

import {
  CalendarDays
} from 'lucide-react'

import {
  getAppointments
} from '../services/appointmentService'

import {
  getPatients
} from '../services/patientService'

import {
  getTherapists
} from '../services/therapistService'

import {
  getPayments
} from '../services/paymentService'

export default function Dashboard({
  role
}) {

  const [appointments, setAppointments] =
    useState([])

  const [patients, setPatients] =
    useState([])

  const [therapists, setTherapists] =
    useState([])

  const [payments, setPayments] =
    useState([])

  const [filter, setFilter] =
    useState('monthly')

  useEffect(() => {

    loadDashboardData()

  }, [])

  const loadDashboardData =
    async () => {

      const appointmentData =
        await getAppointments()

      const patientData =
        await getPatients()

      const therapistData =
        await getTherapists()

      const paymentData =
        await getPayments()

      setAppointments(
        appointmentData || []
      )

      setPatients(
        patientData || []
      )

      setTherapists(
        therapistData || []
      )

      setPayments(
        paymentData || []
      )
    }

  const greeting = () => {

    const hour =
      new Date().getHours()

    if (hour < 12)
      return 'Good Morning'

    if (hour < 18)
      return 'Good Afternoon'

    return 'Good Evening'
  }

  const isRealPaidPayment =
    (item) => {

      return (
        item.status === 'Paid' &&
        item.method !== 'From Wallet' &&
        item.paymentType !== 'Pending Payment'
      )
    }

  const filterPayments = () => {

    const now =
      new Date()

    return payments.filter(
      (item) => {

        if (
          !isRealPaidPayment(item)
        ) return false

        if (!item.date)
          return false

        const paymentDate =
          item.date?.seconds
            ? new Date(
                item.date.seconds * 1000
              )
            : new Date(item.date)

        if (filter === 'daily') {

          return (
            paymentDate.toDateString() ===
            now.toDateString()
          )
        }

        if (filter === 'weekly') {

          const diff =
            (now - paymentDate) /
            (1000 * 60 * 60 * 24)

          return diff <= 7
        }

        if (filter === 'monthly') {

          return (
            paymentDate.getMonth() ===
              now.getMonth() &&
            paymentDate.getFullYear() ===
              now.getFullYear()
          )
        }

        if (filter === 'yearly') {

          return (
            paymentDate.getFullYear() ===
            now.getFullYear()
          )
        }

        return true
      }
    )
  }

  const filteredPayments =
    filterPayments()

  const totalRevenue =
    filteredPayments

      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      )

  const cashRevenue =
    filteredPayments

      .filter((item) => {

        return (
          item.method === 'Cash'
        )
      })

      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      )

  const digitalRevenue =
    filteredPayments

      .filter((item) => {

        return (
          item.method !== 'Cash'
        )
      })

      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      )

  const pendingRevenue =
    patients.reduce(
      (sum, patient) =>
        sum +
        Number(
          patient.pendingDue || 0
        ),
      0
    )

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

  const todayDate =
    new Date()

  const tomorrowDate =
    new Date()

  tomorrowDate.setDate(
    tomorrowDate.getDate() + 1
  )

  const today =
    formatDate(todayDate)

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

  const getAppointmentsByDate =
    (targetDate) => {

      return (appointments || [])

        .filter(Boolean)

        .filter((item) => {

          const appointmentDate =
            item.date?.seconds
              ? (() => {

                  const d =
                    new Date(
                      item.date.seconds * 1000
                    )

                  return formatDate(d)
                })()
              : item.date

          return (
            appointmentDate ===
            targetDate
          )
        })

        .sort((a, b) =>
          parseTime(a.time) -
          parseTime(b.time)
        )
    }

  const todayAppointments =
    getAppointmentsByDate(today)

  const tomorrowAppointments =
    getAppointmentsByDate(tomorrow)

  const ScheduleCard = ({
    title,
    appointments
  }) => (

    <div className="
      rounded-[32px]
      border
      border-white/70
      bg-white/75
      backdrop-blur-xl
      shadow-[0_10px_30px_rgba(124,58,237,0.08)]
      p-6
    ">

      <div className="flex items-center gap-4 mb-6">

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

          <h2 className="text-2xl font-bold text-[#1f1147]">
            {title}
          </h2>

          <p className="text-[#7c6ca8] text-sm font-medium">
            {appointments.length} appointments
          </p>
        </div>
      </div>

      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">

        {appointments.length === 0 && (

          <div className="
            text-[#8c84b3]
            text-sm
            py-12
            text-center
            bg-[#faf8ff]
            rounded-2xl
            border
            border-[#ece7ff]
          ">

            No appointments
          </div>
        )}

        {appointments.map((item, index) => (

          <div
            key={index}
            className="
              bg-[#faf8ff]
              border
              border-[#ece7ff]
              rounded-3xl
              p-5
              flex
              items-center
              gap-4
            "
          >

            <div className="min-w-[90px]">

              <h3 className="font-bold text-xl text-[#1f1147]">
                {item.time}
              </h3>
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

              <h3 className="font-semibold text-lg text-[#1f1147]">
                {
                  item.patient ||
                  item.patientName
                }
              </h3>

              <p className="text-sm text-[#7c6ca8]">
                {
                  item.therapist ||
                  item.therapistName
                }
              </p>
            </div>

            <span className={`px-4 py-2 rounded-full text-xs font-bold ${
              item.status === 'Confirmed'
                ? 'bg-emerald-100 text-emerald-700'
                : item.status === 'Pending'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="pb-10 text-[#1f1147]">

      {/* GREETING */}
      <div className="mb-8">

       <h1 className="
  text-5xl
  md:text-6xl
  font-black
  leading-[1.15]
  pb-2
  mb-3
  tracking-tight
  bg-gradient-to-r
  from-slate-900
  via-blue-700
  to-cyan-600
  bg-clip-text
  text-transparent
">
  {greeting()}
</h1>

        <p className="
  text-[#7c6ca8]
  text-xl
  font-medium
  tracking-wide
">
          Clinic Management System • {' '}
          {new Date().toDateString()}
        </p>
      </div>

      {/* FILTER */}
      {role === 'admin' && (

        <div className="flex flex-wrap gap-3 mb-6">

          {[
            'daily',
            'weekly',
            'monthly',
            'yearly'
          ].map((item) => (

            <button
              key={item}
              onClick={() =>
                setFilter(item)
              }
              className={`px-5 h-12 rounded-2xl border transition-all capitalize font-semibold ${
                filter === item
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent'
                  : 'border-[#ece7ff] bg-white/70  text-[#2563eb]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* STATS */}
      <StatsCards
        appointments={todayAppointments}
        patients={patients}
        therapists={therapists}
        revenue={
          role === 'admin'
            ? totalRevenue
            : 0
        }
        cashRevenue={
          role === 'admin'
            ? cashRevenue
            : 0
        }
        digitalRevenue={
          role === 'admin'
            ? digitalRevenue
            : 0
        }
        pendingRevenue={
          role === 'admin'
            ? pendingRevenue
            : 0
        }
        revenueFilter={filter}
        role={role}
      />

      {/* SCHEDULES */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

        <ScheduleCard
          title="Today's Schedule"
          appointments={todayAppointments}
        />

        <ScheduleCard
          title="Tomorrow's Schedule"
          appointments={tomorrowAppointments}
        />
      </div>

      {/* ADMIN */}
      {role === 'admin' && (

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

          <div className="xl:col-span-2">

            <TeamOverview
              therapists={therapists}
            />
          </div>

          <QuickActions />
        </div>
      )}
    </div>
  )
}