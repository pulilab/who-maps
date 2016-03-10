import _ from 'lodash';
import { hss, interventionsLib, applicationsLib, taxonomyLib } from './hssMockData';

class HssModuleController {

    constructor() {
        this.cell = [0, 1, 2, 3, 4, 5, 6];
        this.editMode = true;
        this.interventions = interventionsLib;
        this.applications = applicationsLib;
        this.taxonomy = taxonomyLib;
        this.constraints = _.keys(taxonomyLib);
        this.constraintsToggle = _.map(this.constraints, (value) => {
            return {
                name: value,
                toggled: false
            };
        });
        this.zeroRow = this.headerRow();
        this.firstRow = this.motherRow();
        this.secondRow = this.childRow();
        this.intervertionLogoColumn = this.interventionHeaderLogoGenerator();
        this.interventionRow = this.interventionRows();
        this.applicationRow = this.applicationRows();
    }

    headerMiddleColumnDecorator() {
        return _.map(this.cell, ()=> {
            return {
                content: 'SOMEICON',
                colSpan: 1,
                rowSpan: 1
            };
        });
    }

    motherMiddleColumnDecorator() {
        return _.map(this.cell, (value)=> {
            return {
                content: hss[value].mother.title,
                colSpan: 1,
                rowSpan: 1
            };
        });
    }

    childMiddleColumnDecorator() {
        return _.map(this.cell, (value)=> {
            return {
                content: hss[value].child.title,
                className: !hss[value].child.title ? 'empty' : '',
                colSpan: 1,
                rowSpan: 1
            };
        });
    }

    interventionHeaderLogoGenerator() {
        return {
            content: 'Interventions and stuff',
            className: '',
            colSpan: 2,
            rowSpan: 4
        };
    }

    interventionsMiddleColumnDecorator() {
        return _.map(this.cell, (value) => {
            return {
                content: null,
                className: '',
                colSpan: 1,
                rowSpan: 4,
                isInput: true,
                selectValues: this.interventions[value]
            };
        });
    }

    headerRow() {
        const row = [{
            content: 'mHealth-Something',
            className: 'title',
            colSpan: 2,
            rowSpan: 1
        }];
        const lastCol = [{
            content: 'health system goals',
            className: 'title',
            colSpan: 2,
            rowSpan: 3
        }];
        return row.concat(this.headerMiddleColumnDecorator())
            .concat(lastCol);
    }

    motherRow() {
        const row = [{
            content: 'Mother',
            className: 'title',
            colSpan: 2,
            rowSpan: 1
        }];
        return row.concat(this.motherMiddleColumnDecorator());
    }

    childRow() {
        const row = [{
            content: 'Child',
            className: 'title',
            colSpan: 2,
            rowSpan: 1
        }];
        return row.concat(this.childMiddleColumnDecorator());
    }

    interventionRows() {
        let cols = [];
        cols = cols.concat(this.interventionsMiddleColumnDecorator());
        return cols;
    }

    applicationHeaderGenerator(index) {
        const subApp = _.values(this.applications[index].subApplications);
        const row = [{
            content: this.applications[index].name,
            className: 'title',
            colSpan: 2,
            rowSpan: 1,
            model: this.applications[index],
            subApplications: subApp
        }];
        return row;
    }

    applicationsMiddleColumnDecorator(index) {
        return _.map(this.cell, () => {
            return {
                content: null,
                className: '',
                colSpan: 1,
                rowSpan: 1,
                isInput: true,
                applicationId: this.applications[index].id
            };
        });
    }

    taxonomyColumnGenerator() {
        const row = [{
            content: 'taxonomy',
            className: 'title',
            colSpan: 2,
            rowSpan: 1
        }];
        return row;
    }

    subApplicationHeaderGenerator(subApp, index, id) {
        return [{
            content: subApp[index],
            className: 'sub',
            colSpan: 2,
            rowSpan: 1,
            isInput: false,
            fatherId: id,
            disabled: true
        }];
    }

    subAppMiddleColumnDecorator(index, id) {
        return _.map(this.cell, () => {
            return {
                content: null,
                className: 'sub',
                colSpan: 1,
                rowSpan: 1,
                isInput: true,
                fatherId: id,
                disabled: true
            };
        });
    }

    subApptaxonomyColumnGenerator(id) {
        const row = [{
            content: 'taxonomy',
            className: 'title',
            colSpan: 2,
            rowSpan: 1,
            fatherId: id,
            disabled: true
        }];
        return row;
    }

    subApplicationRows(index) {
        let cols = [];
        const subApp = _.values(this.applications[index].subApplications);
        const appId = this.applications[index].id;

        for (let i = 0; i < subApp.length; i = i + 1) {
            cols = cols.concat(this.subApplicationHeaderGenerator(subApp, i, appId));
            cols = cols.concat(this.subAppMiddleColumnDecorator(i, appId));
            cols = cols.concat(this.subApptaxonomyColumnGenerator(appId));
        }
        return cols;
    }

    applicationRows() {
        const appNumber = this.applications.length;
        let cols = [];
        for (let i = 0; i < appNumber; i = i + 1) {
            cols = cols.concat(this.applicationHeaderGenerator(i));
            cols = cols.concat(this.applicationsMiddleColumnDecorator(i));
            cols = cols.concat(this.taxonomyColumnGenerator());
            cols = cols.concat(this.subApplicationRows(i));
        }
        return cols;
    }

    enableSubApp(application) {
        const appId = application.id;
        _.map(this.applicationRow, (value) => {
            if (value.fatherId && value.fatherId === appId) {
                value.disabled = !value.disabled;
            }
            return value;
        });
    }

}

export default HssModuleController;
