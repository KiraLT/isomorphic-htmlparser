import { ensureArray, getByKey, titleCase } from 'common-stuff'

interface ExtractExpression {
    selector: string
    attribute?: string
    filters: {
        name: string
        args: string[]
    }[]
}
export type Filter = (value: unknown, ...args: unknown[]) => unknown

export function extractAll<T>(
    expression: string,
    target: (selector: string) => unknown,
    extraFilters?: Record<string, Filter>
): T[] {
    const parsed = parseExtractExpression(expression)
    const values = ensureArray(target(parsed.selector))

    return values.map((v) => {
        return applyFilters(
            parsed.attribute ? getByKey(v, parsed.attribute) : v,
            parsed.filters,
            {
                ...defaultFilters,
                ...extraFilters,
            }
        )
    }) as T[]
}

function parseExtractExpression(selector: string): {
    selector: string
    attribute?: string
    filters: {
        name: string
        args: string[]
    }[]
} {
    const [part1, ...filters] = selector.split(/\s*\|(?!\=)\s*/)
    const [selectorPart, attributePart] =
        part1?.split('@').map((v) => v.trim()) ?? []

    return {
        selector: selectorPart ?? '',
        attribute: attributePart ?? undefined,
        filters: filters.length ? parseFilters(filters) : [],
    }
}

function parseFilters(filters: string[]): ExtractExpression['filters'] {
    return filters.flatMap((v) => {
        const parts = v.split(':')
        const name = parts.shift()

        return name
            ? [
                  {
                      name: name,
                      args: [
                          ...parts
                              .join(':')
                              .matchAll(/"([^"]*)"|'([^']*)'|([^ \t,]+)/g),
                      ]
                          .map((v) => v[2] || v[1] || v[0])
                          .filter((v) => !!v),
                  },
              ]
            : []
    })
}

function applyFilters(
    value: unknown,
    filtersConfig: ExtractExpression['filters'],
    filters: Record<string, Filter>
): unknown {
    return filtersConfig.reduce((prev, cur) => {
        const filter = filters[cur.name]

        if (!filter) {
            throw new Error(
                `Filter ${
                    cur.name
                } does not exist, available filters: ${Object.keys(
                    filters
                ).join(', ')}`
            )
        }

        return filter(prev, ...cur.args)
    }, value)
}

/**
 * Default extraction filters
 */
export const defaultFilters = {
    /**
     * Trims string start & end
     *
     * @example
     * ```
     * const selector = `.container @ text | trim`
     * const input    = `  heLLo   `
     * const output   = `heLLo`
     * ```
     */
    trim: (value: unknown) => {
        return typeof value === 'string' ? value.trim() : value
    },
    /**
     * Lowercase string
     *
     * @example
     * ```
     * const selector = `.container @ text | lowercase`
     * const input    = `heLLo`
     * const output   = `hello`
     * ```
     */
    lowercase: (value: unknown) => {
        return typeof value === 'string' ? value.toLowerCase() : value
    },
    /**
     * Uppercase string
     *
     * @example
     * ```
     * const selector = `.container @ text | uppercase`
     * const input    = `heLLo`
     * const output   = `HELLO`
     * ```
     */
    uppercase: (value: unknown) => {
        return typeof value === 'string' ? value.toUpperCase() : value
    },
    /**
     * Uppercase first word letters
     *
     * @example
     * ```
     * const selector = `.container @ text | titlecase`
     * const input    = `hello world`
     * const output   = `Hello World`
     * ```
     */
    titlecase: (value: unknown) => {
        return typeof value === 'string' ? titleCase(value) : value
    },
    /**
     * Reverses text
     *
     * @example
     * ```
     * const selector = `.container @ text | titlecase`
     * const input    = `hello world`
     * const output   = `dlrow olleh`
     * ```
     */
    reverse: function (value: unknown) {
        return typeof value === 'string'
            ? value.split('').reverse().join('')
            : value
    },
    /**
     * Slices text
     *
     * @example
     * ```
     * const selector = `.container @ text | slice:1,3`
     * const input    = `hello world`
     * const output   = `el`
     * ```
     */
    slice: function (value: unknown, start: unknown, end: unknown) {
        return typeof value === 'string'
            ? value.slice(
                  parseInt(String(start), 10) || undefined,
                  parseInt(String(end)) || undefined
              )
            : value
    },
}
