import { defineConfig } from "vite"
import AutoImport from "unplugin-auto-import/vite"
import uni from "@dcloudio/vite-plugin-uni"

export default defineConfig({
	plugins:[
		uni(),
		AutoImport({
			// 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
			imports:['vue']
		})
	]
})