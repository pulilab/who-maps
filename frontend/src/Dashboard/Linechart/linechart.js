import _template from './Linechart.html';
import LinechartController from './LinechartController';

const linechart = {
    controller: LinechartController,
    template: _template,
    bindings: {
        data: '='
    }
};

export default linechart;
