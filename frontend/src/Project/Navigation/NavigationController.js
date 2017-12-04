import forEach from 'lodash/forEach';
import * as ProjectModule from '../../store/modules/projects';
class NavigationController {

    constructor($element, $state, $ngRedux) {
        this.EE = window.EE;
        this.element = $element;
        this.state = $state;
        this.$ngRedux = $ngRedux;
        this.scrollTo = this.scrollTo.bind(this);
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.scrollHandler = this.scrollHandler.bind(this);
        this.mapState = this.mapState.bind(this);
    }

    onInit() {
        this.content = window.document.getElementsByClassName('main-content')[0];
        this.content.addEventListener('scroll', this.scrollHandler);
        this.EE.on('activateFieldSet', this.activateNavigation, this);
        this.unsubscribe = this.$ngRedux.connect(this.mapState, ProjectModule)(this);
    }

    onDestroy() {
        this.EE.removeListener('activateFieldSet', this.activateNavigation);
        this.unsubscribe();
    }

    mapState(state) {
        const countryFields = ProjectModule.getProjectCountryFields(state)(!this.isPublished);
        return {
            countryFields
        };
    }

    activateNavigation(hash) {
        const navigation = this.element[0].getElementsByTagName('li');
        forEach(navigation, element => {
            if (element.classList.contains(hash)) {
                element.classList.add('active');
            }
            else {
                element.classList.remove('active');
            }
        });
    }

    scrollHandler() {
        if (this.content.scrollTop > 260) {
            this.element[0].style.position = 'fixed';
            this.element[0].style.top = '70px';
        }
        else {
            this.element[0].style.position = 'absolute';
            this.element[0].style.top = '0px';
        }
    }

    scrollTo(hash) {
        this.EE.emit('projectScrollTo', hash);
    }

    goTo(editMode) {
        if (editMode === 'draft' || editMode === 'publish' && this.project.hasPublishedVersion) {
            this.state.go(this.state.current.name, { editMode });
        }
    }

    saveDraft(e) {
        e.preventDefault();
        this.EE.emit('projectSaveDraft');
    }

    discardDraft(e) {
        e.preventDefault();
        this.EE.emit('projectDiscardDraft');
    }

    static navigationFactory() {
        require('./Navigation.scss');
        function navigation($element, $state, $ngRedux) {
            return new NavigationController($element, $state, $ngRedux);
        }
        navigation.$inject = ['$element', '$state', '$ngRedux'];
        return navigation;
    }
}

export default NavigationController;
