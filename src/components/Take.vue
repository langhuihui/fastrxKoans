<template></template>
<script>
export default {
  setup(props, { expose }) {
    expose((n, c, s, { source, arg }) => {
      s.label = parseInt(arg);
      const dispose = source.subscribe((data) => {
        n(data);
        if (--s.label == 0) {
          c();
          dispose();
        }
      }, c);
      return dispose;
    });
  },
};
</script>