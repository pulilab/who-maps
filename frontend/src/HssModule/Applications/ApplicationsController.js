import _ from 'lodash';
import { Protected } from '../../Common/';

class ApplicationsController extends Protected {

    constructor($timeout, $mdDialog) {
        super();
        const vm = this;
        vm.EE = window.EE;
        vm.timeout = $timeout;
        vm.dialog = $mdDialog;
        vm.$onInit = this.onInit.bind(this);
        vm.$onDestroy = this.onDestroy.bind(this);
    }

    onInit() {
        const vm = this;
        vm.defaultOnInit();
        this.rowObject = {};
        this.gridLoading = false;
        this.layoutReady = false;
        vm.editMode = false;
        vm.startTile = {};
        vm.tileClickCounter = 0;
        vm.bindEvents();
        vm.hs = vm.service;
        vm.selectedConstraints = this.constraintsGenerator();
        vm.applicationRow = this.applicationRowGenerator();
        vm.searchForFilledColumns();
    }

    onDestroy() {
        const vm = this;
        vm.defaultOnDestroy();
        vm.removeEvents();
    }

    bindEvents() {
        const vm = this;
        vm.EE.on('hssEditMode', this.handleEditMode, this);
        vm.EE.on('hssGuysActivateColumn', this.handleColumnActivation, this);
        vm.EE.on('hssConstraintsSelected', this.constraintsUpdated, this);
    }

    removeEvents() {
        const vm = this;
        vm.EE.removeListener('hssEditMode', this.handleEditMode, this);
        vm.EE.removeListener('hssGuysActivateColumn', this.handleColumnActivation, this);
        vm.EE.removeListener('hssConstraintsSelected', this.constraintsUpdated, this);
    }

    handleEditMode(value) {
        this.editMode = value;
        this.processRows();
        this.openAllSubApp();
    }

    layoutDone() {
        this.layoutReady = true;
        this.EE.emit('hssInnerLayoutDone', 'application');
    }

    openAllSubApp() {
        _.forEach(this.rowObject.father_0, mainRow => {
            this.toggleSubApp(mainRow.columnId_header, true);
        });
    }

    handleColumnActivation(event) {
        _.map(this.applicationRow, (value) => {
            if (value.columnId === event.columnId) {
                value.activated = event.activated;
            }
            return value;
        });
    }

    constraintsGenerator() {
        return _.chain(this.structure.taxonomies)
            .keys()
            .map((value, key) => {
                const _active = this.data.constraints[key] && this.data.constraints[key].active;
                return {
                    name: value,
                    icon: this.structure.taxonomies[value].icon,
                    active: _active,
                    taxonomy: this.structure.taxonomies[value].values
                };
            })
            .value();
    }

    constraintsUpdated(event) {
        this.selectedConstraints = _.chain(event)
            .map(value => {
                value.taxonomy = this.structure.taxonomies[value.name].values;
                return value;
            })
            .value();
    }

    classGenerator(tile) {
        const classArray = [tile.className];
        classArray.push((tile.columnId + 1) % 2 === 0 ? 'even' : 'odd');
        classArray.push(tile.isMain ? 'app-main' : 'app-sub');
        classArray.push(tile.introName);
        classArray.push(this.editMode ? 'edit-mode' : 'view-mode');
        return classArray.join(' ');
    }

    applicationClassGenerator(tile) {
        const classArray = this.classGenerator(tile).split(' ');

        classArray.push(tile.rowBubbles && tile.rowBubbles.length > 0
            ? tile.applicationStyle : 'application_disabled');
        classArray.push(tile.status ? tile.status : 'no-bubble');
        classArray.push(tile.activated ? 'activated' : 'not-activated');
        classArray.push(tile.subAppOpen ? 'app-open' : 'app-closed');
        return classArray.join(' ');
    }

    applicationActivated(value) {
        return this.data.continuum[value].state;
    }

    applicationHeaderGenerator(index) {
        return [{
            content: this.structure.applications[index].name,
            className: 'app-header',
            colSpan: 9,
            rowSpan: 1,
            columnId: 'header',
            rowIndex: index,
            subApplications: _.values(this.structure.applications[index].subApplications),
            applicationId: this.structure.applications[index].id,
            isHeader: true,
            isMain: true,
            rowBubbles: [],
            invisible: false,
            classGenerator: this.applicationClassGenerator.bind(this),
            clickHandler: this.toggleSubApp.bind(this),
            introName: 'applications_header_' + index,
            applicationStyle: 'application_' + this.structure.applications[index].id,
            fatherId: 0
        }];
    }

