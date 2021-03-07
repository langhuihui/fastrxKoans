<template>
    <div>ob</div>
</template>
<script>
export default {
    props: ["subscribe"],
    setup(props, context) {
        context.expose((n, c) => {
            n("a");
            c();
        });
    },
};
</script>