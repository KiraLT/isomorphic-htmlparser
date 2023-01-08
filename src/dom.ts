export interface ParseHTML {
    /**
     * Parse provided HTML
     * 
     * @param html HTML string to parse
     */
    (html: string): IsomorphicHTMLElement
}

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
     * Get all element attributes
     * 
     * @param selector HTML selector
     */
    attrs: Record<string, string>
}
