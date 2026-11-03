import { studentKeys } from '@/8th/features/student/service/student-key'
import {
  OverrideMutationOptions,
  OverrideQueryOptions,
} from '@/8th/shared/react-query/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { putAdjustChange } from '../model/adjust-change'
import { getAdjustHistoryList } from '../model/adjust-history'
import { getPaymentHistoryList } from '../model/payment-history'
import { postPurchaseInapp } from '../model/purchase-inapp'
import { getPurchaseProductList } from '../model/purchase-product'
import { putRegistTicket } from '../model/regist-ticket'
import { getUnpaidBalanceList } from '../model/unpaid-balance'
import { paymentKeys } from './payment-key'

export function useUnpaidBalanceList(options?: OverrideQueryOptions) {
  return useQuery({
    ...options,
    queryKey: paymentKeys.unpaidBalance(),
    queryFn: () => getUnpaidBalanceList(),
  })
}

export function usePurchaseProductList(
  params: { type: 'direct' | 'directvn' | 'ios' | 'android' },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: paymentKeys.purchaseProduct(),
    queryFn: () => getPurchaseProductList(params),
  })
}

export function usePurchaseSuccessRefresh(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async () => {
      const result = await Promise.all([
        queryClient.refetchQueries({ queryKey: studentKeys.info() }),
        queryClient.refetchQueries({ queryKey: studentKeys.historyList() }),
        queryClient.refetchQueries({ queryKey: paymentKeys.paymentHistory() }),
      ])
      return true
    },
  })
}

export function usePaymentHistoryList(options?: OverrideQueryOptions) {
  return useQuery({
    ...options,
    queryKey: paymentKeys.paymentHistory(),
    queryFn: () => getPaymentHistoryList(),
  })
}

export function useRegistTicket(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (input: { tickets: string[] }) => {
      const registTicket = await putRegistTicket(input)

      let partialSuccess = registTicket.final
      if (!partialSuccess) {
        registTicket.result.forEach((item) => {
          if (!partialSuccess) {
            partialSuccess = item.code === 0
          }
        })
      }
      if (partialSuccess) {
        await Promise.all([
          queryClient.refetchQueries({ queryKey: studentKeys.info() }),
          queryClient.refetchQueries({ queryKey: studentKeys.historyList() }),
        ])
      }
      return registTicket
    },
  })
}

export function usePurchaseInapp(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (input: {
      platform: 'android' | 'ios'
      productId: string
      receipt: string
    }) => {
      const { code, message } = await postPurchaseInapp(input)
      if (code === 0) {
        try {
          await Promise.all([
            queryClient.refetchQueries(
              { queryKey: studentKeys.info() },
              { throwOnError: true },
            ),
            queryClient.refetchQueries(
              { queryKey: studentKeys.historyList() },
              { throwOnError: true },
            ),
          ])
        } catch (error) {
          return { code: -1, message: 'student info update error' }
        }
        return { code, message }
      } else {
        return { code: -2, message: 'purchase inapp failed' }
      }
    },
  })
}

export function useAdjustHistoryList(options?: OverrideQueryOptions) {
  return useQuery({
    ...options,
    queryKey: paymentKeys.adjust(),
    queryFn: () => getAdjustHistoryList(),
  })
}

export function useAdjustChange(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (input: { command: 'pause' | 'release' }) => {
      const adjust = await putAdjustChange(input)
      if (adjust.success) {
        await Promise.all([
          queryClient.refetchQueries({ queryKey: paymentKeys.adjust() }),
          queryClient.refetchQueries({ queryKey: studentKeys.info() }),
          queryClient.refetchQueries({ queryKey: studentKeys.historyList() }),
        ])
      }

      return adjust
    },
  })
}
