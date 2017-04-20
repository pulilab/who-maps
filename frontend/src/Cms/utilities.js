import moment from 'moment';

const prettifyDate = ({ date }) => {
    // 3:26 pm — 4 May, 2015
    return moment(date).format('h:m a - d MMM, YYYY');
};

const itemType = (item) => {
    if (item) {
        const typeLib = ['Lessons & Tips', 'Resources', 'Experiences'];
        return typeLib[item.type - 1];
    }
    return '';
};


export default {
    prettifyDate,
    itemType
};
