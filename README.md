# vue-ssr from scratch

### TODO List

- [x] 配置webpack完成渲染一个简单的vue渲染的页面。简单的渲染出来一个Hello world.

- [x] 配置webpack完成渲染.vue文件

- [x] 增加HTML-Webpack-Plugin自动生成HTML文件

- [x] 配置webpack完成devServer可以有一个开发的服务器Hot reload
- [x] 抽出webpack的manifest文件
- [x] 抽出第三方依赖到vendeor
- [x] 每次编译之前清空dist文件夹(clean-webpack-plugin)
- [ ] 将css单独抽出成为一个bundle
- [ ] webpack长缓存
- [ ] 服务器渲染首页
  - [ ] 服务器渲染中的fetch以及asyncData的实现
- [ ] 服务器渲染 + vue router
- [ ] 服务器渲染指定的路由页面
- [ ] 服务器渲染 + vuex


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

_接下来_ 需要引入Html-webpack-plugin来自动生成html模板放到dist文件夹下面

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

-----

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
参考的文章(文章中的内容比较老，只是参考思路而已)：
> [guide-performance-optimization-webpack](https://blog.logrocket.com/guide-performance-optimization-webpack/)

-----

_接下来是webpack长缓存_

所谓长缓存就是更大限度的利用浏览器的强缓存或者是协商缓存来使一些公共的不经常改变的依赖可以不占用下载资源。从而达到更快渲染的目的。而webpack打包出来的bundle的名字中存在hash，这个hash什么时候会改变，就会影响缓存是否会命中。

#### 做一个测试：
还是在vue-ssr中，output的filename设置为：
```JS
  module.exports = {
    //......
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: "[name].[hash].js",
      publicPath: '/',
    }
    //......
  }
```
打包之后生成的hash为: `[name].876872882ffea7f2c4b6.js`
然后在HomePage.vue里面随便修改一些内容，再次打包生成的所有的bundle的hash为：`[name].a8b0f95e3b617d335d0a.js`,这里包括vendor、manifest等一些文件的名字，全都改变了。这其实是很没有必要的，因为只是改变了业务代码，而那些第三方依赖的内容并没有改变，会导致缓存失效，从而用户第二次访问网站时需要重新下载全部资源。关于长缓存有个文章写的很全面
> [基于 webpack 的持久化缓存方案](https://github.com/pigcan/blog/issues/9)

具体思路就是使用不同的hash生成策略

##### ChunkHash

> chunkhash根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响

首先将output里面的文件名字改成使用chunkhash

打包一次得到结果：
```JS
main.80bebe8f229b6e204c8c.js
manifest.1682414dda493f27ce54.js
show-hide.703e23e505779595437f.js
vendors~main.a7563996ff47501b2974.js
```

修改HomePage.vue的内容,再次打包

```JS
main.423450c419c0a316faf6.js 
manifest.1682414dda493f27ce54.js
show-hide.703e23e505779595437f.js
vendors~main.a7563996ff47501b2974.js
```
可以看到，我修改了业务代码，但是webpack的runtime chunk和懒加载的组件的hash以及第三方依赖的hash都没有改变。接下来需要考虑如果把css单独抽出成为一个文件的话，这个hash有没有啥变化.

首先需要先让webpack支持在vue的单文件中使用css，本来以为这个会在vueloader中已经存在了，就是不用再做单独的设置，但是发现不行。在vue文件中添加style标签之后，编译的时候直接报错了，需要特定的loader来处理这个css文件(*TODO* 为啥在vue-loader里面会报错，难道vue-loader里面把这个vue文件的css抽出来生成css文件了？)

-----
回答上面的TODO:

> vue-loader will parse the file, extract each language block, pipe them through other loaders if necessary, and finally assemble them back into a CommonJS module whose module.exports is a Vue.js component options object.

参考文档：
> [vue-loader](https://vue-loader-v14.vuejs.org/en/start/spec.html) 

------

所以添加css-loader就好啦
```JS
{
  test: /\.css$/,
  use: [
    'vue-style-loader',
    'css-loader'
  ]
}
```
结果发现编译的时候的确不报错了，但是运行devServer测试的时候，发现样式压根就没有起作用。FUCK.

通过各种搜索终于找到了解决方法以及发生的原因

> [css-loader 4.x.x support](https://github.com/vuejs/vue-style-loader/issues/46)

*原因是*：
在4.x版本，css-loader的esModule选项默认是true。那么esModule的作用是啥？

> By default, css-loader generates JS modules that use the ES modules syntax. There are some cases in which using ES modules is beneficial, like in the case of module concatenation and tree shaking.
> EsModule 如果是true的话，就会使用ES模块的语法来生成css相关的模块，这可能导致vue-style-loader无法解析。

*解决方法*：

使用css-loader的时候加一个options

```JS
  module.exports = {
    // ....
    module: {
      rules: [
        {
          test: /\.css$/,
          loader: "css-loader",
          options: {
            esModule: false,
          }
        }
      ]
    }
  }
```
解决了这个问题之后突然想到还不知道css-loader以及style-loader是怎么把样式添加进来的。所以看了一下运行之后的页面，发现原来style-loader是把样式都动态的添加到了head标签里面。并且不同的组件会单独创建一个style标签.

*再深一步*, 如果给组件的样式加上scoped,会发生什么？
编译之后，得到转换结果是
```
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```
发现生成了一个类似于id的东西，但是目前还是不知道这个东西是啥玩意。(*TODO*)。

鉴于style的工作方式，那么当组件很多的时候，岂不是head里面会有一大堆的样式？？？所以就想到了把css单独抽出来成为一个bundle，这样还可以尝试缓存这个css bundle，还能有效减少html的size，美滋滋。

需要使用的工具是'mini-css-extract-plugin',这个插件需要配合他的内置的loader一起使用。

修改配置：
```JS
  module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {loader: 'vue-style-loader'}
            {loader: MiniCssExtractPlugin.loader}, // 需要在css-loader之后调用
            {loader: 'css-loader', options: {esModule: false}}
          ]
        }

      ]
    }

  }
```
但是打包之后发现生成的文件名是`main.css`，这就有个问题了，如果用户的浏览器缓存了这个main.css, 而我修改了样式，岂不是无法让用户看到？所以我决定还是使用hash的方式来生成css的文件名

修改plugin的option(注意是plugin不是loader.....): 

```JS
  // ....
  plugins: [
    //....
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css'
    })
  ]

```






