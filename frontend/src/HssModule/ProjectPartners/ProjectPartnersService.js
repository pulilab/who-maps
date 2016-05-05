import { AuthApi } from '../../Common/';

class ProjectPartnersService extends AuthApi {

    constructor(upload) {
        super('');
        this.upload = upload;
    }

    uploadLogo(logo) {
        this.retrieveToken(true);
        const Authorization = 'Token ' + this.token;
        return this.upload.upload({
            url: 'something',
            headers: { Authorization },
            data: { file: logo }
        });
    }
}

export default ProjectPartnersService;
