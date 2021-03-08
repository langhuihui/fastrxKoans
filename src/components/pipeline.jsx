import interval from "./Interval.vue"
import take from "./Take.vue";
import subscribe from "./Subscriber.vue"
import fromEvent from './FromEvent.vue'
import map from "./Map.vue"
const components = { interval, take, subscribe, fromEvent, map }
import { reactive } from 'vue'

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
        ][(Math.random() * 7) >> 0];
    }
    const disposable = f(
        (data) => {
            if (stream.color) {
                data.color = stream.color;
            } else stream.color = data.color;
            n(data);
        },
        (err) => {
            stream.status = err ? -1 : 3;
            c(err);
        },
        stream,
        ctx
    );
    ctx.streams.push(stream);
    return (stream.dispose = () => {
        stream.status = 2;
        disposable();
    });
};


export default {
    props: ["source"],
    setup() {
        const f = (s) => {
            const Rx = components[s.name]
            const jsx = <observable ctx={s}><Rx ref={f => f ? s.subscribe = ob(f, s) : null}></Rx></observable>
            return s.source ? (<>
                {f(s.source)}
                {jsx}
            </>) : jsx
        }
        return (a, b, { source }) => source ? f(source) : null
    }
}