## [0.0.12](https://github.com/moesuiga/vscode-less-variable-helper/compare/v0.0.11...v0.0.12) (2020-11-29)



## [0.0.11](https://github.com/moesuiga/vscode-less-variable-helper/compare/v0.0.10...v0.0.11) (2020-11-21)


### Bug Fixes

* **delete:** 修复删除被引入的less文件后,依然会有缓存提示 ([7c3baba](https://github.com/moesuiga/vscode-less-variable-helper/commit/7c3babaca62c84b77e352dde84c51846e19b5d9b))
* 修复紧跟行注释后的less变量或mixin无提示 ([868b66e](https://github.com/moesuiga/vscode-less-variable-helper/commit/868b66e6901c9b190a92197e11899bd0294ab2ae))


### Features

* 增加当前文件mixin/class提示支持 ([895ceb4](https://github.com/moesuiga/vscode-less-variable-helper/commit/895ceb45a166decd349cb7820053230baabbaa3f))
* documentation使用markdown的代码格式,并增加注释文本 ([0e4e806](https://github.com/moesuiga/vscode-less-variable-helper/commit/0e4e8063e835ab8ff868c93c0349a491c0014070))



## [0.0.10](https://github.com/moesuiga/vscode-less-variable-helper/compare/v0.0.9...v0.0.10) (2020-11-17)


### Bug Fixes

* **path:** 修复别名与非别名路径匹配不同 ([8178724](https://github.com/moesuiga/vscode-less-variable-helper/commit/817872446f6f238c18bb4224e01cfe78d950a08d))



## [0.0.9](https://github.com/moesuiga/vscode-less-variable-helper/compare/v0.0.8...v0.0.9) (2020-11-14)


### Bug Fixes

* 修复非顶层文件别名路径错误 ([9b1c6c9](https://github.com/moesuiga/vscode-less-variable-helper/commit/9b1c6c95ef6dea5222481772a5e06a0848fd3b8a))



## [0.0.8](https://github.com/moesuiga/vscode-less-variable-helper/compare/v0.0.7...v0.0.8) (2020-11-14)


### Features

* 增加配置文件支持别名 ([b41bf89](https://github.com/moesuiga/vscode-less-variable-helper/commit/b41bf89fffdda5961cd6e5e0f878049e15fbaec4))



## [0.0.7](https://github.com/moesuiga/vscode-less-variable-helper/compare/v0.0.6...v0.0.7) (2020-06-04)


### Performance Improvements

* 优化less mixin提示 ([5705842](https://github.com/moesuiga/vscode-less-variable-helper/commit/5705842119a5751283f385c56b303a9db7271e66))



## [0.0.6](https://github.com/moesuiga/vscode-less-variable-helper/compare/v0.0.5...v0.0.6) (2020-05-20)


### Bug Fixes

* 修复输入 `@` 符号时无变量提示 ([8608408](https://github.com/moesuiga/vscode-less-variable-helper/commit/8608408dd4d544484e2f170a01970d82fd28811e))



## [0.0.5](https://github.com/moesuiga/vscode-less-variable-helper/compare/v0.0.4...v0.0.5) (2019-12-24)


### Bug Fixes

* 修复函数提示 ([541833a](https://github.com/moesuiga/vscode-less-variable-helper/commit/541833aa64840bf7e6de3cf7f3b172890679699f))



## [0.0.4](https://github.com/moesuiga/vscode-less-variable-helper/compare/v0.0.3...v0.0.4) (2019-12-24)


### Features

* 增加函数名提示 ([28298b9](https://github.com/moesuiga/vscode-less-variable-helper/commit/28298b9a59d75b42d6458ef743dd8e0c56fa50eb))



## [0.0.3](https://github.com/moesuiga/vscode-less-variable-helper/compare/v0.0.2...v0.0.3) (2019-12-14)



## [0.0.2](https://github.com/moesuiga/vscode-less-variable-helper/compare/v0.0.1...v0.0.2) (2019-12-14)


### Bug Fixes

* 修复输入 @ 符号后继续输入变量名时，变量提示消失 ([9e14b13](https://github.com/moesuiga/vscode-less-variable-helper/commit/9e14b13a559c737c1231e25a5681063fc47b3985))


### Features

* 增加需要过滤的原生 `@` 规则 ([0612bd9](https://github.com/moesuiga/vscode-less-variable-helper/commit/0612bd90656aa8489a7719bc5e79eb100d83b2bc))



## [0.0.1](https://github.com/moesuiga/vscode-less-variable-helper/compare/f121f4a376de3b715f367982ab68022159a87458...v0.0.1) (2019-12-14)


### Features

* 监视工作区less文件，提取外层变量 ([f121f4a](https://github.com/moesuiga/vscode-less-variable-helper/commit/f121f4a376de3b715f367982ab68022159a87458))
* 只提示通过 `import` 引入的less文件中的变量 ([37aed37](https://github.com/moesuiga/vscode-less-variable-helper/commit/37aed3723cef208b6f6fc6d247f0f450e8db49e5))



