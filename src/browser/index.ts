import { IsomorphicHTMLElement, ParseHTML } from '../dom'
import { extractAll } from '../extraction'

export const parseHTML: ParseHTML = (html) => {
    const root = document.createElement('html')
    root.innerHTML = html

    return createElement(root)
}

function createElement(element: Element): IsomorphicHTMLElement {
    return {
        find(selector) {
            const target = element.querySelector(selector)

            if (target) {
                return createElement(target)
            }

            return undefined
        },
        findAll(selector) {
            return Array.from(element.querySelectorAll(selector)).map((v) =>
                createElement(v),
            )
        },
        extract(selector, extraFilters) {
            return extractAll(
                selector,
                (v) => this.find(v),
                extraFilters,
            )[0] as any
        },
        extractAll(selector, extraFilters) {
            return extractAll(selector, (v) => this.findAll(v), extraFilters)
        },
        get text() {
            return element.textContent || ''
        },
        get html() {
            return element.innerHTML
        },
        get attrs() {
            return Object.assign(
                {},
                ...Array.from(element.attributes, ({ name, value }) => ({
                    [name]: value,
                })),
            )
        },
        get nextSibling() {
            return element.nextSibling instanceof Element
                ? createElement(element.nextSibling)
                : undefined
        },
        get previousSibling() {
            return element.previousSibling instanceof Element
                ? createElement(element.previousSibling)
                : undefined
        },
    }
}
