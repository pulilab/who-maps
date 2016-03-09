import _ from 'lodash';
import { hss, interventionsLib } from './hssMockData';

class HssModuleController {

    constructor() {
        this.cell = [0, 1, 2, 3, 4, 5, 6];
        this.interventions = _.keys(interventionsLib);
        this.zeroRow = this.headerRow();
        this.firstRow = this.motherRow();
        this.secondRow = this.childRow();
        this.interventionRow = this.interventionRows();
        console.log(hss);
    }

    interventionsMiddleColumnDecorator() {
        return _.map(this.cell, (value) => {
            return {
                content: value,
                className: '',
                colSpan: 1,
                rowSpan: 1
            };
        });
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
                content: hss[value].titleMother,
                colSpan: 1,
                rowSpan: 1
            };
        });
    }

    childMiddleColumnDecorator() {
        return _.map(this.cell, (value)=> {
            return {
                content: hss[value].titleChild,
                className: !hss[value].titleChild ? 'empty' : '',
                colSpan: 1,
                rowSpan: 1
            };
        });
    }

    interventionHeaderLogoGenerator() {
        return [{
            content: 'Interventions and stuff',
            className: '',
            colSpan: 1,
            rowSpan: 4
        }];
    }

    interventionHeaderLabelGenerator(index) {

        return [{
            content: this.interventions[index],
            className: '',
            colSpan: 1,
            rowSpan: 1
        }];
    }

    infoBoxCellGenerator() {
        return [{
            content: 'empty box',
            className: '',
            colSpan: 2,
            rowSpan: 4
        }];
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
        for (let i = 0; i < 4; i = i + 1) {
            if (!i) {
                cols = this.interventionHeaderLogoGenerator().concat(cols);
            }
            cols = cols.concat(this.interventionHeaderLabelGenerator(i));
            cols = cols.concat(this.interventionsMiddleColumnDecorator());
            if (!i) {
                cols = cols.concat(this.infoBoxCellGenerator());
            }
        }
        return cols;
    }
}

export default HssModuleController;
