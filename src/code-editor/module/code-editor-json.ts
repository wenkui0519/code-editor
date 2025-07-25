import { Compartment, Extension } from '@codemirror/state';
import { EditorView } from 'codemirror';
import { json, jsonLanguage, jsonParseLinter } from '@codemirror/lang-json';
import * as prettierPluginJson from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import { completeFromList } from '@codemirror/autocomplete';
import { linter, lintGutter } from '@codemirror/lint';
import { AutoCompleteModel } from '../interfaces';
import { CodeEditorContextualService } from '../services/CodeEditorContextualService';

export class ExtraService {
    // 上下文服务实例
    private codeEditorContextualService = new CodeEditorContextualService();

    // 自动补全列表
    private _completeConf = new Compartment();

    /**
     * @description 获取 json 编辑器需要的扩展项
     * @param {AutoCompleteModel[]} autoComplete 编辑器关键字的自动补全提示
     * @return {Extension[]}
     */
    public getExtensions(autoComplete: AutoCompleteModel[] = []): Extension[] {
        // 获取上下文补全
        const contextual = this.codeEditorContextualService.getAutoCompleteConf(jsonLanguage, autoComplete);

        const jsonExtensions = [
            json(),
            lintGutter(),
            linter(jsonParseLinter()),
            // 自动补全
            this._completeConf.of(jsonLanguage.data.of({
                autocomplete: completeFromList(autoComplete),
            })),
            // 上下文自动补全
            contextual,
        ];

        return jsonExtensions;
    }
    /**
     * 格式化数据
     * @param editor 编辑器实例
     * @param type 编辑器类型
     */
    public format(editor: EditorView) {
        const cursorOffset = editor.state.selection.main.head;
        return {
            parser: 'json-stringify',
            plugins: [prettierPluginJson, prettierPluginEstree],
            cursorOffset,
        };
    }
    // 更新编辑器个别属性
    public setAutoCompleteConf(editor: EditorView, value): void {
        this.codeEditorContextualService.updateAutoCompleteList(value);
        const effects = this._completeConf.reconfigure(value ? jsonLanguage.data.of({
            autocomplete: completeFromList(value),
        }) : []);
        editor?.dispatch({ effects });
    }
}

