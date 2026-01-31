import { loginUserAction, logoutAction, registerUserAction } from './auth'
import { enrollCourseAction } from './enrollment'
import { completeModuleAction } from './module-completion'
import { submitQuizAttemptAction } from './quiz'
import { getCurrentUserAction, getUserProgressAction, getUserStatsAction } from './user'

export const actions = {
  auth: {
    registerUserAction,
    loginUserAction,
    logoutAction,
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
