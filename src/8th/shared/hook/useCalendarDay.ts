import { useCallback, useMemo } from 'react'

/*
 * weekStartsOn: 달력의 시작 요일(0: 일-기본값, 1: 월, 2: 화, 3: 수, 4: 목, 5: 금, 6: 토)
 */
export default function useCalednarDay({
  year,
  month,
  weekStartsOn = 0,
}: {
  year: number
  month: number
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}) {
  const today = useMemo(() => {
    const now = new Date()
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    }
  }, [])
  const calendarDayCells = useMemo(() => {
    const beforeMonthLastDay = new Date(year, month - 1, 0).getDate()
    const currentMonthLasyDay = new Date(year, month, 0).getDate()
    const currentMonth = new Date(year, month - 1, 1)
    const currentFirstDayWeek = currentMonth.getDay()

    const cells: number[] = []
    for (let i = 1; i <= currentMonthLasyDay; i++) {
      cells.push(i)
    }

    // 앞쪽에 요일 인덱스에 맞춰 패딩 추가
    const beforeDayPaddingCount = (currentFirstDayWeek - weekStartsOn + 7) % 7
    for (let i = 0; i < beforeDayPaddingCount; i++) {
      cells.unshift((beforeMonthLastDay - i) * -1)
    }

    // 뒤쪽에 그리드에 맞춰 패딩 추가
    let afterDayPaddingCount = (beforeDayPaddingCount + currentMonthLasyDay) % 7
    if (afterDayPaddingCount > 0) {
      afterDayPaddingCount = 7 - afterDayPaddingCount
    }
    for (let i = 0; i < afterDayPaddingCount; i++) {
      cells.push((i + 1) * -1)
    }

    return cells
  }, [year, month, weekStartsOn])

  const getWeekDay = useCallback(
    (day: number) => {
      const currentIndex = calendarDayCells.findIndex((value) => value === day)
      return (weekStartsOn + currentIndex) % 7
    },
    [calendarDayCells, weekStartsOn],
  )

  return {
    today,
    calendarDayCells,
    getWeekDay,
  }
}
