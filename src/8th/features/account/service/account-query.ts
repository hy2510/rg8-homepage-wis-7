import { fetchStudentBootstrap } from '@/8th/shared/hook/useStudentBootstrap'
import {
  OverrideMutationOptions,
  OverrideQueryOptions,
} from '@/8th/shared/react-query/types'
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  deleteAccountItem,
  getAllAccountItems,
  updateAccountItem,
  updateAccountItemIfNullAddItem,
} from '../model/account-list'
import { postChangePasswordWithPin } from '../model/change-password-with-pin'
import { getCheckId } from '../model/check-id'
import { getClassGroupList } from '../model/class-group-list'
import { getClassList } from '../model/class-list'
import { ForgotId, getForgotId } from '../model/forgot-id'
import { getForgotPassword } from '../model/forgot-password'
import { postForgotPasswordConfirm } from '../model/forgot-password-confirm'
import { Login, postLogin } from '../model/login'
import { LoginWithSSOParams, postLoginWithSSO } from '../model/login-with-sso'
import { deleteLogout } from '../model/logout'
import { postRegistRecoveryPin } from '../model/regist-recovery-pin'
import { postTemporaryChangePassword } from '../model/temporary-change-password'
import { getTrialContents } from '../model/trial-contents'
import { postVerifyRecoveryPin } from '../model/verify-recovery-pin'
import { accountKeys } from './account-key'

export function useClassGroupList(
  params: { customerId: string },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: accountKeys.classGroupList(params.customerId),
    queryFn: () => getClassGroupList(),
  })
}

export function useClassList(
  params: {
    customerId: string
    classGroupId: string
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: accountKeys.classList(params),
    queryFn: () => getClassList(params),
  })
}
type LoginParams = {
  type: 'id' | 'token'
  customerId: string
  customerName?: string
  id?: string
  password?: string
  token?: string
  i?: number
  isSaveHistory?: boolean
  isSavePassword?: boolean
  deviceType: string
  loginType: string
}
async function loginProcess(
  param: LoginParams,
  res: Login,
  queryClient: QueryClient,
) {
  if (res.success) {
    if (res.student) {
      const result = await fetchStudentBootstrap(queryClient)

      if (param.isSaveHistory) {
        updateAccountItemIfNullAddItem({
          customerId: param.customerId,
          customerName: param.customerName || '',
          studentId: result.student.student.studentId,
          studentName: result.student.student.name,
          loginId: param.id!,
          password: param.isSavePassword ? param.password! : '',
          avatar: result.avatarList.avatarId,
        })
      }
    }
  }
}

export function useFindId(
  params: { customerId: string; useType: 'Email' | 'Phone'; keyword: string },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: accountKeys.findId(params),
    queryFn: () =>
      getForgotId({ type: params.useType, keyword: params.keyword }),
  })
}

export function useFindPassword(options?: OverrideMutationOptions) {
  return useMutation({
    ...options,
    mutationFn: (input: { type: 'Email' | 'Id'; keyword: string }) =>
      getForgotPassword({ type: input.type, keyword: input.keyword }),
  })
}

export function useForgotPasswordConfirm(options?: OverrideMutationOptions) {
  return useMutation({
    ...options,
    mutationFn: (input: { keyword: string; authCode: string }) =>
      postForgotPasswordConfirm({
        keyword: input.keyword,
        authCode: input.authCode,
      }),
  })
}

export function useLogin(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (input: LoginParams) => {
      const res = await postLogin({
        id: input.id!,
        password: input.password!,
        deviceType: input.deviceType,
        loginType: input.loginType,
      })
      await loginProcess(input, res, queryClient)
      return res
    },
    onSuccess: (data, variables) => {
      if (data.success) {
      }
      if (options?.onSuccess) {
        options.onSuccess(data, variables)
      }
    },
  })
}

export function useLoginWithSSO(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (input: LoginWithSSOParams) => postLoginWithSSO(input),
    onSuccess: (data, variables) => {
      if (data.success) {
      }
      if (options?.onSuccess) {
        options.onSuccess(data, variables)
      }
    },
  })
}

export function useLogout(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: () => deleteLogout(),
    onSuccess: (data, variables) => {
      queryClient.removeQueries()

      if (options?.onSuccess) {
        options.onSuccess(data, variables)
      }
    },
  })
}

