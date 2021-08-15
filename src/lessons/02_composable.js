export default [
    ["composable add", () => {
        let received = 0;
        let numbers = [10, 100, __];

        rx.from(numbers).sum().subscribe(x => { received = x; });

        equal(1110, received);
    }
    ],
    ['composable before and after', () => {
        const names = Range.create(1, 6);
        let a = '';
        let b = '';

        rx.from(names)
            .tap(n => { a += n; })
            .filter(n => n % 2 === 0)
            .tap(n => { b += n; })
            .subscribe();

        equal(__, a);
        equal('246', b);
    }],
    ['we wrote this', () => {
        const received = [];
        let names = ["Bart", "Marge", "Wes", "Linus", "Erik", "Matt"];

        rx.from(names)
            .filter(n => n.length <= __)
            .subscribe(received.push.bind(received));

        equal('Bart,Wes,Erik,Matt', received);
    }],

    ['converting events', () => {
        let received = '';
        const names = ["wE", "hOpE", "yOU", "aRe", "eNJoyIng", "tHiS"];

        rx.from(names)
            .map(x => x.__())
            .subscribe(x => { received += x + ' '; });

        equal('we hope you are enjoying this ', received);
    }],

    ['create a more relevant stream', () => {
        let received = '';
        const mouseXMovements = [100, 200, 150];
        const relativemouse = rx.from(mouseXMovements).map(x => x - __);

        relativemouse.subscribe(x => { received += x + ', '; });

        equal('50, 150, 100, ', received);
    }],

    ['checking everything', () => {
        let received = null;
        const names = [2, 4, 6, 8];

        rx.from(names)
            .every(x => x % 2 === 0)
            .subscribe(x => { received = x; });

        equal(__, received);
    }],

    ['composition means the sum is greater than the parts', () => {
        let received = 0;
        const numbers = rx.range(1, 10);

        numbers.filter(x => x > __)
            .sum()
            .subscribe(x => { received = x; });

        equal(19, received);
    }],
]