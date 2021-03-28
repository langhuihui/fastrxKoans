import { reactive, customRef } from 'vue'
const noop = Function.prototype
import * as fastrx from 'fastrx'
const Sink = fastrx.Sink
function CoolDown(min) {
    return customRef((track, trigger) => {
        let value = 0
        let stop = true
        let cooldown = () => {
            value -= 0.05
            trigger();
            if (value >= min) {
                requestAnimationFrame(cooldown)
            } else {
                stop = true
            }
        }
        return {
            get() {
                track();
                return value;
            },
            set(v) {
                value = v
                trigger()
                if (stop) {
                    requestAnimationFrame(cooldown)
                    stop = false
                }
            }
        }
    })
}
export class Node {
    constructor(name = "", arg = []) {
        this.name = name
        this.arg = arg
        this.streams = reactive([])
        this.sources = reactive([])
        this.cdData = CoolDown(0.1)
        this.cdSub = CoolDown(0)
        this.source = null
        this.stopCoolDown = true
        if (arg.length) {
            this.args = arg
        }
    }
    pickColor() {
        return this.streams.find(s => s.status == 1)?.color ?? 'rgba(255,255,255,.5)'
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
    //是否属于子流
    checkSubNode(x) {
        const isNode = x.unProxy
        if (isNode) {
            this.sources.push(isNode)
            return s => isNode.subscribe(s)
        }
        return x
    }
    //过滤子事件流，放入sources数组中，就能显示
    set args(value) {
        this.arg = value.map(x => typeof x == "function" ? (...arg) => this.checkSubNode(x(...arg)) : this.checkSubNode(x))
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
    subscribe(...args) {
        const { source, name, streams, arg } = this
        //const rx = components[name]
        // const f = source ? rx(source, ...arg) : rx(...arg)
        const realrx = name == "subscribe" ? fastrx[name] : fastrx[name](...arg)
        let f = source ? realrx(s => source.subscribe(s)) : realrx
        this.subscribe = function (...args) {
            let sink = args[0]
            if (name == "subscribe") {
                sink = new Sink()
                sink.next = args[0]
                sink.complete = err => (err ? args[1] : args[2]) || noop
                f = sink => source.subscribe(sink)
            }
            this.cdSub.value = 1
            const newSink = new Sink(sink)
            newSink.status = 1
            const stream = reactive(newSink);
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
            sink.color = stream.color
            newSink.next = data => {
                stream.label = data.toString()
                this.cdData.value = 1
                sink.next(data);
            }
            newSink.complete = err => {
                stream.status = err ? -1 : 3;
                if (err) stream.label = err
                this.cdData.value = 1
                sink.complete(err);
            }
            streams.push(stream);
            newSink.defer(() => {
                stream.status = 2;
                this.cdSub.value = 1
            })
            f(stream);
            return stream
        };
        return this.subscribe(...args)
    }
}

export function parseSource(value) {
    let status = 0;
    let depth = 0;
    let valid = ''
    // let last = null;
    // let current = new Node;
    for (let i = 0; i < value.length; i++) {
        switch (status) {
            case 0:
                if (value[i] == "(") {
                    status = 1;
                    depth = 1;
                } else {
                    // current.name += value[i];
                }
                break;
            case 1:
                if (value[i] == "(") {
                    depth++;
                } else if (value[i] == ")") {
                    depth--;
                    if (depth == 0) {
                        status = 2;
                        valid = value.substr(0, i + 1)
                        // if (last) {
                        //     current.source = last;
                        // }
                        break;
                    }
                }
                // current.arg += value[i];
                break;
            case 2:
                if (value[i] == ".") {
                    status = 0;
                    // last = current;
                    // current = new Node;
                    // } else if (value[i] == ',') {
                    //     status = 0;
                    //     last = null
                    //     sources.push(current)
                    //     current = new Node;
                }
        }
    }
    if (status == 2) {
        // return current
    }
    return valid
    // return last
}

const define = Object.keys(fastrx).map(name => `const ${name} = (...args)=>(new Node('${name}',args)).pipe();`).join('\n')
export function parse(str) {
    return eval(`${define}${str}`)
}