    applicationsMiddleColumnDecorator(index) {
        return _.chain(this.tiles)
            .range()
            .map(value => {
                return {
                    content: '',
                    className: 'app',
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
                    applicationId: this.structure.applications[index].id,
                    activated: this.applicationActivated(value),
                    introName: 'applications_middle_' + value,
                    classGenerator: this.applicationClassGenerator.bind(this),
                    clickHandler: this.appClickHandler.bind(this),
                    fatherId: 0
                };
            })
            .value();
    }

    subApplicationClassGenerator(subApp, tile) {
        const classArray = this.applicationClassGenerator(tile).split(' ');
        classArray.push(tile.rowIndex === subApp.length - 1 ? 'lastSub' : 'sub');
        return classArray.join(' ');
    }

    labelGenerator(tile) {
        if (tile.isMain) {
            return tile.applicationId;
        }
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        return '' + tile.applicationId + alphabet[tile.rowIndex];
    }

    subApplicationHeaderGenerator(subApp, index, id) {
        return [{
            content: subApp[index],
            className: 'app-header',
            colSpan: 2,
            rowSpan: 1,
            isInput: false,
            isHeader: true,
            isMain: false,
            rowEnabled: false,
            columnId: 'header',
            rowIndex: index,
            fatherId: id,
            applicationId: id,
            disabled: true,
            invisible: false,
            rowBubbles: [],
            classGenerator: this.subApplicationClassGenerator.bind(this, subApp),
            clickHandler: void 0,
            applicationStyle: 'application_' + this.structure.applications[id - 1].id
        }];
    }

