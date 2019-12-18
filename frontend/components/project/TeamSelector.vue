<template>
  <div>
    {{ query }}
    <lazy-el-select
      slot="reference"
      :value="value"
      :placeholder="$gettext('Type and select a name') | translate"
      :remote-method="filterList"
      multiple
      filterable
      remote
      class="TeamSelector"
      :popper-class="optionsAndValues.length > value.length ? 'TeamSelectorDropdown' : 'NoDisplay'"
      @change="changeHandler"
      v-outside="{
        exclude: [],
        handler: 'onOutside'
      }"
      @keyup.enter.native="onEnter"
      v-paste="{
        exclude: [],
        handler: 'onPaste'
      }"
    >
      <el-option
        v-for="person in optionsAndValues"
        :key="person.id"
        :label="`${person.name}, ${getOrganisationDetails(person.organisation).name} (${person.email})` | truncate"
        :value="person.id"
      >
        <span style="float: left;">{{ person.name }}</span>
        <template v-if="person.organisation">
          <organisation-item :id="person.organisation" />
        </template>
        <span class="email"><small>{{ person.email }}</small></span>
      </el-option>
    </lazy-el-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import LightSelectMixin from '../mixins/LightSelectMixin.js';
import OrganisationItem from '../common/OrganisationItem';
import debounce from 'lodash/debounce';

export default {
  components: {
    OrganisationItem
  },
  mixins: [LightSelectMixin],
  $_veeValidate: {
    value () {
      return this.value;
    },
    events: 'change|blur'
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      items: 'system/getUserProfiles',
      getOrganisationDetails: 'system/getOrganisationDetails'
    })
  },
  filters: {
    truncate (str) {
      if (str.length > 50 ) return `${str.substr(0, 47)}...`
      return str
    }
  },
  methods: {
    changeHandler (value) {
      this.$emit('change', value);
    },
    onOutside () {
      if (this.query !== '') {
        this.emailList(this.query)
      }
    },
    async onPaste () {
      await this.$nextTick()
      console.log(this.query)
      console.log('me pego')

      await setTimeout(() => {
        console.log('entro al debounce')
          console.log(this.query)
          if (this.query !== '') {
            this.emailList(this.query)
          }
        },
        2500
      )
    },
    onEnter(e) {
      this.emailList(e.target.value)
    },
    emailList (str) {
      // fail@gmail.com, general@gmail.com
      str.trim().replace(/ /g,'').split(',').map((email) => {
        if (this.validateEmail(email) && !this.arrIncludes(email)) {
          this.$emit('change', email);
        }
      })
    },
    arrIncludes (val) {
      return this.value.includes(val)
    },
    validateEmail (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .TeamSelector {
    width: 100%;
    .el-select-dropdown__item.selected {
      display: none;
    }

    &.el-select {
      .el-tag{
        &:hover {
          background-color: white;
          border-color: #B9B9B9;
        }
      }
    }
  }

  .NoDisplay {
    display: none;
  }

  .TeamSelectorDropdown {
    .OrganisationItem {
      display: inline-block;
      margin-left: 6px;
      font-weight: 400;
      color: @colorGray;

      &::before {
        content: "(";
      }

      &::after {
        content: ")";
      }
    }
    li {
      height: 50px;
      .email {
        float: left;
        width: 100%;
        margin-top: -18px;
      }
    }
  }

</style>
