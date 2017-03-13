import SimpleApi from './SimpleApi';

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

    getCountryFlag(subDomain) {
        const country = this.getCountry(subDomain);
        country.countryFlag = `http://${window.location.hostname}/static/flags/${subDomain}.png`;
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
            country: 12,
            cover: 'http://www.worldbank.org/content/dam/photos/780x439/2016/oct-3/' +
            'ug-brewing-prosperity-in-uganda-coffee-farmers-turn-to-climate-smart-agriculture-780x439.jpg',
            cover_text: 'some ugandian cover text',
            footer_title: 'footer title',
            footer_text: 'some footer text',
            partner_logo: ['some partner array']
        };
        Object.assign(country, fakeData);
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
