import _ from 'lodash';
import { hss, applicationsLib, taxonomyLib } from '../hssMockData';

class ApplicationsController {

    constructor($timeout) {
        const vm = this;
        $timeout(() => {
            vm.EE = window.EE;
            vm.editMode = false;
            this.startTile = {};
            this.tileClickCounter = 0;
            this.selectedConstraints = [];
            this.applicationRow = this.applicationRowGenerator();
            vm.EE.on('hssEditMode', this.handleEditMode.bind(this));
            vm.EE.on('hssColumnActiveState', this.handleColumnActivation.bind(this));
            vm.EE.on('hssConstraintsSelected', this.constraintsUpdated.bind(this));
        });
    }

    handleEditMode(value) {
        this.editMode = value;
        this.applicationRow = this.setSubAppEnabled(this.applicationRow);
    }

    handleColumnActivation(event) {
        _.map(this.applicationRow, (value) => {
            if (value.columnId === event.columnId) {
                value.activated = event.activated;
            }
            return value;
        });
    }

    constraintsUpdated(event) {
        this.selectedConstraints = _.map(event, value => {
            value.taxonomy = taxonomyLib[value.name].values;
            return value;
        });
    }

    classGenerator(tile) {
        const classArray = [tile.className];
        classArray.push((tile.columnId + 1) % 2 === 0 ? 'even' : 'odd');
        return classArray.join(' ');
    }

    applicationClassGenerator(tile) {
        const classArray = this.classGenerator(tile).split(' ');

        classArray.push(tile.rowBubbles && tile.rowBubbles.length > 0
            ? tile.applicationStyle : 'application_disabled');
        classArray.push(tile.status ? tile.status : 'no-bubble');
        classArray.push(tile.activated ? 'activated' : 'not-activated');
        classArray.push(tile.subAppOpen ? 'app-open' : 'app-closed');
        classArray.push(tile.introName);
        classArray.push(tile.bubbleDrawn ? 'bubble-shape' : 'empty-tile');
        return classArray.join(' ');
    }

    applicationActivated(value) {
        let _activated = hss[value].mother.activated;
        if (hss[value].child) {
            _activated = _activated || hss[value].child.activated;
        }
        return _activated;
    }

    applicationHeaderGenerator(index) {
        const subApp = _.values(applicationsLib[index].subApplications);
        return [{
            content: applicationsLib[index].name,
            className: '',
            colSpan: 2,
            rowSpan: 1,
            rowIndex: index,
            subApplications: subApp,
            applicationId: applicationsLib[index].id,
            isHeader: true,
            isMain: true,
            rowBubbles: [],
            classGenerator: this.applicationClassGenerator.bind(this),
            clickHandler: this.toggleSubApp.bind(this),
            introName: 'applications_header_' + index,
            applicationStyle: 'application_' + applicationsLib[index].id
        }];
    }

    applicationsMiddleColumnDecorator(index) {
        return _.chain(this.tiles)
            .range()
            .map(value => {
                return {
                    content: '',
                    className: '',
                    rowIndex: index,
                    columnId: value,
                    colSpan: 1,
                    rowSpan: 1,
                    bubbleDrawn: false,
                    isInput: true,
                    invisible: false,
                    subAppOpen: false,
                    isMain: true,
                    rowEnabled: false,
                    applicationId: applicationsLib[index].id,
                    activated: this.applicationActivated(value),
                    introName: 'applications_middle_' + value,
                    classGenerator: this.applicationClassGenerator.bind(this),
                    clickHandler: this.appClickHandler.bind(this),
                    fatherId: 'root'
                };
            })
            .value();
    }

    subApplicationClassGenerator(subApp, tile) {
        const classArray = this.applicationClassGenerator(tile).split(' ');
        classArray.push(tile.rowIndex === subApp.length - 1 ? 'lastSub' : 'sub');
        return classArray.join(' ');
    }

    appLabelGenerator(id, index) {
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        return '' + id + alphabet[index];
    }

    subApplicationHeaderGenerator(subApp, index, id) {
        return [{
            content: subApp[index],
            className: '',
            colSpan: 2,
            rowSpan: 1,
            isInput: false,
            isHeader: true,
            isMain: false,
            rowEnabled: false,
            rowIndex: index,
            fatherId: id,
            applicationId: this.appLabelGenerator(id, index),
            disabled: true,
            rowBubbles: [],
            classGenerator: this.subApplicationClassGenerator.bind(this, subApp),
            clickHandler: void 0,
            applicationStyle: 'application_' + applicationsLib[index].id
        }];
    }

    subAppMiddleColumnDecorator(subApp, index, id) {

        return _.chain(this.tiles)
            .range()
            .map(value => {
                return {
                    content: '',
                    className: '',
                    rowIndex: index,
                    columnId: value,
                    colSpan: 1,
                    rowSpan: 1,
                    bubbleDrawn: false,
                    isInput: true,
                    insertMode: false,
                    invisible: false,
                    applicationId: this.appLabelGenerator(id, index),
                    activated: this.applicationActivated(value),
                    fatherId: id,
                    disabled: true,
                    isMain: false,
                    clickHandler: this.appClickHandler.bind(this),
                    classGenerator: this.subApplicationClassGenerator.bind(this, subApp)
                };
            })
            .value();
    }

