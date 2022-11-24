<template>
  <div>vue3</div>
</template>
<script>
import { APIS } from "@/services";
export default {
  name: "HomePage1",
  setup() {
    APIS.DefaultApi.commonTaskPut().then((res) => {
      console.log(res.data);
    });
  },
};
</script>