export default function mapLoader (k) {
    return new Promise(function (resolve, reject) {
        if (window.AMap) {
            resolve(window.AMap)
        } else {
            let script = document.createElement('script')
            script.type = 'text/javascript'
            script.async = true
            script.src = 'http://webapi.amap.com/maps?v=2.0&callback=onLoad&key=' + k
            script.onerror = reject
            document.head.appendChild(script)
        }
        window.initAMap = () => {
            resolve(window.AMap)
        }
    })
}
