export default function filamentRobustaTable({ resizedConfig }) {
    const SELECTORS = {
        wrapper: '.fi-ta-content',
        table: '.fi-ta-table',
        headerCell: '.fi-ta-header-cell-',
        cell: '.fi-table-cell-',
        resizeHandle: 'column-resize-handle-bar',
        emptyHeaderCell: 'th.fi-ta-actions-cell, th.fi-ta-cell.fi-ta-selection-cell',
        column: 'x-robusta-table-column',
        excludeColumn: 'x-robusta-table-exclude-column',
    };

    return {
        columns: null,
        excludedColumns: null,
        config: {
            minWidth: 50,
            maxWidth: -1,
            enable: false,
            fitContent: false,
            tableKey: null,
            ...resizedConfig,
        },
        // state
        element: null,
        refs: {
            table: null,
            wrapper: null,
            content: null,
        },
        state: {
            initialized: false,
            pendingUpdate: false,
            isLoading: false,
            totalWidth: 0,
            fitContentWidth: 0,
            currentResizeWidth: 0,
        },

        init() {
            this.element = this.$el;

            // initial setup
            this.initializeComponent();

            this.registerLivewireHooks();
        },

        registerLivewireHooks(){
            Livewire.hook('morph.updated', ({ el }) => {
                if (!this.element?.contains(el)) return;

                if (this.state.pendingUpdate) return;

                this.state.pendingUpdate = true;

                requestAnimationFrame(() => {
                    if (this.element && document.body.contains(this.element)) {
                        this.state.initialized = false;
                        this.state.totalWidth = 0;
                        this.initializeComponent();
                    }

                    this.state.pendingUpdate = false;
                })
            })
        },

        initializeComponent() {
            if (this.state.initialized) return;

            // locate elements
            this.refs.wrapper = this.element.querySelector(SELECTORS.wrapper);
            this.refs.content = this.element.querySelector(SELECTORS.wrapper);
            this.refs.table = this.element.querySelector(SELECTORS.table);

            if(!this.refs.table || !this.refs.content) return;

            this.columns = this.refs.table.querySelectorAll(`[${SELECTORS.column}]`);
            this.excludedColumns = this.refs.table.querySelectorAll(`[${SELECTORS.excludeColumn}]`);

            //  Calculate Fit Content (if enabled)
            if(this.config.fitContent) {
                this.calculateFitContentWidth();
            }

            this.initializeColumns();

            this.state.initialized = true;
        },

        calculateFitContentWidth() {
            if (!this.refs.wrapper) return;
            

            if(this.columns?.length === 0) return;

            let availableWidth = this.refs.wrapper.offsetWidth;

            this.refs.table
                .querySelectorAll(SELECTORS.emptyHeaderCell)
                .forEach(cell => {
                    availableWidth -= cell.offsetWidth;
                })

            this.excludedColumns.forEach(column => {
                availableWidth -= column.offsetWidth;
            })

            this.state.fitContentWidth = availableWidth / this.columns.length;
        },

        initializeColumns() {
            if (!this.config.enable || !this.columns.length) return;

            this.state.totalWidth = 0;

            this.columns.forEach((column) => {
                this.setupColumnHeader(column);
            });

            if(this.state.totalWidth > 0) {
                this.refs.table.style.width = `${this.state.totalWidth}px`;
            }
        },

        setupColumnHeader(column) {
            const columnName = this.getColumnName(column);

            column.classList.add(
                'relative',
                'group/column-resize',
                'overflow-hidden',
            );

            this.mountResizeHandle(column, columnName);

            const defaultKey = `${columnName}_default`;
            let width = this.getSavedWidth(columnName);
            const defaultWidth = this.getSavedWidth(defaultKey);

            if (!width && defaultWidth) {
                width = defaultWidth;
            }

            if (!width){
                width = this.config.fitContent
                    ? this.state.fitContentWidth
                    : column.offsetWidth;

                if(width) this.saveColumnWidth(width, columnName, defaultKey);
            }

            if(width) {
                this.applyWidthToColumn(width, columnName);
                this.state.totalWidth += width;
            }
        },

        mountResizeHandle(column, columnName) {
            if (column.querySelector(`.${SELECTORS.reziseHandle}`)) return;

            const handle = document.createElement('button');

            handle.type = 'button';
            handle.className = SELECTORS.resizeHandle;
            handle.title = 'Resize column';

            handle.addEventListener('mousedown', (event) => {
                this.handleResizeStart(event, column, columnName);
            });

            handle.addEventListener('dblclick', (event) => {
                this.handleDoubleClick(event, column, columnName);
            });

            column.appendChild(handle);
        },

        handleResizeStart(event, column, columnName) {
            event.preventDefault();
            event.stopPropagation();

            const startX = event.pageX;
            const startWidth = column.offsetWidth;
            const startTableWidth = this.refs.table.offsetWidth;

            column.classList.add('resizing');

            const onMouseMove = this.throttle((moveEvent) => {
                const delta = moveEvent.pageX - startX;

                let newWidth = startWidth + delta - 16 // -16 buffer
                const max =
                    this.config.maxWidth === -1
                        ? Infinity
                        : this.config.maxWidth

                newWidth = Math.max(
                    this.config.minWidth,
                    Math.min(max, newWidth),
                )
                this.state.currentResizeWidth = Math.round(newWidth)

                // Update Table Width synchronously so it feels responsive
                const widthDiff = this.state.currentResizeWidth - startWidth
                this.refs.table.style.width = `${startTableWidth + widthDiff}px`

                this.applyWidthToColumn(
                    this.state.currentResizeWidth,
                    columnName,
                )
            }, 16)

            const onMouseUp = () => {
                column.classList.remove('resizing');

                if (this.state.currentResizeWidth > 0) {
                    this.saveColumnWidth(
                        this.state.currentResizeWidth,
                        columnName
                    )
                }

                document.removeEventListener('mousemove', onMouseMove)
                document.removeEventListener('mouseup', onMouseUp)
            }

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        },

        handleDoubleClick(event, column, columnName) {
            event.preventDefault();
            event.stopPropagation();

            const defaultKey = `${columnName}_default`;
            const resetWidth = this.getSavedWidth(defaultKey) || this.config.minWidth;

            if(resetWidth !== column.offsetWidth) {
                this.applyWidthToColumn(resetWidth, columnName);
                this.saveColumnWidth(resetWidth, columnName);
            }

        },

        applyWidthToColumn(width, columnName) {
            if (!width || width <= 0) return;

            const name = this.sanitizeName(columnName);
            const widthPx =  `${width}px`;

            const header = this.refs.table.querySelector(`${SELECTORS.headerCell}${name}`);

            if (header) this.setElementWidth(header, widthPx);

            const cells = this.refs.table.querySelectorAll(`${SELECTORS.cell}${name}`);

            cells.forEach(cell => {
                this.setElementWidth(cell, widthPx);
                cell.style.overflow = 'hidden';
                cell.style.textOverflow = 'ellipsis';
                cell.style.whiteSpace = 'nowrap';
            });
        },

        setElementWidth(element, width) {
            element.style.width = width;
            element.style.minWidth = width;
            element.style.maxWidth = width;
        },

        //  ---- Persistence ----

        saveColumnWidth(width, columnName, customKey = null) {
            const key = customKey || columnName;
            const max = this.config.maxWidth === -1 ? Infinity : this.config.maxWidth;
            const validWidth = Math.max(
                this.config.minWidth,
                Math.min(max, width)
            );

            // Frontend Save
            sessionStorage.setItem(
                this.getStorageKey(key),
                validWidth.toString()
            );
        },

        getSavedWidth(name) {
          const val = sessionStorage.getItem(this.getStorageKey(name));
            return val ? parseInt(val, 10) : null;  
        },

        getStorageKey(name) {
            return `${this.config.tableKey}_columnWidth_${name}`;
        },

        // ---- Helpers -----

        sanitizeName(name) {
            return name
                .split('.')
                .map(
                    (s) => s
                        .replace(/_/g, '-')
                        .replace(/([a-z])([A-Z])/g, '$1-$2')
                        .toLowerCase(),
                )
                .join('\\.');
        },

        throttle(callback, limit) {
            let wait = false
            let lastArgs = null

            return function (...args) {
                lastArgs = args

                if (!wait) {
                    callback.apply(this, lastArgs)
                    wait = true

                    setTimeout(() => {
                        wait = false
                        if (lastArgs) {
                            callback.apply(this, lastArgs)
                        }
                    }, limit)
                }
            }
        },
        
        getColumnName(column, selector = SELECTORS.column) {
            return column.getAttribute(selector);
        }
    };
} 