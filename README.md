# less-variable-helper

为了在一个less文件中能方便的使用引入的其他less文件中定义的变量。

## 已知问题

- 新增 `@import` 导入 less 定义文件后，未保存状态下，无法提示导入的文件中的变量。
  需要在新增 `@import "path/to/less"` 后保存一次文件，之后才会有导入文件中的变量提示。

## 配置文件

支持在项目根目录下创建 `.lesshelperrc.js`/`.lesshelperrc.json`/`.lesshelperrc` 等文件。

支持属性：

- `alias`: 自定义别名，如 `"@/": "./src/"`
- `glob`: 文件监听路径匹配，默认值 `**/*.{vscode配置中的less文件扩展名列表}`。
  建议自定义时，以 `**/` 开头，如 `**/src/**/*.less`
- `exclude`: 忽略文件路径匹配，默认值 `**/node_modules/**`，
  建议自定义时，以 `**/` 开头
- `maxResults`: 查找文件的结果上限数，默认全部结果。

示例：

```js
// .lesshelperrc.js
module.exports = {
  alias: {
    '@/': './src/',
    '@styles/': './assets/styles/'
  },
  glob: '**/src/**/*.less',
  exclude: '**/src/test/**/*.less'
}
```
