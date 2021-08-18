import rx from "fastrx";
import EventEmitter from "eventemitter3";
const Range = {
    create(start, end) {
        const results = [];
        let current = start;
        let step = start < end ? 1 : -1;

        results.push(current);

        while (current !== end) {
            current += step;
            results.push(current);
        }

        return results;
    }
};
class BaseQ {
    constructor(name, label, content, wait = 0) {
        this.name = name;
        this.label = label;
        this.content = content;
        this.wait = wait
    }
    validate(value, resolve, reject) {
        try {
            const answer = Array.isArray(value) ? value.reduce((acc, c) => acc.replace('__', c), this.code) : this.code.replace('__', value);
            let pass = true
            const f = new Function("rx,Range,EventEmitter,equal", answer);
            const sub = rx.subject()
            sub.debounceTime(this.wait).take(1).subscribe(() => pass ? resolve() : reject('wrong'))
            f(rx, Range,EventEmitter, (a, b) => {
                pass = pass && a == b
                sub.next(pass)
            });
        } catch (e) {
            console.warn(e);
            reject(e);
        }
    }
    get length() {
        return this.code.split('__').length - 1
    }
    get code() {
        return this.content.toString().substr(8).replace(/        /g, '').replace(/    }$/, '');
    }
}

let index = 0;
export default function getQ(args) {
    index++;
    return new BaseQ("No" + index, ...args);
}