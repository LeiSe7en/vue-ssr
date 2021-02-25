# vue-ssr from scratch

### TODO List

- [x] 配置webpack完成渲染一个简单的vue渲染的页面。简单的渲染出来一个Hello world.

- [x] 配置webpack完成渲染.vue文件

- [ ] 增加HTML-Webpack-Plugin自动生成HTML文件

- [ ] 配置webpack完成devServer可以有一个开发的服务器Hot reload



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

接下来需要引入Html-webpack-plugin来自动生成html模板放到dist文件夹下面

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

加入dev server之后，发现已经可以随着更改代码动态编译，但是不知道这个是不是HRM(也就是不知道是否只是更新页面的展示，保留页面的状态，而不是刷新页面)，所以加一个修改页面状态的测试

```JS
// HomePage.vue
<div>
  I am Home page: 
  {{message}} {{desc}}
  <div>
    <input type="text" v-model="desc"/>
  </div>
</div>
```
在输入框输入文本之后，能在message之后展示出来。但是如果我修改代码，页面上input输入的文本就消失了，*目测*是页面还是刷新了，没有保留状态.通过阅读文档，发现应该开启HRM才能 _局部替换模块_，所以在`webpack.config.js`的deveServer中加入`hot:true`, 测试发现的确保留了状态。关于HRM，参考资料如下：
> [What exactly is Hot Module Replacement in Webpack?](https://stackoverflow.com/questions/24581873/what-exactly-is-hot-module-replacement-in-webpack)

