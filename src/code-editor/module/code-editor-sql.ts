import { Compartment, Extension } from '@codemirror/state';
import { EditorView } from 'codemirror';
import { SQLConfig, sql, MySQL } from '@codemirror/lang-sql';
import * as prettierPluginSql from 'prettier-plugin-sql';
import { completeFromList } from '@codemirror/autocomplete';
import { AutoCompleteModel } from '../interfaces';
import { CodeEditorContextualService } from '../services/CodeEditorContextualService';

export class ExtraService {
    // 上下文服务实例
    private codeEditorContextualService = new CodeEditorContextualService();

    // 自动补全列表
    private _completeConf = new Compartment();

    // language
    private languageSupport;

    /**
     * @description 获取 SQL 编辑器需要的扩展项
     * @param {AutoCompleteModel[]} autoComplete 编辑器关键字的自动补全提示
     * @return {Extension[]}
     */
    public getExtensions(autoComplete: AutoCompleteModel[]): Extension[] {

        const sqlConfig: SQLConfig = {
            dialect: MySQL,
            schema: {
                table: [],
            },
            // tables: autoComplete ?? [],
            upperCaseKeywords: true,
        };

        this.languageSupport = sql(sqlConfig);

        // 获取上下文补全
        const contextual = this.codeEditorContextualService.getAutoCompleteConf(this.languageSupport.language, autoComplete);

        const sqlExtensions = [
            // sql(sqlConfig),
            this.languageSupport,
            // 自动补全
            this._completeConf.of(this.languageSupport.language.data.of({
                autocomplete: completeFromList(autoComplete),
            })),
            // 上下文自动补全
            contextual,
        ];

        return sqlExtensions;
    }
    /**
     * 格式化数据
     * @param editor 编辑器实例
     * @param type 编辑器类型
     */
    public format(editor: EditorView) {
        const cursorOffset = editor.state.selection.main.head;
        return {
            parser: 'sql',
            plugins: [prettierPluginSql.default],
            cursorOffset,
            // language: 'sqlite', // 可配置类型mysql\sql\sqlite\postgresql...
            keywordCase: 'upper',
            functionCase: 'upper',
        };
    }
    // 更新编辑器个别属性
    public setAutoCompleteConf(editor: EditorView, value): void {
        this.codeEditorContextualService.updateAutoCompleteList(value);
        const effects = this._completeConf.reconfigure(value ? this.languageSupport.language.data.of({
            autocomplete: completeFromList(value),
        }) : []);
        editor?.dispatch({ effects });
    }
}

