import { loginUserAction, registerUserAction } from './auth'
import { getCurrentUserAction, getUserProgressAction, getUserStatsAction } from './user'

export const actions = {
  auth: {
    registerUserAction,
    loginUserAction,
  },
  user: {
    getCurrentUserAction,
    getUserStatsAction,
    getUserProgressAction,
  },
}
