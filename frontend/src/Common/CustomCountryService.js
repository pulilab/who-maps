import SimpleApi from './SimpleApi';
import Storage from './Storage';
import _ from 'lodash';
/* global Promise, Symbol */

const singleton = Symbol();
const singletonEnforcer = Symbol();

class CustomCountryService extends SimpleApi {
    constructor(enforcer) {
        super('');
        if (enforcer !== singletonEnforcer) {
            const error = { error: 'Cannot construct singleton' };
            throw error;
        }
        this.store = new Storage();
        const savedStore = this.store.get('countryLib');
        this.countryLib = savedStore ? savedStore : {};
        this.location = window.location;
    }

    getSubDomain() {
        const defaultDomain = 'who';
        const hostArray = this.location.hostname.split('.');
        const subDomain = hostArray.length > 1 ? hostArray.shift() : defaultDomain;
        if (subDomain !== defaultDomain && subDomain.length !== 2) {
            return defaultDomain;
        }
        return subDomain;
    }

    getCountry(cn) {
        const self = this;
        return new Promise(resolve => {
            if (self.countryLib[cn]) {
                resolve(self.countryLib[cn]);
            }
            else {
                self.getCountriesList().then(countries => {
                    resolve(countries[cn]);
                });
            }
        });
    }

    stripMapData(countries) {
        return _.map(countries, country => {
            country.mapData = null;
            return country;
        });
    }

    abcOrder(collection) {
        return collection.sort((a, b) => {
            a = a.name ? a.name : a;
            b = b.name ? b.name : b;
            return a.localeCompare(b);
        });
    }

    getCountries() {
        const self = this;
        return new Promise(resolve => {
            const keys = _.keys(self.countryLib);
            if (keys.length > 0) {
                let countryArray = _.values(_.cloneDeep(self.countryLib));
                countryArray = self.abcOrder(countryArray);
                resolve(self.stripMapData(countryArray));
            }
            else {
                self.getCountriesList().then(countries => {
                    let countryArray = self.stripMapData(_.values(countries));
                    countryArray = self.abcOrder(countryArray);
                    resolve(countryArray);
                });
            }
        });
    }

    prettyName(name) {
        const split = name.split('-');
        return split.join(' ');
    }

    getCountriesList() {
        const self = this;
        if (!this.countryListPromise
            || this.countryListPromise.promiseDone) {
            this.countryListPromise = this.get('countries/');
            this.countryListPromise.promiseDone = false;
        }
        return this.countryListPromise.then(countries => {
            _.forEach(countries, cn => {
                cn.code = cn.code.toLocaleLowerCase();
                cn.flag = self.getCountryFlag(cn.code);
                cn.prettyName = self.prettyName(cn.name);
                self.countryLib[cn.code] = self.countryLib[cn.code] ? self.countryLib[cn.code] : {};
                Object.assign(self.countryLib[cn.code], cn);
            });
            this.store.set('countryLib', self.countryLib);
            self.countryListPromise.promiseDone = true;
            return _.cloneDeep(self.countryLib);
        });
    }

    findCountryId(countryName) {
        return this.findCountry(countryName).then(country => {
            return country.id;
        });
    }

    findCountry(countryId) {
        const self = this;
        return new Promise(resolve => {
            let country = _.find(self.countryLib, cn => {
                return cn.id === countryId || cn.name === countryId;
            });
            if (country && country.code) {
                resolve(country);
            }
            else {
                self.getCountriesList().then(countries => {
                    country = _.find(countries, cn => {
                        return cn.id === countryId;
                    });
                    resolve(country);
                });
            }
        });

    }
    getCountryMapData(countryId) {
        const self = this;
        return self.findCountry(countryId).then(country => {
            return self.fetchMapData(country.code);
        });
    }

    getCountryDistricts(countryId) {
        const self = this;
        return new Promise(resolve => {
            self.findCountry(countryId).then(country => {
                if (country.mapData) {
                    resolve(_.cloneDeep(self.abcOrder(country.districts)));
                }
                else {
                    self.fetchMapData(country.code).then((cn)=> {
                        resolve(_.cloneDeep(self.abcOrder(cn.districts)));
                    });
                }
            });
        });
    }

    fetchMapData(countryCode) {
        const self = this;
        return new Promise(resolve => {
            self.getCountry(countryCode).then(country =>{
                if (country.mapData) {
                    resolve(Object.assign({}, country));
                }
                else {
                    this.get(`/static/country-geodata/${countryCode}.json`, true).then(data => {
                        country.mapData = data;
                        const subKey = _.keys(data.objects)[0];
                        country.districts = _.map(data.objects[subKey].geometries, object => {
                            return object.properties['name:en'] || object.properties.name;
                        });
                        this.store.set('countryLib', self.countryLib);
                        resolve(Object.assign({}, country));
                    });
                }
            });
        });
    }


    getCountryFlag(subDomain) {
        return `/static/flags/${subDomain}.png`;
    }

    sendDefaultCountryData(data) {
        data = data ? data : {};
        const standard = {
            name: 'WHO',
            code: 'who',
            logo: false,
            cover: '',
            cover_text: 'This Digital Health Atlas aims to strengthen the value and impact of' +
            ' digital health investments, improve coordination,' +
            ' and facilitate institutionalization and scale.',
            footer_title: 'customizable footer title',
            footer_text: '(Editable preset text) Lorem ipsum dolor sit amet, consectetur ' +
            'adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.' +
            'Curabitur est gravida et libero vitae dictum. Ab illo tempore, ab est sed immemorabili.' +
            'Quisque ut dolor gravida, placerat libero vel, euismod. Fictum, ' +
            'deserunt mollit anim laborum astutumque!',
            partner_logos: ['https://pbs.twimg.com/media/C2XXpKRUsAAXHWt.jpg',
                'https://pbs.twimg.com/media/C2XXpKRUsAAXHWt.jpg',
                'https://pbs.twimg.com/media/C2XXpKRUsAAXHWt.jpg',
                'https://pbs.twimg.com/media/C2XXpKRUsAAXHWt.jpg']
        };
        _.forEach(standard, (standardValue, key) => {
            const value = data[key];
            if (value === null || value === undefined || value === '') {
                data[key] = standardValue;
            }
        });
        return data;
    }

    getCountryData(subDomain) {
        const self = this;
        return new Promise(resolve => {
            if (subDomain === 'who') {
                resolve(self.sendDefaultCountryData());
                return;
            }
            self.getCountry(subDomain).then(country=> {
                if (country && country.logo) {
                    resolve(Object.assign({}, country));
                }
                else {
                    if (!self.countyDataPromise || self.countyDataPromise.promiseDone) {
                        self.countyDataPromise = self.get(`landing/${subDomain.toUpperCase()}/`);
                    }
                    self.countyDataPromise.then(data => {
                        country = Object.assign({}, country, data);
                        resolve(self.sendDefaultCountryData(country));
                    }).catch(() => {
                        resolve(self.sendDefaultCountryData());
                    });
                }

            });
        });

    }

    static customCountryServiceFactory() {
        if (!this[singleton]) {
            this[singleton] = new CustomCountryService(singletonEnforcer);
        }
        return this[singleton];
    }
}

export default CustomCountryService.customCountryServiceFactory();
