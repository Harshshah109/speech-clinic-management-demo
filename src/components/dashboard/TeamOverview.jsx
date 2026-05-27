export default function TeamOverview({
  therapists = []
}) {

  return (
    <div className="
      bg-white/75
      border
      border-[#ece7ff]
      rounded-3xl
      p-6
      backdrop-blur-xl
      shadow-[0_10px_30px_rgba(124,58,237,0.08)]
    ">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="
            text-3xl
            font-bold
            text-[#1f1147]
            mb-1
          ">
            Team Overview
          </h2>

          <p className="
            text-[#7c6ca8]
            text-sm
          ">
            Active therapist management
          </p>
        </div>
      </div>

      <div className="space-y-4">

        {therapists.length === 0 && (

          <div className="
            bg-[#faf8ff]
            border
            border-[#ece7ff]
            rounded-2xl
            p-5
            text-[#8c84b3]
            text-sm
          ">
            No therapists found
          </div>
        )}

        {therapists.map((item) => (

          <div
            key={item.id}
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
              bg-[#faf8ff]
              border
              border-[#ece7ff]
              rounded-3xl
              p-5
              hover:bg-[#f5f3ff]
              transition-all
            "
          >

            {/* LEFT */}
            <div className="flex items-center gap-4">

              {/* Avatar */}
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

                {(item.name || 'TH')
                  .slice(0, 2)}
              </div>

              {/* Info */}
              <div>

                <h3 className="
                  font-bold
                  text-xl
                  text-[#1f1147]
                  mb-1
                ">
                  {item.name}
                </h3>

                <p className="
                  text-[#7c6ca8]
                  text-sm
                ">
                  {item.role ||
                    'Speech Therapist'}
                </p>
              </div>
            </div>

            {/* STATUS */}
            <div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  item.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : item.status === 'On Leave'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >

                {item.status || 'Active'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}