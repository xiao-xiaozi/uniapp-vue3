<script setup>
	import moment from "moment"
	import { useDatePickerDay, useDatePickerMonth, useDatePickerYear } from "../DatePicker/useDatePicker.js"
	import { useTimePickerHour, useTimePickerMinute } from '../TimePicker/useTimePicker.js'
	
	
	const model = defineModel({ type:String })
	const emits = defineEmits(['popupChange','confirm','cancel'])
	const props = defineProps({
		dateStart:{ // 开始日期
			type:String,
			default:'1900-01-01'
		},
		dateEnd:{ // 截止日期
			type:String,
			default:''
		},
		timeStart:{ // 开始时间
			type:String,
			default:'00:00'
		},
		timeEnd:{ // 结束时间
			type:String,
			default:'23:59'
		},
		isMaskClick:{ // 是否点击蒙层关闭弹窗
			type:Boolean,
			default:false
		},
		title:{ // 弹窗顶部居中的标题文字
			type:String,
			default:'请选择日期时间'
		},
		placeholder:{
			type:String,
			default:'请选择日期时间'
		}
	})
	
	const pickerViewValue = ref([0,0,0,0,0])
	
	const yearOptions = ref([])
	const monthOptions = ref([])
	const dayOptions = ref([])
	function refreshYearOptions(){
		yearOptions.value = useDatePickerYear(props.dateStart, props.dateEnd, 'YYYY-MM-DD')
	}
	function refreshMonthOptions(year){
		monthOptions.value = useDatePickerMonth(props.dateStart, props.dateEnd, 'YYYY-MM-DD', year || model.value)
	}
	function refreshDayOptions(yearMonth){
		dayOptions.value = useDatePickerDay(props.dateStart, props.dateEnd, 'YYYY-MM-DD', yearMonth || model.value)
	}
	
	const hourOptions = ref([])
	const minuteOptions = ref([])
	/**
	 * 刷新小时的可选数据
	 */
	function refreshHourOptions(){
		hourOptions.value = useTimePickerHour(props.timeStart, props.timeEnd)
	}
	/**
	 * 刷新分钟的可选数据
	 */
	function refreshMinuteOptions(hour){
		minuteOptions.value = useTimePickerMinute(props.timeStart, props.timeEnd, hour || model.value)
	}

	function initOptions(){
		const [yearIndex, monthIndex] = pickerViewValue.value
		
		refreshYearOptions()
		refreshMonthOptions(yearOptions.value[yearIndex])
		refreshDayOptions(`${yearOptions.value[yearIndex]}-${monthOptions.value[monthIndex]}`)
		refreshHourOptions()
		refreshMinuteOptions()
	}
	onMounted(() => {
		initOptions()
	})
	
	function setDefaultValue() {
		if(model.value) {
			const [year, month, day] = moment(model.value,'YYYY-MM-DD HH:mm').format('YYYY-M-D').split('-')
			const yearIndex = yearOptions.value.findIndex(el => el == year);
			
			refreshMonthOptions(yearOptions.value[yearIndex])
			
			const monthIndex = monthOptions.value.findIndex(el => el == month);
			
			refreshDayOptions(`${yearOptions.value[yearIndex]}-${monthOptions.value[monthIndex]}`)
			
			const dayIndex = dayOptions.value.findIndex(el => el == day);
			
			const [ hour, minute ] = moment(model.value,'YYYY-MM-DD HH:mm').format('HH:mm').split(':')
			const hourIndex = hourOptions.value.findIndex(el => el == hour)
			const minuteIndex = minuteOptions.value.findIndex(el => el == minute)
			
			pickerViewValue.value = [yearIndex, monthIndex, dayIndex, hourIndex, minuteIndex]
		}else {
			pickerViewValue.value = [0, 0, 0, 0, 0 ]
		}
		
	}
	
	function pickerViewChange(e){
		/**
		 *  日期和时间的限制互不关联
		 */
		const [ yearIndex, monthIndex, dayIndex, hourIndex, minuteIndex ] = e.detail.value
		if(yearIndex !== pickerViewValue.value[0]) {
			pickerViewValue.value[0] = yearIndex
			refreshMonthOptions((yearOptions.value[yearIndex]).toString())
			refreshDayOptions(`${yearOptions.value[yearIndex]}-${monthOptions.value[monthIndex]}`)
		}else if(monthIndex !== pickerViewValue.value[1]) {
			pickerViewValue.value[1] = monthIndex
			refreshDayOptions(`${yearOptions.value[yearIndex]}-${monthOptions.value[monthIndex]}`)
		}else if(dayIndex !== pickerViewValue.value[2]){
			pickerViewValue.value[2] = dayIndex
		}else if(hourIndex !== pickerViewValue.value[3]) {
			pickerViewValue.value[3] = hourIndex
			refreshMinuteOptions(hourOptions.value[hourIndex])
		}else if(minuteIndex !== pickerViewValue.value[4]) {
			pickerViewValue.value[4] = minuteIndex
		}
	}
	
	
	// uni-popup
	const dateTimePickerRef = ref(null)
	const popupState = ref(false)
	function show(){
		dateTimePickerRef.value.open()
		
		setDefaultValue()
	}
	function hide(){
		dateTimePickerRef.value.close()
	}
	// popup组件状态发生变化触发
	function popupChange(e){
		popupState.value = e.show
		emits('popupChange',e)
	}
	function confirm(){
		const [yearIndex, monthIndex, dayIndex, hourIndex, minuteIndex] = pickerViewValue.value
		const date = moment(`${yearOptions.value[yearIndex]}-${monthOptions.value[monthIndex]}-${dayOptions.value[dayIndex]}`,'YYYY-M-D').format('YYYY-MM-DD')
		const time = moment(`${hourOptions.value[hourIndex]}:${minuteOptions.value[minuteIndex]}`,'H:m').format('HH:mm')
		model.value = `${date} ${time}`
		hide()
		emits('confirm',model.value)
	}
	function cancel(){
		hide()
		emits('cancel')
	}
	defineExpose({
		show,
		hide
	})
</script>
<template>
	<view class="date-time-picker">
		<!-- 选中的日期时间 -->
		<view @click="show">
			<slot name="default" :datetime="model" :popup-state="popupState">
				<view>{{ model || placeholder }}</view>
			</slot>
		</view>
		<uni-popup ref="dateTimePickerRef" type="bottom" background-color="#fff" :is-mask-click="isMaskClick" @change="popupChange">
			<view class="popup-content">
				<view class="popup-title">{{ title }}</view>
				<picker-view :value="pickerViewValue" indicator-style="height:50px;" class="picker-view" @change="pickerViewChange">
					<picker-view-column>
						<view class="column-item" v-for="(year,index) in yearOptions" :key="index">{{ year }}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="column-item" v-for="(month,index) in monthOptions" :key="index">{{ month }}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="column-item" v-for="(day,index) in dayOptions" :key="index">{{ day }}日</view>
					</picker-view-column>
					<picker-view-column>
						<view class="column-item" v-for="(hour, index) in hourOptions" :key="index">{{ hour }}时</view>
					</picker-view-column>
					<picker-view-column>
						<view class="column-item" v-for="(minute, index) in minuteOptions" :key="index">{{ minute }}分</view>
					</picker-view-column>
				</picker-view>
				<view class="popup-footer">
					<view class="picker-cancel" @click="cancel">取消</view>
					<view class="picker-confirm" @click="confirm">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<style lang="scss" scoped>
	@use '@/styles/customPopup.scss' as customPopupScss;
	.date-time-picker {
		@include customPopupScss.customPopup;
	}
</style>