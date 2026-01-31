import {
  loginUserAction,
  logoutAction,
  registerUserAction,
} from './auth'
import {
  changePasswordAction,
  deleteUserAction,
  forgotPasswordAction,
  resetPasswordAction,
  setPasswordAction,
  updateUserNameAction,
} from './auth-profile'
import { enrollCourseAction } from './enrollment'
import { completeModuleAction } from './module-completion'
import { submitQuizAttemptAction } from './quiz'
import { getCurrentUserAction, getUserProgressAction, getUserStatsAction } from './user'

export const actions = {
  auth: {
    registerUserAction,
    loginUserAction,
    logoutAction,
    forgotPasswordAction,
    resetPasswordAction,
    changePasswordAction,
    updateUserNameAction,
    deleteUserAction,
    setPasswordAction,
  },
  user: {
    getCurrentUserAction,
    getUserStatsAction,
    getUserProgressAction,
  },
  enrollment: {
    enrollCourseAction,
  },
  quiz: {
    submitQuizAttemptAction,
  },
  moduleCompletion: {
    completeModuleAction,
  },
}
