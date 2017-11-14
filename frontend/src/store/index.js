import { combineReducers } from 'redux';
import thunk from 'redux-async-thunk';
import user  from './modules/user';
import projects  from './modules/projects';
import system  from './modules/system';
import cms  from './modules/cms';
import countries  from './modules/countries';


const reducers = combineReducers({
    user,
    projects,
    system,
    cms,
    countries
});

const middleware = [thunk];


export {
    reducers,
    middleware
};
