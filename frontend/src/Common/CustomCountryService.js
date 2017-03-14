import SimpleApi from './SimpleApi';
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
        this.countryLib = {};
    }

    getSubDomain() {
        const hostArray = window.location.hostname.split('.');
        return hostArray.length > 1 ? hostArray.shift() : 'who';
    }

    getCountry(cn) {
        if (!this.countryLib[cn]) {
            this.countryLib[cn] = {
                serverData: false
            };
        }
        return this.countryLib[cn];
    }
    getCountriesList() {
        return this.get('countries')
            .then(data => {
                return data;
            });
    }
    findCountryById(countryId) {
        const self = this;
        return new Promise(resolve => {
            let country =  _.find(self.countryLib, cn => {
                return cn.id === countryId;
            });
            if (country && country.code) {
                resolve(country);
            }
            else {
                self.getCountriesList().then(countries => {
                    _.forEach(countries, cn => {
                        cn.code = cn.code.toLocaleLowerCase();
                        Object.assign(self.getCountry(cn.code), cn);
                        if (cn.id === countryId) {
                            country = cn;
                        }
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

    fetchMapData(countryCode) {
        const self = this;
        return new Promise(resolve => {
            const country = self.getCountry(countryCode);
            if (country.mapData) {
                resolve(country.mapData);
            }
            this.get(`/static/country-geodata/${countryCode}.json`, true).then(data =>{
                console.log(data);
                country.mapData = data;
                // country
            });
        });

    }

    getCountryFlag(subDomain) {
        const country = this.getCountry(subDomain);
        country.countryFlag = `/static/flags/${subDomain}.png`;
        return country.countryFlag;
    }

    getCountryData(subDomain) {
        const country = this.getCountry(subDomain);
        if (country.serverData) {
            return Promise.resolve(country);
        }
        const fakeData = {
            name: 'Uganda',
            code: 'ug',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/' +
            'Coat_of_arms_of_the_Republic_of_Uganda.svg/955px-Coat_of_arms_of_the_Republic_of_Uganda.svg.png',
            id: 12,
            cover: 'http://www.worldbank.org/content/dam/photos/780x439/2016/oct-3/' +
            'ug-brewing-prosperity-in-uganda-coffee-farmers-turn-to-climate-smart-agriculture-780x439.jpg',
            cover_text: 'some ugandian cover text',
            footer_title: 'footer title',
            footer_text: 'some footer text',
            partner_logo: ['some partner array']
        };
        Object.assign(country, fakeData);
        country.serverData = true;
        return Promise.resolve(country);
    }

    static customCountryServiceFactory() {
        if (!this[singleton]) {
            this[singleton] = new CustomCountryService(singletonEnforcer);
        }
        return this[singleton];
    }
}

export default CustomCountryService.customCountryServiceFactory();
