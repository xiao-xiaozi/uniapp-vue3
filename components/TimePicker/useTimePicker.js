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



export function useTimePickerHour(timeStart, timeEnd){
	let startHour = moment(timeStart, 'HH:mm').format('HH')
	let endHour = moment(timeEnd, 'HH:mm').format('HH')
	
	return generateOptions(parseInt(startHour), parseInt(endHour))
}

function isSameHour(time, hour) {
	return moment(time,'HH:mm').format('HH') == hour
}

export function useTimePickerMinute(timeStart, timeEnd, chooseHour){
	let startMinute = 0
	let endMinute = 59
	
	if(chooseHour && isSameHour(timeStart, chooseHour)) {
		startMinute = moment(timeStart,'HH:mm').format('mm')
	}
	if(chooseHour && isSameHour(timeEnd,chooseHour)) {
		endMinute = moment(timeEnd, 'HH:mm').format('mm')
	}
	
	return generateOptions(parseInt(startMinute), parseInt(endMinute))
}