export function useTemporaryChangePassword(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (param: {
      customerId: string
      customerName?: string
      id?: string
      newPassword: string
      isSaveHistory?: boolean
      isSavePassword?: boolean
      hash: string
    }) => {
      const passwordResult = await postTemporaryChangePassword(param)
      if (passwordResult.success) {
        const result = await fetchStudentBootstrap(queryClient)

        if (param.isSaveHistory) {
          updateAccountItemIfNullAddItem({
            customerId: param.customerId,
            customerName: param.customerName || '',
            studentId: result.student.student.studentId,
            studentName: result.student.student.name,
            loginId: param.id!,
            password: '',
            avatar: result.avatarList.avatarId,
          })
        }
      }
      return passwordResult
    },
  })
}

export function useAccountList() {
  return getAllAccountItems()
}

export function useUpdateAccountItem() {
  return (input: {
    customerId: string
    studentId: string
    loginId: string
    password?: string
    avatar?: string
    studentName?: string
    isReSort?: boolean
  }) => {
    updateAccountItem(
      {
        customerId: input.customerId,
        studentId: input.studentId,
        loginId: input.loginId,
        password: input.password,
        avatar: input.avatar,
        studentName: input.studentName,
      },
      input.isReSort,
    )
  }
}

export function useDeleteAccountItem() {
  return (input: { customerId: string; studentId: string }) => {
    deleteAccountItem({
      customerId: input.customerId,
      studentId: input.studentId,
    })
  }
}

export function useTrialContents(params: { level: string }) {
  return useQuery({
    queryKey: accountKeys.trialContents(params),
    queryFn: () => getTrialContents({ level: params.level }),
  })
}

export function useCheckLoginId(options?: OverrideMutationOptions) {
  return useMutation({
    ...options,
    mutationFn: async (input: { keyword: string; isRequestEmail: boolean }) => {
      const result: {
        success: boolean
        list: ForgotId[]
        keyword: string
        next?: 'pick' | 'enter'
      } = {
        success: false,
        list: [],
        keyword: input.keyword,
      }

      try {
        if (input.isRequestEmail) {
          const results = await Promise.all([
            getCheckId({ loginId: input.keyword }),
            getForgotId({ type: 'Email', keyword: input.keyword }),
          ])
          const checkIdResult = results[0]
          const findIdResult = results[1]?.list || []
          result.list = findIdResult
          if (findIdResult.length > 0) {
            result.success = true
            if (findIdResult.length === 1 && checkIdResult.success) {
              result.next = 'enter'
            } else {
              result.next = 'pick'
            }
          }
        } else {
          const checkResult = (await getCheckId({ loginId: input.keyword }))
            .success

          if (checkResult) {
            result.success = true
            result.next = 'enter'
          }
        }
      } catch (error) {}
      return result
    },
  })
}

export function useRegistRecoveryPin(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (param: {
      customerId: string
      customerName?: string
      id?: string
      pin: string
      isSaveHistory?: boolean
      isSavePassword?: boolean
      hash: string
    }) => {
      const registPinResult = await postRegistRecoveryPin(param)
      if (registPinResult.success) {
        const result = await fetchStudentBootstrap(queryClient)

        if (param.isSaveHistory) {
          const currentAvatar = result.avatarList.list.find(
            (item) => item.avatarId === result.avatarList.avatarId,
          )
          const avatarImage = currentAvatar ? currentAvatar.imageLarge : ''
          updateAccountItemIfNullAddItem({
            customerId: param.customerId,
            customerName: param.customerName || '',
            studentId: result.student.student.studentId,
            studentName: result.student.student.name,
            loginId: param.id!,
            avatar: avatarImage,
          })
        }
      }
      return registPinResult
    },
  })
}

export function useVerifyRecoveryPin(options?: OverrideMutationOptions) {
  return useMutation({
    ...options,
    mutationFn: async (param: { id: string; pin: string }) => {
      const verifyPinResult = await postVerifyRecoveryPin(param)

      return verifyPinResult
    },
  })
}

export function useChangePasswordWithPin(options?: OverrideMutationOptions) {
  return useMutation({
    ...options,
    mutationFn: async (param: {
      loginId: string
      pin: string
      newPassword: string
    }) => {
      const changePasswordResult = await postChangePasswordWithPin(param)
      return changePasswordResult
    },
  })
}
