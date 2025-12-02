export default function filamentRobustaTable({ columns, resizedConfig }) {
    const SELECTORS = {
        wrapper: '.fi-ta-content-ctn.fi-fixed-positioning-context',
        content: '.fi-ta-content-ctn',
        table: '.fi-ta-table',
        headerCell: '.fi-ta-header-cell-',
        cell: '.fi-ta-cell-',
        resizeHandle: 'column-resize-handle-bar',
        emptyHeaderCell:
            'th.fi-ta-actions-header-cell, th.fi-ta-cell.fi-ta-selection-cell',
    }

    return {
        columns,
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
            this.element = this.$el

            // Initial setup
            this.initializeComponent()

            // Handle Livewire DOM updates
            this.registerLivewireHooks()
        },

        registerLivewireHooks() {
            Livewire.hook('morph.updated', ({ el }) => {
                if (!this.element?.contains(el)) return
                if (this.state.pendingUpdate) return

                this.state.pendingUpdate = true

                // Wait for DOM paint to finish
                requestAnimationFrame(() => {
                    if (this.element && document.body.contains(this.element)) {
                        this.state.initialized = false
                        this.state.totalWidth = 0
                        this.initializeComponent()
                    }

                    this.state.pendingUpdate = false
                })
            })
        },

        initializeComponent() {
            if (this.state.initialized) return

            // Locate Elements
            this.refs.content = this.element.querySelector(SELECTORS.content)
            this.refs.table = this.element.querySelector(SELECTORS.table)
            this.refs.wrapper = this.element.querySelector(SELECTORS.wrapper)

            if (!this.refs.table || !this.refs.content) return

            // Calculate Fit Content (if enabled)
            if (this.config.fitContent) {
                this.calculateFitContentWidth()
            }

            this.initializeColumns()

            this.state.initialized = true
        },

        calculateFitContentWidth() {
            if (!this.refs.wrapper) return

            const resizeableCols = this.columns.filter(
                (col) => col.isResized && !col.isHidden,
            )
            const fixedCols = this.columns.filter(
                (col) => !col.isResized && !col.isHidden,
            )

            if (resizeableCols.length === 0) return

            let availableWidth = this.refs.wrapper.offsetWidth

            // Subtract width of action columns/selection checkboxes
            this.refs.table
                .querySelectorAll(SELECTORS.emptyHeaderCell)
                .forEach((el) => {
                    availableWidth -= el.offsetWidth
                })

            // Subtract width of non-resizable columns
            fixedCols.forEach((col) => {
                const selector =
                    SELECTORS.headerCell + this.sanitizeName(col.name)
                const el = this.refs.table.querySelector(selector)
                if (el) availableWidth -= el.offsetWidth
            })

            this.state.fitContentWidth = availableWidth / resizeableCols.length
        },

        initializeColumns() {
            if (!this.config.enable || !this.columns.length) return

            this.state.totalWidth = 0

            this.columns.forEach((column) => {
                if (!column.isResized) return

                const name = this.sanitizeName(column.name)
                const headerEl = this.refs.table.querySelector(
                    SELECTORS.headerCell + name,
                )

                if (headerEl) {
                    this.setupColumnHeader(headerEl, column.name)
                }
            })

            // Apply total width to table to enforce scrolling if needed
            if (this.state.totalWidth > 0) {
                this.refs.table.style.width = `${this.state.totalWidth}px`
            }
        },

        setupColumnHeader(headerEl, rawName) {
            // Add relative class for handle positioning
            headerEl.classList.add(
                'relative',
                'group/column-resize',
                'overflow-hidden',
            )

            // Create Drag Handle
            this.mountResizeHandle(headerEl, rawName)

            // Determine Width priority: Saved > Default > FitContent/Existing
            const defaultKey = `${rawName}_default`
            let width = this.getSavedWidth(rawName)
            const defaultWidth = this.getSavedWidth(defaultKey)

            if (!width && defaultWidth) {
                width = defaultWidth
            }

            if (!width) {
                width = this.config.fitContent
                    ? this.state.fitContentWidth
                    : this.getColumnConfig(rawName)?.width ??
                      headerEl.offsetWidth

                // If we are falling back to a calculated width, save it as default
                if (width) this.saveColumnWidth(width, rawName, defaultKey)
            }

            if (width) {
                this.applyWidthToColumn(width, rawName)
                this.state.totalWidth += width
            }
        },

        mountResizeHandle(headerEl, columnName) {
            if (headerEl.querySelector(`.${SELECTORS.resizeHandle}`)) return

            const handle = document.createElement('button')
            handle.type = 'button'
            handle.className = SELECTORS.resizeHandle // defined in CSS
            handle.title = 'Resize column'

            handle.addEventListener('mousedown', (e) =>
                this.handleResizeStart(e, headerEl, columnName),
            )
            handle.addEventListener('dblclick', (e) =>
                this.handleDoubleClick(e, headerEl, columnName),
            )

            headerEl.appendChild(handle)
        },

        handleResizeStart(event, headerEl, columnName) {
            event.preventDefault()
            event.stopPropagation()

            const startX = event.pageX
            const startWidth = headerEl.offsetWidth
            const startTableWidth = this.refs.table.offsetWidth

            headerEl.classList.add('resizing') //Visual feedback class

            const onMouseMove = this.throttle((moveEvent) => {
                const delta = moveEvent.pageX - startX

                // Calculate new width with constraints
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
                headerEl.classList.remove('resizing')

                if (this.state.currentResizeWidth > 0) {
                    this.saveColumnWidth(
                        this.state.currentResizeWidth,
                        columnName,
                    )
                }

                document.removeEventListener('mousemove', onMouseMove)
                document.removeEventListener('mouseup', onMouseUp)
            }

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        },

        handleDoubleClick(event, headerEl, columnName) {
            event.preventDefault()
            event.stopPropagation()

            const defaultKey = `${columnName}_default`
            const resetWidth =
                this.getSavedWidth(defaultKey) || this.config.minWidth

            if (resetWidth !== headerEl.offsetWidth) {
                this.applyWidthToColumn(resetWidth, columnName)
                this.saveColumnWidth(resetWidth, columnName)
            }
        },

        applyWidthToColumn(width, columnName) {
            if (!width || width <= 0) return

            const name = this.sanitizeName(columnName)
            const widthPx = `${width}px`

            // Resize Header
            const header = this.refs.table.querySelector(
                SELECTORS.headerCell + name,
            )
            if (header) this.setElementWidth(header, widthPx)

            // Resize all Cells in this column

            const cells = this.refs.table.querySelectorAll(
                SELECTORS.cell + name,
            )
            cells.forEach((cell) => {
                this.setElementWidth(cell, widthPx)
                cell.style.overflow = 'hidden'
                cell.style.textOverflow = 'ellipsis'
                cell.style.whiteSpace = 'nowrap'
            })
        },

        setElementWidth(el, widthPx) {
            el.style.width = widthPx
            el.style.minWidth = widthPx
            el.style.maxWidth = widthPx
        },

        // ---- Persistence ----

        saveColumnWidth(width, columnName, customKey = null) {
            const key = customKey || columnName
            const max =
                this.config.maxWidth === -1 ? Infinity : this.config.maxWidth
            const validWidth = Math.max(
                this.config.minWidth,
                Math.min(max, width),
            )

            // Frontend Save
            sessionStorage.setItem(
                this.getStorageKey(key),
                validWidth.toString(),
            )

            // Internal state Update
            const colConfig = this.getColumnConfig(columnName)
            if (colConfig) colConfig.width = validWidth
        },

        getSavedWidth(name) {
            const val = sessionStorage.getItem(this.getStorageKey(name))
            return val ? parseInt(val, 10) : null
        },

        getStorageKey(name) {
            return `${this.config.tableKey}_columnWidth_${name}`
        },

        //  ---- Helpers ----

        getColumnConfig(name) {
            return this.columns.find((column) => column.name === name)
        },

        sanitizeName(name) {
            // Converts "user.first_name" -> "user-first-name" for class selectors
            return name
                .split('.')
                .map((s) =>
                    s
                        .replace(/_/g, '-')
                        .replace(/([a-z])([A-Z])/g, '$1-$2')
                        .toLowerCase(),
                )
                .join('\\.')
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
    }
}
