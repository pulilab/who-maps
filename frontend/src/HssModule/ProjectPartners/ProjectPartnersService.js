import { AuthApi } from '../../Common/';

class ProjectPartnersService extends AuthApi {

    constructor(upload) {
        super('');
        this.upload = upload;
    }

    uploadLogo(logo, projectId) {
        this.retrieveToken(true);
        const Authorization = 'Token ' + this.token;
        return this.upload.upload({
            url: `projects/${projectId}/partnerlogos/`,
            headers: { Authorization },
            data: { file: logo }
        });
    }
}

export default ProjectPartnersService;
