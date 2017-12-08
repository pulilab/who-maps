import concat from 'lodash/concat';
import isPlainObject from 'lodash/isPlainObject';
import isNull from 'lodash/isNull';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import values from 'lodash/values';
import moment from 'moment';

export const fieldsWithCustomValue =  ['interoperability_standards', 'licenses'];
export const fieldsToConvertToObjectArray = ['donors', 'implementing_partners'];
export const fieldsToMapWithId = ['health_focus_areas'];
export const fieldToForceToInt = ['his_bucket', 'hsc_challenges'];

export const fieldToConvertToObject = [
    { key: 'platforms.strategies', structure_key: 'strategies' },
    { key: 'health_focus_areas', structure_key: 'health_focus_areas' }
];
export const dashFieldConvertToObject = [
    { key: 'health_focus_areas', structure_key: 'health_focus_areas' },
    { key: 'platforms', structure_key: 'technology_platforms' },
    { key: 'licenses', structure_key: 'licenses' },
    { key: 'hsc_challenges', structure_key: 'hsc_challenges' },
    { key: 'his_bucket', structure_key: 'his_bucket' },
    { key: 'interoperability_standards', structure_key: 'interoperability_standards' }
];

export const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    return [year, month, day].join('-');

};


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
        const id = p.id;
        const strategies = p.strategies && p.strategies.length > 0 ? p.strategies : undefined;
        p = {};
        if (id) {
            p.id = id;
        }
        if (strategies) {
            p.strategies = strategies.map(s => s.id).filter(s => s);
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
                if (typeof itm === 'number') {
                    return true;
                }
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

export function extractIdFromObjects(form) {
    const result = {};
    fieldsToMapWithId.forEach(field => {
        result[field] = form[field].map(f => f.id).filter(f => f);
    });
    return result;
}

export function parseOutInteroperabilityLinks(form) {
    return { interoperability_links : form.interoperability_links.filter(il => il && il.id)
          .map(il => ({ id: il.id, link: il.link, selected: il.selected })) };
}


function mapObjectToStructure(toMap, structure, field, structure_key) {
    return toMap.map(f => {
        const isInteger = !Number.isNaN(parseInt(f, 10));
        if (isInteger) {
            return structure[structure_key].find(sf => sf.id === f);
        }
        return { ...f, ...structure[structure_key].find(sf => sf.id === f.id) };
    }).filter(f =>f);
}

export function convertIdArrayToObjectArray(form, structure, fieldToConvert) {
    const result = {};
    fieldToConvert.forEach(field => {
        const structure_key = field.structure_key;
        field = field.key.split('.');
        if (field.length === 2) {
            const parent = field[0];
            field = field [1];
            result[parent] = form[parent].map(p => {
                p = { ...p  };
                if (p[field]) {
                    p[field] = mapObjectToStructure(p[field], structure, field, structure_key);
                }
                return p;
            });
        }
        else if (field.length === 1) {
            field = field[0];
            result[field] = mapObjectToStructure(form[field], structure, field, structure_key);
        }
    });
    return result;
}

export function handleInteroperabilityLinks(data, structure) {
    const interoperability_links = structure.interoperability_links.map(s => {
        const incoming = data.interoperability_links.find(il => il.id === s.id);
        const { selected, link } = incoming ? incoming : {};
        return { ...s, selected, link };
    });
    return { interoperability_links };
}

export function retainOnlyIds(form) {
    const result = {};
    fieldToForceToInt.forEach(key => {
        result[key] = form[key].filter(i => !Number.isNaN(parseInt(i, 10)));
    });
    return result;
}

function defaultEmptyCoverageToZero(item) {
    item = { ...item };
    if (isNil(item.clients) && isNil(item.health_workers) && isNil(item.facilities)) {
        return undefined;
    }
    item.clients = isNil(item.clients) ? 0 : item.clients;
    item.health_workers = isNil(item.health_workers) ? 0 : item.health_workers;
    item.facilities = isNil(item.facilities) ? 0 : item.facilities;
    return item;
}

export function handleNationalLevelCoverage({ national_level_deployment }) {
    const n = { ...national_level_deployment };
    return { national_level_deployment: defaultEmptyCoverageToZero(n) };

}

export function handleCoverage({ coverage }) {
    coverage  = coverage ? coverage : [];
    const cov = coverage.map(c => {
        return defaultEmptyCoverageToZero(c);
    }).filter(c => c);
    return { coverage : cov };
}
