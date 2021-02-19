# vue-ssr from scratch

### TODO List

- [x] 配置webpack完成渲染一个简单的vue渲染的页面。简单的渲染出来一个Hello world.

- [x] 配置webpack完成渲染.vue文件

- [x] 增加HTML-Webpack-Plugin自动生成HTML文件

- [x] 配置webpack完成devServer可以有一个开发的服务器Hot reload
- [x] 抽出webpack的manifest文件
- [x] 抽出第三方依赖到vendeor
- [ ] webpack长缓存



### TODO List实现过程记录：

对于 _第一个_ 功能的实现比较简单，就是配置entry以及output，不牵扯到vue的单页面文件，只是单纯的引入vue的依赖，并且new一个vue的实例，创建一个html文件，将打包生成好的文件引入到html。优化的点在于：可以引入一个webpack插件用于动态的插入script标签

_第二个_ 功能是需要webpack可以解析.vue的文件，那就需要vue-loader的加持了。牵扯到的webpack的配置点：

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

_接下来_需要引入Html-webpack-plugin来自动生成html模板放到dist文件夹下面

> [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin#configuration)

引入之后，简单的生成一个index.html是没有问题的，但是打包的js文件和html文件都在同一层目录，也就是都在dist文件夹下。我想实现的是js相关的文件在`dist/js`下，index.html在`dist`文件夹下。这个目前还没有找到解决办法。目前尝试通过在html-webpack-plugin中设置filename:
```JS
new HtmlWebpackPlugin({
  template: path.join(__dirname, '../index.html'),
  filename: '../index.html',
  title: "Nelson Vue SSR from Scratch"
})
```
的确是在build之后分开了js和html，但是运行devServer却无法找到index.html.

记录一个小技巧：

可以通过访问devserver的`/webpack-dev-server`路径，看到目前内存中的文件结构
eg: 
> `http://localhost:8080/webpack-dev-server`


------
_配置dev server_
因为webpack4 里面内置了devServer，这个会实现一部分HRM的功能，通过添加`hot: true`，可以实现热更新，也就是不用刷新页面，页面的状态会保存下来

---

*接下来*需要抽出一些不长变化的内容，打包成单独的文件，这样可以使浏览器的缓存发挥最大的功能。第一就是vendor第二是manifest。manifest文件就是webpack运行时需要的代码：

配置：
```
optimization: { 
  // 打包公共代码
  splitChunks: {
    chunks: 'all'
  },
  // 打包webpack的运行时代码
  runtimeChunk: {
    name: "manifest"
  }
},
```
参考的文章：
> [guide-performance-optimization-webpack](https://blog.logrocket.com/guide-performance-optimization-webpack/)


