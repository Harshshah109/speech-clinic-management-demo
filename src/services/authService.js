import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import { auth } from './firebase'

export const loginUser =
  async (email, password) => {

    try {

      return await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      )

    } catch (error) {

      console.log('LOGIN ERROR CODE:', error.code)

      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {

        return await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password.trim()
        )
      }

      throw error
    }
  }

export const logoutUser =
  async () => {

    await signOut(auth)
  }