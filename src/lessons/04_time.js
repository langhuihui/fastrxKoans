export default [
    ["launching an event in the future", () => {
        let received = null;
        let time = __;

        const people = rx.subject();
        people.delay(time).subscribe((x) => { received = x; });
        people.next('Godot');

        setTimeout(() => {
            equal('Godot', received);
        }, 500)
    }, 600
    ],
    // ['a watched pot', () => {
    //     let received = '';
    //     const delay = 500;
    //     const timeout = __;
    //     const timeoutEvent = rx.of('Tepid');

    //     rx
    //         .of('Boiling')
    //         .delay(delay)
    //         .timeout(timeout, timeoutEvent)
    //         .subscribe(x => { received = x; });

    //     setTimeout(() => {
    //         equal(received, 'Boiling');
    //     }, 500);
    // },600],
    // ['you can place a time limit on how long an event should take', () => {
    //     let received = [];
    //     const timeout = 2000;
    //     const timeoutEvent = rx.of('Tepid');
    //     const temperatures = rx.subject();

    //     temperatures.timeout(timeout, timeoutEvent).subscribe(received.push.bind(received));

    //     temperatures.next('Started');

    //     setTimeout(() => {
    //         temperatures.next('Boiling');
    //     }, 3000);

    //     setTimeout(() => {
    //         equal(__, received.join(', '));
    //     }, 4000);
    // },4100],

    ['debouncing', () => {
        let received = [];
        const events = rx.subject();
        events.debounceTime(100).subscribe(received.push.bind(received));

        events.next('f');
        events.next('fr');
        events.next('fro');
        events.next('from');

        setTimeout(() => {
            events.next('r');
            events.next('rx');
            events.next('rxj');
            events.next('rxjs');

            setTimeout(() => {
                equal(__, received.join(' '));

            }, 120);
        }, 120);
    }, 500],

    ['buffering', () => {
        let received = [];
        const events = rx.subject();
        events.bufferTime(100)
            .map(c => c.join(''))
            .subscribe(received.push.bind(received));

        events.next('R');
        events.next('x');
        events.next('J');
        events.next('S');

        setTimeout(() => {
            events.next('R');
            events.next('o');
            events.next('c');
            events.next('k');
            events.next('s');

            setTimeout(() => {
                equal(__, received.join(' '));

            }, 120);
        }, 120);
    }, 500],

    ['time between calls', () => {
        let received = [];
        const events = rx.subject();

        events.timeInterval()
            .filter(t => t.interval > 100)
            .subscribe(t => { received.push(t.value); });

        events.next('too');
        events.next('fast');

        setTimeout(() => {
            events.next('slow');

            setTimeout(() => {
                events.next('down');

                equal(__, received.join(' '));

            }, 120);
        }, 120);
    }, 500],

    // ['results can be ambiguous timing', () => {
    //     const results = 0;
    //     const fst = rx.timer(400).map(-1);
    //     const snd = rx.timer(500).map(1);

    //     fst.amb(snd).subscribe(x => { results = x; });

    //     setTimeout(() => {
    //         equal(results, __);
    //     }, 600);
    // }, 700],

]