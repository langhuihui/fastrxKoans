export default [
    ['the main event', () => {
        const received = [];
        const subscription = rx.fromEvent(document, 'change')
            .subscribe(({ payload }) => received.push(payload));

        const newEvent = s => {
            const e = new Event('change')
            e.payload = s;
            return e
        }

        document.dispatchEvent(newEvent('R'));
        document.dispatchEvent(newEvent('x'));
        document.dispatchEvent(newEvent('J'));
        document.dispatchEvent(newEvent('S'));

        subscription.dispose();

        document.dispatchEvent(newEvent('!'));

        equal(__, received.join(''));
    }]

]