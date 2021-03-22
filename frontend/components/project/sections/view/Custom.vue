<template>
  <div>
    <custom-readonly-field
      v-for="item in items"
      :id="item.id"
      :key="item.id"
      :question="item.question"
      is-draft
      :type="item.type"
    />

    <!-- :donor-id="item.id" -->
  </div>
</template>



<script>
import CustomReadonlyField from "@/components/project/CustomReadonlyField";

export default {
  components: {
    CustomReadonlyField,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>


