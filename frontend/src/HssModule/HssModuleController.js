import { Protected } from '../Common/';
import 'es6-promise';
/* global Promise */

class HssModuleController extends Protected {

    constructor($scope, $state, $animate, introJs) {
        super();
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.introJsSource = introJs;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);

    }

    onInit() {
        this.defaultOnInit();
        this.eventBindings();
        this.projectId = this.state.params.appName;
        const HssModuleService = require('./HssModuleService');
        this.hs = new HssModuleService(this.projectId);
        this.dataReady = false;
        this.gridLoading = 3;
        this.editMode = false;
        this.structure = {};
        this.data = {};
        this.columnHasContent = [];
        Promise.all([this.hs.getStructure(), this.hs.getData()]).then(this.handleServerData.bind(this));
    }

    onDestroy() {
        this.defaultOnDestroy();
        this.eventRemoving();
    }

    eventBindings() {
        this.EE.on('hssColumnContents', this.reFresh, this);
        this.EE.on('hssHasColumnContent', this.onAskIfColumnGotContent, this);
        this.EE.on('hssHasColumnContentLastTwo', this.onLastTwoContentAsked, this);
        this.EE.on('hssPleaseActivateColumn', this.askedToActivateColumn, this);
        this.EE.on('hssEditMode', this.handleEditMode, this);
        this.EE.on('hssInnerLayoutDone', this.handleLayoutEvent, this);

    }

    eventRemoving() {
        this.EE.removeListener('hssColumnContents', this.reFresh, this);
        this.EE.removeListener('hssHasColumnContent', this.onAskIfColumnGotContent, this);
        this.EE.removeListener('hssHasColumnContentLastTwo', this.onLastTwoContentAsked, this);
        this.EE.removeListener('hssPleaseActivateColumn', this.askedToActivateColumn, this);
        this.EE.removeListener('hssEditMode', this.handleEditMode, this);
        this.EE.removeListener('hssInnerLayoutDone', this.handleLayoutEvent, this);
    }

    handleLayoutEvent() {
        let counter = this.gridLoading;
        counter -= 1;
        if (counter < 0) {
            counter = 0;
            this.EE.emit('editModeDone');
        }
        this.gridLoading = counter;
    }

    handleServerData(values) {
        this.structure = values[0];
        this.data = values[1];
        this.scope.$evalAsync();
        this.dataReady = true;
    }

    handleEditMode(value) {
        this.editMode = value;
    }

    reFresh(columnContentsArray) {
        this.columnHasContent = columnContentsArray;
    }

    onAskIfColumnGotContent(id) {
        this.EE.emit('hssGuysActivateColumn', {
            columnId: id,
            activated: this.columnHasContent[id]
        });
    }

    onLastTwoContentAsked() {
        this.EE.emit('hssHasContentLastTwo', {
            five: this.columnHasContent[5],
            six: this.columnHasContent[6]
        });
    }

    askedToActivateColumn(obj) {
        this.EE.emit('hssGuysActivateColumn', obj);
    }

    static hssControllerFactory() {
        function hssController($scope, $state, $animate) {
            const introJs = require('./resources/introJsSource.json');
            return new HssModuleController($scope, $state, $animate, introJs);
        }

        hssController.$inject = ['$scope', '$state', '$animate'];

        return hssController;
    }

}

export default HssModuleController;
