/** 编辑器类型 */
export type CodeEditorType =
    | 'SQL' // SQL 编辑器
    | 'JS' // JavaScript 编辑器
    | 'HTML' // htm 编辑器
    | 'FORMULA' // 计算公式
    | 'JSON' // JSON 编辑器
    | 'DYNAMIC' // 动态编辑器
    | 'MERMAID' // MERMAID
    | null;  // 纯净模式



/** 编辑器关键字的自动补全提示 */
export interface AutoCompleteModel {
    /** 关键字 */
    label: string;

    /** 关键字的类型; (关键字前的图标, 不同类型对应不同图标) */
    type?: AutoCompleteType;

    /** 选择完成时显示的附加信息。可以是纯字符串或在调用时呈现 DOM 结构以显示的函数。 */
    info?: string;

    /** 在标签后显示的可选短信息 */
    detail?: string;

    /** 
     * @description 上下文补全提示
     * @description 当前关键字按"."键触发，会显示上下文补全提示
     *  */
    children?: AutoCompleteModel[];

    // other
    [key: string]: any;
}


/**
 * @description 关键字匹配
 */
export interface KeywordMatchingModel {
    /** 关键字 */
    label: string;

    /**
     * 自定义属性
     * attributes: {
     *    // 设置关键字的行内样式
     *    style: 'eui.code_editor.color: red;',
     *
     *    // 为关键字添加 aria-click 属性标识
     *    'aria-click': true,
     * }
     */
    attributes?: {
        // id会添加到属性中，当存在上下文时，必填id，这样才能记录路径
        id?: string;
        // 内置tooltip提示
        'data-tooltip'?: string;
        [key: string]: any
    };

    /** 设置关键字的样式类名 */
    className?: string;

    /** 包裹层的标签。默认span */
    tagName?: string;

    // 匹配字段是否看为整体。
    inclusive?: boolean;

    /** 上下文关键字列表 */
    children?: KeywordMatchingModel[];
}



/** 搜索表单的表单模型 */
export interface SearchFormModel {
    /** 要搜索的字符串 */
    search: string;

    /** 是否区分大小写  */
    caseSensitive?: boolean;

    /** 是否启用全字匹配 */
    wholeWord?: boolean;

    /** 要替换的字符串 */
    replace?: string;
}

// 键盘映射模型
export interface KeyMapModel {
    // win键盘映射按键
    key: string;
    // mac键盘映射按键
    mac: AutoCompleteType;
    // 运行时触发的按键
    run: (view) => boolean;
}


type AutoCompleteType =
    | 'class' // 类
    | 'constant' // 常量
    | 'enum' // 枚举
    | 'function' // 函数
    | 'interface' // 接口
    | 'keyword' // 关键字
    | 'method' // 方法
    | 'namespace' // 命名空间
    | 'property' // 属性
    | 'text'  // 文本
    | 'type' // 类型
    | 'variable' // 变量
    | 'test' // 测试
    | 'table' // 表
    | 'fields' // 字段
    ;

// 图标
export const CompleteTypeClass = {
    'class': 'icon-class',
    'constant': 'icon-file-article',
    'enum': 'icon-vote-style',
    'function': 'icon-function',
    'interface': 'icon-structure-department',
    'keyword': 'icon-key',
    'method': 'icon-custom-selector',
    'namespace': 'icon-space',
    'property': 'icon-flow-monitor',
    'text': 'icon-text',
    'type': 'icon-cube',
    'variable': 'icon-data-origin',
    'test': 'icon-source-code',
    'table': 'icon-form-table',
    'fields': 'icon-fields',
}
// 公开方法
export enum PublicMethod {
    insertText = 'insertText',
    verify = 'verify',
    getCursor = 'getCursor',
    format = 'format',
}


export interface CodeEditorProps {
    value?: string; // 编辑器的初始值
    disabled?: boolean; // 是否禁用编辑器
    editorType?: CodeEditorType; // 编辑器类型
    autoComplete?: AutoCompleteModel[]; // 自动补全列表
    indentUnit?: number; // 缩进单位
    placeholder?: string; // 提示文字
    lineWrapping?: boolean; // 是否启用行换行
    autoFocus?: boolean; // 是否自动聚焦
    inclusive?: boolean; // 是否将关键字匹配视为整体
    keywordMatching?: KeywordMatchingModel[]; // 关键字匹配列表
    initMatchList?: any[] | null; // 初始化匹配列表
    keyMap?: KeyMapModel[]; // 键盘映射
    customMatchRule?: (keyword: string) => (contentDOM: HTMLElement) => any; // 自定义匹配规则
    onClickMirror?: (event: MouseEvent) => void; // 点击编辑器时的回调
    matchListChange?: (matchList: any[]) => void; // 匹配列表变化时的回调
    onChange?: (value: string) => void; // 编辑器内容变化时的回调
    loaded?: (view: any) => void; // 编辑器加载完成时的回调
}
