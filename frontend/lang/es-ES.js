import langReq from './langReq'
export default () => {
  return new Promise(function (resolve) {
    langReq('es').then(res => {
      resolve(res.data.catalog)
    })
  })
}
