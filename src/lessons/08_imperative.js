export default [
    ['can make a decision with an if (iif)', () => {
        const results = [];
        rx.range(1, 5)
            .mergeMap((x, i) => rx.iif(() => x % 2 == 0, rx.of(x), rx.range(x, i)))
            .subscribe(results.push.bind(results));

        equal(__, results.join(''));
    }],
    ['takeWhile does something until proven false', () => {
        let i = 0;
        const result = [];

        rx.of(__)
            .takeWhile(() => ++i < 3)
            .subscribe(result.push.bind(result));

        equal('4242', result.join(''));
    }]
]