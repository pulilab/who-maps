export default async function ({ $auth, redirect }) {
  console.log("🚀 ~ file: loginasGuard.js:3 ~ $auth?.user?.is_superuser:", $auth?.user?.is_superuser)
  if (!$auth?.user?.is_superuser) {
    redirect('/')
  }
}

