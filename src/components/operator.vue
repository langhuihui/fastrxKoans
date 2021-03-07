<template>
    <div>o</div>
</template>
<script>
export default {
    props: ["source", "subscribe"],
    setup(props, context) {
        context.expose((n, c) => {
            props.source.subscribe(n, c);
            console.log("hha");
        });
    },
};
</script>