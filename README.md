# less-variable-helper

为了在一个less文件中能方便的使用引入的其他less文件中定义的变量。

## 已知 bug

- 新增 `@import` 导入 less 定义文件后，未保存状态下，无法提示导入的文件中的变量。
  需要在新增 `@import "path/to/less"` 后保存一次文件，之后才会有导入文件中的变量提示。