    subAppMiddleColumnDecorator(subApp, index, id) {
        return _.chain(this.tiles)
            .range()
            .map(value => {
                return {
                    content: '',
                    className: 'app',
                    rowIndex: index,
                    columnId: value,
                    colSpan: 1,
                    rowSpan: 1,
                    bubbleDrawn: false,
                    isInput: true,
                    insertMode: false,
                    invisible: false,
                    applicationId: id,
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

    taxonomyColumnGenerator(index, id, isSubApp, _isEmpty) {
        return [{
            content: '',
            className: 'app-tax',
            colSpan: 2,
            rowSpan: 1,
            columnId: 'tax',
            fatherId: id,
            isInput: false,
            isSelect: true,
            isMain: !isSubApp,
            disabled: isSubApp,
            isTax: true,
            isEmpty: _isEmpty,
            rowIndex: index,
            rowEnabled: false,
            invisible: false,
            introName: 'taxonomy_app_' + index,
            classGenerator: this.classGenerator.bind(this),
            saveTaxonomy: this.saveTaxonomy.bind(this, id, index)
        }];
    }

    saveTaxonomy(appId, subAppId, value) {
        this.rowObject['father_' + appId]['rowIndex_' + subAppId].columnId_tax.content = value;

        this.refreshTaxonomyData(appId, subAppId, value);

        this.EE.emit('hssTaxonomiesUpdated');
        this.hs.postTaxonomy(appId, subAppId, value);
    }

    refreshTaxonomyData(appId, subAppId, value) {
        _.forEach(this.data.taxonomies, (tax) => {
            if (tax.app_id === appId && tax.subapp_id === subAppId) {
                tax.content = value;
            }
        });
        // add if doesn't exist yet
        if (!_.some(this.data.taxonomies, { app_id: appId, subapp_id: subAppId })) {
            this.data.taxonomies.push({
                app_id: appId,
                subapp_id: subAppId,
                content: value
            });
        }
    }

    subApplicationRows(index) {
        let cols = [];
        const subApp = _.values(this.structure.applications[index].subApplications);
        const appId = this.structure.applications[index].id;

        for (let i = 0; i < subApp.length; i += 1) {
            cols = cols.concat(this.subApplicationHeaderGenerator(subApp, i, appId));
            cols = cols.concat(this.subAppMiddleColumnDecorator(subApp, i, appId));
            cols = cols.concat(this.taxonomyColumnGenerator(i, appId, true, false));
        }
        return cols;
    }


    applicationRowGenerator() {
        const appNumber = this.structure.applications.length;
        let cols = [];
        for (let i = 0; i < appNumber; i += 1) {
            cols = cols.concat(this.applicationHeaderGenerator(i));
            // cols = cols.concat(this.applicationsMiddleColumnDecorator(i));
            cols = cols.concat(this.taxonomyColumnGenerator(i, 0, false, true));
            cols = cols.concat(this.subApplicationRows(i));
        }
        this.createRowStructure(cols);
        cols = this.processData(cols);
        this.processRows();
        return cols;
    }

    processRows() {
        _.chain(11)
            .range()
            .forEach(value => {
                if (value === 0) { // skip the main app
                    return;
                }
                _.forEach(this.rowObject['father_' + value], row => {
                    let isEnabled = false;
                    _.forEach(row, tile => {
                        isEnabled = (tile.isInput && tile.content.length > 0) || isEnabled;
                    });
                    _.forEach(row, tile => {
                        tile.disabled = !isEnabled;
                        tile.rowEnabled = isEnabled;
                        tile.className = _.replace(tile.className, 'selected', '');
                    });

                });
            })
            .value();
    }

    processData(cols) {
        _.forEach(this.data.applications, data => {
            const fatherId = data.app_id;
            const rowIndex = data.subapp_id - 1;

            if (rowIndex < 0) {
                return;
            }

            const tile = this.rowObject['father_' + fatherId]['rowIndex_' + rowIndex]['columnId_' + data.column_id];

            if (tile) {
                tile.content = data.content;
                tile.colSpan = data.colspan;
                if (data.content.length > 0) {
                    tile.bubbleDrawn = true;
                    tile.rowEnabled = true;
                    tile.status = this.enableRow(tile);
                    const fatherTile = this.rowObject.father_0['rowIndex_' + (tile.fatherId - 1)].columnId_header;
                    fatherTile.rowEnabled = true;
                    fatherTile.status = this.enableRow(tile);
                }
                if (data.colspan === 0) {
                    tile.invisible = true;
                }
            }
        });

        _.forEach(this.data.taxonomies, tax => {
            const rowIndex = tax.subapp_id;
            const fatherId = tax.app_id;
            if (rowIndex < 0) {
                return;
            }
            const tile = this.rowObject['father_' + fatherId]['rowIndex_' + rowIndex].columnId_tax;
            if (tile) {
                tile.content = tax.content;
                tile.disabled = false;
            }
        });
        return _.filter(cols, { invisible: false });

    }

    createRowStructure(rows) {
        const vm = this;
        _.forEach(rows, item => {
            _.set(vm.rowObject,
                'father_' + item.fatherId + '.rowIndex_' + item.rowIndex + '.columnId_' + item.columnId,
                item);
        });
    }

    toggleSubApp(tile, forceOpening) {
        if (!tile.subApplications || !this.editMode) {
            return;
        }
        this.layoutReady = false;
        tile.subAppOpen = !tile.subAppOpen || forceOpening;
        _.forEach(this.rowObject['father_' + tile.applicationId], value => {
            _.forEach(value, item => {
                item.disabled = !tile.subAppOpen;
            });
        });
    }

    appClickHandler(tile) {
        if (tile.bubbleDrawn || !this.editMode || !tile.activated) {
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
        this.timeout(() => {
            if (event.which === 13) {
                this.focusBubble(tile, true);
            }
        });
    }

    changeHandler(tile) {
        this.saveBubbles(tile);
    }

    blurHandler(tile) {
        this.timeout(() => {
            if (tile.content.length === 0) {
                const vm = this;
                const confirm = this.dialog.confirm()
                    .title('Warning')
                    .textContent('Empty bubble is not allowed, are you sure you want to delete?')
                    .ariaLabel('Bubble Delete')
                    .ok('Yes')
                    .cancel('No');
                this.dialog.show(confirm).then(() => {
                    vm.deleteBubble(tile);
                }, () => {
                    this.focusBubble(tile);
                });
            }
        });
    }

    saveBubbles(tile) {
        const tiles = _.chain(tile.colSpan)
            .range()
            .map((item, key) => {
                item = {
                    'app_id': tile.applicationId,
                    'subapp_id': tile.isMain ? 0 : (tile.rowIndex + 1),
                    'column_id': tile.columnId + item,
                    'colspan': 0,
                    'content': ''
                };
                if (key === 0) {
                    item.colspan = tile.colSpan;
                    item.content = tile.content;
                }
                return item;
            })
            .value();
        this.hs.postBubbles(tiles);
    }


    findSameRowCandidate(tile) {
        if (tile.rowIndex !== this.startTile.rowIndex
            || this.startTile.fatherId !== tile.fatherId) {
            return [];
        }
        return _.chain(this.rowObject['father_' + tile.fatherId]['rowIndex_' + tile.rowIndex])
            .filter(value => {
                return value.activated === true
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
        tile.className += 'selected';
    }

    enableRow(tile) {
        let applicationStyle = '';
        _.map(this.rowObject['father_' + tile.fatherId]['rowIndex_' + tile.rowIndex], value => {
            if (value.isHeader) {
                applicationStyle = value.applicationStyle;
                value.rowBubbles.push(this.startTile.columnId);
            }
            value.rowEnabled = true;
            return value;
        });
        return applicationStyle;
    }

    tileBalloonEndHandler(tile) {
        const rowColumns = this.findSameRowCandidate(tile);
        if (rowColumns.length === 0) {
            this.startTile.className = 'app';
            this.startTile = void 0;
            return;
        }

        const applicationStyle = this.enableRow(tile);
        rowColumns.forEach((value, key)=> {
            if (key === 0) {
                value.colSpan = rowColumns.length;
                value.bubbleDrawn = true;
                value.status = applicationStyle;
                const fatherTile = this.rowObject.father_0['rowIndex_' + (value.fatherId - 1)].columnId_header;
                fatherTile.rowEnabled = true;
                fatherTile.status = this.enableRow(tile);
            }
            else {
                value.invisible = true;
            }
        });

        this.applicationRow = _.filter(this.applicationRow, (value) => {
            return !value.invisible || !value.isInput;
        });

        this.focusBubble(tile);

        this.searchForFilledColumns();
    }

    focusBubble(tile, unfocus) {
        this.timeout(() => {
            const input = document.getElementById('appBubble_' + this.labelGenerator(tile));
            if (input) {
                if (unfocus) {
                    input.blur();
                }
                else {
                    input.focus();
                }
            }
        });
    }

    deleteBubble(bubble) {
        const toAdd = [];
        const index = _.findIndex(this.applicationRow, bubble);
        _.chain(bubble.colSpan)
            .range()
            .forEach(tileIndex => {
                const colId = 'columnId_' + (bubble.columnId + tileIndex);
                const item = this.rowObject['father_' + bubble.fatherId]['rowIndex_' + bubble.rowIndex][colId];
                item.colSpan = 1;
                item.content = '';
                item.bubbleDrawn = false;
                item.status = '';
                item.invisible = false;
                item.className = _.replace(item.className, 'selected', '');
                toAdd.push(item);
            })
            .value();
        _.forEach(toAdd, (value, key) => {
            if (key !== 0) {
                this.applicationRow.splice((index + key), 0, value);
            }
        });
        const toSave = _.map(toAdd, tile => {
            return {
                'app_id': tile.applicationId,
                'subapp_id': tile.isMain ? 0 : (tile.rowIndex + 1),
                'column_id': tile.columnId,
                'colspan': 1,
                'content': ''
            };
        });
        this.hs.postBubbles(toSave);

        _.map(this.rowObject['father_' + bubble.fatherId]['rowIndex_' + bubble.rowIndex], value => {
            if (value.isHeader) {
                _.remove(value.rowBubbles, n => {
                    return n === bubble.columnId;
                });
            }
            value.rowEnabled = false;
            return value;
        });
        this.checkIfMainIsEnabled(bubble);
        this.searchForFilledColumns();

        // delete all taxonomies
        this.saveTaxonomy(bubble.fatherId, bubble.rowIndex, []);
    }

    checkIfMainIsEnabled(bubble) {
        let isMainEnabled = false;
        _.forEach(this.rowObject['father_' + bubble.fatherId], row => {
            _.forEach(row, column => {
                isMainEnabled = isMainEnabled || column.bubbleDrawn;
            });
        });
        if (!isMainEnabled) {
            const fatherTile = this.rowObject.father_0['rowIndex_' + (bubble.fatherId - 1)].columnId_header;
            fatherTile.rowEnabled = true;
            fatherTile.status = '';
        }
    }

    confirmDeleteBubble(bubble) {
        const vm = this;
        const confirm = this.dialog.confirm()
            .title('Warning')
            .textContent('Are you sure?')
            .ariaLabel('Bubble Delete')
            .ok('Ok')
            .cancel('Cancel');
        this.dialog.show(confirm).then(() => {
            vm.deleteBubble(bubble);
        });
    }

    searchForFilledColumns() {

        const containArr = _.fill(new Array(7), false);

        const notEmpties = this.applicationRow.filter(el => {
            return el.bubbleDrawn;
        });

        notEmpties.forEach(el => {
            for (let i = +el.columnId; i <= el.columnId + el.colSpan - 1; i += 1) {
                containArr[i] = true;
            }
        });

        this.EE.emit('hssColumnContents', containArr);
    }

    static applicationsFactory() {
        require('./Applications.scss');
        function applications($timeout, $mdDialog) {
            return new ApplicationsController($timeout, $mdDialog);
        }

        applications.$inject = ['$timeout', '$mdDialog'];

        return applications;
    }

}

export default ApplicationsController;
