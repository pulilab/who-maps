import concat from 'lodash/concat';
import isPlainObject from 'lodash/isPlainObject';
import isNull from 'lodash/isNull';
import reduce from 'lodash/reduce';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import values from 'lodash/values';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';

export const fieldsWithCustomValue =  ['interoperability_standards', 'licenses'];
export const fieldsToConvertToObjectArray = ['donors', 'implementing_partners'];

export const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    return [year, month, day].join('-');

};

export function convertArrayToStandardCustomObj(data) {
    data = cloneDeep(data);
    fieldsWithCustomValue.forEach(key=> {
        const scaffold = {
            standard: [],
            custom: void 0
        };
        scaffold.standard = data[key];
        data[key] = scaffold;
    });
    return data;
}

export function concatCustom(obj) {
    const cat = concat(obj.custom, obj.standard);
    return cat.filter(item => {
        return !isNil(item) && !isEmpty(item);
    });
}

export function mergeCustomAndDefault(collection) {
    fieldsWithCustomValue.forEach(key => {
        collection[key] = concatCustom(collection[key]);
    });

    collection.platforms.forEach(p => {
        if (p.custom) {
            p.name = p.custom;
        }
    });
    return Object.assign({}, collection);
}

export function convertDate(date) {
    const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
    if (date) {
        return moment(date, dateFormat).toDate();
    }
    return undefined;
}

export function convertStringArrayToObjectArray(data) {
    fieldsToConvertToObjectArray.forEach(key => {
        if (!data[key]) {
            return;
        }
        data[key] = data[key].map(value => {
            return { value };
        });
        if (data[key].length === 0) {
            data[key].push({});
        }
    });
    return Object.assign({}, data);
}

export function convertObjectArrayToStringArray(data) {
    fieldsToConvertToObjectArray.forEach(key => {
        if (!data[key]) {
            return;
        }
        data[key] = data[key].map(value => value.value);
        data[key] = data[key].filter(item => item);
    });
    return Object.assign({}, data);
}

export function fillEmptyCollectionsWithDefault(data) {
    data.coverage = isEmpty(data.coverage) ? [{}] : data.coverage;
    data.platforms = isEmpty(data.platforms) ? [{}] : data.platforms;
    return Object.assign({}, data);
}

export function setCoverageType(cov, nat) {
    let ret = null;
    if (nat && (nat.clients || nat.facilities || nat.health_workers)) {
        ret = 2;
    }
    else if (cov && cov.length > 1) {
        ret = 1;
    }
    else if (cov && Array.isArray(cov) && cov[0] && cov[0].district) {
        ret = 1;
    }
    return ret;
}

export function createDateFields(processedForm) {
    processedForm.start_date = moment(processedForm.start_date).toJSON();
    processedForm.end_date = moment(processedForm.end_date).toJSON();
    processedForm.implementation_dates = moment(processedForm.implementation_dates).toJSON();
    return Object.assign({}, processedForm);
}

export function deleteUndefinedAndDoubleDollarKeys(item) {
    const output = {};
    Object.keys(item).forEach(key => {
        if (item[key] !== undefined && key !== '$$hashKey') {
            output[key] = item[key];
        }
    });
    return output;
}

export function removeEmptyChildObjects(processedForm) {
    const keyArray = ['coverage', 'platforms'];
    keyArray.forEach(key => {
        processedForm[key] = processedForm[key].filter(itm => {
            itm = deleteUndefinedAndDoubleDollarKeys(itm);
            if (itm.hasOwnProperty('available')) {
                delete itm.available;
            }
            return Object.keys(itm).length > 0;
        });
    });

    return Object.assign({}, processedForm);
}

export function removeKeysWithoutValues(processedForm) {
    return reduce(processedForm, (result, value, key) => {
        if (value === null || value === '' || isPlainObject(value) &&  values(value).every(isNull)) {
            result[key] = void 0;
        }
        else {
            result[key] = value;
        }
        return result;
    }, {});
}
