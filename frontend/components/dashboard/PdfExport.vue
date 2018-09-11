<template>
  <div/>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      projects: 'dashboard/getProjectsList',
      selectedRows: 'dashboard/getSelectedRows',
      selectAll: 'dashboard/getSelectAll',
      getCountryDetails: 'countries/getCountryDetails',
      getDonorDetails: 'system/getDonorDetails',
      getOrganisationDetails: 'system/getOrganisationDetails',
      getHealthFocusAreas: 'projects/getHealthFocusAreas'
    }),
    exportDate () {
      return moment().format('Do MMM, YYYY');
    },
    docDefinition () {
      return {
        content: [
          {
            table: {
              widths: ['50%', '50%'],
              headerRows: 2,
              body: [
                [
                  {
                    text: this.$gettext('Digital Health Atlas'),
                    fillColor: '#1A237E',
                    color: '#FFFFFF',
                    colSpan: 2,
                    style: 'mainHeader',
                    margin: [5, 0, 0, 0]
                  },
                  ''
                ],
                [
                  {
                    text: this.$gettext('All Countries'),
                    fillColor: '#EEEEEE',
                    color: '#000000',
                    style: 'headerSecondRow',
                    margin: [5, 0, 0, 0]
                  },
                  {
                    text: this.$gettext(`List exported on ${this.exportDate}`),
                    fillColor: '#EEEEEE',
                    color: '#000000',
                    style: 'headerSecondRowRight',
                    margin: [0, 0, 5, 0]
                  }
                ]
              ]
            },
            layout: 'noBorders',
            margin: [0, 10]
          }
        ],
        defaultStyle: {
          font: 'Roboto',
          fontSize: 10
        },
        pageSize: 'A4',
        margin: [40, 40, 40, 40],
        pageOrientation: 'landscape',
        styles: {
          mainHeader: {
            bold: true,
            fontSize: 16
          },
          headerSecondRow: {
            alignment: 'left',
            fontSize: 12,
            bold: true
          },
          headerSecondRowRight: {
            alignment: 'right',
            fontSize: 12

          },
          tableHeader: {
            bold: true,
            fontSize: 14
          },
          subHeader: {
            bold: true,
            fontSize: 10,
            color: '#8A8A8A'
          }
        },
        images: this.base64Images
      };
    },
    selected () {
      return this.selectAll ? this.projects : this.projects.filter(p => this.selectedRows.some(sr => sr === p.id));
    }
  },
  methods: {
    ...mapActions({
      loadProjectList: 'dashboard/loadProjectList'
    }),
    printDate (dateString) {
      const mom = moment(dateString);
      return mom.format('Do MMM, YYYY');
    },
    async printPdf () {
      if (this.selectAll) {
        await this.loadProjectList(999999);
      }
      this.base64Images = require('../../utilities/exportBase64Images.js');
      this.pdfMake = require('pdfmake/build/pdfmake');
      const pdfFonts = require('pdfmake/build/vfs_fonts.js');
      this.pdfMake.vfs = pdfFonts.pdfMake.vfs;
      const docDefinition = {...this.docDefinition};
      this.selected.forEach((project, index) => {
        const country = this.getCountryDetails(project.country);
        const country_name = country && country.name ? country.name.toUpperCase() : '';
        const donors = project.donors.map(d => this.getDonorDetails(d)).filter(d => d).map(d => d.name);
        const organisation = this.getOrganisationDetails(project.organisation);
        const organisation_name = organisation ? organisation.name : '';
        const health_focus_areas = this.getHealthFocusAreas.filter(hfa => project.health_focus_areas.some(h => h === hfa.id)).map(hf => hf.name);

        docDefinition.content.push({
          margin: [0, 10],
          table: {
            widths: [118, 118, 118, 118, 118, 118],
            headerRows: 1,
            body: [
              [
                {
                  text: `${index + 1}. ${project.name || ''}`,
                  fillColor: '#EEEEEE',
                  style: 'tableHeader',
                  colSpan: this.isAllCountry ? 4 : 5
                }, '', '', '',
                { text: this.$gettext(`UUID: ${project.id}`), style: 'subHeader' },
                country_name
              ],
              [
                [
                  { text: this.$gettext('Date of:'), style: 'subHeader' },
                  this.printDate(project.implementation_dates)],
                [
                  { text: this.$gettext('Organisation name:'), style: 'subHeader' },
                  organisation_name
                ],
                [
                  { text: this.$gettext('Donors:'), style: 'subHeader' },
                  donors.join(', ')
                ],
                {
                  stack: [
                    { text: this.$gettext('Health Focus Area:'), style: 'subHeader' },
                    health_focus_areas.join(', ')
                  ],
                  colSpan: 2
                },
                '',
                [
                  { text: this.$gettext('Point of contact:'), style: 'subHeader' },
                  `${project.contact_name || ''} - ${project.contact_email || ''}`
                ]
              ],
              [
                {
                  stack: [
                    { text: this.$gettext('Overview of digital health implementation:'),
                      style: 'subHeader' },
                    { text: project.implementation_overview || '' }
                  ],
                  colSpan: 3
                },
                '', '',
                {
                  stack: [
                    { text: this.$gettext('Geographical coverage:'), style: 'subHeader' },
                    project.geographic_scope || ''
                  ],
                  colSpan: 3
                },
                '', ''
              ]
            ]
          }
        });
      });
      this.pdfMake.createPdf(docDefinition).download('clv-searchable-export.pdf');
    }
  }
};
</script>

<style>

</style>
