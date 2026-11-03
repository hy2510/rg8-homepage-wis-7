import { OverrideMutationOptions } from '@/8th/shared/react-query/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postSignUpEmailCertification } from '../model/sign-up-email-cert'
import { postSignUpEmailConfirm } from '../model/sign-up-email-confirm'
import { postSignUpEmailConfirmVN } from '../model/sign-up-email-confirm-vn'
import { postSignUpPhoneCertificationVN } from '../model/sign-up-phone-cert-vn'
import { postSignUpPhoneConfirmVN } from '../model/sign-up-phone-confirm-vn'
import { postSignUpVN } from '../model/sign-up-vn'

export function useSignUpEmailCertify(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (input: {
      email: string
      password: string
      studentName: string
    }) => postSignUpEmailCertification(input),
  })
}

export function useSignUpEmailConfirmKR(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (input: { email: string; authCode: string }) =>
      postSignUpEmailConfirm(input),
  })
}

export function useSignUpEmailConfirmVN(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (input: { email: string; authCode: string }) =>
      postSignUpEmailConfirmVN(input),
  })
}

export function useSignUpPhoneCertifyVN(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (input: { phone: string }) =>
      postSignUpPhoneCertificationVN(input),
  })
}

export function useSignUpPhoneConfirmVN(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (input: { phone: string; authCode: string }) =>
      postSignUpPhoneConfirmVN(input),
  })
}

export function useSignUpVN(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (input: { email: string; phone: string }) =>
      postSignUpVN(input),
  })
}
