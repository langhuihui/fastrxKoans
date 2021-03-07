<template>
    <div>interval{{ arg }}</div>
</template>
<script>
export default {
    props: ["subscribe", "arg"],
    setup(props, context) {
        context.expose((n, c) => {
            let i = 0;
            let clearId = setInterval(() => {
                n(i++);
            }, parseInt(props.arg));
            return () => clearInterval(clearId);
        });
    },
};
</script>