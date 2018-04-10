import { getLanguage, setCatalog, setScope } from '../plugins/language';
import * as ProjectsModule from '../store/modules/projects';
import * as UserModule from '../store/modules/user';
import * as CountryModule from '../store/modules/countries';
import axios from '../plugins/axios';
import Storage from '../Storage';

const storage = new Storage();

function scrollToTopOnSuccess(type, from, to) {
    if (type === 'success' && (from.name !== to.name || to.name === 'editProject')) {
        const mainContent = document.getElementsByClassName('main-content')[0];
        if (mainContent) {
            mainContent.scrollTop = 0;
        }
    }
}

function checkProfile(profile, t) {
    if (!profile || !profile.name || !profile.country || !profile.organisation_id) {
        console.log('You can not navigate to that area without a user profile');
        return t.router.stateService.target('editProfile');
    }
    return Promise.resolve();
}

function setCountryIfEmpty(to, $ngRedux) {
    const state = $ngRedux.getState();
    if (to.name === 'dashboard' && state.countries.currentCountry === null) {
        $ngRedux.dispatch(CountryModule.setCurrentCountry(state.user.profile.country));
    }
}

function setAxiosBaseTokenIfInStorage() {
    const tkn = storage.get('token');
    if (tkn) {
        axios.setAuthToken(tkn);
    }
}

const run = ($rootScope, $state, $mdToast, $mdDialog, $ngRedux, $timeout, $transitions, gettextCatalog) => {
    setCatalog(gettextCatalog);
    setScope($rootScope);
    getLanguage();
    const transitionStart = new Event('RouterTransitionStart');
    const transitionDone = new Event('RouterTransitionDone');
    setAxiosBaseTokenIfInStorage();

    $transitions.onStart({}, () => {
        window.dispatchEvent(transitionStart);
        return Promise.resolve();
    });

    $transitions.onSuccess({}, (t) => {
        scrollToTopOnSuccess(t.from(), t.to());
        setCountryIfEmpty(t.to(), $ngRedux);
        return Promise.resolve();
    });

    $transitions.onError({}, () => {
        return Promise.resolve();
    });

    $transitions.onFinish({}, (t) => {
        const to = t.to();
        window.dispatchEvent(transitionDone);
        $ngRedux.dispatch(ProjectsModule.setCurrentProject(t.params().appName));
        const state = $ngRedux.getState();
        if (to && to.profileRequired) {
            return checkProfile(state.user.profile, t);
        }
        if (to && to.forbidAuthenticated && state.user.token) {
            return t.router.stateService.target('my-projects');
        }
        return Promise.resolve();
    });

    const showPopUp = () => {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Ops! something went wrong, try again later.')
            .position('bottom right')
            .hideDelay(3000)
        );

    };

    let authPopup = undefined;
    const showCredentialsPopUp = async () => {
        const mainUi = window.document.querySelector('ui-view');
        mainUi.style.display = 'none';
        const message = 'You are not logged in or your session has expired, please login again.';
        await $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(false)
            .title('Authentication problem')
            .textContent(message)
            .theme('alert')
            .ariaLabel('Auth problem dialog')
            .ok('Understand')
        );
        mainUi.style.display = '';
        $ngRedux.dispatch(UserModule.doLogout());
        $state.go('login', { location: window.location.pathname });
    };

    const handleAuthProblem = () => {
        if (!authPopup) {
            authPopup = showCredentialsPopUp();
        }
    };

    axios.setShowPopUp(showPopUp.bind(this));
    axios.setHandleAuthProblem(handleAuthProblem.bind(this));

    $ngRedux.subscribe(() => {
        $timeout(() => { $rootScope.$apply(() => { }); }, 100);
    });

    const storeReadyEvent = new CustomEvent('storeSetupReady', { detail: $ngRedux });

    window.dispatchEvent(storeReadyEvent);

};

run.$inject = [
    '$rootScope',
    '$state',
    '$mdToast',
    '$mdDialog',
    '$ngRedux',
    '$timeout',
    '$transitions',
    'gettextCatalog'
];

export { run, scrollToTopOnSuccess, checkProfile, setAxiosBaseTokenIfInStorage };
