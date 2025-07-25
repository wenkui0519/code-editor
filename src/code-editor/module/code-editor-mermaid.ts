import { Extension } from '@codemirror/state';
import { mermaid, flowchartTags } from 'codemirror-lang-mermaid';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';

export class ExtraService {

    /**
     * @description 获取 mermaid 编辑器需要的扩展项
     * @return {Extension[]}
     */
    public getExtensions(): Extension[] {
        // 关键字配置
        const myHighlightStyle = HighlightStyle.define([
            { tag: flowchartTags.diagramName, color: '#9650c8' },
            { tag: flowchartTags.keyword, color: '#ce9178' },
            { tag: flowchartTags.lineComment, color: '#008800' },
            { tag: flowchartTags.link, color: '#008800' },
            { tag: flowchartTags.nodeEdge, color: 'blue' },
            { tag: flowchartTags.nodeEdgeText, color: 'magenta' },
            { tag: flowchartTags.nodeId, color: '#a22889' },
            { tag: flowchartTags.nodeText, color: '#aa8500' },
            { tag: flowchartTags.orientation, color: '#649696' },
            { tag: flowchartTags.string, color: '#ce9178' },
        ]);

        const mermaidExtensions = [
            mermaid(),
            syntaxHighlighting(myHighlightStyle),
        ];

        return mermaidExtensions;
    }
}

