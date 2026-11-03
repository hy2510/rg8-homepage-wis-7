import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type Classes = {
  id: string
  name: string
  classes: Class[]
}

type Class = {
  id: string
  name: string
}

type ClassPayload = {
  GroupId: string
  GroupName: string
  ClassId: string
  ClassName: string
  SortOrder: number
}

function makeClass(json: any): ClassPayload {
  return {
    GroupId: RenewType.renewString(json.GroupId),
    GroupName: RenewType.renewString(json.GroupName),
    ClassId: RenewType.renewString(json.ClassId),
    ClassName: RenewType.renewString(json.ClassName),
    SortOrder: RenewType.renewNumber(json.SortOrder),
  }
}

function transform(json: any): ClassesResponse {
  const payloadList: ClassPayload[] =
    json?.classes?.map((item: any) => makeClass(item)) ?? []

  if (payloadList.length === 0) {
    throw new Error('Classes not found')
  }

  const classes: Classes[] = []
  const orderMap = new Map<string, ClassPayload[]>()
  payloadList.forEach((item: ClassPayload) => {
    const id = item.GroupId
    const list = orderMap.get(id) ?? []
    list.push(item)
    orderMap.set(id, list)
  })
  for (const [key, values] of orderMap) {
    if (values.length === 0) {
      continue
    }
    const currentClasses: Classes = {
      id: key,
      name: values[0].GroupName,
      classes: values.map((item) => {
        return {
          id: item.ClassId,
          name: item.ClassName,
        }
      }),
    }
    classes.push(currentClasses)
  }

  return classes
}

export type ClassesParams = {}

export type ClassesResponse = Classes[]

export async function getClasses(
  input: ClassesParams,
): Promise<ClassesResponse> {
  const request = makeRequest(`api/teacher-guide/classes`, {
    method: 'get',
    queryString: {},
  })
  return await execute(request, transform)
}
