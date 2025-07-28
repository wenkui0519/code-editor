import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { EditorView } from '@codemirror/view';
import { SearchPanel } from './components/search-panel/SearchPanel';
import { useCodeEditor } from './hooks/useCodeEditor';
import type { CodeEditorProps } from './interfaces';
import './CodeEditor.scss';

export type CodeEditorHandle = {
  changeValue: (value: string) => void;
  changeRange: (pos: { anchor: number; head?: number }) => void;
  getCursor: () => { anchor: number; head: number; from: number; to: number; } | null;
  insertContent: (content: string, pos?: { from: number; to: number }) => void;
  getInstance: () => EditorView | null;
};

const CodeEditorWithRef = forwardRef<CodeEditorHandle, CodeEditorProps>(({
    disabled,
    value,
    editorType,
    autoComplete,
    indentUnit,
    keywordMatching,
    placeholder,
    initMatchList,
    lineWrapping,
    autoFocus,
    inclusive,
    customMatchRule,
    onClickMirror,
    matchListChange,
    onChange,
    loaded,
}, ref) => {
    const initializedRef = useRef(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const [editorView, setEditorView] = useState<EditorView | null>(null);

    const {
        initializeEditor,
        updateEditor,
        editorMethods
    } = useCodeEditor();

    // 通过 useImperativeHandle 暴露方法给父组件
    useImperativeHandle(ref, () => ({
        changeValue: (value: string) => {
            if (editorView) {
                editorMethods.changeValue(editorView, value);
            }
        },
        changeRange: (pos) => {
            if (editorView) {
                editorMethods.changeRange(editorView, pos);
            }
        },
        getCursor: () => {
            if (editorView) {
                return editorMethods.getCursor(editorView);
            }
            return null;
        },
        insertContent: (content: string, pos?) => {
            if (editorView) {
                editorMethods.insertContent(editorView, content, pos);
            }
        },
        getInstance: () => {
            return editorView;
        }
    }), [editorView, editorMethods]);

    useEffect(() => {
        if (initializedRef.current) return;
        // 标记已初始化
        initializedRef.current = true;

        if (editorRef.current) {
            // 标记组件是否已挂载（避免卸载后更新状态）
            let view: EditorView;
            // 定义异步加载函数
            const loadService = async () => {
                try {
                    view = await initializeEditor({
                        element: editorRef.current,
                        doc: value,
                        editorType,
                        autoComplete,
                        keywordMatching,
                        indentUnit,
                        searchElement: searchRef.current,
                        customMatchRule,
                        lineWrapping,
                        placeholder,
                        inclusive,
                        onChange,
                        matchListChange,
                        onClick: onClickMirror,
                        autoFocus,
                        initMatchList,
                    });

                    // 确保组件未卸载再更新状态
                    setEditorView(view);
                    loaded?.(view);
                } catch (error) {
                    console.error('加载服务失败:', error);
                }
            };

            // 执行加载
            loadService();

            // 清理函数：组件卸载时标记为未挂载
            return () => {
                view?.destroy();
            };
        }
    }, []);

    useEffect(() => {
        if (editorView) {
            updateEditor(editorView, {
                disabled,
                value,
                autoComplete,
                keywordMatching,
                placeholder,
            });
        }
    }, [disabled, value, autoComplete, keywordMatching, placeholder, editorView, updateEditor]);

    return (
        <div className="code-editor-container">
            <div ref={editorRef} className="code-editor-content" />
            <SearchPanel
                ref={searchRef}
                editorView={editorView}
            />
        </div>
    );
});

export const CodeEditor = CodeEditorWithRef;
export default CodeEditor;