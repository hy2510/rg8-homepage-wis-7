export const myclassKeys = {
  root: () => ['myclass'] as const,
  weekStatus: (params?: Record<string, unknown>) =>
    ['myclass', 'week-status', params] as const,
  monthStatus: (params?: Record<string, unknown>) =>
    ['myclass', 'month-status', params] as const,
  dailyBook: () => ['myclass', 'daily-book'] as const,
  dailyBookWithParam: (params?: Record<string, unknown>) =>
    ['myclass', 'daily-book', params] as const,
  lectureSection: () => ['myclass', 'lecture-section'] as const,
  lectureSectionWithParam: (params?: Record<string, unknown>) =>
    ['myclass', 'lecture-section', params] as const,
  courseBook: () => ['myclass', 'course-book'] as const,
  courseBookWithParam: (params?: Record<string, unknown>) =>
    ['myclass', 'course-book', params] as const,
}
