// Set utils function parseTime to filter
export { parseTime } from '@/utils'
export { reformatRate } from '@/utils/spider-job'

// Filter for article status
export const articleStatusFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  return statusMap[status]
}

// Filter to uppercase the first character
export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const dateFormatter = require('dateformat');

export const date = (millis: number): string => {
  return dateFormatter(new Date(millis), 'yyyy-MM-dd HH:mm:ss')
}
