import {
  useEffect,
  useState
} from 'react'

import {
  CalendarDays,
  Clock3,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Save
} from 'lucide-react'

import {
  getPatientSessions,
  updateSession,
  deleteSession
} from '../../services/sessionService'

export default function SessionHistory({
  patient
}) {

  const [sessions, setSessions] =
    useState([])

  const [openSession, setOpenSession] =
    useState(null)

  const [editingSession,
    setEditingSession] =
      useState(null)

  const [editData,
    setEditData] =
      useState({})

  useEffect(() => {

    loadSessions()

  }, [])

  const loadSessions =
    async () => {

      const data =
        await getPatientSessions(
          patient.name
        )

      const sortedSessions =
        data.sort((a, b) => {

          const dateA =
            new Date(
              `${a.sessionDate} ${a.sessionTime}`
            )

          const dateB =
            new Date(
              `${b.sessionDate} ${b.sessionTime}`
            )

          return dateB - dateA
        })

      setSessions(
        sortedSessions || []
      )
    }

  return (
    <div className="mt-5 max-h-[520px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">

      {sessions.length === 0 && (

        <div className="
          bg-white/75
          border
          border-[#ece7ff]
          rounded-2xl
          p-5
          text-[#8c84b3]
          text-sm
        ">

          No session history yet
        </div>
      )}

      {sessions.map((session) => (

        <div
          key={session.id}
          className="
            bg-white/75
            border
            border-[#ece7ff]
            rounded-3xl
            overflow-hidden
            backdrop-blur-xl
            shadow-[0_10px_30px_rgba(124,58,237,0.08)]
          "
        >

          {/* TOP */}
          <button
            onClick={() =>

              setOpenSession(

                openSession === session.id
                  ? null
                  : session.id
              )
            }
            className="
              w-full
              p-5
              flex
              items-center
              justify-between
              hover:bg-[#f5f3ff]
              transition-all
            "
          >

            <div className="text-left">

              <div className="
                flex
                items-center
                gap-2
                text-[#1f1147]
                font-semibold
                mb-2
              ">

                <CalendarDays size={16} />

                {session.sessionDate}
              </div>

              <div className="
                flex
                items-center
                gap-4
                text-sm
                text-[#8c84b3]
              ">

                <div className="flex items-center gap-2">

                  <Clock3 size={14} />

                  {session.sessionTime}
                </div>

                <span>
                  {session.therapist}
                </span>
              </div>
            </div>

            {openSession === session.id
              ? <ChevronUp size={18} />
              : <ChevronDown size={18} />
            }
          </button>

          {/* CONTENT */}
          {openSession === session.id && (

            <div className="
              border-t
              border-[#ece7ff]
              p-5
              space-y-5
            ">

              {/* ACTIONS */}
              <div className="flex gap-3">

                <button
                  onClick={() => {

                    setEditingSession(
                      session.id
                    )

                    setEditData({
                      notes:
                        session.notes || '',

                      progress:
                        session.progress || '',

                      nextGoal:
                        session.nextGoal || ''
                    })
                  }}
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    h-11
                    rounded-2xl
                    border
                    border-[#ece7ff]
                    bg-white
                    hover:bg-[#f5f3ff]
                    transition-all
                  "
                >

                  <Pencil size={16} />

                  Edit
                </button>

                <button
                  onClick={async () => {

                    const confirmDelete =
                      window.confirm(
                        'Delete this session?'
                      )

                    if (!confirmDelete)
                      return

                    await deleteSession(
                      session.id
                    )

                    loadSessions()
                  }}
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    h-11
                    rounded-2xl
                    border
                    border-red-200
                    text-red-500
                    hover:bg-red-50
                    transition-all
                  "
                >

                  <Trash2 size={16} />

                  Delete
                </button>
              </div>

              {/* NOTES */}
              <div>

                <p className="
                  text-sm
                  text-[#8c84b3]
                  mb-2
                ">
                  Session Notes
                </p>

                {editingSession === session.id
                  ? (

                    <textarea
                      value={
                        editData.notes
                      }
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          notes:
                            e.target.value
                        })
                      }
                      className="
                        w-full
                        min-h-[120px]
                        bg-[#faf8ff]
                        border
                        border-[#ece7ff]
                        rounded-2xl
                        p-4
                        outline-none
                      "
                    />

                  ) : (

                    <div className="
                      bg-[#faf8ff]
                      border
                      border-[#ece7ff]
                      rounded-2xl
                      p-4
                      text-[#1f1147]
                      leading-relaxed
                    ">
                      {session.notes}
                    </div>
                  )}
              </div>

              {/* PROGRESS */}
              <div>

                <p className="
                  text-sm
                  text-[#8c84b3]
                  mb-2
                ">
                  Progress
                </p>

                {editingSession === session.id
                  ? (

                    <textarea
                      value={
                        editData.progress
                      }
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          progress:
                            e.target.value
                        })
                      }
                      className="
                        w-full
                        min-h-[100px]
                        bg-[#faf8ff]
                        border
                        border-[#ece7ff]
                        rounded-2xl
                        p-4
                        outline-none
                      "
                    />

                  ) : (

                    <div className="
                      bg-[#faf8ff]
                      border
                      border-[#ece7ff]
                      rounded-2xl
                      p-4
                      text-[#1f1147]
                      leading-relaxed
                    ">
                      {
                        session.progress ||
                        'No progress added'
                      }
                    </div>
                  )}
              </div>

              {/* GOAL */}
              <div>

                <p className="
                  text-sm
                  text-[#8c84b3]
                  mb-2
                ">
                  Next Goal
                </p>

                {editingSession === session.id
                  ? (

                    <>
                      <textarea
                        value={
                          editData.nextGoal
                        }
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            nextGoal:
                              e.target.value
                          })
                        }
                        className="
                          w-full
                          min-h-[100px]
                          bg-[#faf8ff]
                          border
                          border-[#ece7ff]
                          rounded-2xl
                          p-4
                          outline-none
                        "
                      />

                      <button
                        onClick={async () => {

                          await updateSession(
                            session.id,
                            editData
                          )

                          setEditingSession(
                            null
                          )

                          loadSessions()
                        }}
                        className="
                          mt-4
                          flex
                          items-center
                          gap-2
                          px-5
                          h-12
                          rounded-2xl
                          bg-gradient-to-r
                          from-blue-600
                          to-cyan-500
                          text-white
                          font-semibold
                          shadow-lg
                          shadow-blue-500/20
                        "
                      >

                        <Save size={16} />

                        Save Changes
                      </button>
                    </>

                  ) : (

                    <div className="
                      bg-[#faf8ff]
                      border
                      border-[#ece7ff]
                      rounded-2xl
                      p-4
                      text-[#1f1147]
                      leading-relaxed
                    ">
                      {
                        session.nextGoal ||
                        'No goal added'
                      }
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}