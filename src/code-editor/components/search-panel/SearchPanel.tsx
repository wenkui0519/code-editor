// components/SearchPanel.tsx

import React, { forwardRef, useState } from 'react';
import { useSearchPanel } from '../../hooks/useSearchPanel';
import type { EditorView } from '@codemirror/view';
import './SearchPanel.scss';

interface SearchPanelProps {
    editorView: EditorView | null;
}

export const SearchPanel = forwardRef<HTMLDivElement, SearchPanelProps>(
    ({
        editorView,
    }, ref) => {
        const [searchType, setSearchType] = useState('search');

        const {
            searchForm,
            handleSearchChange,
            findNextMatch,
            findPreviousMatch,
            replaceNextMatch,
            replaceAllMatches,
            closePanel,
        } = useSearchPanel(editorView);

        const switchReplace = () => {
            // Logic to switch between search and replace
            setSearchType(prev => (prev === 'search' ? 'replace' : 'search'));
        }
        // 切换大小写
        const changeCaseSensitive = () => {
            handleSearchChange({
                ...searchForm,
                caseSensitive: !searchForm.caseSensitive
            });
        }
        // 切换全字匹配
        const changeWholeWord = () => {
            handleSearchChange({
                ...searchForm,
                wholeWord: !searchForm.wholeWord
            });
        }

        return (
            <div hidden={true}>
                <div ref={ref}>
                    <div className="search-panel-container">
                        <span className="search-type-toggle" onClick={switchReplace}>
                            <i
                                className={"iconfont " + (searchType === 'search' ? 'icon-row-next' : 'icon-row-down')}
                            />
                        </span>
                        <div className='search-panel-content'>
                            {/* 搜索 */}
                            <div className='search'>
                                <div className='input-container'>
                                    <input
                                        type="text"
                                        placeholder="Find"
                                        value={searchForm.search}
                                        onChange={(e) => handleSearchChange({
                                            ...searchForm,
                                            search: e.target.value
                                        })}
                                    />
                                    <div className="icon-group">
                                        <span
                                            onClick={changeCaseSensitive}
                                            className={searchForm.caseSensitive ? ' cde-primary-active' : ''}
                                        >
                                            <i className="iconfont icon-daxiaoxie" />
                                        </span>
                                        <span
                                            onClick={changeWholeWord}
                                            className={searchForm.wholeWord ? ' cde-primary-active' : ''}
                                        >
                                            <i className="iconfont icon-whole-word" />
                                        </span>
                                    </div>
                                </div>
                                <span onClick={findPreviousMatch}>
                                    <i className="iconfont icon-up" />
                                </span>
                                <span onClick={findNextMatch}>
                                    <i className="iconfont icon-down" />
                                </span>
                                <span onClick={closePanel}>
                                    <i className="iconfont icon-close" />
                                </span>
                            </div>
                            {/* 替换 */}
                            {searchType === 'replace' && (
                                <div className="replace">
                                    <div className='input-container'>
                                        <input
                                            type="text"
                                            placeholder="Replace"
                                            value={searchForm.replace}
                                            onChange={(e) => handleSearchChange({
                                                ...searchForm,
                                                replace: e.target.value
                                            })}
                                        />
                                    </div>
                                    <span onClick={replaceNextMatch}>
                                        <i className="iconfont icon-replace" />
                                    </span>
                                    <span onClick={replaceAllMatches}>
                                        <i className="iconfont icon-replace-all" />
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);