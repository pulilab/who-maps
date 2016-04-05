// import _ from 'lodash';

class LinechartController {

    constructor() {
        require('./Linechart.scss');
        require('d3');

        const vm = this;
        // console.log(vm.data); // the data got thru HTML data=""
    }

    static linechartFactory() {
        function linechart() {
            return new LinechartController();
        }
        linechart.$inject = [];
        return linechart;
    }

}

export default LinechartController;
