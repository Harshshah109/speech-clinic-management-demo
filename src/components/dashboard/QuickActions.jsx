import {
  useState
} from 'react'

import {
  Users,
  CalendarDays,
  Wallet,
  Stethoscope
} from 'lucide-react'

import AddPatientModal
  from '../modals/AddPatientModal'

import AddAppointmentModal
  from '../modals/AddAppointmentModal'

import AddTherapistModal
  from '../modals/AddTherapistModal'

import AddPaymentModal
  from '../modals/AddPaymentModal'

export default function QuickActions() {

  const [openPatient,
    setOpenPatient] =
      useState(false)

  const [openAppointment,
    setOpenAppointment] =
      useState(false)

  const [openTherapist,
    setOpenTherapist] =
      useState(false)

  const [openPayment,
    setOpenPayment] =
      useState(false)

  const scrollToModal =
    () => {

      setTimeout(() => {

        const modal =
          document.getElementById(
            'quick-action-modal'
          )

        if (modal) {

          modal.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }

      }, 100)
    }

  const actions = [
    {
      title: 'Add Patient',
      icon: Users,
      gradient:
        'from-violet-500 to-fuchsia-500',

      shadow:
        'shadow-violet-500/20',

      action: () => {

        setOpenPatient(true)

        scrollToModal()
      }
    },
    {
      title: 'New Appointment',
      icon: CalendarDays,
      gradient:
        'from-cyan-400 to-blue-500',

      shadow:
        'shadow-cyan-500/20',

      action: () => {

        setOpenAppointment(true)

        scrollToModal()
      }
    },
    {
      title: 'Add Therapist',
      icon: Stethoscope,
      gradient:
        'from-pink-400 to-rose-500',

      shadow:
        'shadow-pink-500/20',

      action: () => {

        setOpenTherapist(true)

        scrollToModal()
      }
    },
    {
      title: 'Add Payment',
      icon: Wallet,
      gradient:
        'from-emerald-400 to-green-500',

      shadow:
        'shadow-emerald-500/20',

      action: () => {

        setOpenPayment(true)

        scrollToModal()
      }
    }
  ]

  return (
    <>
      <div className="
        bg-white/75
        border
        border-[#ece7ff]
        rounded-3xl
        p-6
        backdrop-blur-xl
        shadow-[0_10px_30px_rgba(124,58,237,0.08)]
      ">

        {/* Header */}
        <div className="mb-6">

          <h2 className="
            text-3xl
            font-bold
            text-[#1f1147]
            mb-1
          ">
            Quick Actions
          </h2>

          <p className="
            text-[#7c6ca8]
            text-sm
          ">
            Manage clinic instantly
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">

          {actions.map((item) => {

            const Icon = item.icon

            return (
              <button
                key={item.title}
                onClick={item.action}
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  p-5
                  rounded-3xl
                  border
                  border-[#ece7ff]
                  bg-[#faf8ff]
                  hover:bg-[#f5f3ff]
                  transition-all
                  group
                "
              >

                {/* ICON */}
                <div className={`
                  w-14
                  h-14
                  rounded-2xl
                  bg-gradient-to-br
                  ${item.gradient}
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  ${item.shadow}
                  group-hover:scale-105
                  transition-all
                `}>

                  <Icon size={22} />
                </div>

                {/* TEXT */}
                <div className="text-left">

                  <h3 className="
                    font-bold
                    text-lg
                    text-[#1f1147]
                  ">
                    {item.title}
                  </h3>

                  <p className="
                    text-sm
                    text-[#8c84b3]
                  ">
                    Quick clinic action
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* MODALS */}

      <div id="quick-action-modal">
        {openPatient && (
          <AddPatientModal
            close={() =>
              setOpenPatient(false)
            }
          />
        )}

        {openAppointment && (
          <AddAppointmentModal
            close={() =>
              setOpenAppointment(false)
            }
          />
        )}

        {openTherapist && (
          <AddTherapistModal
            close={() =>
              setOpenTherapist(false)
            }
          />
        )}

        {openPayment && (
          <AddPaymentModal
            close={() =>
              setOpenPayment(false)
            }
          />
        )}
      </div>
    </>
  )
}