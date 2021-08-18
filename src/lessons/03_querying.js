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
        const e = new EventEmitter();
        rx.fromEvent(e, 'click')
            .filter(click => click.x === click.y)
            .map(click => __ + __)
            .subscribe(x => { results = x; });
           
            e.emit('click', {x: 100, y: 50});
            e.emit('click', {x: 75,  y: 75});
            e.emit('click', {x: 40,  y: 80});

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