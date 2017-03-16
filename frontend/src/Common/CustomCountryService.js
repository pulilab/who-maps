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
    }

    getSubDomain() {
        const hostArray = window.location.hostname.split('.');
        return hostArray.length > 1 ? hostArray.shift() : 'who';
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

    getCountries() {
        const self = this;
        return new Promise(resolve=> {
            const keys = _.keys(self.countryLib);
            if (keys > 0) {
                const countryArray = _.values(_.cloneDeep(self.countryLib));
                resolve(self.stripMapData(countryArray));
            }
            else {
                self.getCountriesList().then(countries => {
                    resolve(self.stripMapData(_.values(countries)));
                });
            }
        });
    }

    getCountriesList() {
        const self = this;
        return this.get('countries')
            .then(countries => {
                _.forEach(countries, cn => {
                    cn.code = cn.code.toLocaleLowerCase();
                    cn.flag = self.getCountryFlag(cn.code);
                    self.countryLib[cn.code] = self.countryLib[cn.code] ? self.countryLib[cn.code] : {};
                    Object.assign(self.countryLib[cn.code], cn);
                });
                this.store.set('countryLib', self.countryLib);
                return _.cloneDeep(self.countryLib);
            });
    }
    findCountryById(countryId) {
        const self = this;
        return new Promise(resolve => {
            let country = _.find(self.countryLib, cn => {
                return cn.id === countryId;
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
        return self.findCountryById(countryId).then(country => {
            return self.fetchMapData(country.code);
        });
    }

    getCountryDistricts(countryId) {
        const self = this;
        return new Promise(resolve => {
            self.findCountryById(countryId).then(country => {
                if (country.mapData) {
                    resolve(_.cloneDeep(country.districts));
                }
                else {
                    self.fetchMapData(country.code).then((cn)=> {
                        resolve(_.cloneDeep(cn.districts));
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

    getCountryData(subDomain) {
        const self = this;
        return new Promise(resolve => {
            self.getCountry(subDomain).then(country=> {
                if (country.logo) {
                    resolve(Object.assign({}, country));
                }
                else {
                    const fakeData = {
                        name: 'Uganda',
                        code: 'ug',
                        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/' +
                        'Coat_of_arms_of_the_Republic_of_Uganda.svg/' +
                        '955px-Coat_of_arms_of_the_Republic_of_Uganda.svg.png',
                        id: 12,
                        cover: 'http://www.worldbank.org/content/dam/photos/780x439/2016/oct-3/' +
                        'ug-brewing-prosperity-in-uganda-coffee-farmers-turn-to-climate-smart-agriculture-780x439.jpg',
                        cover_text: 'some ugandian cover text',
                        footer_title: 'footer title',
                        footer_text: 'some footer text',
                        partner_logo: ['some partner array']
                    };
                    Object.assign(country, fakeData);
                    this.store.set('countryLib', self.countryLib);
                    resolve(Object.assign({}, country));
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
