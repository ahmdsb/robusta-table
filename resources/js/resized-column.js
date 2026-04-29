
export default function (el, props) {
    let isInitialized = false
    let { tableKey, minColumnWidth, maxColumnWidth, enable = false } = props

    maxColumnWidth = maxColumnWidth === -1 ? Infinity : maxColumnWidth

    if (!enable) return;

    const tableSelector = '.fi-ta-table';
    const tableWrapperContentSelector = '.fi-ta-content';
    const tableBodyCellPrefix = 'fi-table-cell-';
    const columnSelector = 'x-robusta-table-column';
    const excludeColumnSelector = 'x-robusta-table-exclude-column';

    let columns = el.querySelectorAll(`[${columnSelector}]`);
    let excludeColumns = el.querySelectorAll(`[${excludeColumnSelector}]`);

    let table = el.querySelector(tableSelector);
    let totalTableWidth = 0;

    // Inject a <style> tag into <head> so column widths are defined via CSS rules.
    // Morphdom only patches the component's DOM subtree — it never touches <head> —
    // so these rules survive every Livewire update without flickering.
    const styleId = `robusta-resize-${tableKey}`;
    const styleEl = document.getElementById(styleId) ?? (() => {
        const s = document.createElement('style');
        s.id = styleId;
        document.head.appendChild(s);
        return s;
    })();
    const columnWidthMap = new Map();

    init();

    let morphDebounceTimer = null;

    const cleanupElementInit = Livewire.hook("element.init", () => {
        if (isInitialized) return;
        init();
    });

    // Re-init after morph to attach handle bars to any new/replaced header cells
    // and to capture widths for columns added by pagination or filter changes.
    const cleanupMorphUpdated = Livewire.hook("morph.updated", () => {
        clearTimeout(morphDebounceTimer);
        morphDebounceTimer = setTimeout(() => {
            isInitialized = false;
            init();
        }, 50);
    });

    el.addEventListener('alpine:destroy', () => {
        cleanupElementInit();
        cleanupMorphUpdated();
        clearTimeout(morphDebounceTimer);
        styleEl.remove();
    }, { once: true });


    function init() {
        table = el.querySelector(tableSelector);
        columns = el.querySelectorAll(`[${columnSelector}]`);
        excludeColumns = el.querySelectorAll(`[${excludeColumnSelector}]`);
        initializeColumnLayout();
        isInitialized = true;
    }

    function initializeColumnLayout() {
        let totalWidth = 0;

        const applyLayout = (column, columnName, withHandleBar = false) => {
            const defaultKey = `${columnName}_default`;

            if (withHandleBar) {
                column.classList.add("relative", "group/column-resize", "overflow-hidden");
                createHandleBar(column);
            }

            let savedWidth = getSavedWidth(columnName);
            const defaultWidth = getSavedWidth(defaultKey);

            if (!savedWidth && defaultWidth) {
                savedWidth = defaultWidth;
            }

            if (!savedWidth && !defaultWidth) {
                savedWidth = column.offsetWidth;
                handleColumnUpdate(savedWidth, defaultKey);
            }

            totalWidth += savedWidth;
            applyColumnWidth(savedWidth, column);
        };

        excludeColumns.forEach(column => {
            applyLayout(column, getColumnName(column, excludeColumnSelector));
        });

        columns.forEach(column => {
            applyLayout(column, getColumnName(column, columnSelector), true);
        });

        totalTableWidth = totalWidth;
        renderStyleSheet();
    }


    function createHandleBar(column) {
        const existingHandle = column.querySelector(".column-resize-handle-bar");
        if (existingHandle) return;

        const handleBar = document.createElement("button");
        handleBar.type = "button";
        handleBar.classList.add("column-resize-handle-bar");
        handleBar.title = "Resize column";

        column.appendChild(handleBar);

        handleBar.addEventListener("mousedown", (e) => startResize(e, column));

        handleBar.addEventListener("dblclick", (e) => handleDoubleClick(e, column));
    }

    function handleDoubleClick(event, column) {
        event.preventDefault();
        event.stopPropagation();
        const columnName = getColumnName(column);
        const defaultColumnName = columnName + '_default';
        const savedWidth = getSavedWidth(defaultColumnName) || minColumnWidth;

        if (savedWidth === column.offsetWidth) return;

        applyColumnWidth(savedWidth, column);
        handleColumnUpdate(savedWidth, columnName);
    }

    function startResize(event, column) {
        event.preventDefault();
        event.stopPropagation();

        event.target.classList.add("active");

        const startX = event.pageX;
        const originalColumnWidth = Math.round(column.offsetWidth);

        let currentWidth = originalColumnWidth;
        let hasDragged = false;

        const onMouseMove = throttle((moveEvent) => {
            if (moveEvent.pageX === startX) return;
            hasDragged = true;
            const delta = moveEvent.pageX - startX;

            currentWidth = Math.round(
                Math.min(
                    maxColumnWidth,
                    Math.max(minColumnWidth, originalColumnWidth + delta - 16)
                )
            );

            applyColumnWidth(currentWidth, column);
        }, 16);

        const onMouseUp = () => {
            event.target.classList.remove("active");

            if (hasDragged) {
                handleColumnUpdate(currentWidth, getColumnName(column));
            }

            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }


    function handleColumnUpdate(width, columnName) {
        saveWidthToStorage(width, columnName);
    }

    function applyColumnWidth(width, column) {
        const colAttr = column.hasAttribute(columnSelector) ? columnSelector : excludeColumnSelector;
        const columnName = column.getAttribute(colAttr);
        if (!columnName) return;
        columnWidthMap.set(columnName, { width, colAttr });
        renderStyleSheet();
    }

    function renderStyleSheet() {
        let css = '';
        if (totalTableWidth > 0) {
            css += `[data-robusta-table="${tableKey}"] .fi-ta-table { max-width: ${totalTableWidth}px !important; }\n`;
        }
        columnWidthMap.forEach(({ width: w, colAttr }, name) => {
            const cellClass = escapeCssClass(`${tableBodyCellPrefix}${name}`);
            css += `[${colAttr}="${name}"], .${cellClass} {`
                + ` width: ${w}px !important;`
                + ` min-width: ${w}px !important;`
                + ` max-width: ${w}px !important; }\n`;
            css += `.${cellClass} { overflow: hidden !important; }\n`;
        });
        styleEl.textContent = css;
    }

    function escapeCssClass(className) {
        return className
            .split('.')
            .map(s => s.replace(/_/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())
            .join('\\.');
    }

    function throttle(callback, limit) {
        let wait = false;
        return function (...args) {
            if (!wait) {
                callback.apply(this, args);
                wait = true;
                setTimeout(() => {
                    wait = false;
                }, limit);
            }
        };
    }

    function getStorageKey(columnName) {
        return `${tableKey}_columnWidth_${columnName}`;
    }

    function getSavedWidth(columnName) {
        const savedWidth = sessionStorage.getItem(getStorageKey(columnName));
        return savedWidth ? parseInt(savedWidth) : null;
    }

    function saveWidthToStorage(width, columnName) {
        sessionStorage.setItem(
            getStorageKey(columnName),
            Math.max(
                minColumnWidth,
                Math.min(maxColumnWidth, width)
            ).toString()
        );
    }

    function getColumnName(column, selector = columnSelector) {
        return column.getAttribute(selector);
    }
}
