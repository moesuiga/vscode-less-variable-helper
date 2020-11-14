# less-variable-helper

为了在一个less文件中能方便的使用引入的其他less文件中定义的变量。

## 已知 bug

- 新增 `@import` 导入 less 定义文件后，未保存状态下，无法提示导入的文件中的变量。
  需要在新增 `@import "path/to/less"` 后保存一次文件，之后才会有导入文件中的变量提示。

## 别名 alias 支持

在项目根目录下创建 `.lesshelperrc.js`/`.lesshelperrc.json`/`.lesshelperrc` 等文件，
导出一个包含 `alias` 属性的对象即可。

示例：

```js
// .lesshelperrc.js
module.exports = {
  alias: {
    '@/': './src/',
    '@styles/': './assets/styles/'
  }
}
```
