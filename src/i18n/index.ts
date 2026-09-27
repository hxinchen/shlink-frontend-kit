/**
 * Minimal translation layer for the UI kit.
 *
 * Kept dependency-free on purpose: this is a component library, and pulling a full i18n
 * runtime into it would force it on every consumer. Keys are the original English copy,
 * so an untranslated key renders as English.
 *
 * Host applications call `setLanguage()` when their own language changes.
 */

type Dictionary = Record<string, string>;

const dictionaries: Record<string, Dictionary> = {
  'zh-CN': {
    'Order by': '排序',
    'Order by...': '排序方式…',
    'Order by: ': '排序：',
    ASC: '升序',
    DESC: '降序',
    'Clear selection': '清除选择',
    'Search...': '搜索…',
    'Matching items': '匹配项',
    Previous: '上一页',
    Next: '下一页',
    Close: '关闭',
    'Close dialog': '关闭对话框',
    Confirm: '确认',
    Cancel: '取消',
    Options: '操作',
    'Copy to clipboard': '复制到剪贴板',
    'Show password': '显示密码',
    'Hide password': '隐藏密码',
    'Show menu': '显示菜单',
    'Loading...': '加载中…',
    'Dismiss notification': '关闭通知',
    'Select...': '请选择…',
    'Hide menu': '隐藏菜单',
    // Orderable field names rendered by OrderingDropdown
    'Created at': '创建时间',
    'Short URL': '短链',
    'Long URL': '原始链接',
    Title: '标题',
    Visits: '访问量',
    Tag: '标签',
    'Short URLs': '短链',
  },
};

let currentLanguage = 'en';

export const setLanguage = (language: string) => {
  currentLanguage = language;
};

export const getLanguage = () => currentLanguage;

/** Translates a key, falling back to the key itself (which is the English copy) */
export const t = (key: string): string => dictionaries[currentLanguage]?.[key] ?? key;
