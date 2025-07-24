import { Compartment, Extension } from '@codemirror/state';
import { EditorView } from 'codemirror';
import { html, htmlLanguage } from '@codemirror/lang-html';
import * as prettierPluginHtml from 'prettier/plugins/html';
import { completeFromList } from '@codemirror/autocomplete';
import { EoAutoCompleteModel } from '../interfaces';
import { CodeEditorContextualService } from '../services/CodeEditorContextualService';

export class ExtraService {

    // 上下文服务实例
    private codeEditorContextualService = new CodeEditorContextualService();
    // 自动补全列表
    private _completeConf = new Compartment();

    /**
     * @description 获取 HTML 编辑器需要的扩展项
     * @param {EoAutoCompleteModel[]} eoAutoComplete 编辑器关键字的自动补全提示
     * @return {Extension[]}
     */
    public getExtensions(autoComplete: EoAutoCompleteModel[] = []): Extension[] {
        // 获取上下文补全
        const contextual = this.codeEditorContextualService.getAutoCompleteConf(htmlLanguage, autoComplete);

        const htmlExtensions = [
            html(),
            // 自动补全
            this._completeConf.of(htmlLanguage.data.of({
                autocomplete: completeFromList(autoComplete),
            })),
            // 上下文自动补全
            contextual,
        ];

        return htmlExtensions;
    }
    /**
     * 格式化数据
     * @param editor 编辑器实例
     * @param type 编辑器类型
     */
    public format(editor: EditorView) {
        const cursorOffset = editor.state.selection.main.head;
        return {
            parser: 'html',
            plugins: [prettierPluginHtml],
            cursorOffset,
        };
    }
    // 更新编辑器个别属性
    public setAutoCompleteConf(editor: EditorView, value): void {
        this.codeEditorContextualService.updateAutoCompleteList(value);
        const effects = this._completeConf.reconfigure(value ? htmlLanguage.data.of({
            autocomplete: completeFromList(value),
        }) : []);
        editor?.dispatch({ effects });
    }
}

