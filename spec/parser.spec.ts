import { parseHTML } from '../src/node'

const html = `
<!DOCTYPE html>
<html>
<body>

<h1>
    My First Heading
</h1>
<p>My first paragraph.</p>
<div class="body">
    <span class="content">My content</span>
    <span class="content content2">My content2</span>
</div>
<div id="size">
    7.4 GB
</div>
<div id="number">
    7.4
</div>
<div id="date">
    2023-11-10 10:30
</div>
<div id="date2">
    Dec. 20th '23
</div>
<div id="html"><strong>a</strong></div>
</body>
</html>
`

describe('parseHTML', () => {
    it('finds one element', () => {
        const dom = parseHTML(html)

        expect(dom.find('.body .content')?.text).toBe('My content')
    })

    it('finds multiple element', () => {
        const dom = parseHTML(html)

        expect(dom.findAll('.body .content').map((v) => v.text)).toEqual([
            'My content',
            'My content2',
        ])
    })

    it('extracts html from element', () => {
        const dom = parseHTML(html)

        expect(dom.find('#html')?.html).toBe('<strong>a</strong>')
    })

    it('parses attributes', () => {
        const dom = parseHTML(html)

        expect(dom.find('.body .content')?.attrs).toEqual({
            class: 'content',
        })
    })

    it('extracts attribute', () => {
        const dom = parseHTML(html)

        expect(dom.extract('.body .content @ attrs.class')).toBe('content')
    })

    it('extracts heading and trims it', () => {
        const dom = parseHTML(html)

        expect(dom.extract('h1 @ text | trim')).toBe('My First Heading')
    })

    it('extracts heading and lowercase it', () => {
        const dom = parseHTML(html)

        expect(dom.extract('h1 @ text | trim | lowercase')).toBe(
            'my first heading',
        )
    })

    it('extracts heading and uppercase it', () => {
        const dom = parseHTML(html)

        expect(dom.extract('h1 @ text | trim | uppercase')).toBe(
            'MY FIRST HEADING',
        )
    })

    it('extracts heading and titlecase it', () => {
        const dom = parseHTML(html)

        expect(dom.extract('h1 @ text | trim | titlecase')).toBe(
            'My First Heading',
        )
    })

    it('extracts heading and slice it', () => {
        const dom = parseHTML(html)

        expect(dom.extract('h1 @ text | trim | slice:3,8')).toBe('First')
    })

    it('extracts heading and slice it by start only', () => {
        const dom = parseHTML(html)

        expect(dom.extract('h1 @ text | trim | slice:3')).toBe('First Heading')
    })

    it('extracts multiple attribute', () => {
        const dom = parseHTML(html)

        expect(dom.extractAll('.body .content @ attrs.class')).toEqual([
            'content',
            'content content2',
        ])
    })

    it('extracts heading and slice it', () => {
        const dom = parseHTML(html)

        expect(dom.extract('#size @ text | trim | parseSize')).toBe(
            7945689497.6,
        )
    })

    it('extracts int', () => {
        const dom = parseHTML(html)

        expect(dom.extract('#number @ text | parseInt')).toBe(7)
    })

    it('extracts float', () => {
        const dom = parseHTML(html)

        expect(dom.extract('#number @ text | parseFloat')).toBe(7.4)
    })

    it('extracts date', () => {
        const dom = parseHTML(html)

        // Date parsing depends of current timezone
        expect(dom.extract('#date @ text | parseDate')).toBeGreaterThan(
            1699600000000,
        )
        expect(
            dom.extract('#date2 @ text | parseDate:"MMM. Do \'YY"'),
        ).toBeGreaterThan(1699600000000)
    })
})
