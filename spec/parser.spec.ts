import { parseHTML } from '../src/node'

const html = `
<!DOCTYPE html>
<html>
<body>

<h1>My First Heading</h1>
<p>My first paragraph.</p>
<div class="body">
    <span class="content">My content</span>
    <span class="content">My content2</span>
</div>
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

        expect(dom.findAll('.body .content').map(v => v.text)).toEqual([
            'My content',
            'My content2'
        ])
    })

    it('parses attributes', () => {
        const dom = parseHTML(html)

        expect(dom.find('.body .content')?.attrs).toEqual({
            class: 'content'
        })
    })
})