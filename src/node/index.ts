import { AnyNode, CheerioAPI, load } from 'cheerio'
import { IsomorphicHTMLElement, ParseHTML } from '../dom'

export const parseHTML: ParseHTML = (html) => {
    return createElement(load(html))
}

function createElement($: CheerioAPI, element?: AnyNode): IsomorphicHTMLElement {
    return {
        find(selector) {
            const target = (element ? $(element).find(selector).first() : $(selector).first()).get()[0]

            if (target) {
                return createElement($, target)
            }

            return undefined
        },
        findAll(selector) {
            const target = element ? $(element).find(selector) : $(selector)

            return target.get().map(v => createElement($, v))
        },
        get text() {
            return element ? $(element).text() : ''
        },
        get attrs() {
            return element ? $(element).attr() || {} : {}
        }
    }
}