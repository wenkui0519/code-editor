import { EditorState, Extension, Transaction } from '@codemirror/state';
import { EditorView } from 'codemirror';
import { Decoration, DecorationSet, MatchDecorator, ViewPlugin, ViewUpdate, WidgetType } from '@codemirror/view';
import * as _ from 'lodash';
import { syntaxTree } from '@codemirror/language';
import { KeywordMatchingModel } from '../interfaces';

export class CodeEditorKeywordService {
    // 编辑器实例
    public editorView: EditorView;
    // 匹配字段列表
    public matchList = new Map<string, any>();
    // 正则匹配白名单列表
    private whiteList = new Set(['|', '!', '^', '$', '*', '~', "'", '"', '(', ')', '{', '}', '.', ',', '-', '+', '%', '*', '=', '<', '>', '?', ':', ';', '\/', '\\s', '\\n', ' ', '']);

    /**
     * @description 关键字匹配
     * @param {KeywordMatchingModel[]} keywordMatching 关键字匹配, 可以对匹配到的关键字设置样式类名, 设置行内样式、设置属性;
     * @return {Extension}
     */
    public keywordMatching(params: {
        keywordMatching: KeywordMatchingModel[],
        customMatchRule: (contentDOM: HTMLElement) => any;
        matchListChange: (list: any[]) => void,
        handleClick: (event) => void,
        initMatchList?: any[],
        inclusive?: boolean,
    }): Extension {
        const { keywordMatching = [], customMatchRule, matchListChange, handleClick, initMatchList = [] } = params;
        const matchingList = this.initChildKeyword(keywordMatching);
        const groupBy = _.groupBy(matchingList, 'label');
        let matchList: Map<string, any> = this.matchList;
        let size = 0;
        // 是否是初始化改变
        let isInit = true;
        // 匹配到的decorations
        let matchDecorations: DecorationSet;

        // 注意: 这里必须要先为关键字由长到短进行排序, 如果不进行排序会出现如下问题:
        // 例如: 正则表达式: new RegExp('address | address_private', 'g');
        //       当在编辑器中输入 address_private 时只会匹配到 address, 匹配不到 address_private;
        const sort = Object.keys(groupBy).sort((a, b) => b.length - a.length);
        const regStr = sort.map(keyword => `${_.escapeRegExp(keyword)}`).join('|');
        const keywordsRegex = new RegExp(regStr, 'g');
        // 验证关键字是否在引号范围内
        const isInQuotes = function (from, to, state) {
            const tree = syntaxTree(state);
            let inQuotes = false;
            tree.iterate({
                enter(node) {
                    if (
                        (
                            node.name === "String" || // 字符串
                            node.name === "QuotedString" || // 引号字符串
                            node.name === "LineComment" || // 单行注释
                            node.name === "BlockComment" // 多行注释
                        ) &&
                        node.from <= from &&
                        node.to >= to
                    ) {
                        inQuotes = true;
                    }
                },
            });
            return inQuotes;
        }

        const keywordsMatcher: MatchDecorator = new MatchDecorator({
            regexp: keywordsRegex,
            decoration: (match: RegExpExecArray, view: EditorView, pos: number): Decoration | null => {
                const [matchText] = match;
                // 获取当前匹配字符前面、后面的文本。用于验证是否要添加自定义widget
                // let before = view.state.doc.sliceString(1, pos).trim(),
                //     after = view.state.doc.sliceString(pos + matchText.length, view.state.doc.length).trim();
                let before = view.state.doc.sliceString(pos - 1, pos).trim(); // 前一个字符
                let after = view.state.doc.sliceString(pos + matchText.length, pos + matchText.length + 1).trim(); // 后一个字符
                // 前后文字只能是白名单中相关的字符
                if (!this.whiteList.has(before) || !this.whiteList.has(after)) {
                    return null;
                }
                // 引号范围内不要匹配
                if (isInQuotes(pos, pos + matchText.length, view.state)) {
                    return null;
                }

                const current: KeywordMatchingModel = groupBy[matchText]?.[0];
                // 关键字看作整体的情况下
                if (params.inclusive && current.inclusive) {
                    return Decoration.replace({
                        widget: new PlaceholderWidget(matchText, current.className ?? '', current.tagName, { ...current.attributes }, matchList), // 使用自定义 Widget
                        inclusive: false
                    });
                } else {
                    // 关键字不认为整体的情况下
                    return Decoration.mark({
                        attributes: {
                            ...current.attributes,
                        },
                        class: current.className,
                        tagName: current.tagName,
                    });
                }
            },
        });

        const plugin = ViewPlugin.fromClass(class {
            editorView: EditorView;
            decorations: DecorationSet;

            constructor(view: EditorView) {
                this.editorView = view;
                this.decorations = keywordsMatcher.createDeco(view);
                matchDecorations = this.decorations;
            }
            update(update: ViewUpdate) {
                this.decorations = keywordsMatcher.updateDeco(update, this.decorations);
                matchDecorations = this.decorations;
                if (update.docChanged || update.viewportChanged) {
                    const widgetList: { from: number, to: number }[] = [];
                    // 初始化赋值id
                    if (isInit && initMatchList?.length > 0) {
                        let index = 0;
                        this.decorations.between(0, this.editorView.state.doc.length, (from, to, decoration) => {
                            const { widget } = decoration.spec;
                            if (widget) {
                                widget.id = initMatchList[index]?.['data-id'] || null;
                                index++;
                            }
                        });
                    }
                    // 获取所有装饰对象pos
                    if (this.decorations.size) {
                        this.decorations.between(0, this.editorView.state.doc.length, (from, to, decoration) => {
                            widgetList.push({
                                from,
                                to,
                            })
                        });
                    } else if (!isInit && matchListChange !== null && matchListChange !== undefined) {
                        // 非初始化时，如果没有装饰对象，则清空matchList
                        matchListChange([]);
                        return;
                    }
                    requestAnimationFrame(() => {
                        let result: any[] = [];
                        if (customMatchRule) {
                            result = customMatchRule(this.editorView.contentDOM);
                        } else {
                            const nodes = Array.from(this.editorView.contentDOM.querySelectorAll('.field[data-id]'));
                            nodes.map((node, index) => {
                                const id: any = node.getAttribute('data-id')
                                if (matchList.get(id) && !result.find(item => item['data-id'] === id)) {
                                    const info = matchList.get(id);
                                    // 更新pos
                                    info['pos'] = widgetList[index];
                                    result.push(info);
                                }
                            });
                        }
                        if (matchListChange !== null && matchListChange !== undefined) {
                            matchListChange(result);
                        }
                        if (isInit) {
                            isInit = false;
                        }
                    });
                }
            }

        }, {
            decorations: v => {
                return v.decorations
            },
            provide: plugin => {
                const extension: Extension[] = [];
                const atomicRanges = EditorView.atomicRanges.of(view => {
                    // 避免光标在关键字上
                    if (params.inclusive) {
                        return view.plugin(plugin)?.decorations || Decoration.none;
                    } else {
                        return Decoration.none;
                    }
                });
                extension.push(atomicRanges);
                // 删除关键字额外验证
                if (params.inclusive) {
                    const deleteWidget = EditorState.changeFilter.of((tr: Transaction) => {
                        const size = matchDecorations.size;

                        // 处理变更，决定是否修改
                        if (size && tr.isUserEvent('delete')) {
                            // const length = this.editorView.state.doc.length;
                            const { selection } = tr;
                            // 个别情况下，没有选取
                            // if (!selection || !length) {
                            if (!selection) {
                                return true;
                            }
                            let point;
                            // 处理单个选区
                            selection.ranges.forEach(range => {
                                const from = range.from;
                                const to = range.to;
                                const cursor = (matchDecorations as DecorationSet).iter();
                                while (cursor.value) {
                                    if (from >= cursor.from && to <= cursor.to) {
                                        point = Object.assign(cursor);
                                    }
                                    cursor.next(); // 移动到下一个范围
                                }
                            });
                            if (point?.value && point.value?.widget instanceof PlaceholderWidget) {
                                const { widgetInfo } = point.value.widget;
                                // 当是二级选项时，删除二级选项。如："明细表1.AAA"删除后变为"明细表1"
                                if (widgetInfo?.is_sub) {
                                    const label = widgetInfo.label;
                                    const labelArr = label.split('.');
                                    if (labelArr.length > 1) {
                                        labelArr.pop();
                                        const text = labelArr.join('.');
                                        let { from, to } = point;
                                        setTimeout(() => {
                                            this.editorView.dispatch({
                                                changes: {
                                                    from,
                                                    to,
                                                    insert: text,
                                                },
                                                selection: { anchor: from + text.length, head: from + text.length },
                                            });
                                        }, 0);
                                    }
                                    return false;
                                }
                            }
                            return true;
                        } else {
                            return true;
                        }
                    });
                    extension.push(deleteWidget);
                }
                return extension;
            },
            eventHandlers: {
                mousedown: (event, view) => {
                    const target = event.target as HTMLElement;
                    // 触发点击事件
                    if (handleClick) {
                        handleClick(event);
                    }
                    // 点击关键字时，添加特殊样式。并选中选取
                    if (target && target.classList.contains('cm-edc-keyword')) {
                        if (target['cmView']) {
                            const widgetView = target['cmView'],
                                from = widgetView.posAtStart,
                                to = widgetView.posAtEnd;
                            view.dispatch({
                                selection: { anchor: from, head: to },
                            });
                        }
                        // event.preventDefault();
                        document.querySelectorAll('.cm-edc-keyword.active').forEach(el => el.classList.remove('active'));
                        target.classList.add('active');
                        return true;
                    } else {
                        // 光标注入到其它地方时移除选中状态
                        document.querySelectorAll('.cm-edc-keyword.active').forEach(el => el.classList.remove('active'));
                    }
                    return false;
                },
            },
        });

        return plugin;
    }
    // 初始化关键字匹配列表。主要是为了处理子集列表。
    private initChildKeyword(keywordMatching: KeywordMatchingModel[] = []) {
        const matchingList: KeywordMatchingModel[] = [...keywordMatching];
        const deep = (list: KeywordMatchingModel[] = [], isChild?, path: any[] = [], pLabel: any[] = []) => {
            list.forEach((keyword: any) => {
                let newWord;
                let label = keyword.label;
                const newPath = [...path, keyword.attributes.id];
                const newLabel = [...pLabel, label];
                if (isChild) {
                    newWord = Object.assign({}, keyword);
                    label = newLabel.join('.');
                    newWord.label = label;
                    newWord.attributes['path'] = newPath.join(',');
                    newWord.attributes['label'] = label;
                    // 标记为二级选项
                    newWord.attributes['is_sub'] = true;
                    // newWord.attributes['label'] = newLabel.join(',');
                    matchingList.push(newWord);
                    newWord['inclusive'] = true;
                }
                if (keyword.children?.length) {
                    deep([...keyword.children], 1, newPath, newLabel);
                }
            });
        };
        deep([...matchingList]);
        return matchingList;
    }

}

