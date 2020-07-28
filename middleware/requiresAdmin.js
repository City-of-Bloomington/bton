export default function ({ store, redirect }) {
  let isUser = store.state.user != null && store.state.user.user != null;

  if(isUser) {
    let isAdmin = store.state.user.user.role == 'admin';

    console.log(`NUXT MW - requiresAdmin :: ${isAdmin} :: User is ${store.state.user.user.role}`);

    if (!isAdmin)
      return redirect(process.env.clientHost)
  } else {
    return redirect(process.env.clientHost)
  }
}