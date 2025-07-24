/** 编辑器类型 */
export type EoCodeEditorType =
    | 'SQL' // SQL 编辑器
    | 'JS' // JavaScript 编辑器
    | 'HTML' // htm 编辑器
    | 'FORMULA' // 计算公式
    | 'JSON' // JSON 编辑器
    | 'DYNAMIC' // 动态编辑器
    | 'MERMAID' // MERMAID
    | null;  // 纯净模式



/** 工具栏菜单 */
export interface EoToolbarMenuModel {
    /** 菜单标题 */
    title: string;

    /** 鼠标悬浮在菜单上的提示文字 */
    tooltip?: string;

    /**
     * 要向编辑器中插入的内容
     * 会插入到光标所在位置, 或将光标选中的位置替换成给定的值;
     */
    insetContent?: string | ((editorView) => string);

    /**
     * 当前菜单的点击回调事件;
     * 参数 menuItem: 当前点击的菜单项;
     */
    onClick?: (menuItem: EoToolbarMenuModel) => void;

    /** 子菜单; (目前仅支持到二级子菜单) */
    children?: EoToolbarMenuModel[];

    callback?: (editorView) => void;

    // other
    [key: string]: any;
}


/** 编辑器关键字的自动补全提示 */
export interface EoAutoCompleteModel {
    /** 关键字 */
    label: string;

    /** 关键字的类型; (关键字前的图标, 不同类型对应不同图标) */
    type?: EoAutoCompleteType;

    /** 选择完成时显示的附加信息。可以是纯字符串或在调用时呈现 DOM 结构以显示的函数。 */
    info?: string;

    /** 在标签后显示的可选短信息 */
    detail?: string;

    /** 
     * @description 上下文补全提示
     * @description 当前关键字按"."键触发，会显示上下文补全提示
     *  */
    children?: EoAutoCompleteModel[];

    // other
    [key: string]: any;
}


/**
 * @description 关键字匹配
 */
export interface EoKeywordMatchingModel {
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
    children?: EoKeywordMatchingModel[];
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
/**
 * @description 工具栏菜单类型
 * @params EoToolbarMenuModel 自定义
 * @params 'format' 格式化
 */
export type ToolbarMenuType = EoToolbarMenuModel | 'format' | string;

type EoAutoCompleteType =
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
    disabled?: boolean; // 是否禁用编辑器
    value?: string; // 编辑器的初始值
    directiveId?: string; // 指令ID
    editorType?: EoCodeEditorType; // 编辑器类型
    eoToolbarMenu?: ToolbarMenuType[]; // 工具栏菜单
    eoAutoComplete?: EoAutoCompleteModel[]; // 自动补全列表
    eoIndentUnit?: number; // 缩进单位
    eoKeywordMatching?: EoKeywordMatchingModel[]; // 关键字匹配列表
    placeholder?: string; // 占位符文本
    eoInitMatchList?: any[] | null; // 初始化匹配列表
    eoLineWrapping?: boolean; // 是否启用行换行
    eoInsertPlaceholder?: boolean; // 是否启用插入占位符
    autoFocus?: boolean; // 是否自动聚焦
    inclusive?: boolean; // 是否将关键字匹配视为整体
    expanded?: boolean; // 默认展开操作栏
    customMatchRule?: (keyword: string) => (contentDOM: HTMLElement) => any; // 自定义匹配规则
    onClickMirror?: (event: MouseEvent) => void; // 点击编辑器时的回调
    matchListChange?: (matchList: any[]) => void; // 匹配列表变化时的回调
    onChange?: (value: string) => void; // 编辑器内容变化时的回调
    loaded?: (view: any) => void; // 编辑器加载完成时的回调
}