// 自定义 Widget 来替换文本，符合 WidgetType 接口
class PlaceholderWidget extends WidgetType {
    constructor(
        private text: string,
        private className: string,
        private tagName: string = 'span',
        private attributes: object,
        private matchList: Map<string, any>,
    ) {
        super();
    }
    // 当前实例唯一标识
    public id;
    // 当前实例信息
    public widgetInfo;

    // 创建 DOM 元素以显示
    toDOM(view: EditorView): HTMLElement {
        if (!this.id) {
            // const array = new Uint32Array(1),
            //     id = window.crypto.getRandomValues(array)[0].toString();
            // 避免黏贴的时候时间戳相同，所以加个随机数
            const id = Math.random().toString(36).replace('0.', '');
            this.id = this.attributes?.['data-id'] || (new Date().getTime()).toString() + id;
        }

        this.widgetInfo = {
            label: this.text,
            ...this.attributes,
            'data-id': this.id,
        }
        const span = document.createElement(this.tagName);
        span.textContent = this.text;
        this.className = 'cm-edc-keyword ' + this.className;
        span.className = this.className;

        // span.style.pointerEvents = 'none'; // 确保这个元素不响应点击
        // 添加唯一标识
        span.setAttribute('data-id', this.id);

        // 添加额外的属性到 DOM 元素
        for (const [key, value] of Object.entries(this.attributes)) {
            span.setAttribute(key, value);
        }
        // 添加节点
        this.updateMatchList('add');

        return span;
    }

    eq(other: PlaceholderWidget): boolean {
        return this.text === other.text && JSON.stringify(this.attributes) === JSON.stringify(other.attributes);
    }

    // 确定是否忽略特定事件
    ignoreEvent(event: Event): boolean {
        return false; // 默认处理所有事件
    }

    destroy(dom: HTMLElement): void {
        this.updateMatchList('delete');
    }

    private updateMatchList(type: 'add' | 'delete') {
        if (type === 'add') {
            this.matchList.set(this.id, this.widgetInfo);
        } else {
            this.matchList.delete(this.id);
        }
    }
}
