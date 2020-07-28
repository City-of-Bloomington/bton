export default function ({ store, redirect }) {
  console.log('NUXT MW - Authenticated ::', store.state.authenticated);

  // If the user is not authenticated
  if (!store.state.authenticated) {
    let encodedRedirectURL = encodeURIComponent(`${process.env.apiHost}/auth/verify/`);
    return redirect(`${process.env.cobWebsiteURL}/cas/login?service=${encodedRedirectURL}`);
  }
}