// hooks/useSearchPanel.ts

import { useState, useCallback } from 'react';
import { EditorView } from '@codemirror/view';
import { SearchQuery, setSearchQuery, findNext, findPrevious, replaceNext, replaceAll, closeSearchPanel } from '@codemirror/search';
import type { SearchFormModel } from '../interfaces';

export const useSearchPanel = (editorView: EditorView | null) => {
    const [searchForm, setSearchForm] = useState<SearchFormModel>({
        search: '',
        caseSensitive: false,
        wholeWord: false,
        replace: ''
    });
    // 更新搜索表单
    const handleSearchChange = useCallback((form: SearchFormModel) => {
        if (!editorView) return;
        
        setSearchForm(form);
        const searchQuery = new SearchQuery({
            search: form.search,
            caseSensitive: form.caseSensitive,
            wholeWord: form.wholeWord
        });
        
        editorView.dispatch({
            effects: setSearchQuery.of(searchQuery)
        });
    }, [editorView]);
    // 查找下一个匹配项
    const findNextMatch = useCallback(() => {
        if (!editorView) return;
        findNext(editorView);
    }, [editorView]);
    // 查找上一个匹配项
    const findPreviousMatch = useCallback(() => {
        if (!editorView) return;
        findPrevious(editorView);
    }, [editorView]);
    // 替换下一个匹配项
    const replaceNextMatch = useCallback(() => {
        if (!editorView) return;
        replaceNext(editorView);
    }, [editorView]);
    // 替换所有匹配项
    const replaceAllMatches = useCallback(() => {
        if (!editorView) return;
        replaceAll(editorView);
    }, [editorView]);
    // 关闭搜索面板
    const closePanel = useCallback(() => {
        if (!editorView) return;
        closeSearchPanel(editorView);
    }, [editorView]);

    return {
        searchForm,
        handleSearchChange,
        findNextMatch,
        findPreviousMatch,
        replaceNextMatch,
        replaceAllMatches,
        closePanel,
    };
};