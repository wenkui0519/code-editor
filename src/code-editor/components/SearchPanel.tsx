// components/SearchPanel.tsx

import React, { forwardRef } from 'react';
import { useSearchPanel } from '../hooks/useSearchPanel';
import type { EditorView } from '@codemirror/view';
import './SearchPanel.css';

interface SearchPanelProps {
    editorView: EditorView | null;
    onClose: () => void;
}

export const SearchPanel = forwardRef<HTMLDivElement, SearchPanelProps>(
    ({ editorView, onClose }, ref) => {
        const {
            searchForm,
            handleSearchChange,
            findNextMatch,
            findPreviousMatch,
            replaceNextMatch,
            replaceAllMatches
        } = useSearchPanel(editorView);

        return (
            <div ref={ref} className="search-panel">
                <div className="search-row">
                    <input
                        type="text"
                        value={searchForm.search}
                        onChange={e => handleSearchChange({
                            ...searchForm,
                            search: e.target.value
                        })}
                        placeholder="Find"
                    />
                    <button onClick={findPreviousMatch}>
                        <i className="icon-arrow-up" />
                    </button>
                    <button onClick={findNextMatch}>
                        <i className="icon-arrow-down" />
                    </button>
                    <button onClick={onClose}>
                        <i className="icon-close" />
                    </button>
                </div>
                <div className="search-options">
                    <label>
                        <input
                            type="checkbox"
                            checked={searchForm.caseSensitive}
                            onChange={e => handleSearchChange({
                                ...searchForm,
                                caseSensitive: e.target.checked
                            })}
                        />
                        Match Case
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={searchForm.wholeWord}
                            onChange={e => handleSearchChange({
                                ...searchForm,
                                wholeWord: e.target.checked
                            })}
                        />
                        Whole Word
                    </label>
                </div>
                <div className="replace-row">
                    <input
                        type="text"
                        value={searchForm.replace || ''}
                        onChange={e => handleSearchChange({
                            ...searchForm,
                            replace: e.target.value
                        })}
                        placeholder="Replace"
                    />
                    <button onClick={replaceNextMatch}>Replace</button>
                    <button onClick={replaceAllMatches}>Replace All</button>
                </div>
            </div>
        );
    }
);