<script setup>
	import moment from 'moment'
	import { useTimePickerHour, useTimePickerMinute } from './useTimePicker'

	
	const model = defineModel({ type:String })
	const emits = defineEmits(['popupChange','confirm','cancel'])
	const props = defineProps({
		timeStart:{ // 可选的起始时间
			type:String,
			default:'00:00'
		},
		timeEnd:{ // 可选的结束时间
			type:String,
			default:'23:59'
		},
		title:{ // 弹窗顶部居中的标题文字
			type:String,
			default:"请选择时间"
		},
		placeholder:{
			type:String,
			default:'请选择时间'
		},
		isMaskClick:{ // 点击蒙层是否关闭
			type:Boolean,
			default:false
		}
	})
	
	const pickerViewValue = ref([0,0])
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
	onMounted(() => {
		refreshHourOptions()
		refreshMinuteOptions()
	})
	/**
	 * 设置默认选中
	 */
	function setDefaultValue(){
		if(model.value) {
			const [ hour, minute ] = moment(model.value,'HH:mm').format('HH:mm').split(':')
			const hourIndex = hourOptions.value.findIndex(el => el == hour)
			const minuteIndex = minuteOptions.value.findIndex(el => el == minute)
			pickerViewValue.value = [hourIndex, minuteIndex]
		}else {
			pickerViewValue.value = [0,0]
		}
	}
	function pickerViewChange(e){
		const [hourIndex, minuteIndex] = e.detail.value
		if(hourIndex !== pickerViewValue.value[0]) {
			pickerViewValue.value[0] = hourIndex
			refreshMinuteOptions(hourOptions.value[hourIndex])
		}else if(minuteIndex !== pickerViewValue.value[1]) {
			pickerViewValue.value[1] = minuteIndex
		}
	}
	function cancel(){
		hide()
		emits('cancel')
	}
	function confirm(){
		model.value = moment(`${hourOptions.value[pickerViewValue.value[0]]}:${minuteOptions.value[pickerViewValue.value[1]]}`,'H:m').format('HH:mm')
		hide()
		emits('confirm', model.value)
	}
	
	// uni-popup
	const timePickerRef = ref(null)
	const popupState = ref(false)
	function show(){
		timePickerRef.value.open()
		
		refreshHourOptions()
		refreshMinuteOptions()
		setDefaultValue()
	}
	function hide(){
		timePickerRef.value.close()
	}
	function popupChange(e){
		popupState.value = e.show
		emits('popupChange', e)
	}
	
	defineExpose({
		show,
		hide
	})
</script>
<template>
	<view class="time-picker">
		<!-- 选中时间展示 -->
		<view @click="show">
			<slot name="default" :time="model" :popup-state="popupState">
				<view>{{ model || placeholder }}</view>
			</slot>
		</view>
		<uni-popup ref="timePickerRef" :is-mask-click="isMaskClick" type="bottom" background-color="#fff" @change="popupChange">
			<view class="popup-content">
				<view class="popup-title">{{ title }}</view>
				<picker-view :value="pickerViewValue" indicator-style="height:50px;" class="picker-view" @change="pickerViewChange">
					<picker-view-column>
						<view class="column-item" v-for="(hour, index) in hourOptions" :key="index">{{ hour }}时</view>
					</picker-view-column>
					<picker-view-column>
						<view class="column-item" v-for="(minute, index) in minuteOptions" :key="index">{{ minute }}分</view>
					</picker-view-column>
				</picker-view>
				<view class="popup-footer">
					<view class="picker-cancel"@click="cancel">取消</view>
					<view class="picker-confirm" @click="confirm">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<style lang="scss" scoped>
	@use '@/styles/customPopup.scss' as customPopupScss;
	.time-picker {
		@include customPopupScss.customPopup;
	}
</style>