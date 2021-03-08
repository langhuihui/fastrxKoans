<template></template>
<script>
export default {
  setup(props, context) {
    context.expose((n, c, s, ctx) => {
      ctx.clickTag = (s) => {
        s.dispose();
      };
      return ctx.source.subscribe(
        (data) => {
          s.label = data.data;
          n(data);
        },
        (err) => {
          s.label = "Complete";
          c(err);
        }
      );
    });
  },
};
</script>