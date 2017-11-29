import merge from 'lodash/merge';
import forEach from 'lodash/forEach';
import moment from 'moment';
import pdfMake from 'pdfmake-browserified/';
import base64Images from './images/base64Images';


import PDFExportStorage from './PDFExportStorage';

class PDFExportController {

    constructor() {
        this.pdfStorage = PDFExportStorage.factory();
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.pdfMake = pdfMake;
    }

    onInit() {
        merge(this, this.pdfStorage.getData());
        this.logo = require('./images/dha-logo.svg');
        this.exportDate = moment().format('Do MMM, YYYY');
        this.isAllCountry = this.country && this.country.name === 'Show all countries';
        if (this.instantDownload) {
            this.makePDF();
            setTimeout(() => {
                window.close();
            }, 500);
        }
    }

    onDestroy() {

    }

    printDate(dateString) {
        const mom = moment(dateString);
        return mom.format('Do MMM, YYYY');
    }

    makePDF() {


        // units of measure is point.. friggin point
        const docDefinition = {
            content: [
                {
                    table: {
                        widths: ['50%', '50%'],
                        headerRows: 2,
                        body: [
                            [
                                {
                                    text: 'Digital Health Atlas',
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
                                    text: this.country.name.toUpperCase(), fillColor: '#EEEEEE',
                                    color: '#000000',
                                    style: 'headerSecondRow',
                                    margin: [5, 0, 0, 0]
                                },
                                {
                                    text: `List exported on ${this.exportDate}`,
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

        forEach(this.projectList, (project, index)  => {
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
                                style: 'tableHeader', colSpan: this.isAllCountry ? 4 : 5
                            }, '', '', '',
                            this.isAllCountry ? { text: `UUID: ${project.uuid || ''}`, style: 'subHeader' } : '',
                            this.isAllCountry ? country :  { text: `UUID: ${project.uuid || ''}`, style: 'subHeader' }
                        ],
                        [
                            [{ text: 'Date of: ', style: 'subHeader' }, this.printDate(project.implementation_dates)],
                            [{ text: 'Organisation name: ', style: 'subHeader' }, project.organisation_name || ''],
                            [{ text: 'Donors:', style: 'subHeader' },  project.donors.join(', ')],
                            [
                                { text: 'Implementing partners:', style: 'subHeader' },
                                project.implementing_partners || ''],
                            [
                                { text: 'Health Focus Area:', style: 'subHeader' },
                                project.health_focus_areas ? project.health_focus_areas.join(', ') : ''
                            ],
                            [
                                { text: 'Point of contact:', style: 'subHeader' },
                                `${project.contact_name || ''} - ${project.contact_email || ''}`
                            ]
                        ],
                        [
                            {
                                stack: [
                                    { text: 'Overview of digital health implementation: ', style: 'subHeader' },
                                    { text: project.implementation_overview || '' }
                                ],
                                colSpan: 3
                            },
                            '', '',
                            {
                                stack: [
                                    { text: 'Geographical coverage: ', style: 'subHeader' },
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

    static pdfExportFactory() {
        require('./PDFExport.scss');

        function pdfExportController() {
            return new PDFExportController();
        }

        pdfExportController.$inject = [];

        return pdfExportController;
    }

}

export default PDFExportController;
