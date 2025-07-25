# Code Editor

一个基于 CodeMirror v6 的 React 代码编辑器组件，支持多种语言（SQL、JavaScript、HTML、JSON、计算公式等）和丰富的功能。

## 特性

- 支持多种语言模式：SQL、JavaScript、HTML、JSON、计算公式、Mermaid
- 语法高亮
- 代码自动补全
- 代码格式化（使用 Prettier）
- 关键字匹配高亮
- 搜索和替换功能
- 可自定义主题和配置

## 安装

```bash
npm install kui-code-editor
```

## 使用
```js
import { CodeEditor } from 'kui-code-editor';
import 'kui-code-editor/style.css';

function App() {
  return (
    <CodeEditor
      value="console.log('Hello World');"
      editorType="JS"
      onChange={(value) => console.log(value)}
    />
  );
}
```


## 属性
| 属性名          | 类型                                                   | 描述                     |
| --------------- | ------------------------------------------------------ | ------------------------ |
| value           | string                                                 | 编辑器的初始值           |
| editorType      | CodeEditorType                                         | 编辑器类型               |
| autoComplete    | AutoCompleteModel[]                                    | 自动补全列表             |
| indentUnit      | number                                                 | 缩进单位                 |
| placeholder     | string                                                 | 提示文字                 |
| lineWrapping    | boolean                                                | 是否启用行换行           |
| autoFocus       | boolean                                                | 是否自动聚焦             |
| inclusive       | boolean                                                | 是否将关键字匹配视为整体 |
| keywordMatching | KeywordMatchingModel[]                                 | 关键字匹配列表           |
| initMatchList   | any[]                                                  | 初始化匹配列表           |
| keyMap          | KeyMapModel[]                                          | 键盘映射                 |
| customMatchRule | (keyword: string) => (contentDOM: HTMLElement) => any; | 自定义匹配规则           |
| onClickMirror   | (event: MouseEvent) => void;                           | 点击编辑器时的回调       |
| matchListChange | (matchList: any[]) => void;                            | 匹配列表变化时的回调     |
| onChange        | (value: string) => void;                               | 编辑器内容变化时的回调   |
| loaded          | (value: string) => void;                               | 编辑器加载完成时的回调   |

## Interfaces
AutoCompleteModel
编辑器关键字的自动补全提示

| 属性     | 类型                | 说明                                                                          |
| -------- | ------------------- | ----------------------------------------------------------------------------- |
| label    | string              | 关键字                                                                        |
| type     | AutoCompleteType    | 关键字的类型; (关键字前的图标, 不同类型对应不同图标)                          |
| info     | string              | 选择完成时显示的附加信息。可以是纯字符串或在调用时呈现 DOM 结构以显示的函数。 |
| detail   | string              | 在标签后显示的可选短信息                                                      |
| children | AutoCompleteModel[] | 上下文补全提示，当前关键字按"."键触发，会显示上下文补全提示                   |

KeywordMatchingModel
关键字匹配
| 属性       | 类型                                                         | 说明                   |
| ---------- | ------------------------------------------------------------ | ---------------------- |
| label      | string                                                       | 关键字                 |
| attributes | { id?: string; 'data-tooltip'?: string; [key: string]: any } | 自定义属性             |
| className  | string                                                       | 设置关键字的样式类名   |
| tagName    | string                                                       | 包裹层的标签。默认span |
| inclusive  | boolean                                                      | 匹配字段是否看为整体。 |
| children   | KeywordMatchingModel[]                                       | 上下文关键字列表       |


SearchFormModel
搜索表单的表单模型
| 属性          | 类型    | 说明             |
| ------------- | ------- | ---------------- |
| search        | string  | 要搜索的字符串   |
| caseSensitive | boolean | 是否区分大小写   |
| wholeWord     | boolean | 是否启用全字匹配 |
| replace       | string  | 要替换的字符串   |


KeyMapModel
键盘映射模型
| 属性 | 类型              | 说明             |
| ---- | ----------------- | ---------------- |
| key  | string            | win键盘映射按键  |
| mac  | AutoCompleteType  | mac键盘映射按键  |
| run  | (view) => boolean | 运行时触发的按键 |
