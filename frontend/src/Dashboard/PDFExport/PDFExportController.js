import forEach from 'lodash/forEach';
import moment from 'moment';
import base64Images from './images/base64Images';

class PDFExportController {
  constructor (gettextCatalog) {
    this.onInit();
    this.makePDF = this.makePDF.bind(this, gettextCatalog);
  }

  onInit () {
    this.logo = require('./images/dha-logo.svg');
    this.exportDate = moment().format('Do MMM, YYYY');
  }

  printDate (dateString) {
    const mom = moment(dateString);
    return mom.format('Do MMM, YYYY');
  }

  setData (projectList, country, countryFlag) {
    this.projectList = projectList;
    this.country = country;
    this.isAllCountry = country && country.id === false;
    this.countryFlag = countryFlag;
  }

  async makePDF (gettextCatalog) {
    /* translation-unfriendly-code */
    const pdfMakePromise = import('pdfmake/build/pdfmake');
    const pdfFontsPromise = import('pdfmake/build/vfs_fonts.js');
    const [pdfMake, pdfFonts] = await Promise.all([pdfMakePromise, pdfFontsPromise]);
    /* end-translation-unfriendly-code */
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.pdfMake = pdfMake.createPdf;
    const docDefinition = {
      content: [
        {
          table: {
            widths: ['50%', '50%'],
            headerRows: 2,
            body: [
              [
                {
                  text: gettextCatalog.getString('Digital Health Atlas'),
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
                  text: this.country.name.toUpperCase(),
                  fillColor: '#EEEEEE',
                  color: '#000000',
                  style: 'headerSecondRow',
                  margin: [5, 0, 0, 0]
                },
                {
                  text: gettextCatalog.getString(`List exported on ${this.exportDate}`),
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

      images: base64Images
    };

    forEach(this.projectList, (project, index) => {
      const country = project.country_name.replace('-', ' ').toUpperCase();

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
              this.isAllCountry ? { text: gettextCatalog.getString(`UUID: ${project.uuid || ''}`),
                style: 'subHeader' } : '',
              this.isAllCountry ? country
                : { text: gettextCatalog.getString(`UUID: ${project.uuid || ''}`),
                  style: 'subHeader' }
            ],
            [
              [{ text: gettextCatalog.getString('Date of:'), style: 'subHeader' },
                this.printDate(project.implementation_dates)],
              [{ text: gettextCatalog.getString('Organisation name:'), style: 'subHeader' },
                project.organisation_name || ''],
              [{ text: gettextCatalog.getString('Donors:'), style: 'subHeader' },
                project.donors.join(', ')],
              [
                { text: gettextCatalog.getString('Implementing partners:'), style: 'subHeader' },
                project.implementing_partners || ''],
              [
                { text: gettextCatalog.getString('Health Focus Area:'), style: 'subHeader' },
                project.health_focus_areas ? project.health_focus_areas.join(', ') : ''
              ],
              [
                { text: gettextCatalog.getString('Point of contact:'), style: 'subHeader' },
                `${project.contact_name || ''} - ${project.contact_email || ''}`
              ]
            ],
            [
              {
                stack: [
                  { text: gettextCatalog.getString('Overview of digital health implementation:'),
                    style: 'subHeader' },
                  { text: project.implementation_overview || '' }
                ],
                colSpan: 3
              },
              '', '',
              {
                stack: [
                  { text: gettextCatalog.getString('Geographical coverage:'), style: 'subHeader' },
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
    this.pdfMake(docDefinition).download('clv-searchable-export.pdf');
  }
}

export default PDFExportController;
