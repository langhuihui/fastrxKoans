<template>
    <div>take({{ parseInt(arg) }})</div>
</template>
<script>
export default {
    props: ["source", "subscribe", "arg"],
    setup(props, context) {
        context.expose((n, c) => {
            let remain = parseInt(props.arg);
            const dispose = props.source.subscribe((data) => {
                n(data);
                if (--remain == 0) {
                    c();
                    dispose();
                }
            }, c);
            return dispose;
        });
    },
};
</script>