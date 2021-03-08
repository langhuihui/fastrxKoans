<template></template>
<script>
export default {
  setup(props, { expose }) {
    expose((n, c, s, { arg }) => {
      let [target, name] = arg.split(",");
      target = eval(target);
      name = eval(name);
      const f = (e) => n({ data: e });
      target.addEventListener(name, f);
      return () => target.removeEventListener(name, f);
    });
  },
};
</script>