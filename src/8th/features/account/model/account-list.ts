import RenewType from '@/util/string-utils'

const ACCOUNT_LIST_STORAGE_KEY = 'accounts'

export type AccountItem = {
  _id: string
  customerId: string
  customerName: string
  studentId: string
  studentName: string
  loginId: string
  password?: string
  avatar: string
  order: number
}
type AccountItemId = {
  customerId: string
  studentId: string
}

const DEFAULT_ACCOUNT_ITEM: AccountItem = {
  _id: '',
  customerId: '',
  customerName: '',
  studentId: '',
  studentName: '',
  loginId: '',
  password: undefined,
  avatar: '',
  order: 0,
}

function createAccountItem(accountItemId: string): AccountItem {
  return {
    ...DEFAULT_ACCOUNT_ITEM,
    _id: accountItemId,
  }
}

function parseAccountItem(json: any): AccountItem {
  return {
    _id:
      json?._id === undefined
        ? DEFAULT_ACCOUNT_ITEM._id
        : RenewType.renewString(json?._id),
    customerId:
      json?.customerId === undefined
        ? DEFAULT_ACCOUNT_ITEM.customerId
        : RenewType.renewString(json?.customerId),
    customerName:
      json?.customerName === undefined
        ? DEFAULT_ACCOUNT_ITEM.customerName
        : RenewType.renewString(json?.customerName),
    studentId:
      json?.studentId === undefined
        ? DEFAULT_ACCOUNT_ITEM.studentId
        : RenewType.renewString(json?.studentId),
    studentName:
      json?.studentName === undefined
        ? DEFAULT_ACCOUNT_ITEM.studentName
        : RenewType.renewString(json?.studentName),
    loginId:
      json?.loginId === undefined
        ? DEFAULT_ACCOUNT_ITEM.loginId
        : RenewType.renewString(json?.loginId),
    password:
      json?.password === undefined
        ? DEFAULT_ACCOUNT_ITEM.password
        : RenewType.renewString(json?.password),
    avatar:
      json?.avatar === undefined
        ? DEFAULT_ACCOUNT_ITEM.avatar
        : RenewType.renewString(json?.avatar),
    order:
      json?.order === undefined
        ? DEFAULT_ACCOUNT_ITEM.order
        : RenewType.renewNumber(json?.order),
  }
}

export function getAllAccountItems(): AccountItem[] {
  if (typeof window === 'undefined') return []

  try {
    const accountJson = window.localStorage.getItem(ACCOUNT_LIST_STORAGE_KEY)
    if (!accountJson) return []

    const parsed = JSON.parse(accountJson)
    if (!Array.isArray(parsed)) return []

    const allItems = parsed
      .map(parseAccountItem)
      .filter((v) => !!v._id)
      .map((item) => {
        if (item.studentId) {
          return {
            ...item,
            _id: getAccountItemId({
              customerId: item.customerId,
              studentId: item.studentId,
            }),
          }
        }
        return item
      })

    const seen = new Set()
    const duplicateItems = allItems.filter((item) => {
      if (seen.has(item._id)) return false

      seen.add(item._id)
      return true
    })
    return duplicateItems
  } catch {
    return []
  }
}

export function getAccountItem(info: AccountItemId): AccountItem {
  const accountId = getAccountItemId(info)
  if (!accountId) return createAccountItem('')

  const allItems = getAllAccountItems()
  const item = allItems.find((item) => item._id === accountId)
  if (!item) {
    return createAccountItem(accountId)
  }
  return item
}

export function updateAccountItem(
  update: {
    customerId: string
    studentId: string
    loginId: string
  } & Partial<Omit<AccountItem, '_id'>>,
  isSort = true,
) {
  if (typeof window === 'undefined') return

  const { customerId, studentId, ...rawPatch } = update
  if (customerId === '' || studentId === '') return

  const allItems = getAllAccountItems()
  const index = allItems.findIndex(
    (item) =>
      item.customerId === update.customerId && item.loginId === update.loginId,
  )
  if (index < 0) {
    return
  }
  const nextItems = allItems
    .map((item, i) => {
      if (i === index) {
        const patch = Object.fromEntries(
          Object.entries(rawPatch).filter(([, v]) => v !== undefined),
        )
        const newAccount = {
          ...item,
          ...patch,
          studentId: update.studentId,
          _id: getAccountItemId({
            customerId: update.customerId,
            studentId: update.studentId,
          }),
          order: 0,
        }
        return newAccount
      } else {
        return item
      }
    })
    .sort((a, b) => {
      if (isSort) {
        return a.order - b.order
      }
      return 0
    })
    .map((item, i) => {
      item.order = i + 1
      return item
    })

  window.localStorage.setItem(
    ACCOUNT_LIST_STORAGE_KEY,
    JSON.stringify(nextItems),
  )
}

export function deleteAccountItem(info: AccountItemId) {
  if (typeof window === 'undefined') return

  const accountId = getAccountItemId(info)
  const accounts = getAllAccountItems().filter((item) => item._id !== accountId)

  window.localStorage.setItem(
    ACCOUNT_LIST_STORAGE_KEY,
    JSON.stringify(accounts),
  )
  return accounts
}

export function updateAccountItemIfNullAddItem(
  item: {
    customerId: string
    studentId: string
    loginId: string
  } & Partial<Omit<AccountItem, '_id'>>,
) {
  if (typeof window === 'undefined') return

  const accounts = getAllAccountItems()
  const id = getAccountItemId({
    customerId: item.customerId,
    studentId: item.studentId,
  })

  const rawAccount = accounts.find((item) => item._id === id)
  if (rawAccount) {
    const newItem = {
      ...rawAccount,
      ...item,
    }
    updateAccountItem(newItem, true)
    return
  }

  const newItem: AccountItem = {
    ...DEFAULT_ACCOUNT_ITEM,
    ...item,
    _id: id,
    order: -1,
  }
  accounts.splice(0, 0, newItem)
  const reorderedAccounts = accounts.map((item, i) => {
    item.order = i + 1
    return item
  })
  window.localStorage.setItem(
    ACCOUNT_LIST_STORAGE_KEY,
    JSON.stringify(reorderedAccounts),
  )
}

function getAccountItemId({ customerId, studentId }: AccountItemId) {
  if (customerId === '' || studentId === '') return ''
  return `${customerId}#${studentId}`
}
