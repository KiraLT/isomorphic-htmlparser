import { CheerioAPI, load } from 'cheerio'
import { IsomorphicHTMLElement, ParseHTML } from '../dom'
import { extractAll } from '../extraction'
import type { AnyNode } from 'domhandler'

export const parseHTML: ParseHTML = (html) => {
    return createElement(load(html))
}

function createElement(
    $: CheerioAPI,
    element?: AnyNode,
): IsomorphicHTMLElement {
    return {
        find(selector) {
            const target = (
                element
                    ? $(element).find(selector).first()
                    : $(selector).first()
            ).get()[0]

            if (target) {
                return createElement($, target)
            }

            return undefined
        },
        findAll(selector) {
            const target = element ? $(element).find(selector) : $(selector)

            return target.get().map((v) => createElement($, v))
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
            return element ? $(element).text() : ''
        },
        get html() {
            return element ? $(element).html() || '' : ''
        },
        get attrs() {
            return element
                ? JSON.parse(JSON.stringify($(element).attr())) || {}
                : {}
        },
        get nextSibling() {
            return element?.nextSibling
                ? createElement($, element.nextSibling)
                : undefined
        },
        get previousSibling() {
            return element?.previousSibling
                ? createElement($, element.previousSibling)
                : undefined
        },
        remove() {
            if (element) {
                $(element).remove()
            }
        },
    }
}
