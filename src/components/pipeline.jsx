import * as components from "./rx"
import { reactive } from 'vue'
const noop = Function.prototype
function parseSources(value) {
    let sources = []
    let status = 0;
    let depth = 0;
    let last = null;
    let current = { name: "", arg: "", streams: [] };
    for (let i = 0; i < value.length; i++) {
        switch (status) {
            case 0:
                if (value[i] == "(") {
                    status = 1;
                    depth = 1;
                } else {
                    current.name += value[i];
                }
                break;
            case 1:
                if (value[i] == "(") {
                    depth++;
                } else if (value[i] == ")") {
                    depth--;
                    if (depth == 0) {
                        status = 2;
                        if (last) {
                            current.source = last;
                        }
                        break;
                    }
                }
                current.arg += value[i];
                break;
            case 2:
                if (value[i] == ".") {
                    status = 0;
                    last = current;
                    current = { name: "", arg: "", streams: [] };
                } else if (value[i] == ',') {
                    status = 0;
                    last = null
                    sources.push(current)
                    current = { name: "", arg: "", streams: [] };
                }
        }
    }
    if (status == 2) {
        sources.push(current)
        return sources
    }
    return []
}
const ob = (f, ctx) => function (n, c) {
    const stream = reactive({
        status: 1,
    });
    if (!ctx.source) {
        stream.color = [
            "pink",
            "red",
            "orange",
            "blue",
            "green",
            "cyan",
            "purple",
        ][ctx.streams.length % 7];
    }
    const disposable = f(
        (data) => {
            if (typeof data == 'object' && data.color) {
                stream.color = data.color
            } else {
                data = { data, color: stream.color }
            }
            stream.label = data.data.toString()
            n(data);
        },
        (err) => {
            stream.status = err ? -1 : 3;
            if (err) stream.label = err
            c(err);
        },
        stream
    ) || noop;
    ctx.streams.push(stream);
    return (stream.dispose = () => {
        stream.status = 2;
        disposable();
    });
};

export default {
    props: ["source"],
    setup(props, { emit }) {
        const f = (s) => {
            const Rx = components[s.name]
            let children = null
            if (Rx.length == 2) {
                let sources = parseSources(s.arg)
                children = sources.map(source => <div style="display:flex">{f(source)}</div>)
                s.subscribe = ob(Rx(s, sources), s)
            } else {
                if (s.arg && !/,/.exec(s.arg)) {
                    s.arg = eval(s.arg)
                }
                s.subscribe = ob(Rx(s), s)
            }
            const jsx = <observable ctx={s}>{children}</observable>
            return s.source ? (<>
                {f(s.source)}
                {jsx}
            </>) : jsx
        }
        return (a, b, { source }) => {
            if (typeof source == 'object') {
                return f(source)
            }
            const [s] = parseSources(source)
            if (s) {
                const el = f(s)
                emit("update:source", s)
                return el
            }
            return null
        }
    }
}