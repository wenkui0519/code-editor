import { autocompletion, Completion } from "@codemirror/autocomplete";
import { EditorState, Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { CompleteTypeClass } from "../interfaces";

/**
  * @description 获取编辑器需要的基本样式主题
  * @description 详情: https://codemirror.net/examples/styling/
  * @param {number | string} eoHeight 设置编辑器高度
  * @return {Extension} 基本样式主题
  */
export function getBaseTheme(): Extension {
    const baseTheme = EditorView.baseTheme({
        // 清除编辑器获得焦点时的边框样式
        '&.cm-focused': {
            outline: 'unset',
        },

        // 设置编辑器内容溢出滚动样式
        '.cm-scroller': {
            overflow: 'auto',
        },

        // 搜索面板的样式
        '& .cm-panels': {
            'position': 'absolute',
            'left': 'unset',
            'z-index': 1,
            'border-bottom': 'unset',
            'box-shadow': '0px 4px 12px rgba(0, 0, 0, 0.15)',
        }
    });

    return baseTheme;
}

/**
 * @description 关键字自动补全配置
 * @return {Extension}
 */
export function autocompletionWord(): Extension {
    return autocompletion({
        closeOnBlur: true,
        tooltipClass: (state: EditorState) => { return 'code-editor-autocomplete-list' },
        optionClass: (completion: Completion) => { return 'code-editor-autocomplete-option' },
        // icons: false,
        // addToOptions: [{
        //     render: (completion, state, view) => {
        //         const { type } = completion,
        //             className = CompleteTypeClass[type] || 'eui-constant';
        //         const iconElement = document.createElement("span");
        //         iconElement.classList.add("eui-icon", className);
        //         return iconElement;
        //     },
        //     position: 0,
        // }]
    });
}
// 改变数据
export function changeValue(editor: EditorView, value: string) {
    if (!editor) {
        return;
    }
    editor.dispatch({
        changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: value
        },
        selection: {
            anchor: value?.length || 0,
        },
    });
}
// 改变range
export function changeRange(editor: EditorView, pos) {
    if (!editor) {
        return;
    }
    editor.dispatch({
        selection: {
            anchor: pos,
        },
    });
}
// 获取当前光标位置
export function getCursor(editor: EditorView) {
    if (!editor) {
        return;
    }
    return editor.state.selection.main;
}

// 插入内容
export function insertContent(editor: EditorView, content: string, pos?) {
    if (!editor) {
        return;
    }
    let from, to;
    if (pos) {
        from = pos.from;
        to = pos.to;
    } else {
        const selection = editor.state.selection.main;
        from = selection.from;
        to = selection.to;
    }
    editor.dispatch({
        changes: {
            from,
            to: to || from,
            insert: content,
        },
        selection: {
            anchor: from + content.length,
        }
    });
}

// 替换中文符号
export function replaceChineseComma() {
    return EditorState.transactionFilter.of((tr) => {
        if (!tr.docChanged) return tr; // 如果没有文档变化，直接返回
        const changes: { from: number, to: number, insert: string }[] = [];
        // 遍历事务的所有更改
        tr.changes.iterChanges((from, to, _, __, text) => {
            const punctuationMap: { [key: string]: string } = {
                '，': ',',
                // '。': '.',
                '（': '(',
                '）': ')'
            };

            const txt = text.toString();
            const newText = punctuationMap[txt];
            // 替换中文符号
            if (newText) {
                changes.push({ from, to, insert: newText });
            }
        });

        // 如果有需要替换的内容，返回一个新事务以覆盖当前内容
        if (changes.length > 0) {
            return [{
                changes,
                selection: tr.newSelection, // 光标位置处理
            }];
        }

        return tr; // 没有中文逗号时，返回原始事务
    });
}