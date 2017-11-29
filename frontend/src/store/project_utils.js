import concat from 'lodash/concat';
import isPlainObject from 'lodash/isPlainObject';
import isNull from 'lodash/isNull';
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
    const processed = {};
    fieldsWithCustomValue.forEach(key => {
        processed[key] = concatCustom(collection[key]);
    });
    return { ...processed };
}

export function parsePlatformCollection({ platforms }) {
    return platforms.map(p => {
        const name = p.name === 'Other' ? p.custom : p.name;
        const strategies = p.strategies && p.strategies.length > 0 ? p.strategies : undefined;
        p = {};
        if (name) {
            p.name = name;
        }
        if (strategies) {
            p.strategies = strategies;
        }
        return p;
    });
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
    const result = {};
    fieldsToConvertToObjectArray.forEach(key => {
        if (!data[key]) {
            return;
        }
        result[key] = data[key].map(value => value.value).filter(item => item);
    });
    return { ...result };
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
    const start_date = moment(processedForm.start_date).toJSON();
    const end_date = moment(processedForm.end_date).toJSON();
    const implementation_dates = moment(processedForm.implementation_dates).toJSON();
    return { start_date, end_date, implementation_dates };
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

export function removeEmptyChildObjects(form) {
    const result = {};
    const keyArray = ['coverage', 'platforms', 'his_bucket', 'hsc_challenges', 'publications', 'links', 'reports'];
    keyArray.forEach(key => {
        if (form[key]) {
            result[key] = form[key].filter(itm => {
                itm = { ...itm };
                itm = deleteUndefinedAndDoubleDollarKeys(itm);
                if (itm.hasOwnProperty('available')) {
                    delete itm.available;
                }
                return Object.keys(itm).length > 0;
            });
        }
    });

    return { ...result };
}


export function removeKeysWithoutValues(processedForm) {
    const result = {};
    for (const key in processedForm) {
        const data = processedForm[key];
        if (data !== null && data !== undefined && data !== ''
          || (isPlainObject(data) && values(data).some(i => !isNull(i)))) {
            result[key] = data;
        }
    }
    return result;
}

export function retainNationalOrDistrictCoverage(form) {
    let national_level_deployment = null;
    let coverage = null;
    if (form.coverageType === 1) {
        coverage = form.coverage.map(c => ({ ...c }));
    }
    else {
        national_level_deployment = { ...form.national_level_deployment };
    }
    return { national_level_deployment, coverage };
}
