import HssModuleService from './HssModuleService';
import { Protected } from '../Common/';
import 'es6-promise';
/* global Promise */

class HssModuleController extends Protected {

    constructor($scope, $state, introJs) {
        super();
        this.EE = window.EE;
        this.scope = $scope;
        this.dataReady = false;
        this.gridLoading = 3;
        this.editMode = false;
        this.structure = {};
        this.data = {};

        this.columnHasContent = [];

        this.EE.on('hssColumnContents', this.reFresh.bind(this));

        this.EE.on('hssHasColumnContent', this.onAskIfColumnGotContent.bind(this));

        this.EE.on('hssHasColumnContentLastTwo', this.onLastTwoContentAsked.bind(this));

        this.EE.on('hssPleaseActivateColumn', this.askedToActivateColumn.bind(this));

        this.EE.on('hssEditMode', this.handleEditMode.bind(this));

        this.EE.on('hssInnerLayoutDone', this.handleLayoutEvent.bind(this));

        this.projectId = $state.params.appName;
        this.hs = new HssModuleService(this.projectId);

        this.$onInit = () => {
            this.introJsSource = introJs;
        };

        Promise.all([this.hs.getStructure(), this.hs.getData()]).then(this.handleServerData.bind(this));

    }

    handleLayoutEvent() {
        this.gridLoading -= 1;
        if (this.gridLoading < 0) {
            this.gridLoading = 0;
        }
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
        function hssController($scope, $state) {
            const introJs = require('./resources/introJsSource.json');
            return new HssModuleController($scope, $state, introJs);
        }

        hssController.$inject = ['$scope', '$state'];

        return hssController;
    }

}

export default HssModuleController;
