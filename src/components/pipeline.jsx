import { unref } from 'vue'
const f = (s) => {
    const color = s.streams.find(s => s.status == 1)?.color ?? 'rgba(255,255,255,.5)'
    const jsx = <observable ctx={s}>{s.sources.map(x => <subpipe source={x} cooldown={x.cooldown}></subpipe>)}</observable>
    return s.source ? (<>
        {f(s.source)}
        <middleArrow color={color} cooldown={s.source.cooldown} />
        {jsx}
    </>) : jsx
}
const middleArrow = {
    props: ["color", "cooldown"],
    setup() {
        return (a, b, { color, cooldown }) => {
            return <span class="arrow" style={'color:' + color + ';opacity:' + unref(cooldown)}>→</span>
        }
    }
}
const subpipe = {
    props: ["source", "cooldown"],
    setup() {
        return (a, b, { source, cooldown }) => {
            const color = source.streams.find(s => s.status == 1)?.color ?? 'rgba(255,255,255,.5)'
            return <div class="subpipe"><div class='before' style={'color:gray' + ';opacity:.5'}>↑</div>{f(source)}<div class='after' style={'color:' + color + ';opacity:' + cooldown}>↓</div></div>
        }
    }
}
export default {
    props: ["source"],
    setup() {
        return (a, b, { source }) => source ? f(source) : null
    }
}