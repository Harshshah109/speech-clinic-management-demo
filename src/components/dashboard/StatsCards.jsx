import {
  CalendarDays,
  Users,
  IndianRupee,
  UserRound,
  Wallet,
  Smartphone,
  AlertCircle
} from 'lucide-react'

export default function StatsCards({
  appointments = [],
  patients = [],
  therapists = [],
  revenue = 0,
  cashRevenue = 0,
  digitalRevenue = 0,
  pendingRevenue = 0,
  revenueFilter = 'monthly',
  role = 'admin'
}) {

  const todayAppointments =
    appointments.length

  const pendingAppointments =
    appointments.filter(
      (item) =>
        item.status === 'Pending'
    ).length

  const activePatients =
    patients.length

  const activeTherapists =
    therapists.length

  const revenueTitle =
    revenueFilter === 'daily'
      ? 'Today Revenue'
      : revenueFilter === 'weekly'
      ? 'Weekly Revenue'
      : revenueFilter === 'yearly'
      ? 'Yearly Revenue'
      : 'Monthly Revenue'

  const cardClass =
    `
      rounded-[30px]
      border
      border-white/70
      bg-white/75
      backdrop-blur-xl
      shadow-[0_10px_30px_rgba(124,58,237,0.08)]
      p-6
    `

  const iconWrap =
    `
      w-14
      h-14
      rounded-2xl
      flex
      items-center
      justify-center
    `

  return (
    <div className={`grid gap-5 mb-8 ${
      role === 'admin'
        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
        : 'grid-cols-1'
    }`}>

      {/* APPOINTMENTS */}
      <div className={cardClass}>

        <div className="flex items-center justify-between mb-5">

          <div className={`${iconWrap} bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20`}>

            <CalendarDays size={24} />
          </div>
        </div>

        <h3 className="text-[#7c6ca8] mb-2 font-medium">
          Today's Appointments
        </h3>

        <h2 className="text-5xl font-bold text-[#1f1147] mb-2">
          {todayAppointments}
        </h2>

        <p className="text-sm text-amber-500 font-medium">
          {pendingAppointments} pending confirmations
        </p>
      </div>

      {/* ADMIN */}
      {role === 'admin' && (
        <>
          {/* PATIENTS */}
          <div className={cardClass}>

            <div className="flex items-center justify-between mb-5">

              <div className={`${iconWrap} bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/20`}>

                <Users size={24} />
              </div>
            </div>

            <h3 className="text-[#7c6ca8] mb-2 font-medium">
              Active Patients
            </h3>

            <h2 className="text-5xl font-bold text-[#1f1147] mb-2">
              {activePatients}
            </h2>

            <p className="text-sm text-emerald-500 font-medium">
              Live patient database
            </p>
          </div>

          {/* REVENUE */}
          <div className={cardClass}>

            <div className="flex items-center justify-between mb-5">

              <div className={`${iconWrap} bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20`}>

                <IndianRupee size={24} />
              </div>
            </div>

            <h3 className="text-[#7c6ca8] mb-2 font-medium">
              {revenueTitle}
            </h3>

            <h2 className="text-5xl font-bold text-[#1f1147] mb-5">
              ₹{revenue.toLocaleString()}
            </h2>

            <div className="space-y-3">

              <div className="flex items-center justify-between bg-[#f7f4ff] border border-[#ece7ff] rounded-2xl px-4 py-3">

                <div className="flex items-center gap-2 text-[#7c6ca8] text-sm font-medium">

                  <Wallet size={16} />

                  Cash
                </div>

                <span className="font-bold text-[#1f1147]">
                  ₹{cashRevenue.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between bg-[#f7f4ff] border border-[#ece7ff] rounded-2xl px-4 py-3">

                <div className="flex items-center gap-2 text-[#7c6ca8] text-sm font-medium">

                  <Smartphone size={16} />

                  Digital
                </div>

                <span className="font-bold text-[#1f1147]">
                  ₹{digitalRevenue.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between bg-[#fff7ed] border border-[#fde7c7] rounded-2xl px-4 py-3">

                <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">

                  <AlertCircle size={16} />

                  Pending
                </div>

                <span className="font-bold text-amber-600">
                  ₹{pendingRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* THERAPISTS */}
          <div className={cardClass}>

            <div className="flex items-center justify-between mb-5">

              <div className={`${iconWrap} bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-pink-500/20`}>

                <UserRound size={24} />
              </div>
            </div>

            <h3 className="text-[#7c6ca8] mb-2 font-medium">
              Therapists Active
            </h3>

            <h2 className="text-5xl font-bold text-[#1f1147] mb-2">
              {activeTherapists}
            </h2>

            <p className="text-sm text-emerald-500 font-medium">
              Available therapists
            </p>
          </div>
        </>
      )}
    </div>
  )
}