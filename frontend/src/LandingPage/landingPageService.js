import SimpleApi from '../Common/SimpleApi';

/* global Promise */

class LandingPageService extends SimpleApi {
    constructor() {
        super('');
    }

    getCountryData(subDomain) {
        console.log(subDomain);
        const fakeData = {
            name: 'Uganda',
            code: 'ugaUga',
            logo: 'https://www.brandsoftheworld.com/sites/default/files/styles/' +
            'logo-thumbnail/public/112012/uganda_court_of_arms.png?itok=jqLQf5v-',
            country: 12,
            cover: 'http://www.worldbank.org/content/dam/photos/780x439/2016/oct-3/' +
            'ug-brewing-prosperity-in-uganda-coffee-farmers-turn-to-climate-smart-agriculture-780x439.jpg',
            cover_text: 'some ugandian cover text',
            footer_title: 'footer title',
            footer_text: 'some footer text',
            partner_logo: ['some partner array']
        };
        return Promise.resolve(fakeData);
    }
}

export default LandingPageService;
