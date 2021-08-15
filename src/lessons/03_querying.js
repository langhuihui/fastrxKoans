export default [
    ['Basic querying', () => {
        const strings = [];
        const numbers = rx.range(1, 100);

        numbers
            .filter(x => x % __ === 0)
            .map(x => x.toString())
            .subscribe(strings.push.bind(strings));

        equal('11,22,33,44,55,66,77,88,99', strings.toString());
    }],

    ['querying over events', () => {
        let results = 0;

        rx.fromEvent(document, 'click')
            .filter(click => click.x === click.y)
            .map(click => __ + __)
            .subscribe(x => { results = x; });
            const newEvent = (x,y) => {
                const e = new Event('click')
                e.x = x
                e.y = y
                return e
            }
            document.dispatchEvent(newEvent(100,50));
            document.dispatchEvent(newEvent(75,75));
            document.dispatchEvent(newEvent(40,80));

        equal(results, 150);
    }],

    ['buffering with count and skip', () => {
        const results = [];
        rx.range(1, 10)
            .bufferCount(__, __)
            .subscribe(results.push.bind(results));

        equal('12345', results[0].join(''));
        equal('678910', results[1].join(''));
    }],

]