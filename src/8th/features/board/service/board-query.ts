import { OverrideQueryOptions } from '@/8th/shared/react-query/types'
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { getBoardCustomerReviewDetail } from '../model/board-customer-review-detail'
import { getBoardCustomerReviewList } from '../model/board-customer-review-list'
import { getBoardGalleryDetail } from '../model/board-gallery-detail'
import { getBoardGalleryList } from '../model/board-gallery-list'
import { getBoardNoticeDetail } from '../model/board-notice-detail'
import { getBoardNoticeList } from '../model/board-notice-list'
import { getHome8th } from '../model/home-8th'

export function useHome(
  params: {
    template: string
    platform: string
    country: string
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: ['home'],
    queryFn: () => getHome8th(params),
  })
}

export function useBoardNoticeList(
  params: {
    page: number
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: ['board', 'notice', 'list', params.page],
    queryFn: () => getBoardNoticeList(params),
    placeholderData: keepPreviousData,
  })
}

export function useBoardNoticeDetail(
  params: {
    notifyId: string
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: ['board', 'notice', 'detail', params.notifyId],
    queryFn: () => getBoardNoticeDetail(params),
  })
}

export function useBoardGalleryList(
  params: {
    page: number
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: ['board', 'gallery', 'list'],
    queryFn: () => getBoardGalleryList(params),
    placeholderData: keepPreviousData,
  })
}

export function useBoardGalleryDetail(
  params: {
    boardId: string
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: ['board', 'gallery', 'detail', params.boardId],
    queryFn: () => getBoardGalleryDetail(params),
  })
}

export function useBoardCustomerReviewList(
  params: {
    writeType: string
    page: number
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: [
      'board',
      'customer-review',
      'list',
      params.writeType,
      params.page,
    ],
    queryFn: () => getBoardCustomerReviewList(params),
    placeholderData: keepPreviousData,
  })
}

export function useBoardCustomerReviewListInfinite(
  params: {
    writeType: string
  },
  options?: OverrideQueryOptions,
) {
  return useInfiniteQuery({
    ...options,
    queryKey: ['board', 'customer-review', 'list-infinite', params.writeType],
    queryFn: ({ pageParam }) =>
      getBoardCustomerReviewList({ ...params, page: pageParam }),
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || !lastPage.page) return undefined
      const current = lastPage.page.page
      const max = lastPage.page.totalPages
      if (current < max) return current + 1
      return undefined
    },
  })
}

export function useBoardCustomerReviewDetail(
  params: {
    writeType: string
    id: string
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: [
      'board',
      'customer-review',
      'detail',
      params.writeType,
      params.id,
    ],
    queryFn: () => getBoardCustomerReviewDetail(params),
  })
}
