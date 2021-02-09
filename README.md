# vue-ssr from scratch

### TODO List

- [x] 配置webpack完成渲染一个简单的vue渲染的页面。简单的渲染出来一个Hello world.

- [x] 配置webpack完成渲染.vue文件

- [ ] 配置webpack完成devServer可以有一个开发的服务器Hot reload





### TODO List实现过程记录：

对于第一个功能的实现比较简单，就是配置entry以及output，不牵扯到vue的单页面文件，只是单纯的引入vue的依赖，并且new一个vue的实例，创建一个html文件，将打包生成好的文件引入到html。优化的点在于：可以引入一个webpack插件用于动态的插入script标签

第二个功能是需要webpack可以解析.vue的文件，那就需要vue-loader的加持了。牵扯到的webpack的配置点：

1. module.rules
2. plugins 里面需要一个 vue-loader/lib/plugin (目前还不知道为啥要这个plugin)
3. resolve.extensions里面加入.vue的扩展名的支持，这样就不用每次都写 `import Component from 'path/to/component.vue'`了

在引入组件的时候遇到一个问题，代码如下：

```JS
const app = new Vue ({
  el: '#app',
  components: {
    HomePage
  },
  render (h) {
    return h('div', {}, [HomePage])
  }
})
```

这里渲染不出来HomePage这个子组件。后来发现原因是，应该在渲染子组件的时候，调用一下h方法（也就是createElement）。因为好久不用render function了，这点忽略了。正确的写法是：
```JS
const app = new Vue ({
  el: '#app',
  components: {
    HomePage
  },
  render (h) {
    return h('div', {}, [h(HomePage)])
  }
})
```

因为import进来的HomePage其实就是个JS对象，需要传进createElement方法，进行渲染。还需要看看createElement方法做了什么。
