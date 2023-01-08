import { IsomorphicHTMLElement, ParseHTML } from '../dom'

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
            return Array.from(element.querySelectorAll(selector)).map(v => createElement(v))
        },
        get text() {
            return element.textContent || ''
        },
        get attrs() {
            return Object.assign(
                {},
                ...Array.from(element.attributes, ({name, value}) => ({
                    [name]: value
                }))
            )
        }
    }
}