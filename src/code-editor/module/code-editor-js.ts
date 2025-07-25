import { Compartment, Extension } from '@codemirror/state';
import { EditorView } from 'codemirror';

import { esLint, javascript, javascriptLanguage, scopeCompletionSource } from '@codemirror/lang-javascript';
import { linter, lintGutter } from '@codemirror/lint';
import * as prettierPluginBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import Linter from 'eslint4b-prebuilt';
import { AutoCompleteModel } from '../interfaces';
import { ESLINT_CONFIG } from '../interfaces/eslint.config';
import { CodeEditorContextualService } from '../services/CodeEditorContextualService';

export class ExtraService {

    // 上下文服务实例
    private codeEditorContextualService = new CodeEditorContextualService();
    // 自动补全列表
    private _completeConf = new Compartment();
    // 是否需要全局变量
    private isNeedWindow: boolean = true;

    /**
     * @description 获取 js 编辑器需要的扩展项
     * @param {AutoCompleteModel[]} autoComplete 编辑器关键字的自动补全提示
     * @param {boolean} isNeedWindow 是否需要全局变量
     * @param {jsx?: boolean;typescript?: boolean;} config
     * @return {Extension[]}
     */
    public getExtensions(keywordMatching: AutoCompleteModel[] = [], isNeedWindow: boolean = true, config?: {
        jsx?: boolean;
        typescript?: boolean;
    }): Extension[] {
        this.isNeedWindow = isNeedWindow;
        // keywordMatching = [
        //     { label: 'match', type: 'keyword' },
        //     { label: 'hello', type: 'variable', info: '(World)' },
        //     { label: 'magic', type: 'text', apply: '⠁⭒*.✩.*⭒⠁', detail: 'macro' }
        // ];
        // js补全提示拓展
        const jsCompletions = this.jsCompletions(keywordMatching, isNeedWindow);
        // eslint配置
        const esLintConfig = {
            'parserOptions': { ecmaVersion: 2019, sourceType: 'module' },
            'env': {
                browser: true, es6: true, es2015: true, es2017: true, es2020: true
            },
            'rules': {
                // 关闭 ESLint 的分号检查
                'semi': 0,
                // 强制使用英文分号
                'semi-style': ['error', 'last'],
                ...ESLINT_CONFIG
            },
        };
        // 错误提示可配置多语言
        const source = (view: EditorView) => {
            const lint = esLint(new Linter(), esLintConfig);
            const result = lint(view);
            result.forEach((item: any, index) => {
                const regex = /eslint:(.+)/;
                const match = item.source.match(regex);
                if (match) {
                    const key = match[1].trim();
                    // item.message = this.euiI18nService.i18nTrans(ERROR_LABEL[item.severity]) + ': ' + this.euiI18nService.i18nTrans(ERROR_LABEL[key]);
                    item.source = '';
                }
            });
            return result;
        };

        // 获取上下文补全
        const contextual = this.codeEditorContextualService.getAutoCompleteConf(javascriptLanguage, keywordMatching);

        // js配置
        const jsExtensions = [
            javascript(config),
            // jsSnippets,
            lintGutter(),
            linter(source),
            // 自动补全
            this._completeConf.of(javascriptLanguage.data.of({
                autocomplete: jsCompletions,
            })),
            // 上下文自动补全
            contextual,
        ];
        return jsExtensions;
    }
    // js自动补全配置处理
    private jsCompletions(keywordMatching: AutoCompleteModel[] = [], isNeedWindow: boolean = true) {
        const Identifier = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/;
        return (context) => {
            const word = context.matchBefore(/\w*/);

            if (word?.from == word?.to && !context.explicit) {
                return null;
            }
            let result: any = {
                from: word?.from,
                options: [],
                validFor: Identifier
            };
            // 需要全局变量时
            if (isNeedWindow) {
                const jsWindowCompletions = scopeCompletionSource(window);
                const windowOptions = jsWindowCompletions(context);
                if (windowOptions) {
                    result = windowOptions;
                }
            }
            if (keywordMatching && keywordMatching.length) {
                result.options = [
                    ...result.options,
                    ...keywordMatching,
                ];
            }
            return result;
        };
    }
    /**
     * 格式化数据
     * @param editor 编辑器实例
     * @param type 编辑器类型
     */
    public format(editor: EditorView) {
        const cursorOffset = editor.state.selection.main.head;
        return {
            parser: 'babel',
            plugins: [prettierPluginBabel, prettierPluginEstree],
            cursorOffset,
            useTabs: true,
        };
    }
    // 更新编辑器个别属性
    public setAutoCompleteConf(editor: EditorView, value): void {
        this.codeEditorContextualService.updateAutoCompleteList(value);
        const jsCompletions = this.jsCompletions(value, this.isNeedWindow);
        const effects = this._completeConf.reconfigure(value ? javascriptLanguage.data.of({
            autocomplete: jsCompletions,
        }) : []);
        editor?.dispatch({ effects });
    }
}

