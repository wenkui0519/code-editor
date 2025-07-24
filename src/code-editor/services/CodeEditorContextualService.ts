import { Extension } from '@codemirror/state';
import { EoAutoCompleteModel } from '../interfaces';

export class CodeEditorContextualService {

    private autoCompleteList: {
        [key: string]: EoAutoCompleteModel[]
    } = {};

    // 获取自动匹配插件实例
    public getAutoCompleteConf(language, autoComplete: EoAutoCompleteModel[] = []): Extension[] {
        this.autoCompleteList = this.getContextualOptions(autoComplete);
        // 上下文识别
        const contextual = language.data.of({
            autocomplete: (context) => this.getContextual(context, this.autoCompleteList),
        });
        return contextual;
    }

    // 更新控件列表
    public updateAutoCompleteList(autoCompleteList: EoAutoCompleteModel[]) {
        this.autoCompleteList = this.getContextualOptions(autoCompleteList);
    }

    // 获取上下文自动匹配列表
    private getContextual(context, autoCompleteList) {
        let before = context.matchBefore(/\S+\./);
        if (!context.explicit && !before) return null;
        // // 截取掉“.”
        const key = before.text.slice(0, before.text.length - 1);
        // // 获取二级列表
        const subOptions = autoCompleteList[key]?  [...autoCompleteList[key]]: [];
        return {
            from: context.pos,
            options: subOptions,
            validFor: /^\w*$/,
        }
    }
    // 上下文选项列表
    private getContextualOptions(autoComplete) {
        const result = {};
        const deep = (list) => {
            list.forEach(item => {
                if (item.children) {
                    const key = item.applyLabel || item.label;
                    result[key] = item.children;
                    deep(item.children);
                }
            });
        };
        deep(autoComplete);
        return result;
    }
}
