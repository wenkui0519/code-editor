import { Compartment, EditorState, Extension } from '@codemirror/state';
import { EditorView, keymap, Panel, placeholder } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { search } from '@codemirror/search';
import { forEachDiagnostic } from '@codemirror/lint';
import { AutoCompleteModel, CodeEditorType, SearchFormModel } from '../interfaces';
import { basicSetup } from 'codemirror';
import { indentUnit } from '@codemirror/language';
import { format, formatWithCursor } from 'prettier';
import { autocompletionWord, getBaseTheme, replaceChineseComma } from './CodeEditorUtilsService';
import { CodeEditorKeywordService } from './codeEditorKeyword';

export class CodeEditorBaseService {
    codeEditorKeywordService = new CodeEditorKeywordService();


    private disabled = false;
    // 语言包类
    private baseClass: any;
    // 编辑器格式化中
    private isFormatting = false;
    // 提示文字
    private _placeholderConf = new Compartment();
    // 快捷键
    private _keyMapConf = new Compartment();
    // disabled
    private _editableConf = new Compartment();
    // 关键字匹配
    private _keywordMatching = new Compartment();
    // 初始化编辑器配置参数列表缓存
    private _editorConfigPrams: any = {};
    // 已匹配参数列表
    public matchList: any[] = [];

    // 创建编辑器实例
    async getEditor(config: any): Promise<EditorView> {
        // 缓存参数
        this._editorConfigPrams = config;

        const extensions = await this.createExtensions(config);

        const state = EditorState.create({
            doc: config.doc || '',
            extensions
        });

        const editorView = new EditorView({
            state,
            parent: config.element
        });

        // 自动聚焦
        if (config.autoFocus) {
            let timer = setTimeout(() => {
                editorView.focus();
                clearTimeout(timer);
                timer = null;
            }, 100);
        }

        // 快捷键
        const baseKeyMapList = [...defaultKeymap, indentWithTab, {
            key: 'Alt-F', // SHIFT+ALT+F格式化
            mac: "Alt-F", // SHIFT+OPTION+F
            run: (view) => {
                this.format(view, config.editorType);
                return true;
            },
        }];
        // 如果有自定义快捷键映射
        if (config.keyMap?.length) {
            config.keyMap.forEach((item: any) => {
                if (item.key && item.run) {
                    baseKeyMapList.push({
                        key: item.key,
                        mac: item.mac || item.key,
                        run: (view) => {
                            return item.run(view);
                        },
                    });
                }
            });
        }
        this.setEditorProperty(editorView, 'keyMap', baseKeyMapList);
        // 提示文字
        if (config.placeholder) {
            this.setEditorProperty(editorView, 'placeholder', config.placeholder);
        }
        // 编辑状态
        if (this.disabled) {
            this.setEditorProperty(editorView, 'disabled', this.disabled);
        }
        // 关键字匹配配置
        if (config.keywordMatching?.length) {
            this.setEditorProperty(editorView, 'keywordMatching', config.keywordMatching);
        }

        return editorView;
    }
    // 设置编辑器Extensions
    private async createExtensions(config: any = {}): Promise<Extension[]> {
        let baseExtensions: Extension[] = [
            basicSetup,
            // 基本样式主题
            getBaseTheme(),
            // 自动关键字补全配置
            autocompletionWord(),
            // 输入时替换中文符号
            replaceChineseComma(),
            // 缩进单位
            indentUnit.of(config.indentUnit === 2 ? '  ' : '    '),
            // 搜索
            this.getSearchExtensions(config.searchElement),
            // 监听编辑器的更改
            this.updateListenerExtension(config.onChange),
            // 提示文字
            this._placeholderConf.of([]),
            // 快捷键
            this._keyMapConf.of([]),
            // 编辑状态
            this._editableConf.of([]),
            // 关键字匹配
            this._keywordMatching.of([]),
        ];

        // 自动换行
        if (config.ineWrapping) {
            baseExtensions.push(EditorView.lineWrapping);
        }

        // 添加不同语言的Extensions
        if (config.editorType) {
            const extraExtensions = await this.getLanguageSupport(config.editorType, config.autoComplete);
            if (extraExtensions) {
                baseExtensions = [
                    ...baseExtensions,
                    ...extraExtensions,
                ]
            }
        }

        return baseExtensions;
    }
    // 获取语言包
    private async getLanguageSupport(type: CodeEditorType, autoComplete: AutoCompleteModel[]) {
        let baseClass;
        switch (type) {
            case 'JS':
                baseClass = (await import('../module/code-editor-js')).ExtraService;
                break;
            case 'HTML':
                baseClass = (await import('../module/code-editor-html')).ExtraService;
                break;
            case 'JSON':
                baseClass = (await import('../module/code-editor-json')).ExtraService;
                break;
            case 'SQL':
                baseClass = (await import('../module/code-editor-sql')).ExtraService;
                break;
            case 'FORMULA':
                baseClass = (await import('../module/code-editor-formula')).ExtraService;
                break;
            case 'MERMAID':
                baseClass = (await import('../module/code-editor-mermaid')).ExtraService;
                break;
            default:
                baseClass = null;
                break;
        }
        // 语言包服务创建
        if (baseClass) {
            this.baseClass = new baseClass(this);
            return this.baseClass.getExtensions(autoComplete);
        }
    }

