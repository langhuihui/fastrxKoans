export default [
    ['mergeMap can be a cartesian product', () => {
        const results = [];
        rx.range(1, 3)
            .mergeMap((x, i) => rx.range(__, __))
            .subscribe(results.push.bind(results));

        equal('234', results.join(''));
    }],
    ['switchMap only gets us the latest value', () => {
        const results = [];
        rx.range(1, 3)
            .switchMap((x) => rx.range(x, ___))
            .subscribe(results.push.bind(results));

        equal('12345', results.join(''));
    }]
]