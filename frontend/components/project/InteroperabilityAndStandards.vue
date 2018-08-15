<template>
  <div
    id="interoperability"
    class="InteroperabilityAndStandards">
    <collapsible-card title="Interoperability &amp; Standards">
      <el-form-item
        label="Does your digital health project link to a digital HIS?"
        prop="interoperability_links">
        <interoperability-link-component
          v-for="ir in interopearilbityLinksStructure"
          :key="ir.id"
          :item="ir"
          :interoperability-links.sync="interoperability_links"
        />
      </el-form-item>
      <el-form-item
        label="What data standards does your digital health project use?"
        prop="interoperability_standards">
        <standards-selector v-model="interoperability_standards" />
      </el-form-item>
    </collapsible-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapGettersActions } from '../../utilities/form';

import CollapsibleCard from './CollapsibleCard';
import InteroperabilityLinkComponent from './InteroperabilityLinkComponent';
import StandardsSelector from './StandardsSelector';

export default {
  components: {
    CollapsibleCard,
    InteroperabilityLinkComponent,
    StandardsSelector
  },
  computed: {
    ...mapGetters({
      interopearilbityLinksStructure: 'projects/getInteroperabilityLinks'
    }),
    ...mapGettersActions({
      interoperability_links: ['project', 'getInteroperabilityLinks', 'setInteroperabilityLinks', 200],
      interoperability_standards: ['project', 'getInteroperabilityStandards', 'setInteroperabilityStandards', 0]
    })
  },
  mounted () {
    this.$emit('mounted');
  }
};
</script>

<style>

</style>
