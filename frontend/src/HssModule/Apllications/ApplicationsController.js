import _ from 'lodash';
import { hss, applicationsLib } from '../hssMockData';

class ApplicationsController {

    constructor($timeout) {
        const vm = this;
        $timeout(() => {
            vm.EE = window.EE;
            vm.editMode = false;
            this.startTile = {};
            this.tileClickCounter = 0;
            this.applicationRow = this.applicationRowGenerator();
            vm.EE.on('hssEditMode', this.handleEditMode.bind(this));
            vm.EE.on('hssColumnActiveState', this.handleColumnActivation.bind(this));
        });
    }

    handleEditMode(value) {
        this.editMode = value;
    }

    handleColumnActivation(event) {
        _.map(this.applicationRow, (value) => {
            if (value.columnId === event.columnId) {
                value.activated = event.activated;
            }
            return value;
        });
    }

    classGenerator(tile) {
        const classArray = [tile.className];
        classArray.push((tile.columnId + 1) % 2 === 0 ? 'even' : 'odd');
        return classArray.join(' ');
    }

    inspect(tile) {
        console.log(tile);
    }

    applicationClassGenerator(tile) {
        const classArray = this.classGenerator(tile).split(' ');

        classArray.push(tile.rowBubbles && tile.rowBubbles.length > 0
            ? tile.applicationStyle : 'application_disabled');
        classArray.push(tile.status ? tile.status : 'no-bubble' );
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
            clickHandler: this.enableSubApp.bind(this),
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
                    clickHandler: this.appClickHandler.bind(this)
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

    subAppMiddleColumnDecorator(index, id) {

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
                    appLabel: this.appLabelGenerator(id, index),
                    activated: this.applicationActivated(value),
                    fatherId: id,
                    disabled: true,
                    isMain: false,
                    clickHandler: this.appClickHandler.bind(this)
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
            isInput: true,
            isSelect: true,
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
            cols = cols.concat(this.subAppMiddleColumnDecorator(i, appId));
            cols = cols.concat(this.taxonomyColumnGenerator(i, appId, true));
        }
        return cols;
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

    enableSubApp(tile) {
        if (!tile.subApplications) {
            return;
        }
        tile.subAppOpen = !tile.subAppOpen;
        _.map(this.applicationRow, (value) => {
            if (value.fatherId && value.fatherId === tile.applicationId) {
                value.disabled = !value.disabled;
            }
            return value;
        });
    }

    appClickHandler(tile) {
        if (tile.bubbleDrawn) {
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
        console.log(rowColumns);
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
