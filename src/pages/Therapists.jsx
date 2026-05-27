import {
  Plus,
  Clock3,
  BriefcaseMedical,
  Pencil,
  X,
  CalendarDays
} from 'lucide-react'

import { useEffect, useState } from 'react'

import {
  getTherapists
} from '../services/therapistService'

import AddTherapistModal
  from '../components/modals/AddTherapistModal'

import TherapistAppointmentAnalyticsModal
  from '../components/modals/TherapistAppointmentAnalyticsModal'

export default function Therapists() {

  const [therapists, setTherapists] =
    useState([])

  const [openModal, setOpenModal] =
    useState(false)

  const [editData, setEditData] =
    useState(null)

  const [openEdit, setOpenEdit] =
    useState(false)

  const [openProfile, setOpenProfile] =
    useState(false)

  const [profileData, setProfileData] =
    useState(null)

  const [appointmentTherapist,
    setAppointmentTherapist] =
      useState(null)

  useEffect(() => {

    loadTherapists()

  }, [])

  const loadTherapists =
    async () => {

      const data =
        await getTherapists()

      setTherapists(data || [])
    }

  return (
    <div className="
      pb-10
      text-[#1f1147]
    ">

      {/* HEADER */}
      <div className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-4
        mb-8
      ">

        <div>

          <h1 className="
            text-5xl
            font-bold
            mb-2
          ">
            Therapists
          </h1>

          <p className="
            text-[#7c6ca8]
            text-lg
          ">
            Manage clinic therapists and availability
          </p>
        </div>

        <button
          onClick={() =>
            setOpenModal(true)
          }
          className="
            flex
            items-center
            justify-center
            gap-2
            border
            border-[#ece7ff]
            bg-white/75
            rounded-2xl
            px-6
            py-4
            hover:bg-[#f5f3ff]
            transition-all
            text-[#1f1147]
            font-semibold
            backdrop-blur-xl
          "
        >

          <Plus size={20} />

          <span>
            Add Therapist
          </span>
        </button>
      </div>

      {/* CARDS */}
      <div className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
      ">

        {therapists.map((therapist) => (

          <div
            key={therapist.id}
            className="
              bg-white/75
              border
              border-[#ece7ff]
              rounded-3xl
              p-6
              backdrop-blur-xl
              shadow-[0_10px_30px_rgba(124,58,237,0.08)]
            "
          >

            {/* TOP */}
            <div className="
              flex
              items-start
              justify-between
              mb-6
            ">

              <div className="
                flex
                items-center
                gap-4
              ">

                {/* AVATAR */}
                <div className="
                  w-16
                  h-16
                  rounded-full
                  bg-gradient-to-br
                  from-blue-500
                  to-cyan-500
                  text-white
                  flex
                  items-center
                  justify-center
                  text-lg
                  font-bold
                  uppercase
                  shadow-lg
                  shadow-blue-500/20
                ">

                  {(therapist.name || 'TH')
                    .slice(0, 2)}
                </div>

                {/* INFO */}
                <div>

                  <h2 className="
                    text-2xl
                    font-bold
                    mb-1
                  ">
                    {therapist.name}
                  </h2>

                  <p className="
                    text-[#7c6ca8]
                  ">
                    {
                      therapist.role ||
                      'Therapist'
                    }
                  </p>
                </div>
              </div>

              {/* STATUS */}
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  therapist.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : therapist.status === 'On Leave'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >

                {therapist.status}
              </span>
            </div>

            {/* DETAILS */}
            <div className="
              space-y-4
              mb-6
            ">

              <div className="
                flex
                items-center
                gap-3
                text-[#433878]
              ">

                <BriefcaseMedical size={18} />

                <span>
                  Experience: {
                    therapist.experience || 0
                  } years
                </span>
              </div>

              <div className="
                flex
                items-center
                gap-3
                text-[#433878]
              ">

                <Clock3 size={18} />

                <span>
                  {
                    therapist.phone ||
                    'No phone'
                  }
                </span>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">

              {/* VIEW */}
              <button
                onClick={() => {

                  setProfileData(
                    therapist
                  )

                  setOpenProfile(true)
                }}
                className="
                  flex-1
                  py-3
                  rounded-2xl
                  border
                  border-[#ece7ff]
                  bg-[#faf8ff]
                  hover:bg-[#f5f3ff]
                  transition-all
                  font-semibold
                "
              >
                View Profile
              </button>

              {/* EDIT */}
              <button
                onClick={() => {

                  setEditData(
                    therapist
                  )

                  setOpenEdit(true)
                }}
                className="
                  w-12
                  h-12
                  rounded-2xl
                  border
                  border-[#ece7ff]
                  flex
                  items-center
                  justify-center
                  bg-[#faf8ff]
                  hover:bg-[#f5f3ff]
                  transition-all
                "
              >

                <Pencil size={18} />
              </button>
            </div>

            {/* ANALYTICS BUTTON */}
            <button
              onClick={() =>
                setAppointmentTherapist(
                  therapist
                )
              }
              className="
                mt-4
                flex
                items-center
                gap-2
                text-sm
                text-violet-600
                font-semibold
                hover:text-fuchsia-500
                transition-all
              "
            >
              <CalendarDays size={16} />

              View Appointment Analytics
            </button>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      {openModal && (

        <AddTherapistModal
          close={() =>
            setOpenModal(false)
          }
          refresh={loadTherapists}
        />
      )}

      {/* PROFILE MODAL */}
      {openProfile && profileData && (

        <div className="
          fixed
          inset-0
          z-50
          bg-black/40
          backdrop-blur-md
          flex
          items-center
          justify-center
          p-4
          overflow-y-auto
        ">

          <div className="
            w-full
            max-w-4xl
            bg-white/90
            border
            border-[#ece7ff]
            rounded-3xl
            p-7
            backdrop-blur-xl
            shadow-[0_10px_40px_rgba(124,58,237,0.12)]
          ">

            {/* HEADER */}
            <div className="
              flex
              items-start
              justify-between
              mb-8
            ">

              <div className="
                flex
                items-center
                gap-5
              ">

                <div className="
                  w-24
                  h-24
                  rounded-full
                  bg-gradient-to-br
                  from-blue-500
                  to-cyan-500
                  text-white
                  flex
                  items-center
                  justify-center
                  text-3xl
                  font-bold
                  uppercase
                  shadow-lg
                  shadow-blue-500/20
                ">

                  {(profileData.name || 'TH')
                    .slice(0, 2)}
                </div>

                <div>

                  <h2 className="
                    text-4xl
                    font-bold
                    mb-2
                  ">
                    {profileData.name}
                  </h2>

                  <p className="
                    text-[#7c6ca8]
                    text-lg
                  ">
                    {
                      profileData.role ||
                      'Therapist'
                    }
                  </p>

                  <span className="
                    inline-block
                    mt-3
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    bg-emerald-100
                    text-emerald-700
                  ">

                    {profileData.status}
                  </span>
                </div>
              </div>

              {/* CLOSE */}
              <button
                onClick={() =>
                  setOpenProfile(false)
                }
                className="
                  w-12
                  h-12
                  rounded-2xl
                  border
                  border-[#ece7ff]
                  bg-[#faf8ff]
                  hover:bg-[#f5f3ff]
                  flex
                  items-center
                  justify-center
                  transition-all
                "
              >

                <X size={20} />
              </button>
            </div>

            {/* GRID */}
            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            ">

              {[
                {
                  title: 'Phone',
                  value:
                    profileData.phone || 'N/A'
                },
                {
                  title: 'Email',
                  value:
                    profileData.email || 'N/A'
                },
                {
                  title: 'Qualification',
                  value:
                    profileData.qualification || 'N/A'
                },
                {
                  title: 'Experience',
                  value:
                    `${profileData.experience || 0} years`
                }
              ].map((item, index) => (

                <div
                  key={index}
                  className="
                    bg-[#faf8ff]
                    border
                    border-[#ece7ff]
                    rounded-2xl
                    p-5
                  "
                >

                  <p className="
                    text-[#8c84b3]
                    text-sm
                    mb-2
                  ">
                    {item.title}
                  </p>

                  <h3 className="
                    text-lg
                    font-semibold
                    break-all
                  ">
                    {item.value}
                  </h3>
                </div>
              ))}
            </div>

            {/* SPECIALIZATION */}
            <div className="
              mt-6
              bg-[#faf8ff]
              border
              border-[#ece7ff]
              rounded-2xl
              p-5
            ">

              <p className="
                text-[#8c84b3]
                text-sm
                mb-4
              ">
                Specializations
              </p>

              <div className="
                flex
                flex-wrap
                gap-3
              ">

                {(profileData.specialization
                  ?.split(', ') || [])
                  .map((item, index) => (

                    <span
                      key={index}
                      className="
                        px-4
                        py-2
                        rounded-full
                        bg-gradient-to-r
                        from-blue-500
                        to-cyan-500
                        text-white
                        font-semibold
                        text-sm
                        shadow-lg
                        shadow-blue-500/20
                      "
                    >
                      {item}
                    </span>
                  ))}
              </div>
            </div>

            {/* NOTES */}
            <div className="
              mt-6
              bg-[#faf8ff]
              border
              border-[#ece7ff]
              rounded-2xl
              p-5
            ">

              <p className="
                text-[#8c84b3]
                text-sm
                mb-3
              ">
                Notes
              </p>

              <p className="
                text-[#433878]
                leading-relaxed
              ">
                {
                  profileData.notes ||
                  'No notes added'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {openEdit && editData && (

        <AddTherapistModal
          editData={editData}
          isEdit={true}
          close={() =>
            setOpenEdit(false)
          }
          refresh={loadTherapists}
        />
      )}

      {/* ANALYTICS MODAL */}
      {appointmentTherapist && (

        <TherapistAppointmentAnalyticsModal
          therapist={appointmentTherapist}
          close={() =>
            setAppointmentTherapist(null)
          }
        />
      )}
    </div>
  )
}