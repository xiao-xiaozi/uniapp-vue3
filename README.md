# uniapp-vue3


## 注意事项

1. 组件自动导入

通过[easycom](https://uniapp.dcloud.net.cn/collocation/pages.html#easycom)可以实现uni-ui以及位于路径：`componnets/组件名称/组件名称.vue`中的组件自动导入。

2. `vue`相关函数/方法自动导入

通过`unplugin-auto-import`插件实现自动导入。

3. 当前uni-app的vue版本是：`v3.4.21`，需要注意vue的部分语法不支持。（如：解构defineProps,useTemplateRef等）


4. `ref`引用元素的写法

在vue3.5之前的版本尚未引入`useTemplateRef()`，需要声明一个与模板里ref attribute匹配的引用。[文档](https://cn.vuejs.org/guide/essentials/template-refs.html)