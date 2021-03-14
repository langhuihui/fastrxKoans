const f = (s) => {
    const color = s.streams.find(s => s.status == 1)?.color ?? 'rgba(255,255,255,.5)'
    const jsx = <observable ctx={s}>{s.sources.map(x => subpipe(color, x))}</observable>
    return s.source ? (<>
        {f(s.source)}
        <span class="arrow" style={'color:' + color}>→</span>
        {jsx}
    </>) : jsx
}
const subpipe = (c, source) => {
    const color = source.streams.find(s => s.status == 1)?.color ?? 'rgba(255,255,255,.5)'
    return <div class="subpipe"><div class='before' style={'color:' + c}>↑</div>{f(source)}<div class='after' style={'color:' + color}>↓</div></div>
}
export default {
    props: ["source"],
    setup() {
        return (a, b, { source }) => source ? f(source) : null
    }
}