<template>
  <div
    id="stages"
    class="StageOverview"
  >
    <collapsible-card
      ref="collapsible"
      :title="$gettext('Project stages') | translate"
      show-legend
    >
      <!-- stages -->
      <el-row>
        <el-col :span="24">
          <div class="stages">
            <custom-required-form-item :error="errors.first('stages')">
              <template slot="label">
                <translate key="stages">
                  Set current and previous stages of project
                </translate>
              </template>

              <el-col
                v-for="(stage, idx) in stages"
                :key="stage.id"
                :span="24"
              >
                <p>{{ idx + 1}}.</p>
                <el-checkbox
                  :label="stage.id"
                  v-model="stage.checked"
                  @change="handleCheckItem(idx)"
                >
                  {{stage.name}}
                  <el-tooltip
                    v-if="stage.tooltip"
                    effect="dark"
                    :content="stage.tooltip"
                    placement="right"
                    popper-class="stages__tooltip"
                  >
                    <fa icon="question-circle" class="research__info--muted research__info--gutter" />
                  </el-tooltip>
                </el-checkbox>
              </el-col>


              <!-- <custom-required-form-item
                v-for="(stage, index) in stages"
                :key="stage"
                :error="errors.first('id', 'stage_' + index)"
                :draft-rule="draftRules.stages"
                :publish-rule="publishRules.stages"
                class="ItemIndent"
              >
                <el-col :span="16">
                  {{stage}}
                  <platform-selector
                    :key="platform"
                    v-model="platforms"
                    v-validate="rules.platforms"
                    :data-vv-scope="'platform_' + index"
                    :index="index"
                    data-vv-name="id"
                    data-vv-as="Software"
                  />
                </el-col>
              </custom-required-form-item> -->
            </custom-required-form-item>
          </div>
        </el-col>
      </el-row>

      <!-- research section -->
      <el-row>
        <el-col :span="24">
          <div class="research">
            <el-switch
              v-model="research"
              active-color='#008DC9'
              :disabled="false"
            />
            <p class="research__switch">
              <translate key="research-project-title">
                Set project as ‘Research project’
              </translate>
            </p>
            <p class="research__info">
              <fa icon="info-circle" class="research__info--muted research__info--gutter" />
              <span>
                <translate key="research-project-info">
                  Explanatory text: Prima luce, cum quibus mons aliud consensu ab eo. Me non paenitet nullum festiviorem excogitasse ad hoc. Excepteur sint obcaecat cupiditat non proident culpa. Pellentesque habitant morbi tristique senectus et netus.
                </translate>
              </span>
            </p>
          </div>
        </el-col>
      </el-row>
    </collapsible-card>
  </div>
</template>

<script>
import { isAfter } from 'date-fns';
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js';
import ProjectFieldsetMixin from '../../mixins/ProjectFieldsetMixin.js';
import CollapsibleCard from '../CollapsibleCard';
// import FormHint from '../FormHint';
import { mapGettersActions } from '../../../utilities/form';

export default {
  components: {
    CollapsibleCard,
  },
  mixins: [VeeValidationMixin, ProjectFieldsetMixin],
  data() {
    return {
      research: false,
      stages: [
        {
          id: 0,
          name: 'Opportunity and Ideation',
          date: '',
          note: '',
          checked: false,
          tooltip: 'Using new tool in the field, feeding back into iterative development, M&E with an eye towards scale decision'
        },
        {
          id: 1,
          name: 'Preparation and Scoping',
          date: '',
          note: '',
          checked: false,
          tooltip: 'Using new tool in the field, feeding back into iterative development, M&E with an eye towards scale decision'
        },
        {
          id: 2,
          name: 'Analysis and Design',
          date: '',
          note: '',
          checked: false,
          tooltip: 'Using new tool in the field, feeding back into iterative development, M&E with an eye towards scale decision'
        },
        {
          id: 3,
          name: 'Implementation Planning',
          date: '',
          note: '',
          checked: false,
          tooltip: 'Using new tool in the field, feeding back into iterative development, M&E with an eye towards scale decision'
        },
        {
          id: 4,
          name: 'Developing or Adapting Solution',
          date: '',
          note: '',
          checked: false,
          tooltip: 'Using new tool in the field, feeding back into iterative development, M&E with an eye towards scale decision'
        },
        {
          id: 5,
          name: 'Piloting and Evidence Generation',
          date: '',
          note: '',
          checked: false,
          tooltip: 'Using new tool in the field, feeding back into iterative development, M&E with an eye towards scale decision'
        },
        {
          id: 6,
          name: 'Package and Advocacy',
          date: '',
          note: '',
          checked: false,
          tooltip: ''
        },
        {
          id: 7,
          name: 'Deploying',
          date: '',
          note: '',
          checked: false,
          tooltip: 'Using new tool in the field, feeding back into iterative development, M&E with an eye towards scale decision'
        },
        {
          id: 8,
          name: 'Scaling up',
          date: '',
          note: '',
          checked: false,
          tooltip: ''
        },
        {
          id: 9,
          name: 'Hand over or Complete',
          date: '',
          note: '',
          checked: false,
          tooltip: ''
        }
      ]
    }
  },
  computed: {
    ...mapGettersActions({
      // stages: ['project', 'getStages', 'setStages', 0],
    }),
    // endDateError () {
    //   if (this.usePublishRules && this.start_date && this.end_date && isAfter(this.start_date, this.end_date)) {
    //     return this.$gettext('End date must be after Start date');
    //   }
    //   return '';
    // }
  },
  methods: {
    async validate () {
      this.$refs.collapsible.expandCard();
      const validations = await Promise.all([
        this.$validator.validate(),
        Promise.resolve(this.endDateError === '')
      ]);
      console.log('Project stages published validation', validations);
      return validations.reduce((a, c) => a && c, true);
    },
    async validateDraft () {
      this.$refs.collapsible.expandCard();
      const validations = await Promise.all([
        this.$validator.validate('name'),
        this.$validator.validate('country'),
        this.$validator.validate('contact_email'),
        this.$validator.validate('team'),
        this.$validator.validate('start_date'),
        this.$validator.validate('end_date')

      ]);
      return validations.reduce((a, c) => a && c, true);
    },
    handleCheckItem (idx) {
      this.stages[idx].checked = !this.stages[idx].checked
      this.stages[idx].checked = !this.stages[idx].checked
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .stages__tooltip {
    max-width: 320px;
  }

  .StageOverview {
    // general
    .CollapsibleCard {
      .ContentContainer {
        padding: 0!important;
      }
    }
    // stages
    .stages {
      padding: 40px 80px 60px 40px;
    }
    // research
    .research {
      background-color: #F8F8F8;
      padding: 40px 130px 70px 40px;
    }
    .research__switch {
      font-size: @fontSizeBase;
      margin-left: 8px;
      display: inline;
    }
    .research__info {
      margin-top: 24px;
      font-size: @fontSizeSmall;
      color: @colorTextSecondary;
      display: flex;
    }
    .research__info--muted {
      color: @colorTextMuted;
    }
    .research__info--gutter {
      margin-right: 8px;
    }
  }

</style>
