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
            flexibleColumns: [],
            tableKey: null,
            averageCharacterWidth: 8,
            headerPadding: 32,
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
        },

        livewireHookCleanup: null,
        abortController: null,

        init() {
            this.abortController = new AbortController()
            this.element = this.$el

            // Initial setup
            this.initializeComponent()

            // Handle Livewire DOM updates
            this.registerLivewireHooks()
        },

        registerLivewireHooks() {
            this.livewireHookCleanup = Livewire.hook(
                'morph.updated',
                ({ el }) => {
                    if (!this.element?.contains(el)) return
                    if (this.state.pendingUpdate) return

                    this.state.pendingUpdate = true

                    // Wait for DOM paint to finish
                    requestAnimationFrame(() => {
                        if (
                            this.element &&
                            document.body.contains(this.element)
                        ) {
                            this.state.initialized = false
                            this.state.totalWidth = 0
                            this.initializeComponent()
                        }

                        this.state.pendingUpdate = false
                    })
                },
            )
        },

        initializeComponent() {
            if (this.state.initialized) return

            // Locate Elements
            this.refs.content = this.element.querySelector(SELECTORS.content)
            this.refs.table = this.element.querySelector(SELECTORS.table)
            this.refs.wrapper = this.element.querySelector(SELECTORS.wrapper)

            if (!this.refs.table || !this.refs.content) return

            this.initializeColumns()

            this.state.initialized = true
        },

        calculateFitContentWidth() {
            if (!this.refs.wrapper) {
                return
            }

            const visibleColumns = this.columns.filter(
                (column) => !column.isHidden,
            )

            let wrapperWidth = this.refs.wrapper.clientWidth

            // subtract selection/action columns
            this.refs.table
                .querySelectorAll(SELECTORS.emptyHeaderCell)
                .forEach((el) => {
                    wrapperWidth -= el.offsetWidth
                })

            const baseWidths = []
            const flexible = []

            let totalBaseWidth = 0

            visibleColumns.forEach((column) => {
                const baseWidth = this.getColumnBaseWidth(column)

                baseWidths.push({
                    column,
                    baseWidth,
                })

                totalBaseWidth += baseWidth

                if (this.isFlexibleColumn(column.name)) {
                    flexible.push(column.name)
                }
            })

            if (wrapperWidth <= totalBaseWidth) {
                // Wrapper smaller than natural width

                baseWidths.forEach(({ column, baseWidth }) => {
                    const key = `${column.name}_default`

                    this.saveColumnWidth(width, column.name, key)
                })

                return
            }

            const extraWidth = wrapperWidth - totalBaseWidth

            if (flexible.length) {
                // ---------- FLEXIBLE MODE ----------

                const flexibleBase = baseWidths
                    .filter((item) => flexible.includes(item.column.name))
                    .reduce((sum, item) => sum + item.baseWidth, 0)

                baseWidths.forEach((item) => {
                    let width = item.baseWidth

                    if (flexible.includes(item.column.name)) {
                        width += extraWidth * (item.baseWidth / flexibleBase)
                    }

                    const key = `${item.column.name}_default`

                    this.saveColumnWidth(
                        Math.round(width),
                        item.column.name,
                        key,
                    )
                })
            } else {
                // ---------- AUTO EXPAND MODE ----------

                baseWidths.forEach((item) => {
                    const width =
                        item.baseWidth +
                        extraWidth * (item.baseWidth / totalBaseWidth)

                    const key = `${item.column.name}_default`

                    if (!this.getSavedWidth(key)) {
                        this.saveColumnWidth(
                            Math.round(width),
                            item.column.name,
                            key,
                        )
                    }
                })
            }
        },

        initializeColumns() {
            if (!this.config.enable || !this.columns.length) return

            this.state.totalWidth = 0

            if (this.config.fitContent) {
                this.calculateFitContentWidth()
            }

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

            const savedWidth = this.getSavedWidth(rawName)
            const defaultWidth = this.getSavedWidth(defaultKey)

            let width = savedWidth ?? defaultWidth

            if (!width) {
                width = this.config.fitContent
                    ? this.getSavedWidth(defaultKey)
                    : headerEl.offsetWidth

                if (!width) {
                    width = headerEl.offsetWidth
                }

                this.saveColumnWidth(width, rawName, defaultKey)
            }

            this.applyWidthToColumn(width, rawName)

            this.state.totalWidth += width
        },

        mountResizeHandle(headerEl, columnName) {
            if (headerEl.querySelector(`.${SELECTORS.resizeHandle}`)) return

            const handle = document.createElement('button')
            handle.type = 'button'
            handle.className = SELECTORS.resizeHandle // defined in CSS
            handle.title = 'Resize column'

            handle.addEventListener(
                'mousedown',
                (e) => {
                    this.handleResizeStart(e, headerEl, columnName)
                },
                { signal: this.abortController.signal },
            )

            handle.dataset.column = columnName

            handle.addEventListener(
                'dblclick',
                (e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    this.handleDoubleClick(e, headerEl, columnName)
                },
                { signal: this.abortController.signal },
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

            let currentResizeWidth = startWidth

            const onMouseMove = this.throttle((moveEvent) => {
                const delta = moveEvent.pageX - startX

                // Calculate new width with constraints
                let newWidth = startWidth + delta
                const max =
                    this.config.maxWidth === -1
                        ? Infinity
                        : this.config.maxWidth

                newWidth = Math.max(
                    this.config.minWidth,
                    Math.min(max, newWidth),
                )
                currentResizeWidth = Math.round(newWidth)

                // Update Table Width synchronously so it feels responsive
                const widthDiff = currentResizeWidth - startWidth
                this.state.totalWidth = startTableWidth + widthDiff
                this.refs.table.style.width = `${this.state.totalWidth}px`

                this.applyWidthToColumn(currentResizeWidth, columnName)
            }, 16)

            const onMouseUp = () => {
                headerEl.classList.remove('resizing')

                if (currentResizeWidth > 0) {
                    this.saveColumnWidth(currentResizeWidth, columnName)
                }

                document.removeEventListener('mousemove', onMouseMove)
                document.removeEventListener('mouseup', onMouseUp)
            }

            document.addEventListener('mousemove', onMouseMove, {
                signal: this.abortController.signal,
            })
            document.addEventListener('mouseup', onMouseUp, {
                signal: this.abortController.signal,
            })
        },

        handleDoubleClick(event, headerEl, columnName) {
            event.preventDefault()
            event.stopPropagation()

            const defaultWidth = this.getSavedWidth(`${columnName}_default`)

            if (!defaultWidth) return

            const currentWidth = headerEl.offsetWidth
            this.applyWidthToColumn(defaultWidth, columnName)

            this.saveColumnWidth(defaultWidth, columnName)

            this.state.totalWidth += defaultWidth - currentWidth

            this.refs.table.style.width = `${this.state.totalWidth}px`
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

        saveColumnWidth(width, columnName, customKey = null, overwrite = true) {
            const key = customKey || columnName

            if (!overwrite && localStorage.getItem(this.getStorageKey(key))) {
                return
            }

            const max =
                this.config.maxWidth === -1 ? Infinity : this.config.maxWidth

            const validWidth = Math.max(
                this.config.minWidth,
                Math.min(max, width),
            )

            // Frontend Save
            localStorage.setItem(this.getStorageKey(key), validWidth.toString())

            // Internal state Update
            const colConfig = this.getColumnConfig(columnName)
            if (colConfig) colConfig.width = validWidth
        },

        getSavedWidth(name) {
            const val = localStorage.getItem(this.getStorageKey(name))
            return val ? parseInt(val, 10) : null
        },

        getStorageKey(name) {
            return `${this.config.tableKey}_columnWidth_${name}`
        },

        //  ---- Helpers ----

        getColumnConfig(name) {
            return this.columns.find((column) => column.name === name)
        },

        isFlexibleColumn(name) {
            return this.config.flexibleColumns.includes(name)
        },

        getColumnBaseWidth(column) {
            const header = this.refs.table.querySelector(
                SELECTORS.headerCell + this.sanitizeName(column.name),
            )

            if (!header) {
                return this.config.minWidth
            }

            // Remove resize handle
            const clone = header.cloneNode(true)

            clone
                .querySelectorAll(`.${SELECTORS.resizeHandle}`)
                .forEach((el) => el.remove())

            const text = clone.textContent.replace(/\s+/g, ' ').trim()

            const width = Math.max(
                this.config.minWidth,
                text.length * this.config.averageCharacterWidth +
                    this.config.headerPadding,
            )

            return width
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

        // ---- Cleanup ----
        destroy() {
            this.livewireHookCleanup?.()
            this.livewireHookCleanup = null

            this.abortController?.abort()
            this.abortController = null
        },
    }
}