    /**
     * @description 监听编辑器的更改
     * @param {(doc: string) => void} codeEditorDocChanges 编辑器文档改变时的回调
     * @return {Extension}
     */
    private updateListenerExtension(codeEditorDocChanges: (doc: string) => void): Extension {
        const updateListenerExtension = EditorView.updateListener.of(update => {
            if (update.docChanged && codeEditorDocChanges !== null && codeEditorDocChanges !== undefined) {
                const docStr = update.state.doc.toString();
                codeEditorDocChanges(docStr);
            }
        });

        return updateListenerExtension;
    }

    /**
     * @description 获取 '搜索' 的扩展
     * @param {ElementRef<any>} searchElement 自定义查询模板
     * @return {Extension}
     */
    private getSearchExtensions(searchElement: HTMLDivElement): Extension {
        return search({
            createPanel: (view: EditorView) => {

                const panel: Panel = {
                    top: true,
                    dom: searchElement,
                };

                return panel;
            }
        });
    }
    /**
     * @description 获取搜索面板表单初始值
     * @return {*}  {SearchFormModel}
     */
    public getSearchPaneForm(): SearchFormModel {
        const searchPaneForm: SearchFormModel = {
            search: '',
            caseSensitive: false,
            wholeWord: false,
            replace: '',
        };

        return searchPaneForm;
    }

    /**
     * 格式化数据
     * @param editor 编辑器实例
     * @param type 编辑器类型
     */
    public format(editor: EditorView, type: CodeEditorType) {
        if (this.isFormatting) return;

        if (this.baseClass && this.baseClass.format) {
            this.isFormatting = true;

            const parser = this.baseClass.format(editor);
            let code = editor.state.doc.toString();

            if (!code.trim().length) {
                return;
            }

            // 插入前的预处理
            if (this.baseClass.preprocess) {
                code = this.baseClass.preprocess(code);
            }
            // 计算公式模式只能非光标下格式化
            if (type === 'FORMULA') {
                // 非当前光标下格式化
                format(code, parser).then(formattedCode => {
                    // 插入前的预处理
                    if (this.baseClass.processFormatData) {
                        formattedCode = this.baseClass.processFormatData(formattedCode);
                    }
                    editor.dispatch({
                        changes: { from: 0, to: editor.state.doc.length, insert: formattedCode },
                    });
                    this.isFormatting = false;
                }, error => {
                    if (error.message) {
                        console.log(error.message);
                    } else {
                        console.log(error);
                    }
                    this.isFormatting = false;
                });
            } else {
                // 当前光标下格式化
                formatWithCursor(code, parser).then(formattedCode => {
                    let formatCode = formattedCode.formatted;
                    // 插入前的预处理
                    if (this.baseClass.processFormatData) {
                        formatCode = this.baseClass.processFormatData(formatCode);
                    }
                    // 更新格式化后内容\光标位置
                    editor.dispatch({
                        changes: {
                            from: 0,
                            to: code.length,
                            insert: formatCode,
                        },
                        selection: { anchor: formattedCode.cursorOffset }
                    });
                    this.isFormatting = false;
                }, error => {
                    if (error.message) {
                        console.log(error.message);
                    } else {
                        console.log(error);
                    }
                    this.isFormatting = false;
                });
            }
        }
    }
    // 获取当前编辑器状态
    public getStatus(editor: EditorView): boolean {
        if (!editor) {
            return true;
        }
        let status = true;
        try {
            forEachDiagnostic(editor.state, (diagnostic) => {
                // console.log(diagnostic);
                if (diagnostic.severity == 'error') {
                    status = false;
                    throw new Error();
                }
            });
        } catch (error) { }
        return status;
    }
    // 更新编辑器个别属性
    public setEditorProperty(editor: EditorView, property: 'placeholder' | 'keyMap' | 'disabled' | 'complete' | 'keywordMatching' | any, value: any): void {
        let effects;
        switch (property) {
            case 'placeholder':
                effects = this._placeholderConf.reconfigure(value ? placeholder(value) : []);
                editor?.dispatch({ effects });
                break;
            case 'keyMap':
                effects = this._keyMapConf.reconfigure(value ? keymap.of(value) : []);
                editor?.dispatch({ effects });
                break;
            case 'disabled':
                effects = this._editableConf.reconfigure(value ? EditorView.editable.of(!value) : []);
                editor?.dispatch({ effects });
                break;
            case 'complete':
                if (this.baseClass?.setAutoCompleteConf) {
                    this.baseClass.setAutoCompleteConf(editor, value);
                }
                break;
            case 'keywordMatching':
                let keywordMatching: any = [];
                if (value?.length) {
                    const {
                        customMatchRule,
                        handleClick,
                        initMatchList,
                        inclusive,
                    } = this._editorConfigPrams;
                    const matchListChange = (list: any[]) => {
                        this.matchList = list;
                        if (this._editorConfigPrams.matchListChange) {
                            this._editorConfigPrams.matchListChange(list);
                        }
                    }
                    keywordMatching = this.codeEditorKeywordService.keywordMatching({
                        keywordMatching: value,
                        customMatchRule,
                        matchListChange,
                        handleClick,
                        initMatchList,
                        inclusive
                    });
                }

                effects = this._keywordMatching.reconfigure(keywordMatching);
                editor?.dispatch({ effects });
                break;
            default:
                break;
        }
    }
}