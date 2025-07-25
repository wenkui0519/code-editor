import { useCallback } from 'react';
import { EditorView } from '@codemirror/view';
import { CodeEditorBaseService } from '../services/CodeEditorBaseService';
import type { CodeEditorType } from '../interfaces';
import { changeValue } from '../services/CodeEditorUtilsService';

const baseService = new CodeEditorBaseService();

export const useCodeEditor = () => {
    const initializeEditor = useCallback((config: any) => {
        return baseService.getEditor(config);
    }, []);

    const updateEditor = useCallback((view: EditorView, props: any) => {
        if (props.disabled !== undefined) {
            baseService.setEditorProperty(view, 'disabled', props.disabled);
        }
        if (props.value !== undefined) {
            changeValue(view, props.value);
        }
        if (props.autoComplete) {
            baseService.setEditorProperty(view, 'complete', props.autoComplete);
        }
        if (props.keywordMatching) {
            baseService.setEditorProperty(view, 'keywordMatching', props.keywordMatching);
        }
        if (props.placeholder !== undefined) {
            baseService.setEditorProperty(view, 'placeholder', props.placeholder);
        }
    }, []);

    return {
        initializeEditor,
        updateEditor,
    };
};