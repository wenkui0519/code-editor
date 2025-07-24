// constants/buttons.ts

import { EoToolbarMenuModel } from '../interfaces';

const isMacNavigator = navigator.platform.match('Mac');

export const buttons: Record<string, EoToolbarMenuModel> = {
    'format': {
        type: 'icon',
        icon: 'icon-code-formatting',
        title: isMacNavigator ? 'Format (⌘ + Shift + F)' : 'Format (Ctrl + Shift + F)',
        tooltip: isMacNavigator ? 'Format (⌘ + Shift + F)' : 'Format (Ctrl + Shift + F)',
    },
    'search': {
        type: 'icon',
        icon: 'icon-search',
        title: isMacNavigator ? 'Search (⌘ + F)' : 'Search (Ctrl + F)',
        tooltip: isMacNavigator ? 'Search (⌘ + F)' : 'Search (Ctrl + F)',
    }
};