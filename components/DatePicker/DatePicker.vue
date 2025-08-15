<script setup>
	import moment from "moment"
	import { useDatePickerDay, useDatePickerMonth, useDatePickerYear } from "./useDatePicker"
	
	const model = defineModel({ type:String })
	const props = defineProps({
		pickerType:{
			type:String,
			default:'date' // 可选值为：year / yearMonth / date
		},
		dateStart:{ // 可选起始日期
			type:String,
			default:'1900-01-01'
		},
		dateEnd:{ // 可选的截止日期
			type:String,
			default:''
		},
		title:{ // 弹窗顶部居中的标题文字
			type:String,
			default:'请选择日期'
		},
		isMaskClick:{ // 点击蒙层是否关闭
			type:Boolean,
			default:false
		},
		placeholder:{
			type:String,
			default:'请选择日期'
		},
		defaultDate:{ // 日期选择器打开时默认选中的日期
			type:String,
			default:''
		}
	})
	const emits = defineEmits(['popupChange','confirm','cancel'])
	
	const pickerViewValue = ref([0,0,0])
	const yearOptions = ref([])
	const monthOptions = ref([])
	const dayOptions = ref([])
	
	// 是否需要加载月份数据
	const loadMonth = computed(() => {
		return props.pickerType === 'yearMonth' || props.pickerType === 'date'
	})
	// 是否需要加载天数数组
	const loadDay = computed(() => {
		return props.pickerType === 'date'
	})
	
	const valueFormat = computed(() => {
		let formatStr = ''
		switch(props.pickerType) {
			case 'year':formatStr = 'YYYY';break
			case 'yearMonth':formatStr = 'YYYY-MM';break
			case 'date':formatStr = 'YYYY-MM-DD';break
			default: formatStr = 'YYYY-MM-DD'; break
		}
		return formatStr
	})
	
	function refreshYearOptions(){
		yearOptions.value = useDatePickerYear(props.dateStart, props.dateEnd, valueFormat.value)
	}
	function refreshMonthOptions(year){
		monthOptions.value = useDatePickerMonth(props.dateStart, props.dateEnd, valueFormat.value, year || model.value)
	}
	function refreshDayOptions(yearMonth){
		dayOptions.value = useDatePickerDay(props.dateStart, props.dateEnd, valueFormat.value, yearMonth || model.value)
	}
	onMounted(() => {
		refreshYearOptions()
		const [yearIndex, monthIndex] = pickerViewValue.value
		if(loadMonth.value) refreshMonthOptions(props.defaultDate || yearOptions.value[yearIndex])
		if(loadDay.value) refreshDayOptions(props.defaultDate || `${yearOptions.value[yearIndex]}-${monthOptions.value[monthIndex]}`)
	})
	
	
	// 设置默认选中值
	function setDefaultValue(){
		if(model.value) {
			const [year, month, day] = moment(model.value,'YYYY-MM-DD').format('YYYY-M-D').split('-')
			const yearIndex = yearOptions.value.findIndex(el => el == year);
			
			if(loadMonth.value) refreshMonthOptions(yearOptions.value[yearIndex])
			
			const monthIndex = monthOptions.value.findIndex(el => el == month);
			
			if(loadDay.value) refreshDayOptions(`${yearOptions.value[yearIndex]}-${monthOptions.value[monthIndex]}`)
			
			const dayIndex = dayOptions.value.findIndex(el => el == day);
			pickerViewValue.value = [yearIndex, monthIndex, dayIndex]
		}else {
			if(props.defaultDate) {
				pickerViewValue.value = [
					yearOptions.value.findIndex(el => el == moment(props.defaultDate).format('YYYY')),
					monthOptions.value.findIndex(el => el == moment(props.defaultDate).format('M')),
					dayOptions.value.findIndex(el => el == moment(props.defaultDate).format('D'))
				]
			}else {
				// 空值默认选中第一项
				pickerViewValue.value = [0,0,0]
			}
		}
		
	}
	
	function pickerViewChange(e) {
		const [ yearIndex, monthIndex, dayIndex ] = e.detail.value
		if(yearIndex !== pickerViewValue.value[0]) {
			pickerViewValue.value[0] = yearIndex
			if(loadMonth.value) refreshMonthOptions((yearOptions.value[yearIndex]).toString())
			if(loadDay.value) refreshDayOptions(`${yearOptions.value[yearIndex]}-${monthOptions.value[monthIndex]}`)
		}else if(monthIndex !== pickerViewValue.value[1]) {
			pickerViewValue.value[1] = monthIndex
			if(loadDay.value) refreshDayOptions(`${yearOptions.value[yearIndex]}-${monthOptions.value[monthIndex]}`)
		}else {
			pickerViewValue.value[2] = dayIndex
		}
	}
	
	function confirm(){
		const [yearIndex,monthIndex,dayIndex] = pickerViewValue.value
		model.value = moment(`${yearOptions.value[yearIndex]}-${monthOptions.value[monthIndex]}-${dayOptions.value[dayIndex]}`,'YYYY-M-D').format(valueFormat.value)
		hide()
		emits('confirm', model.value)
	}
	function cancel(){
		hide()
		emits('cancel')
	}
	
	
	// uni-popup
	const datePickerPopupRef = ref(null)
	const popupState = ref(false)
	function show(){
		datePickerPopupRef.value.open()
		setDefaultValue()
	}
	function hide(){
		datePickerPopupRef.value.close()
	}
	// popup组件状态发生变化触发
	function popupChange(e){
		popupState.value = e.show
		emits('popupChange',e)
	}
	defineExpose({
		show,
		hide
	})
</script>
<template>
	<view class="date-picker">
		<!-- 选中日期展示 -->
		<view @click="show">
			<slot name="default" :date="model" :popup-state="popupState">
				<view>{{ model || placeholder }}</view>
			</slot>
		</view>
		<uni-popup ref="datePickerPopupRef" :is-mask-click="isMaskClick" type="bottom" background-color="#fff" @change="popupChange">
			<view class="popup-content">
				<view class="popup-title">{{ title }}</view>
				<picker-view :value="pickerViewValue" indicator-style="height:50px" class="picker-view" @change="pickerViewChange">
					<picker-view-column>
						<view class="column-item" v-for="(year,index) in yearOptions" :key="index">{{ year }}年</view>
					</picker-view-column>
					<picker-view-column v-if="valueFormat.startsWith('YYYY-MM')">
						<view class="column-item" v-for="(month,index) in monthOptions" :key="index">{{ month }}月</view>
					</picker-view-column>
					<picker-view-column v-if="valueFormat.startsWith('YYYY-MM-DD')">
						<view class="column-item" v-for="(day,index) in dayOptions" :key="index">{{ day }}日</view>
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
	.date-picker {
		@include customPopupScss.customPopup;
	}
</style>