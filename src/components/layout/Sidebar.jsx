import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Wallet,
  LogOut,
  X
} from 'lucide-react'

import {
  NavLink
} from 'react-router-dom'

import {
  logoutUser
} from '../../services/authService'

import {
  useState
} from 'react'

const navSections = [
  {
    title: 'MAIN',
    items: [
      {
        name: 'Dashboard',
        path: '/',
        icon: LayoutDashboard
      },
      {
        name: 'Appointments',
        path: '/appointments',
        icon: CalendarDays
      },
      {
        name: 'Calendar',
        path: '/calendar',
        icon: CalendarDays
      },
      {
        name: 'Patients',
        path: '/patients',
        icon: Users
      }
    ]
  },
  {
    title: 'CLINIC',
    items: [
      {
        name: 'Therapists',
        path: '/therapists',
        icon: Stethoscope
      },
      {
        name: 'Payments',
        path: '/payments',
        icon: Wallet
      }
    ]
  }
]

const therapistRestricted = [
  'Payments',
  'Therapists',
  'Messages'
]

export default function Sidebar({
  role
}) {

  const [openMobile,
    setOpenMobile] =
      useState(false)

  const navClass =
    ({ isActive }) =>

      `flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 border ${
        isActive
          ? `
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-white
            border-transparent
            shadow-lg
            shadow-blue-500/20
          `
          : `
            bg-white/70
            border-[#ebe7ff]
            text-[#433878]
            hover:bg-[#f5f3ff]
          `
      }`

  const BrandLogo = () => (

    <div className="
      flex
      items-center
      gap-3
    ">

      <div className="
        w-12
        h-12
        rounded-2xl
        bg-gradient-to-br
        from-blue-600
        to-cyan-500
        text-white
        flex
        items-center
        justify-center
        font-black
        text-lg
        shadow-lg
        shadow-blue-500/25
      ">
        CMS
      </div>

      <div>

        <h2 className="
          text-lg
          font-black
          text-[#1f1147]
          leading-tight
        ">
          Clinic
        </h2>

        <p className="
          text-xs
          font-semibold
          text-[#7c6ca8]
          leading-tight
        ">
          Management System
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-[#ece7ff] flex items-center justify-between px-5">

        <BrandLogo />

        <button
          onClick={() =>
            setOpenMobile(true)
          }
          className="w-11 h-11 rounded-2xl bg-white border border-[#ece7ff] flex items-center justify-center shadow-sm"
        >

          <div className="flex flex-col gap-1">

            <div className="w-5 h-[2px] bg-[#6d28d9] rounded-full"></div>

            <div className="w-5 h-[2px] bg-[#6d28d9] rounded-full"></div>

            <div className="w-5 h-[2px] bg-[#6d28d9] rounded-full"></div>
          </div>
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {openMobile && (

        <div className="md:hidden fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm">

          <div className="w-[85%] max-w-[320px] h-full bg-white border-r border-[#ece7ff] flex flex-col justify-between">

            <div>

              {/* HEADER */}
              <div className="p-5 border-b border-[#ece7ff] flex items-center justify-between">

                <BrandLogo />

                <button
                  onClick={() =>
                    setOpenMobile(false)
                  }
                  className="w-10 h-10 rounded-2xl border border-[#ece7ff] bg-[#faf8ff] flex items-center justify-center"
                >

                  <X
                    size={18}
                    className=" text-[#2563eb]"
                  />
                </button>
              </div>

              {/* NAV */}
              <div className="p-4">

                {navSections
                  .filter((section) =>

                    role === 'admin'
                      ? true
                      : section.title !== 'CLINIC'
                  )
                  .map((section) => (

                  <div
                    key={section.title}
                    className="mb-6"
                  >

                    <p className="text-xs text-[#0ea5e9] tracking-[0.2em] mb-4 font-semibold">

                      {section.title}
                    </p>

                    <div className="space-y-2">

                      {section.items
                        .filter((item) =>

                          role === 'admin'
                            ? true
                            : !therapistRestricted.includes(
                                item.name
                              )
                        )
                        .map((item) => (

                          <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === '/'}
                            onClick={() =>
                              setOpenMobile(false)
                            }
                            className={navClass}
                          >

                            <item.icon size={18} />

                            <span className="font-semibold">
                              {item.name}
                            </span>
                          </NavLink>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LOGOUT */}
            <div className="p-4 border-t border-[#ece7ff]">

              <button
                onClick={logoutUser}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-[#ece7ff] hover:bg-[#faf8ff] transition-all text-[#433878]"
              >

                <LogOut size={18} />

                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[270px] bg-white/75 backdrop-blur-xl border-r border-[#ece7ff] flex-col justify-between">

        <div>

          {/* LOGO */}
          <div className="p-6 border-b border-[#ece7ff]">

            <BrandLogo />
          </div>

          {/* NAV */}
          <div className="px-4 py-5">

            {navSections
              .filter((section) =>

                role === 'admin'
                  ? true
                  : section.title !== 'CLINIC'
              )
              .map((section) => (

              <div
                key={section.title}
                className="mb-6"
              >

                <p className="text-xs text-[#0ea5e9] tracking-[0.2em] mb-4 font-semibold">

                  {section.title}
                </p>

                <div className="space-y-2">

                  {section.items
                    .filter((item) =>

                      role === 'admin'
                        ? true
                        : !therapistRestricted.includes(
                            item.name
                          )
                    )
                    .map((item) => (

                      <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === '/'}
                        className={navClass}
                      >

                        <item.icon size={18} />

                        <span className="font-semibold">
                          {item.name}
                        </span>
                      </NavLink>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOGOUT */}
        <div className="p-4 border-t border-[#ece7ff]">

          <button
            onClick={logoutUser}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-[#ece7ff] hover:bg-[#faf8ff] transition-all text-[#433878]"
          >

            <LogOut size={18} />

            Logout
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-20 bg-white/85 backdrop-blur-xl border-t border-[#ece7ff] flex items-center justify-around px-2">

        {[
          {
            name: 'Dashboard',
            path: '/',
            icon: LayoutDashboard
          },
          {
            name: 'Appointments',
            path: '/appointments',
            icon: CalendarDays
          },
          {
            name: 'Patients',
            path: '/patients',
            icon: Users
          }
        ].map((item) => (

          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-xs ${
                isActive
                  ? 'text-[#7c3aed]'
                  : 'text-[#8c84b3]'
              }`
            }
          >

            <item.icon size={20} />

            <span>
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>
    </>
  )
}