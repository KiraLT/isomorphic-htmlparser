import { ensureArray, getByKey, titleCase, parseSize } from 'common-stuff'

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
    extraFilters?: Record<string, Filter>,
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
            },
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
                      args: Array.from(
                          parts
                              .join(':')
                              .matchAll(/"([^"]*)"|'([^']*)'|([^ \t,]+)/g),
                      )
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
    filters: Record<string, Filter>,
): unknown {
    return filtersConfig.reduce((prev, cur) => {
        const filter = filters[cur.name]

        if (!filter) {
            throw new Error(
                `Filter ${
                    cur.name
                } does not exist, available filters: ${Object.keys(
                    filters,
                ).join(', ')}`,
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
    trim: (value: unknown): string => {
        return String(value).trim()
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
    lowercase: (value: unknown): string => {
        return String(value).toLowerCase()
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
        return String(value).toUpperCase()
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
    titlecase: (value: unknown): string => {
        return titleCase(String(value))
    },
    /**
     * Reverses text
     *
     * @example
     * ```
     * const selector = `.container @ text | reverse`
     * const input    = `hello world`
     * const output   = `dlrow olleh`
     * ```
     */
    reverse: (value: unknown): string => {
        return String(value).split('').reverse().join('')
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
    slice: (value: unknown, start: unknown, end: unknown): string => {
        return String(value).slice(
            parseInt(String(start), 10) || undefined,
            parseInt(String(end)) || undefined,
        )
    },
    /**
     * Parses size string to bytes
     *
     * @example
     * ```
     * const selector = `#size @ text | trim | parseSize`
     * const input    = `7.4 GB`
     * const output   = `7945689497.6`
     * ```
     */
    parseSize: (value: unknown): number => {
        return parseSize(defaultFilters.trim(value))
    },
    /**
     * Parses int from text
     *
     * @example
     * ```
     * const selector = `#number @ text | trim | parseInt`
     * const input    = `7 `
     * const output   = 7
     * ```
     */
    parseInt: (value: unknown): number | undefined => {
        const parsed = parseInt(defaultFilters.trim(value), 10)
        return isNaN(parsed) ? undefined : parsed
    },
    /**
     * Parses float from text
     *
     * @example
     * ```
     * const selector = `#number @ text | trim | parseFloat`
     * const input    = `7.6 `
     * const output   = 7.6
     * ```
     */
    parseFloat: (value: unknown): number | undefined => {
        const parsed = parseFloat(defaultFilters.trim(value))
        return isNaN(parsed) ? undefined : parsed
    },
}
