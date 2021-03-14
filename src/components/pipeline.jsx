import * as components from "./rx"
import { reactive } from 'vue'
const noop = Function.prototype
class Node {
    constructor(name = "", arg = '') {
        this.name = name
        this.arg = arg
        this.streams = []
        this.sources = reactive([])
        this.source = null
    }
    toString() {
        return `${this.name}(${this.arg.map(x => typeof x == 'object' || typeof x == 'function' ? '...' : x).join(',')})`
    }
    clickTag() {
        console.log(this)
    }
    get unProxy() {
        return this
    }
    //过滤子事件流，放入sources数组中，就能显示
    set args(value) {
        this.arg = value.map(x => {
            const isNode = x.unProxy
            if (isNode) {
                this.sources.push(isNode)
                return isNode
            }
            if (typeof x == "function") {
                return (...arg) => {
                    const result = x(...arg)
                    const isNode = result.unProxy
                    if (isNode) {
                        this.sources.push(isNode)
                        return isNode
                    }
                    return result
                }
            }
            return x
        })
    }
    // 通过返回proxy产生链式调用
    pipe() {
        return new Proxy(this, {
            get(target, prop) {
                if (target[prop] || target.hasOwnProperty(prop)) return target[prop]
                let sink = new Node(prop)
                sink.source = target
                return (...args) => {
                    sink.args = args
                    return sink.pipe()
                }
            }
        })
    }
    subscribe(n, c) {
        const { source, name, streams, arg } = this
        const rx = components[name]
        const f = source ? rx(source, ...arg) : rx(...arg)
        this.subscribe = function (n, c) {
            const stream = reactive({
                status: 1,
            });
            if (!source) {
                stream.color = [
                    "pink",
                    "red",
                    "orange",
                    "blue",
                    "green",
                    "cyan",
                    "purple",
                ][streams.length % 7];
            }
            const disposable = f(
                (data) => {
                    if (typeof data == 'object' && data.color) {
                        stream.color = data.color
                    } else {
                        data = { value: data, color: stream.color }
                    }
                    stream.label = data.value.toString()
                    n(data);
                },
                (err) => {
                    stream.status = err ? -1 : 3;
                    if (err) stream.label = err
                    c(err);
                },
                stream
            ) || noop;
            streams.push(stream);
            return (stream.dispose = () => {
                stream.status = 2;
                disposable();
            });
        };
        return this.subscribe(n, c)
    }
}
function parseSource(value) {
    // let sources = []
    let status = 0;
    let depth = 0;
    let last = null;
    let current = new Node;
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
                    current = new Node;
                    // } else if (value[i] == ',') {
                    //     status = 0;
                    //     last = null
                    //     sources.push(current)
                    //     current = new Node;
                }
        }
    }
    if (status == 2) {
        // sources.push(current)
        // return sources
        return current
    }
    return last
    // return []
}

const define = Object.keys(components).map(name => `const ${name} = (...args)=>(new Node('${name}',args)).pipe();`).join('\n')

const f = (s) => {
    if (typeof s.arg == "string")
        s.args = eval(`${define}[${s.arg}]`)
    const jsx = <observable ctx={s}>{s.sources.map(source => <div style="display:flex;margin:5px">{f(source)}</div>)}</observable>
    return s.source ? (<>
        {f(s.source)}
        {jsx}
    </>) : jsx
}

export default {
    Node,
    props: ["source"],
    setup(props, { emit }) {
        return (a, b, { source }) => {
            if (typeof source == 'object') {
                return f(source)
            }
            const s = parseSource(source)
            if (s) {
                const el = f(s)
                emit("update:source", s)
                return el
            }
            return null
        }
    }
}