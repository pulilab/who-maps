<template>
  <el-dialog
    v-if="visible"
    :visible.sync="visible"
    :title="$gettext('Edit Sub Level') | translate"
    modal
    top="10vh"
    width="70vw"
    custom-class="EditSubLevelDialog"
  >
    {{ model }}
    <div
      v-for="key in editableKeys"
      :key="key"
    >
      {{ key }}
    </div>
  </el-dialog>
</template>

<script>
import { mapGettersActions } from '@/utilities/form.js';

export default {
  data () {
    return {
      localValue: {}
    };
  },
  computed: {
    ...mapGettersActions({
      model: ['layout', 'getEditSubLevelDialogState', 'setEditSubLevelDialogState', 0]
    }),
    visible: {
      get () {
        return !!this.model;
      },
      set () {
        this.model = null;
      }
    },
    editableKeys () {
      return Object.keys(this.model.item).filter(k => k.includes('name'));
    }
  },
  methods: {}
};
</script>

<style>

</style>
