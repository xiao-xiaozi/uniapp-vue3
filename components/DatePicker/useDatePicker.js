import moment from "moment"

/**
 * 生成从start 到 end 的数组
 * @param {Object} end
 * @param {Object} start
 */
function generateOptions(start,end) {
	const options = []
	for(let i = start; i <= end; i++) {
		options.push(i)
	}
	return options
}

/**
 * 生成dateStart 到 dateEnd 的年份数据，若dateEnd为空，则默认生成到当前年份的下一年
 * @param {Object} dateStart
 * @param {Object} dateFormat
 * @param {Object} dateEnd
 */
export function useDatePickerYear(dateStart, dateEnd, dateFormat){
	
	const currentYear = moment(new Date(), dateFormat).format('YYYY')
	const startYear = moment(dateStart, dateFormat).format('YYYY')
	let endYear = ''
	
	if(dateEnd) endYear = moment(dateEnd, dateFormat).format('YYYY')
	else endYear = parseInt(currentYear) + 1 // 默认年份加载到当前年份的下一年
	
	
	return generateOptions(parseInt(startYear), parseInt(endYear))
}

/**
 * date的年份与year是否一致
 * @param {Object} date
 * @param {Object} year
 * @param {Object} dateFormat
 */
function isSameYear(date, dateFormat, year){
	if(typeof year === 'number') year = year.toString()
	return moment(year).format('YYYY') == moment(date, dateFormat).format('YYYY')
}

/**
 * 生成chooseYear的可选月份数据
 * 根据dateStart dateEnd限制可选
 * @param {Object} dateStart
 * @param {Object} dateEnd
 * @param {Object} chooseYear
 * @param {Object} dateFormat
 */
export function useDatePickerMonth(dateStart, dateEnd, dateFormat, chooseYear){
	let startMonth = 1;
	let endMonth = 12;
	if(chooseYear && isSameYear(dateStart, dateFormat, chooseYear)) {
		startMonth = moment(dateStart, dateFormat).format('M')
	}
	if(chooseYear && isSameYear(dateEnd, dateFormat, chooseYear)) {
		endMonth = moment(dateEnd, dateFormat).format('M')
	}
	
	return generateOptions(parseInt(startMonth), parseInt(endMonth))
}

/**
 * date的年月是否与yearMonth一致
 * @param {Object} date
 * @param {Object} yearMonth
 * @param {Object} dateFormat
 */
function isSameYearMonth(date, dateFormat,yearMonth){
	return moment(yearMonth, 'YYYY-MM').format('YYYY-MM') == moment(date, dateFormat).format('YYYY-MM')
}

/**
 * 生成月份的可选天数数据
 * 根据dateStart dateEnd限制可选
 * @param {Object} dateStart
 * @param {Object} dateEnd
 * @param {Object} chooseYearMonth
 * @param {Object} dateFormat
 */
export function useDatePickerDay(dateStart, dateEnd, dateFormat, chooseYearMonth){
	let startDay = 1;
	let endDay = moment(chooseYearMonth, 'YYYY-MM').daysInMonth()
	
	if(chooseYearMonth && isSameYearMonth(dateStart, dateFormat, chooseYearMonth)) {
		startDay = moment(dateStart, dateFormat).format('D')
	}
	if(chooseYearMonth && isSameYearMonth(dateEnd, dateFormat, chooseYearMonth)) {
		endDay = moment(dateEnd, dateFormat).format('D')
	}
	
	return generateOptions(parseInt(startDay), parseInt(endDay))
}