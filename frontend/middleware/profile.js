export default async function ({ store, redirect, app, route, $auth }) {
  const profile = $auth.$state.user
  const donorTypes = ['D', 'DA', 'SDA']
  const routeName = route.name.split('___')[0]
  if (
    routeName !== 'organisation-edit-profile' &&
    profile &&
    (!profile.name ||
      !profile.country ||
      !profile.organisation ||
      !profile.account_type ||
      (
        donorTypes.includes(profile.account_type) &&
        !profile.donor
      )
    )
  ) {
    const path = app.localePath({ name: 'organisation-edit-profile', params: route.params, query: { missingProfile: true } })
    redirect(path)
  }
};
