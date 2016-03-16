import _ from 'lodash';
import { hss, interventionsLib, applicationsLib, taxonomyLib } from './hssMockData';

class HssModuleController {

    constructor($timeout) {
        this.$timeout = $timeout;
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
        this.motherRow = this.motherColumns();
        this.childRow = this.childColumns();
        this.intervertionLogoColumn = this.interventionHeaderLogoGenerator();
        this.interventionRow = this.interventionRows();
        this.applicationRow = this.applicationRows();
        this.tileClickCounter = 0;
        this.startTile = {};
    }

    headerMiddleColumnDecorator() {
        return _.map(this.cell, (value) => {
            return {
                content: '',
                colSpan: 1,
                rowSpan: 1,
                className: (value + 1) % 2 === 0 ? 'even' : 'odd'
            };
        });
    }

    motherClickHandler(tile) {
        if (!this.editMode) {
            return;
        }
        const idList = [];
        tile.activated = !tile.activated;
        for (let i = tile.columnId; i < tile.columnId + tile.colSpan; i = i + 1) {
            idList.push(i);
        }
        this.applicationRow = _.map(this.applicationRow, (value) => {
            if (_.includes(idList, value.columnId)) {
                value.activated = !value.activated;
            }
            return value;
        });
        this.childRow = _.map(this.childRow, (value) => {
            if (_.includes(idList, value.columnId)) {
                value.activated = !value.activated;
            }
            return value;
        });
    }

    motherMiddleColumnDecorator() {
        return _.chain(this.cell)
            .map((value) => {
                return {
                    content: hss[value].mother.title,
                    colSpan: hss[value].mother.span,
                    rowSpan: 1,
                    invisible: _.isEmpty(hss[value].mother),
                    clickHandler: this.motherClickHandler.bind(this),
                    columnId: value,
                    activated: hss[value].activated,
                    className: (value + 1) % 2 === 0 ? 'even' : 'odd'
                };
            })
            .filter({
                invisible: false
            })
            .value();
    }

    childMiddleColumnDecorator() {
        return _.map(this.cell, (value)=> {
            return {
                content: hss[value].child.title,
                className: (!hss[value].child.title ? 'empty' : '') + ' ' + ((value + 1) % 2 === 0 ? 'even' : 'odd'),
                colSpan: 1,
                rowSpan: 1,
                columnId: value,
                activated: hss[value].activated
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
                className: (value + 1) % 2 === 0 ? 'even' : 'odd',
                colSpan: 1,
                rowSpan: 4,
                isInput: true,
                selectValues: this.interventions[value]
            };
        });
    }

    headerRow() {
        const row = [{
            content: '',
            className: 'even',
            colSpan: 2,
            rowSpan: 1
        }];
        return row.concat(this.headerMiddleColumnDecorator());
    }

    motherColumns() {
        const row = [{
            content: 'Mother',
            className: 'title',
            colSpan: 2,
            rowSpan: 1
        }];
        return row.concat(this.motherMiddleColumnDecorator());
    }

    childColumns() {
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
            subApplications: subApp,
            appId: this.applications[index].id
        }];
        return row;
    }

    applicationsMiddleColumnDecorator(index) {
        return _.map(this.cell, (value) => {
            return {
                content: '',
                className: (value + 1) % 2 === 0 ? 'even' : 'odd',
                rowIndex: index,
                columnId: value,
                colSpan: 1,
                rowSpan: 1,
                isDefined: false,
                isInput: true,
                insertMode: false,
                invisible: false,
                applicationId: this.applications[index].id,
                activated: hss[value].activated
            };
        });
    }

    taxonomyColumnGenerator() {
        return [{
            content: '',
            className: 'taxonomy',
            colSpan: 2,
            rowSpan: 1,
            isInput: true
        }];
    }

    subApplicationHeaderGenerator(subApp, index, id) {
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        return [{
            content: subApp[index],
            className: index === subApp.length - 1 ? 'lastSub' : 'sub',
            colSpan: 2,
            rowSpan: 1,
            isInput: false,
            fatherId: id,
            appId: id + alphabet[index],
            disabled: true
        }];
    }

    subAppMiddleColumnDecorator(index, id) {
        return _.map(this.cell, (value) => {
            return {
                content: '',
                className: (value + 1) % 2 === 0 ? 'even' : 'odd',
                rowIndex: index,
                columnId: value,
                colSpan: 1,
                rowSpan: 1,
                isDefined: false,
                isInput: true,
                insertMode: false,
                invisible: false,
                applicationId: this.applications[index].id,
                activated: hss[value].activated,
                fatherId: id,
                disabled: true
            };
        });
    }

    subAppTaxonomyColumnGenerator(id) {
        return [{
            content: '',
            className: 'taxonomy',
            colSpan: 2,
            rowSpan: 1,
            fatherId: id,
            isInput: true,
            disabled: true
        }];
    }

    subApplicationRows(index) {
        let cols = [];
        const subApp = _.values(this.applications[index].subApplications);
        const appId = this.applications[index].id;

        for (let i = 0; i < subApp.length; i = i + 1) {
            cols = cols.concat(this.subApplicationHeaderGenerator(subApp, i, appId));
            cols = cols.concat(this.subAppMiddleColumnDecorator(i, appId));
            cols = cols.concat(this.subAppTaxonomyColumnGenerator(appId));
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

    enableSubApp(tile) {
        if (!tile.subApplications) {
            return;
        }
        const appId = tile.model.id;
        _.map(this.applicationRow, (value) => {
            if (value.fatherId && value.fatherId === appId) {
                value.disabled = !value.disabled;
            }
            return value;
        });
    }

    clickHandler(tile) {
        if (tile.isDefined) {
            return;
        }
        if (this.tileClickCounter === 0) {
            this.tileClickCounter = this.tileClickCounter + 1;
            this.tileBalloonStartHandler(tile);
        }
        else if (this.tileClickCounter === 1) {
            this.tileClickCounter = 0;
            this.tileBalloonEndHandler(tile);
        }
    }

    inputHandler(tile, event) {
        if (event.which === 13) {
            tile.insertMode = false;
        }
    }

    findSameRowCandidate(tile) {
        return _.chain(this.applicationRow)
            .filter({ rowIndex: tile.rowIndex, activated: true })
            .filter((value) => {
                return value.columnId >= this.startTile.columnId
                    && value.columnId <= tile.columnId
                    && this.startTile.fatherId === value.fatherId;
            })
            .value();
    }

    tileBalloonStartHandler(tile) {
        tile.status = 'head';
        this.startTile = tile;
    }

    tileBalloonEndHandler(tile) {
        tile.status = 'tail';
        const rowColumns = this.findSameRowCandidate(tile);
        console.log(rowColumns);
        rowColumns.forEach((value, key)=> {
            if (key === 0) {
                value.colSpan = rowColumns.length;
                value.isDefined = true;
            }
            else {
                value.invisible = true;
            }
        });
        this.applicationRow = _.filter(this.applicationRow, (value) => {
            return !value.invisible || !value.isInput;
        });
    }

    classGenerator(tile) {
        return tile.className + ' ' + (tile.activated ? 'activated' : '') + ' ' + tile.status;
    }

}

export default HssModuleController;
