import React, { useState, useEffect } from 'react';
import type { EoToolbarMenuModel } from '../interfaces';
import { buttons } from '../constants/buttons';

interface ToolbarProps {
    menu: string[];
    expanded?: boolean;
    editorView: any;
    onFormat: () => void;
    onSearch: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    menu,
    expanded,
    editorView,
    onFormat,
    onSearch,
}) => {
    const [toolbarItems, setToolbarItems] = useState<EoToolbarMenuModel[]>([]);
    const [firstMenu, setFirstMenu] = useState<EoToolbarMenuModel[]>();
    const [secondaryMenu, setSecondaryMenu] = useState<EoToolbarMenuModel[]>();
    const [showAllBtn, setShowAllBtn] = useState(false);

    useEffect(() => {
        const items = menu.map(item => {
            if (typeof item === 'string') {
                return buttons[item];
            }
            return item;
        }).filter(Boolean);
        setToolbarItems(items);
    }, [menu]);

    const handleMenuClick = async (menuItem: EoToolbarMenuModel) => {
        if (menuItem.insetContent) {
            const content = typeof menuItem.insetContent === 'function'
                ? await menuItem.insetContent(editorView)
                : menuItem.insetContent;
                
            // Insert content at cursor position logic here
            menuItem.callback?.(editorView);
        }
        menuItem.onClick?.(menuItem);
    };

    return (
        <div className="code-editor-toolbar">
            {toolbarItems.map((item, index) => (
                <button
                    key={item.title}
                    className={`toolbar-item ${item.type}`}
                    onClick={() => handleMenuClick(item)}
                    title={item.tooltip}
                >
                    {item.icon && <i className={item.icon} />}
                    {item.type === 'text' && item.title}
                </button>
            ))}
        </div>
    );
};