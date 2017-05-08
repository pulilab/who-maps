import AuthApi  from '../Common/AuthApi';

/* global Promise, URL */

class NewProjectService extends AuthApi {
    constructor(_upload) {
        super('');
        this.upload = _upload;
    }

    async newProject(data) {
        let status = void 0;
        try {
            const answer = await this.post('projects/', data);
            status = answer.status;
            const json = await answer.json();
            return {
                success: status < 400,
                data: json
            };
        }
        catch (answer) {
            return {
                success: false,
                data: answer
            };
        }
    }

    getGroups(projectId) {
        return this.get(`projects/${projectId}/groups/`)
          .then(answer => {
              return {
                  success: answer.status < 400,
                  data: answer
              };
          });
    }

    putGroups(projectId, team, viewers) {
        const ret = {
            team: team.map(el => el.id),
            viewers: viewers.map(el => el.id)
        };
        return this.put(`projects/${projectId}/groups/`, ret);
    }

    saveCountryFields(fields, country_id, project_id) {
        return this.post(`country-fields/${country_id}/${project_id}/`, { fields });
    }

    async updateProject(data, id) {
        let status = void 0;
        try {
            const answer = await this.put(`projects/${id}/`, data);
            status = answer.status;
            const json = await answer.json();
            return {
                success: status < 400,
                data: json
            };
        }
        catch (answer) {
            return {
                success: false,
                data: answer
            };
        }
    }


    autocompleteProjectName(name) {
        const data = {
            health_topic: false,
            location: false,
            organisation: false,
            project_name: true,
            query: name,
            technology_platform: false
        };
        return this.post('search/projects/', data)
          .then(results => {
              return results.json();
          });
    }
}

export default NewProjectService;
