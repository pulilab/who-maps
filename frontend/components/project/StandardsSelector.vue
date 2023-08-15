<template>
  <el-checkbox-group
    :value="value"
    class="TwoPerRow"
    @input="changeHandler"
  >
    <div v-for="(group,i) in standardsGroups" :key="i" class="Group">
      <div class="name">{{ group.name }}</div>
      <div class="inputs">
        <el-checkbox
          v-for="standard in getStandards(group.standardIds)"
          :key="standard.id"
          :label="standard.id"
        >
          {{ standard.name }}
          <Tooltip :text="standard.tooltip" />
        </el-checkbox>
      </div>
    </div>
  </el-checkbox-group>
</template>

<script>
import { mapGetters } from 'vuex'
import Tooltip from '@/components/dashboard/Tooltip'

export default {
  components: {
    Tooltip,
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      standardsGroups: [
        {
          name: this.$gettext('Health Data Exchange Standards'),
          standardIds: [1,4,5,6,17,8,9,11,13,18,15,16]
        },
        {
          name: this.$gettext('Health Data Standardization'),
          standardIds: [28,30,22,31,26,27,21]
        },
        {
          name: this.$gettext('Demographic Data Standardization'),
          standardIds: [24,25,23]
        },
        {
          name: this.$gettext('Security & Privacy Standards'),
          standardIds: [2,3,12]
        },
        {
          name: this.$gettext('Technical Standards'),
          standardIds: [19,7,10,14,20,29]
        },
      ],
      tooltips: [
        {
          id: 1,
          tooltip: this.$gettext('The Aggregate Data Exchange (ADX) Profile supports interoperable public health reporting of aggregate health data.')
        },
        {
          id: 4,
          tooltip: this.$gettext('Clinical Document Architecture (CDA) is a set of standards that describe the structure and semantics of clinical data in XML (Extensible Markup Language) for easy exchange.')
        },
        {
          id: 5,
          tooltip: this.$gettext('The Care Services Discovery (CSD) registry contains information about health organizations, facilities, services and providers')
        },
        {
          id: 6,
          tooltip: this.$gettext('Digital Imaging and Communication in Medicine (DICOM) is an international standard and file format for medical images, such as CT scans, MRIs and printer images.')
        },
        {
          id: 17,
          tooltip: this.$gettext('The Fast Healthcare Interoperability Resources (FHIR) standard is a set of rules and specifications for exchanging electronic health care data.')
        },
        {
          id: 8,
          tooltip: this.$gettext('Health Level Seven Version 2 (HL7 v2) is a widely implemented messaging standard that allows the exchange of clinical data between systems.')
        },
        {
          id: 9,
          tooltip: this.$gettext('Health Level Seven Version 3 (HL7 v3) is an XML-based document markup standard that specifies the structure and logic of "clinical documents" for the purpose of exchange between healthcare providers and patients.')
        },
        {
          id: 11,
          tooltip: this.$gettext('The Mobile access to Health Documents (MHD) Profile defines one standardized interface to health document sharing for use by mobile devices.')
        },
        {
          id: 13,
          tooltip: this.$gettext('Patient Demographics Query (PDQ) provides a query to a central patient information server and retrieve a patient’s demographic and visit information. In Patient Demographics Matching, the Patient Demographics Supplier provides a service to the Patient Demographics Consumer in finding a "best fit" list of possible patient identities that match the demographics information contained in the query parameters.')
        },
        {
          id: 18,
          tooltip: this.$gettext('Sharing Value Sets (SVS) provides a means through which healthcare systems producing clinical or administrative data, can receive a common, uniform nomenclature managed centrally.')
        },
        {
          id: 15,
          tooltip: this.$gettext('Cross Enterprise Document Sharing (XDS) is a system of standards for cataloguing and sharing patient records across health institutions.')
        },
        {
          id: 16,
          tooltip: this.$gettext('The Cross-Enterprise User Assertion Profile (XUA) provides a means to communicate across cross applications by authenticating users, applications or systems.')
        },
        {
          id: 28,
          tooltip: this.$gettext('Concepts for Integrated Epidemiology and Linkage (CIEL) is a health data standardization initiative that focuses on creating and maintaining standardized codes and concepts for health-related data.')
        },
        {
          id: 30,
          tooltip: this.$gettext('Current Procedural Terminology (CPT) serves as a standardized system for reporting medical procedures and services provided by healthcare professionals.')
        },
        {
          id: 22,
          tooltip: this.$gettext('International Classification of Diseases, 10th Revision (ICD10) is international standard for coding and classification of diseases and health conditions.')
        },
        {
          id: 31,
          tooltip: this.$gettext('International Classification of Diseases, 11th Revision (ICD11) is the latest version of international standard for coding and classification of diseases and health conditions')
        },
        {
          id: 26,
          tooltip: this.$gettext('Logical Observation Identifiers Names and Codes (LOINC) is a health data standard that focuses on the identification and exchange of clinical laboratory and other medical observations.')
        },
        {
          id: 27,
          tooltip: this.$gettext('Prescription Norms (RxNorm) is a standardized terminology for medications which provides a structured system for representing and exchanging drug-related information, including medication names, ingredients, strengths, dosages, and other related concepts.')
        },
        {
          id: 21,
          tooltip: this.$gettext('Systematized Nomenclature of Medicine (SNOMED) is a comprehensive and internationally recognized health data standard used for clinical terminology and coding in healthcare systems.')
        },
        {
          id: 24,
          tooltip: this.$gettext('International Standard Classification of Occupations, 8th edition (ISCO-8) is a classification system to categorize and standardize occupational information.')
        },
        {
          id: 25,
          tooltip: this.$gettext('International Standard Classification of Occupations, 1988 edition (ISCO-88) is an older classification system to categorize and standardize occupational information.')
        },
        {
          id: 23,
          tooltip: this.$gettext('International Organization for Standardization-3166 (ISO-3166) is a standard that defines codes for identifying countries and their subdivisions.')
        },
        {
          id: 2,
          tooltip: this.$gettext('The Audit Trail and Node Authentication (ATNA) Integration Profile establishes security measures which, together with the Security Policy and Procedures, provide patient information confidentiality, data integrity and user accountability.')
        },
        {
          id: 3,
          tooltip: this.$gettext('Basic Patient Privacy Consents (BPPC) provides a mechanism to record the patient privacy consent(s) and a method for Content Consumers to use to enforce the privacy consent appropriate to the use.')
        },
        {
          id: 12,
          tooltip: this.$gettext('(mobile) Patient Identifier Cross-referencing (PIX) supports the cross-referencing of patient identifiers from multiple Patient Identifier Domains.')
        },
        {
          id: 19,
          tooltip: this.$gettext('Geography Markup Language (GML) is an XML-based standard for encoding and exchange of geographic data.')
        },
        {
          id: 7,
          tooltip: this.$gettext('Global System of Standards (GS1) enable the accurate and consistent identification, capture, and sharing of information about products, locations, assets, and other entities.')
        },
        {
          id: 10,
          tooltip: this.$gettext('Mobile Alert Communication Management (mACM) provides the infrastructural components needed to send short, unstructured text alerts to human recipients and can record the outcomes of any human interactions upon receipt of the alert.')
        },
        {
          id: 14,
          tooltip: this.$gettext('Statistical Data and Metadata Exchange (SDMX) is a standard for exchanging statistical data and metadata.')
        },
        {
          id: 20,
          tooltip: this.$gettext('XHTML Forms(xForms) is a markup language standard for creating web forms with advanced features and functionality')
        },
        {
          id: 29,
          tooltip: this.$gettext('JSON (JavaScript Object Notation, is an open standard file format and data interchange format that uses human-readable text to store and transmit data objects consisting of attribute-value pairs and arrays (or other serializable values).')
        },

      ],
    }
  },
  computed: {
    ...mapGetters({
      standards: 'projects/getInteroperabilityStandards'
    })
  },
  methods: {
    changeHandler (value) {
      this.$emit('change', value)
    },
    getStandards(ids) {
      const standards = this.standards.filter(s => ids.includes(s.id))
      return standards.map(s => ({
        ...s,
        tooltip: this.tooltips.find(t => t.id === s.id)?.tooltip
      }))
    },
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .TwoPerRow {
    display: flex;
    flex-wrap: wrap;
    row-gap: 16px;
    column-gap: 32px;

    .Group {
      padding: 8px 0;
      .name {
        padding-bottom: 4px;
        margin-bottom: 10px;
        font-size: @fontSizeBase;
        border-bottom: 1px solid @colorGrayLight;
      }
      .inputs {
        label {
          display: block;
          padding: 6px 0;
        }
      }
    }
  }
</style>
