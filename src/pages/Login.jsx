import { useState } from 'react'

import {
  Lock,
  Mail
} from 'lucide-react'

import { loginUser }
  from '../services/authService'

export default function Login({
  onLogin
}) {

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const handleSubmit =
    async (e) => {

      e.preventDefault()

      try {

        setLoading(true)
        setError('')

        await loginUser(
          email,
          password
        )

        onLogin()

      } catch (err) {

        console.log(err)

        setError(err.message)
      }

      setLoading(false)
    }

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-[#faf7ff]
      via-[#f6f2ff]
      to-[#eef2ff]
      px-4
      relative
      overflow-hidden
    ">

      {/* BACKGROUND GLOW */}
      <div className="
        absolute
        top-[-120px]
        right-[-120px]
        w-[350px]
        h-[350px]
        bg-fuchsia-300/30
        blur-3xl
        rounded-full
      " />

      <div className="
        absolute
        bottom-[-120px]
        left-[-120px]
        w-[350px]
        h-[350px]
        bg-violet-300/30
        blur-3xl
        rounded-full
      " />

      {/* CARD */}
      <div className="
        relative
        w-full
        max-w-md
        rounded-[36px]
        border
        border-white/60
        bg-white/80
        backdrop-blur-xl
        p-8
        shadow-[0_20px_60px_rgba(124,58,237,0.18)]
      ">

        {/* DEMO LOGO */}
        <div className="
          flex
          justify-center
          mb-5
        ">

          <div className="
            w-24
            h-24
            rounded-3xl
            bg-gradient-to-br
            from-blue-600
            to-cyan-500
            text-white
            flex
            items-center
            justify-center
            text-3xl
            font-black
            shadow-lg
            shadow-blue-500/25
          ">
            CMS
          </div>
        </div>

        {/* TITLE */}
        <div className="
          mb-8
          text-center
        ">

          <h1 className="
            text-4xl
            font-black
            mb-2
            text-[#1f1147]
          ">
            Welcome Back
          </h1>

          <p className="
            text-[#7c6ca8]
            text-base
          ">
            Clinic Management System
          </p>
        </div>

        {/* ERROR */}
        {error && (

          <div className="
            mb-5
            rounded-2xl
            border
            border-red-200
            bg-red-50
            text-red-600
            p-4
            text-sm
            font-medium
          ">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="space-y-5"
        >

          {/* EMAIL */}
          <div>

            <label className="
              text-sm
              font-semibold
              text-[#6d5ca5]
              mb-2
              block
            ">
              Email Address
            </label>

            <div className="
              relative
              flex
              items-center
            ">

              <Mail
                size={18}
                className="
                  absolute
                  left-4
                  text-blue-500
                "
              />

              <input
                type="email"
                name="no-autofill-email"
                autoComplete="off"
                spellCheck="false"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-[#e9ddff]
                  bg-[#faf8ff]
                  pl-12
                  pr-4
                  outline-none
                  text-[#1f1147]
                  placeholder:text-[#9b8cc9]
                  focus:border-violet-400
                  focus:bg-white
                  transition-all
                "
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>

            <label className="
              text-sm
              font-semibold
              text-[#6d5ca5]
              mb-2
              block
            ">
              Password
            </label>

            <div className="
              relative
              flex
              items-center
            ">

              <Lock
                size={18}
                className="
                  absolute
                  left-4
                  text-blue-500
                "
              />

              <input
                type="password"
                name="no-autofill-password"
                autoComplete="new-password"
                spellCheck="false"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-[#e9ddff]
                  bg-[#faf8ff]
                  pl-12
                  pr-4
                  outline-none
                  text-[#1f1147]
                  placeholder:text-[#9b8cc9]
                  focus:border-violet-400
                  focus:bg-white
                  transition-all
                "
                required
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              via-cyan-500
              to-purple-500
              text-white
              font-bold
              text-lg
              shadow-lg
              shadow-blue-500/25
              hover:scale-[1.01]
              hover:opacity-95
              transition-all
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >

            {loading
              ? 'Signing In...'
              : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}