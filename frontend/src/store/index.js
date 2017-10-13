import { combineReducers } from 'redux';
import thunk from 'redux-async-thunk';
import { createLogger } from 'redux-logger';
import user  from './modules/user';
import projects  from './modules/projects';

const logger = createLogger();

const reducers = combineReducers({
    user,
    projects
});

const middleware = [thunk, logger];


export {
    reducers,
    middleware
};
