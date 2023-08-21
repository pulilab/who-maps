export default async function ({ $auth, redirect }) {
  if (!$auth?.user?.is_superuser) {
    redirect('/')
  }
}

