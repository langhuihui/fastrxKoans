<template></template>
<script>
export default {
  setup(props, context) {
    context.expose((n, c, s, ctx) => {
      s.label = 0;
      let clearId = setInterval(() => {
        n({ data: s.label++ });
      }, parseInt(ctx.arg));
      return () => clearInterval(clearId);
    });
  },
};
</script>