    taxonomyColumnGenerator(index, id, isSubApp) {
        return [{
            content: '',
            className: 'taxonomy',
            colSpan: 2,
            rowSpan: 1,
            fatherId: id,
            isInput: false,
            isSelect: true,
            isMain: !isSubApp,
            disabled: isSubApp,
            isTax: true,
            rowIndex: index,
            rowEnabled: false
        }];
    }

    subApplicationRows(index) {
        let cols = [];
        const subApp = _.values(applicationsLib[index].subApplications);
        const appId = applicationsLib[index].id;

        for (let i = 0; i < subApp.length; i += 1) {
            cols = cols.concat(this.subApplicationHeaderGenerator(subApp, i, appId));
            cols = cols.concat(this.subAppMiddleColumnDecorator(subApp, i, appId));
            cols = cols.concat(this.taxonomyColumnGenerator(i, appId, true));
        }
        return this.setSubAppEnabled(cols);
    }

    applicationRowGenerator() {
        const appNumber = applicationsLib.length;
        let cols = [];
        for (let i = 0; i < appNumber; i += 1) {
            cols = cols.concat(this.applicationHeaderGenerator(i));
            cols = cols.concat(this.applicationsMiddleColumnDecorator(i));
            cols = cols.concat(this.taxonomyColumnGenerator(i, false));
            cols = cols.concat(this.subApplicationRows(i));
        }
        return cols;
    }

    setSubAppEnabled(rows) {
        return _.map(rows, tile => {
            if (!tile.isMain) {
                return _.chain(rows)
                    .filter(value => {
                        const conditions = value.fatherId === tile.fatherId
                            && !_.isNil(value.content)
                            && value.content.length > 0
                            && value.isInput;
                        return conditions
                            && (!this.editMode ? (value.rowIndex === tile.rowIndex) : true);
                    })
                    .thru(result => {
                        tile.disabled = result.length === 0;
                        return tile;
                    })
                    .value();
            }
            return tile;
        });

    }

    toggleSubApp(tile) {
        if (!tile.subApplications || !this.editMode) {
            return;
        }
        tile.subAppOpen = !tile.subAppOpen;
        _.map(this.applicationRow, (value) => {
            if (value.fatherId && value.fatherId === tile.applicationId) {
                value.disabled = !tile.subAppOpen;
            }
            return value;
        });
    }

    appClickHandler(tile) {
        if (tile.bubbleDrawn || !this.editMode) {
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
            .filter((value) => {
                return value.rowIndex === tile.rowIndex
                    && tile.rowIndex === this.startTile.rowIndex
                    && this.startTile.fatherId === value.fatherId
                    && value.activated === true
                    && value.columnId >= this.startTile.columnId
                    && value.columnId <= tile.columnId;
            })
            .thru(result => {
                return this.isRowContiguous(result);
            })
            .value();

    }

    isRowContiguous(input) {
        let result = input;
        let columnIds = _.map(result, value => {
            return parseInt(value.columnId, 10);
        });
        const max = _.max(columnIds);
        const min = _.min(columnIds);

        if (columnIds.length !== max - min + 1) {
            result = [];
        }

        columnIds = _.map(columnIds, value => {
            return value - min + 1;
        });
        for (let i = 0; i < columnIds.length; i += 1) {
            const x = Math.abs(columnIds[i]);
            if (columnIds[x - 1] > 0) {
                columnIds[x - 1] = columnIds[x - 1] * -1;
            }
            else {
                result = [];
            }
        }
        return result;
    }

    tileBalloonStartHandler(tile) {
        this.startTile = tile;
    }

    tileBalloonEndHandler(tile) {
        let applicationStyle;
        const rowColumns = this.findSameRowCandidate(tile);
        if (rowColumns.length === 0) {
            this.startTile = void 0;
            return;
        }

        this.applicationRow = _.map(this.applicationRow, (value) => {
            if (value.rowIndex === tile.rowIndex) {
                if (tile.isMain && value.isMain && value.isHeader) {
                    applicationStyle = value.applicationStyle;
                    value.rowBubbles.push(rowColumns);
                }
                else if (value.fatherId === tile.fatherId && !value.isMain && value.isHeader) {
                    value.rowBubbles.push(rowColumns);
                    applicationStyle = value.applicationStyle;
                }

                value.rowEnabled = true;
            }
            return value;
        });
        rowColumns.forEach((value, key)=> {
            if (key === 0) {
                value.colSpan = rowColumns.length;
                value.bubbleDrawn = true;
                value.status = applicationStyle;
            }
            else {
                value.invisible = true;
            }
        });

        this.applicationRow = _.filter(this.applicationRow, (value) => {
            return !value.invisible || !value.isInput;
        });
    }

    static applicationsFactory() {
        require('./Applications.scss');
        function applications($timeout) {
            return new ApplicationsController($timeout);
        }

        applications.$inject = ['$timeout'];

        return applications;
    }

}

export default ApplicationsController;
