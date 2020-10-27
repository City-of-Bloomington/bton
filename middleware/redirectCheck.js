import axios from 'axios'

export default function ({ redirect, route }) {
  let routeId,
   rawRouteId = route.params.id;

  rawRouteId.endsWith('+') ?
    routeId = rawRouteId.slice(0, -1) :
    routeId = route.params.id;

  // this causes an extra hit count to be tallied,
  // we could use vuex and access the data instead ...
  // reducing the extra GET
  return axios.get(`${process.env.apiHost}/api/short/${routeId}`)
    .then(res => {
      if(!res.data.delayPreview) {
        if (rawRouteId.endsWith('+')) {
          return
        } else {
          return redirect(res.data.url)
        }
      } else { return }
    })
    .catch(e => { return });
}