<template>
  <div
    id="interoperability"
    class="InteroperabilityAndStandards">
    <collapsible-card
      ref="collapsible"
      title="Interoperability &amp; Standards">
      <el-form-item
        :label="$gettext('Does your project share information with one or more of these digital Health Information System components?')"
        prop="interoperability_links">
        <interoperability-link-component
          v-for="(ir, index) in interopearilbityLinksStructure"
          ref="interoperabilityLink"
          :key="ir.id"
          :item="ir"
          :index="index"
          :rules="rules"
          :api-errors="apiErrors"
          :interoperability-links.sync="interoperability_links"
        />
      </el-form-item>
      <el-form-item
        :label="$gettext('What data standards does your digital health project use?')"
        prop="interoperability_standards">

        <template slot="label">
          <translate key="interoperability-standards">What data standards does your digital health project use?</translate>
          <form-hint >
            <translate key="interoperability-standards-hint">If your data standards are not available here, please email digitalhealthatlas@gmail.com</translate>
          </form-hint>
        </template>

        <standards-selector v-model="interoperability_standards" />
      </el-form-item>
    </collapsible-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapGettersActions } from '../../../utilities/form';
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js';

import CollapsibleCard from '../CollapsibleCard';
import InteroperabilityLinkComponent from '../InteroperabilityLinkComponent';
import StandardsSelector from '../StandardsSelector';
import FormHint from '../FormHint';

export default {
  components: {
    CollapsibleCard,
    InteroperabilityLinkComponent,
    StandardsSelector,
    FormHint
  },
  mixins: [VeeValidationMixin],
  computed: {
    ...mapGetters({
      interopearilbityLinksStructure: 'projects/getInteroperabilityLinks'
    }),
    ...mapGettersActions({
      interoperability_links: ['project', 'getInteroperabilityLinks', 'setInteroperabilityLinks', 0],
      interoperability_standards: ['project', 'getInteroperabilityStandards', 'setInteroperabilityStandards', 0]
    })
  },
  mounted () {
    this.$emit('mounted');
  },
  methods: {
    async validate () {
      this.$refs.collapsible.expandCard();
      const validations = await Promise.all([
        this.$validator.validate(),
        ...this.$refs.interoperabilityLink.map(ir => ir.validate())
      ]);
      return validations.reduce((a, c) => a && c, true);
    }
  }
};
</script>

<style lang="less">
 @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .InteroperabilityAndStandards {}

</style>
