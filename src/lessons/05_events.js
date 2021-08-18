export default [
    ['the main event', () => {
        const received = [];
        const e = new EventEmitter();
        const subscription = rx.fromEvent(e, 'change')
            .subscribe(received.push.bind(received));

        e.emit('change', 'R');
        e.emit('change', 'x');
        e.emit('change', 'J');
        e.emit('change', 'S');

        subscription.dispose();

        e.emit('change', '!');

        equal(__, received.join(''));
    }]

]