import { Compartment, Extension } from '@codemirror/state';
import { EditorView } from 'codemirror';
import { formulaLanguage, formula, esLint } from '../plugins/lang-formula-base';
import { completeFromList } from '@codemirror/autocomplete';

import { lintGutter, linter } from '@codemirror/lint';
import Linter from 'eslint4b-prebuilt';
import * as prettierPluginBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import { ERROR_FILTER, ERROR_LABEL, FORMULA_LINT_CONFIG } from '../interfaces/eslint.config';
import { AutoCompleteModel } from '../interfaces';
import { CodeEditorContextualService } from '../services/CodeEditorContextualService';
import { CodeEditorBaseService } from '../services/CodeEditorBaseService';

export class ExtraService {

    constructor(
        private codeEditorBaseService: CodeEditorBaseService,
    ) {
    }

    // 上下文服务实例
    private codeEditorContextualService = new CodeEditorContextualService();

    // 自动补全列表
    private _completeConf = new Compartment();

    public matchList: Map<string, any> = new Map<string, any>();

    /**
     * @description 获取 FORMULA 编辑器需要的扩展项
     * @param {AutoCompleteModel[]} autoComplete 编辑器关键字的自动补全提示
     * @return {Extension[]}
     */
    public getExtensions(autoComplete: AutoCompleteModel[] = []): Extension[] {
        if (!autoComplete.length) {
            return [];
        }

        // eslint配置
        const esLintConfig = {
            'parserOptions': {
                ecmaVersion: 6,
                sourceType: 'script',
            },
            // 'env': {
            //     browser: true, es6: true, es2015: true, es2017: true, es2020: true
            // },
            'rules': {
                // 关闭 ESLint 的分号检查
                'semi': 0,
                // 强制使用英文分号
                'semi-style': ['error', 'last'],
                ...FORMULA_LINT_CONFIG,
            },
        };
        // 错误提示可配置多语言
        const source: any = (view: EditorView) => {
            const lint = esLint(new Linter(), esLintConfig, this.codeEditorBaseService.matchList);
            let result = lint(view);
            result = result.filter((item) => {
                return !ERROR_FILTER.includes(item.message);
            });
            result.forEach((item) => {
                const regex = /eslint:(.+)/;
                const match = item.source.match(regex);
                if (match) {
                    // const key = match[1].trim();
                    // if (ERROR_LABEL[item.severity]) {
                    //     item.message = this.euiI18nService.i18nTrans(ERROR_LABEL[item.severity]) + ': ' + this.euiI18nService.i18nTrans(ERROR_LABEL[key]);
                    // }
                    item.source = '';
                } else if (item.message.includes('Unexpected token')) {
                    // item.message = this.euiI18nService.i18nTrans('eui.code_editor.syntax_error') + ': ' + this.euiI18nService.i18nTrans('eui.code_editor.unexpected_token');
                    item.source = '';
                }
            });
            return result;

            // const diagnostics: Diagnostic[] = [];
            // const { state } = view
            // const tree = syntaxTree(state)
            // if (tree.length === state.doc.length) {
            //     let pos = null
            //     tree.iterate({
            //         enter: n => {
            //             if (pos == null && n.type.isError) {
            //                 pos = n.from
            //                 return false
            //             }
            //         }
            //     })
            //     if (pos != null)
            //         diagnostics.push({ from: pos, to: pos + 1, severity: 'error', message: '语法错误' });
            // }
            // console.log(diagnostics)

            // return diagnostics;
        };

        // 获取上下文补全
        const contextual = this.codeEditorContextualService.getAutoCompleteConf(formulaLanguage, autoComplete);

        const formulaExtensions = [
            formula(),
            lintGutter(),
            linter(source),
            // 自动补全
            this._completeConf.of(formulaLanguage.data.of({
                autocomplete: completeFromList(autoComplete),
            })),
            // 上下文自动补全
            contextual,
        ];

        return formulaExtensions;
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
            // 括号中不加空格
            bracketSpacing: false,
            useTabs: true,
            // 结尾不添加;
            // semi: false,
            // 三元运算符换行
            experimentalTernaries: true,
            // 行尾
            endOfLine: 'auto',
            // 尾随逗号
            trailingComma: 'none',
        };
    }
    // 将变量替换成占位符
    public preprocess(text: string) {
        const result = this.formatData(text, this.codeEditorBaseService.matchList);
        return result;
    }
    // 将占位符替换成变量
    public processFormatData(str) {
        if (!str?.length) {
            return str;
        }
        if (this.matchList.size > 0) {
            // 遍历替换关键字
            for (const [key, value] of this.matchList) {
                str = str.replace(value, key);
            }
        }
        return str;
    }
    // 格式化数据
    public formatData(data, matchList) {
        console.log('matchList: ', matchList);
        if (!data) {
            return '';
        }
        // 按 pos.from 排序，补充验证
        matchList.sort((a, b) => a.pos?.from - b.pos?.from);

        let result = '';
        let lastIndex = 0;

        matchList.forEach(keyword => {
            const { from, to } = keyword.pos,
                id = keyword.id,
                label = keyword.label;
            let newFrom, newTo;

            result += data.substring(lastIndex, from);
            newFrom = result.length;
            // 随机生成一个占位符
            let content = label;
            if (keyword.category === 'control') {
                content = `${Math.random().toString(10).replace('0.', '')}`;
                // 记录变量和占位符的关联关系
                this.matchList.set(content, label);
            }

            result += content;
            newTo = result.length;
            lastIndex = to;
            // 计算出新的下标，方便解析
            keyword.pos = {
                from: newFrom,
                to: newTo,
            };
        });

        // 添加最后一段剩余的文本
        result += data.substring(lastIndex);

        return result;
    }
    // 更新编辑器个别属性
    public setAutoCompleteConf(editor: EditorView, value): void {
        this.codeEditorContextualService.updateAutoCompleteList(value);
        const effects = this._completeConf.reconfigure(value ? formulaLanguage.data.of({
            autocomplete: completeFromList(value),
        }) : []);
        editor?.dispatch({ effects });
    }
}
// {日期}> {爱好}? {日期}:{爱好}
// if ({日期}) {{日期}} else {{时间}}