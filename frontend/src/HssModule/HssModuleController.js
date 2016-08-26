import { Protected } from '../Common/';
import 'es6-promise';
/* global Promise */

class HssModuleController extends Protected {

    constructor($scope, $state, CommonService, introJs) {
        super();
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.cs = CommonService;
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
        this.structure = this.cs.hssStructure;
        this.data = {};
        this.columnHasContent = [];
        if (this.cs.userProfile) {
            this.adjustUserType(this.cs.userProfile);
        }
        this.viewMode = this.userType < 3;
        this.hs.getData().then(this.handleServerData.bind(this));
    }

    onDestroy() {
        this.defaultOnDestroy();
        this.eventRemoving();
    }

    eventBindings() {
        this.EE.on('hssColumnContents', this.reFresh, this);
        this.EE.on('hssHasColumnContent', this.onAskIfColumnGotContent, this);
        this.EE.on('hssPleaseActivateColumn', this.askedToActivateColumn, this);
        this.EE.on('hssEditMode', this.handleEditMode, this);
        this.EE.on('hssInnerLayoutDone', this.handleLayoutEvent, this);

    }

    eventRemoving() {
        this.EE.removeListener('hssColumnContents', this.reFresh, this);
        this.EE.removeListener('hssHasColumnContent', this.onAskIfColumnGotContent, this);
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

    handleServerData(data) {
        this.data = data;
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

    askedToActivateColumn(obj) {
        this.EE.emit('hssGuysActivateColumn', obj);
    }

    static hssControllerFactory() {
        function hssController($scope, $state) {
            const introJs = require('./resources/introJsSource.json');
            const CommonService = require('../Common/CommonServices');
            return new HssModuleController($scope, $state, CommonService, introJs);
        }

        hssController.$inject = ['$scope', '$state'];

        return hssController;
    }

}

export default HssModuleController;
