export const loadScript = (id, url, callback?) => {
  if (document.getElementById(id) && callback) {
    callback()
  } else {
    const script = document.createElement('script')
    script.setAttribute('id', id)
    script.type = 'text/javascript'

    if (callback) {
      script.onload = () => callback()
    }

    script.src = url
    document.getElementsByTagName('head')[0].appendChild(script)
  }
}
