setup 生命周期入口
readonly 将数据变为只读，不可修改
ref,reactive 通过 proxy 创建响应式属性
getCurrentInstance 获取当前组件实例

toRefs 由于使用 es6 的解构方式解构 reactive 创建的对象的话，会丧失响应式，使用 torefs 来解构就不会了

defineProps 获取父组件传来的 props（只有数据，没有方法）
defineEmits 获取父组件传来的方法（只有方法没有数据） 低版本 vue 为 defineEmit
defineExpoes 子组件将自身数据暴露，父组件通过子组件实例获取

defineAsyncComponent 异步加载组件

provide/inject 可实现数据共享，父组件 provide 数据，子孙组件 inject 获取数据，配合 vue3 ref 与 reactive 的响应式属性

watch 初始化不会执行，且需要指定依赖
watchEffect 初始化就会执行,没有指定数据的操作，在函数内部使用到的数据，都会自动监听

生命周期：
beforeCreate 与 created 都直接使用 setup
beforeMount -> onBeforeMount
mounted -> onMounted
beforeUpdate -> onBeforeUpdate
updated -> onUpdated
beforeDestroy -> onBeforeUnmount
destroyed -> onUnmounted
errorCaptured -> onErrorCaptured

Teleport 组件可以直接加载到指定元素下面
