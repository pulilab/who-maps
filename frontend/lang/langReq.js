import axios from 'axios'
export default ln => {
  const base =
    process.server && process.env.NODE_ENV === 'production'
      ? 'http://nginx:9010'
      : ''
  // const base = process.server && process.env.NODE_ENV === 'production' ? '' : ''

  return axios.get(`${base}/translation/json/`, {
    headers: {
      'Accept-Language': ln
    }
  })
}
