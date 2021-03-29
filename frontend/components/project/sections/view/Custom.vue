<template>
  <div>
    <view-field
      v-for="item in items"
      :key="item.id"
      :header="item.question"
      :content="content(item)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ViewField from '@/components/project/wrappers/ViewField'

export default {
  components: {
    ViewField
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    published: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      getPublishedCountryAnswerDetails:
        'project/getPublishedCountryAnswerDetails',
      getCountryAnswerDetails: 'project/getCountryAnswerDetails',
      getDonorsAnswerDetails: 'project/getDonorsAnswerDetails',
      getPublishedDonorsAnswerDetails:
        'project/getPublishedDonorsAnswerDetails'
    })
  },
  methods: {
    answer (item) {
      let detailsFunction = () => null
      if (item.donor) {
        detailsFunction = this.getPublishedDonorsAnswerDetails
      } else {
        detailsFunction = this.published
          ? this.getPublishedCountryAnswerDetails
          : this.getCountryAnswerDetails
      }
      const saved = detailsFunction(item.id)
      return (
        saved || {
          question_id: item.id,
          answer: []
        }
      )
    },
    content (item) {
      return this.type === 5
        ? this.answer(item).answer
        : this.answer(item).answer[0]
    }
  }
}
</script>
