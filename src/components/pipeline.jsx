import interval from "./Interval.vue"
import take from "./Take.vue";
const components = { interval, take }
export default {
    props: ["source"],
    setup() {
        const f = (s) => {
            const Rx = components[s.name]
            const jsx = <Rx {...s} ref={f => f ? s.subscribe = f : null}></Rx>
            return s.source ? (<>
                {f(s.source)}
                {jsx}
            </>) : jsx
        }
        return (a, b, { source }) => source ? f(source) : null
    }
}