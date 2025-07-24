// hooks/useSearchPanel.ts

import { useState, useCallback } from 'react';
import { EditorView } from '@codemirror/view';
import { SearchQuery, setSearchQuery, findNext, findPrevious, replaceNext, replaceAll } from '@codemirror/search';
import type { SearchFormModel } from '../interfaces';

export const useSearchPanel = (editorView: EditorView | null) => {
    const [searchForm, setSearchForm] = useState<SearchFormModel>({
        search: '',
        caseSensitive: false,
        wholeWord: false,
        replace: ''
    });

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

    const findNextMatch = useCallback(() => {
        if (!editorView) return;
        findNext(editorView);
    }, [editorView]);

    const findPreviousMatch = useCallback(() => {
        if (!editorView) return;
        findPrevious(editorView);
    }, [editorView]);

    const replaceNextMatch = useCallback(() => {
        if (!editorView) return;
        replaceNext(editorView);
    }, [editorView]);

    const replaceAllMatches = useCallback(() => {
        if (!editorView) return;
        replaceAll(editorView);
    }, [editorView]);

    return {
        searchForm,
        handleSearchChange,
        findNextMatch,
        findPreviousMatch,
        replaceNextMatch,
        replaceAllMatches
    };
};