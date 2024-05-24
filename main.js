// main.js

const holidays = require("./scripts/holidays")

// 接收从捷径传入的日期
const dateFromShortcut = $context.query.date

function isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/
    if (!dateString.match(regEx)) return false // Invalid format
    const d = new Date(dateString)
    if (Number.isNaN(d.getTime())) return false // Invalid date
    return d.toISOString().slice(0, 10) === dateString
}

function isLastDayOfYear(date) {
    const dateObj = new Date(date)
    const year = dateObj.getFullYear()
    const lastDay = new Date(year, 11, 31) // December 31st of the given year
    return dateObj.getTime() === lastDay.getTime()
}

// 判断日期是否是节假日或工作日
function checkDayType(date) {
    console.log(date)
    if (!isValidDate(date)) {
        return { error: "无效的日期格式。预期格式：YYYY-MM-DD。" }
    }

    if (isLastDayOfYear(date)) {
        return { error: "这是今年的最后一天，请更新节假日数据。" }
    }

    // 判断是否是节假日或调休的工作日
    for (const holiday of holidays) {
        if (holiday.dates.includes(date)) {
            return { result: holiday.name }
        }
        if (holiday.workdays.includes(date)) {
            return { result: "工作日" }
        }
    }

    // 转换日期字符串为Date对象
    const dateObj = new Date(date)
    const dayOfWeek = dateObj.getUTCDay() // 0 是星期天, 6 是星期六

    // 判断是否是周末
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return { result: "非工作日" }
    }

    return { result: "工作日" }
}

// 判断传入日期是节假日还是工作日，并返回给捷径
const dayType = checkDayType(dateFromShortcut)

// 返回结果给捷径
$intents.finish(dayType)
