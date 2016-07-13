import SimpleApi from '../SimpleApi';

/* global Promise */

class ResetService extends SimpleApi {
    constructor() {
        super('rest-auth/password/reset');
    }

    reset(data) {
        let status = 599;

        return this.post('', data)
        .then(answer => {
            status = answer.status;
            return answer.json();
        })
        .then(json => {
            return {
                success: status < 400,
                data: json
            };
        });
    }

}

export default ResetService;
