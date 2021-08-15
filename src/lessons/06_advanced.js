export default [
    ['merging', () => {
        const easy = [];
        const you = rx.of(1, 2, 3);
        const me = rx.of('A', 'B', 'C');
        rx.merge(you, me).subscribe(easy.push.bind(easy));
        equal(easy.join(' '), __);
    }],

    ['merging events', () => {
        const first = [];
        const both = [];

        const s1 = rx.subject();
        const s2 = rx.subject();

        s1.subscribe(first.push.bind(first));
        rx.merge(s1, s2).subscribe(both.push.bind(both));

        s1.next('I');
        s1.next('am');
        s2.next('nobody.');
        s2.next('Nobody');
        s2.next('is');
        s1.next('perfect.');

        equal('I am nobody. Nobody is perfect.', both.join(' '));
        equal(__, first.join(' '));
    }],

    ['splitting up', () => {
        const oddsAndEvens = [];
        const numbers = rx.range(1, 9);
        const split = numbers.groupBy(n => n % __);
        split.subscribe(group => {
            group.subscribe(n => {
                oddsAndEvens[group.key] || (oddsAndEvens[group.key] = '');
                oddsAndEvens[group.key] += n;
            })
        })

        equal('2468', oddsAndEvens[0]);
        equal('13579', oddsAndEvens[1]);
    }],

    ['need to subscribe immediately when splitting', () => {
        const mins = [0, 0];
        const numbers = rx.of(24, 22, 103, 26, 101, 200);
        const split = numbers.groupBy(n => n % 2);

        split.subscribe(g => {
            g.min().__(a => { mins[g.key] = a; });
        });

        equal(22, mins[0]);
        equal(101, mins[1]);
    }],

    ['multiple subscriptions', () => {
        const numbers = rx.subject();
        let sum = 0;
        let max = 0;

        numbers.sum().subscribe(n => { sum = n; });
        numbers.next(1);
        numbers.next(1);
        numbers.next(1);
        numbers.next(1);
        numbers.next(1);

        numbers.max().subscribe(n => { max = n; });
        numbers.next(2);
        numbers.next(5);
        numbers.next(3);
        numbers.next(7);
        numbers.next(6);

        numbers.complete();

        equal(1+1+1+1+1+2+5+3+7+6, sum);
        equal(__, max);
    }],

]