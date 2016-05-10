import _template from './EditProfile.html';
import EditProfileController from './EditProfileController';


const editProfileComponent = {
    controller: EditProfileController.editProfileFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'editProfile'
};

export default editProfileComponent;
