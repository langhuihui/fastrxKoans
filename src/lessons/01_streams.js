export default [
    ["simple subscription", () => {
        rx.of(42).subscribe((x) => equal(x, __))
    }
    ],
    ["what comes in goes out", () => {
        // Which interface Rx apply? (hint: what does "of()" return) 
        rx.of(__).subscribe((x) => equal(x, 101))
    }
    ],
    ["this is the same as an event stream", () => {
        // What is the relationship between 
        // "this is the same as an event stream" and "simple subscription"?
        const sub = rx.subject();
        sub.subscribe((x) => equal(__, x));
        sub.next(37)
    }
    ],
    ["how event streams relate to observables", () => {
        // What does rx.of() map to for a Subject?
        let observableResult = 1;
        rx.of(73).subscribe((x) => { observableResult = x; });

        let eventStreamResult = 1;
        const events = rx.subject();
        events.subscribe((x) => { eventStreamResult = x; });
        events.__(73);

        equal(observableResult, eventStreamResult);
    }
    ],
    ["simple return", () => {
        let received = '';
        rx.of('foo').subscribe((x) => { received = x; });

        equal(__, received);
    }
    ],
    ["the last event", () => {
        let received = '';
        const names = ['foo', 'bar'];
        rx.from(names).subscribe((x) => { received = x; });

        equal(__, received);
    }
    ],
    ["this is still an event stream", () => {
        let received = 0;
        const numbers = rx.subject();
        numbers.subscribe((x) => { received += x; });

        numbers.next(10);
        numbers.next(5);

        equal(__, received);
    }
    ],
    ["all events will be received", () => {
        let received = 'Working ';
        const numbers = Range.create(9, 5);

        rx.from(numbers).subscribe((x) => { received += x; });
        equal(__, received);
    }
    ],
    ["do things in the middle", () => {
        const status = [];
        const daysTilTest = rx.from(Range.create(4, 1));

        daysTilTest
            .tap((d) => {
                status.push(d + '=' + (d === 1 ? 'Study Like Mad' : __));
            })
            .subscribe();

        equal('4=Party,3=Party,2=Party,1=Study Like Mad', status.toString());
    }
    ],
    ["nothing listens until you subscribe", () => {
        let sum = 0;
        const numbers = rx.from(Range.create(1, 10));
        const observable = numbers.tap(n => { sum += n; });

        equal(0, sum);
        observable.__();

        equal(1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10, sum);
    }
    ],
    ["events before you subscribe do not count", () => {
        let sum = 0;
        const numbers = rx.subject();
        const observable = numbers.tap(n => { sum += n; });

        numbers.next(1);
        numbers.next(2);

        observable.subscribe();

        numbers.next(3);
        numbers.next(4);

        equal(__, sum);
    }
    ],
    ['events after you unsubscribe dont count', () => {
        let sum = 0;
        const numbers = rx.subject();
        const observable = numbers.tap(n => { sum += n; });
        const subscription = observable.subscribe();

        numbers.next(1);
        numbers.next(2);

        subscription.dispose();

        numbers.next(3);
        numbers.next(4);

        equal(__, sum);
    }
    ],
    ["events while subscribing", () => {
        const received = [];
        const words = rx.subject();
        const observable = words.tap(received.push.bind(received));

        words.next('Peter');
        words.next('said');

        const subscription = observable.subscribe();

        words.next('you');
        words.next('look');
        words.next('pretty');

        subscription.dispose();

        words.next('ugly');

        equal(__, received.join(' '));
    }
    ],
]