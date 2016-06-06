import { AuthApi } from '../../Common/';

/* global define, URL */

class ProjectPartnersService extends AuthApi {

    constructor(upload) {
        super('');
        this.upload = upload;
    }

    uploadLogo(logo, projectId) {
        this.retrieveToken(true);
        const Authorization = 'Token ' + this.token;
        return this.upload.upload({
            url: `api/projects/${projectId}/partnerlogos/`,
            headers: { Authorization },
            data: { file: logo }
        });
    }

    getLogoList(projectId) {
        return this.get(`projects/${projectId}/partnerlogo-list/`);

    }
    deleteLogo(logoId) {
        return this.del(`partnerlogos/${logoId}/`);
    }
}

export default ProjectPartnersService;
