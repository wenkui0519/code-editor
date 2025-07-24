import React, { useEffect, useRef, useState } from 'react';
import { EditorView } from '@codemirror/view';
// import { SearchPanel } from './components/SearchPanel';
// import { Toolbar } from './components/Toolbar';
import { useCodeEditor } from './hooks/useCodeEditor';
import type { CodeEditorProps } from './interfaces';
import './index.css';

export const CodeEditor: React.FC<CodeEditorProps> = ({
    disabled,
    value,
    directiveId,
    editorType,
    eoToolbarMenu,
    eoAutoComplete,
    eoIndentUnit,
    eoKeywordMatching,
    placeholder,
    eoInitMatchList,
    eoLineWrapping,
    eoInsertPlaceholder,
    autoFocus,
    inclusive,
    expanded,
    customMatchRule,
    onClickMirror,
    matchListChange,
    onChange,
    loaded,
}) => {
    const initializedRef = useRef(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const [editorView, setEditorView] = useState<EditorView | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const {
        initializeEditor,
        updateEditor,
        formatCode,
    } = useCodeEditor();

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
                        eoAutoComplete,
                        eoKeywordMatching,
                        eoIndentUnit,
                        searchElement: searchRef.current,
                        customMatchRule,
                        eoLineWrapping,
                        placeholder,
                        eoInsertPlaceholder,
                        inclusive,
                        onChange,
                        matchListChange,
                        onClick: onClickMirror,
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
                eoAutoComplete,
                eoKeywordMatching,
                placeholder,
            });
        }
    }, [disabled, value, eoAutoComplete, eoKeywordMatching, placeholder]);

    return (
        <div className="code-editor-container">
            {/* {toolbarMenu.length > 0 && (
                <Toolbar
                    menu={toolbarMenu}
                    expanded={expanded}
                    onFormat={() => editorView && formatCode(editorView, editorType)}
                    onSearch={() => setIsSearchOpen(true)}
                    editorView={editorView}
                />
            )} */}
            <div ref={editorRef} className="code-editor-content" />
            {/* {isSearchOpen && (
                <SearchPanel
                    ref={searchRef}
                    editorView={editorView}
                    onClose={() => setIsSearchOpen(false)}
                />
            )} */}
        </div>
    );
};

export default CodeEditor;