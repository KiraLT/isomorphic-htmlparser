import { Filter } from './extraction'

export interface ParseHTML {
    /**
     * Parse provided HTML
     *
     * @param html HTML string to parse
     */
    (html: string): IsomorphicHTMLElement
}

export interface ExtractFromHTML {
    /**
     * Parse provided HTML
     *
     * @param html HTML string to parse
     */
    (html: string, schema: Record<string, string>): Record<string, unknown>
}

/**
 * Structure representing one HTML element
 */
export interface IsomorphicHTMLElement {
    /**
     * Find one HTML element by provided HTML Selector
     *
     * @param selector HTML selector
     */
    find(selector: string): IsomorphicHTMLElement | undefined
    /**
     * Find all HTML elements by provided HTML Selector
     *
     * @param selector HTML selector
     */
    findAll(selector: string): IsomorphicHTMLElement[]
    /**
     * Get the combined text contents of each element in the set of matched elements, including their descendants
     *
     * @param selector HTML selector
     */
    text: string
    /**
     * Get the HTML content of the first element in the set of matched elements
     */
    html: string
    /**
     * Get all element attributes
     */
    attrs: Record<string, string>
    /**
     * Get next sibling
     */
    nextSibling?: IsomorphicHTMLElement
    /**
     * Get previous sibling
     */
    previousSibling?: IsomorphicHTMLElement
    /**
     * Extract value from first found element by provided selector
     *
     * @example
     * ```
     * el.extract('.content @ attrs.data-summary | trim | uppercase')
     *
     * el.extract('.content @ attrs.data-summary | myCallback | uppercase', {
     *     myCallback(value) {
     *         return typeof value === 'string' ? value.trim() : value
     *     }
     * })
     * ```
     * @param selector HTML selector
     * @param extraFilters custom filters
     */
    extract<T>(
        selector: string,
        extraFilters?: Record<string, Filter>,
    ): T | undefined
    /**
     * Extract value by provided selector
     *
     * @example
     * ```
     * el.extractAll('.content @ attrs.data-summary | trim | uppercase')
     *
     * el.extractAll('.content @ attrs.data-summary | myCallback | uppercase', {
     *     myCallback(value) {
     *         return typeof value === 'string' ? value.trim() : value
     *     }
     * })
     * ```
     * @param selector HTML selector
     * @param extraFilters custom filters
     */
    extractAll<T>(selector: string, extraFilters?: Record<string, Filter>): T[]
    /**
     * Remove element from the DOM
     * @example
     * ```
     * el.remove()
     * ```
     */
    remove(): void
}
