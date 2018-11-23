export const fetchProjectData = async (store, params, error) => {
  try {
    await store.dispatch('projects/setCurrentProject', params.id);
    await Promise.all([
      store.dispatch('project/loadProject', params.id),
      store.dispatch('projects/loadProjectStructure')
    ]);
  } catch (e) {
    error({
      response: {
        status: 404,
        statusText: 'This project does not exist'
      }
    });
    return Promise.reject(e);
  }
};
