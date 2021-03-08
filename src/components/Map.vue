<template></template>
<script>
export default {
  setup(props, { expose }) {
    expose((n, c, s, { arg, source }) => {
      const f = eval(arg);
      return source.subscribe((data) => {
        const mapto = f(data.data);
        s.label = `${data}=>${mapto}`;
        data.data = mapto;
        n(data);
      }, c);
    });
  },
};
</script>