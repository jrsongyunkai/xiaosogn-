import { switchHover } from '@/api/public';
import store from '@/store';
import router from '../router'
import { Message } from 'view-design';
import { mapGetters } from 'vuex';
export default {
    timeFommater () {
        let date = new Date()
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        let second = date.getSeconds();
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    getNowFormatDate () {
        let date = new Date()
        let seperator = '-'
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let strDate = date.getDate()
        if (month >= 1 && month <= 9) {
            month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate
        }
        let currentDate = year + seperator + month + seperator + strDate
        return currentDate
    },
    getCurrentYearMonth () {
        let date = new Date()
        let seperator = '-'
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        if (month >= 1 && month <= 9) {
            month = '0' + month
        }
        let current = year + seperator + month
        return current
    },
    getFuTime (date, time) {
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        if (month >= 1 && month <= 9) {
            month = '0' + month
        }
        if (time === 'month') {
            return year + '-' + month
        } else if (time === 'date') {
            return year + '-' + month + '-' + strDate
        } else if (time === 'hour') {
            return year + '-' + month + '-' + strDate + ' ' + hour
        } else if (time === 'year') {
            return year + ''
        }
    },
    getYearMonth (date, time) {
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        if (month >= 1 && month <= 9) {
            month = '0' + month
        }
        if (time === 'year') {
            return year + ''
        } else if (time === 'all') {
            return year + '-' + month
        } else if (time === 'month') {
            return month + ''
        }
    },
    getNowFormatDateTime (e) {
        let date = new Date()
        let seperator = '-'
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let strDate = date.getDate()
        let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        if (month >= 1 && month <= 9) {
            month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate
        }
        if (e === 'time') {
            let currentDate = [hour, minute, second].join(':')
            return currentDate
        } else {
            let currentDate = year + seperator + month + seperator + strDate + ' ' + [hour, minute, second].join(':')
            return currentDate
        }
    },
    formatDate (format, time) {
        let date = new Date(time)
        let seperator = '-'
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let strDate = date.getDate()
        let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        if (month >= 1 && month <= 9) {
            month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate
        }
        let formatDate
        if (format === 'yyyy-MM-dd HH:mm:ss') {
            formatDate = year + seperator + month + seperator + strDate + ' ' + [hour, minute, second].join(':')
        } else if (format === 'yyyy-MM-dd') {
            formatDate = year + seperator + month + seperator + strDate
        } else if (format === 'HH:mm') {
            formatDate = [hour, minute].join(':')
        } else if (format === 'yyyy-MM-dd HH') {
            formatDate = year + seperator + month + seperator + strDate + ' ' + hour
        }
        return formatDate
    },
    getDaysBetween (dateString1, dateString2) {
        let startDate = dateString1
        let endDate = dateString2
        let days = Math.floor((endDate - startDate) / (1 * 24 * 60 * 60 * 1000))
        return days
    },
    getMonthText (date) {
        if (!date) return
        let monthText = date.split('-')[1]

        let _lang = localStorage.getItem('locale')
        if (monthText === '01') {
            return '??????'
        } else if (_lang === 'en') {
            return 'January'
        }
        if (monthText === '02') {
            return '??????'
        } else if (_lang === 'en') {
            return 'February'
        }
        if (monthText === '03') {
            return '??????'
        } else if (_lang === 'en') {
            return 'March'
        }
        if (monthText === '04') {
            return '??????'
        } else if (_lang === 'en') {
            return 'April'
        }
        if (monthText === '05') {
            return '??????'
        } else if (_lang === 'en') {
            return 'May'
        }
        if (monthText === '06') {
            return '??????'
        }
        if (monthText === '07') {
            return '??????'
        }
        if (monthText === '08') {
            return '??????'
        }
        if (monthText === '09') {
            return '??????'
        }
        if (monthText === '10') {
            return '??????'
        }
        if (monthText === '11') {
            return '?????????'
        }
        if (monthText === '12') {
            return '?????????'
        }
    },
    checkDateOneYear (start, end) {
        let diff = new Date(end).getTime() - new Date(start).getTime() - (366 * 24 * 60 * 60 * 1000)
        let result = diff <= 0 ? 'true' : 'false'
        return result
    },
    checkDateOneMonth (start, end) {
        let diff = new Date(end).getTime() - new Date(start).getTime() - (30 * 24 * 60 * 60 * 1000)
        let result = diff <= 0 ? 'true' : 'false'
        return result
    },
    checkPhone (phone) {
        let tel = /^(\+?[0-9]{2,4}-)?[0-9]{2,15}$/
        if (tel.test(phone)) {
            return phone
        }
    },
    checkDateThreeMonths (start, end) {
        let diff = new Date(end).getTime() - new Date(start).getTime() - (91 * 24 * 60 * 60 * 1000)
        let result = diff <= 0 ? 'true' : 'false'
        return result
    },
    checkDataType (val) {
        return val === undefined || val === ''
    },
    globalizationAlarmTypes (type) {
        switch (type) {
        case '????????????':
            type = 'types.shortCircuitA'
            break
        case '????????????':
            type = 'types.leakageA'
            break
        case '????????????':
            type = 'types.overpressureA'
            break
        case '????????????':
            type = 'types.overloadA'
            break
        case '????????????':
            type = 'types.overcurrentA'
            break
        case '????????????':
            type = 'types.undervoltageA'
            break
        case '????????????':
            type = 'types.temperatureA'
            break
        case '????????????':
            type = 'types.temperatureW'
            break
        case '????????????':
            type = 'types.surgeA'
            break
        case '????????????':
            type = 'types.fireA'
            break
        case '??????????????????':
            type = 'types.leakageProtectionNormal'
            break
        case '????????????????????????':
            type = 'types.leakageProtectionNormal'
            break
        case '?????????????????????':
            type = 'types.leakageProtectionSelfTestNotCompleted'
            break
        case '???????????????????????????':
            type = 'types.leakageProtectionSelfTestNotCompleted'
            break
        case '????????????':
            type = 'types.leakageW'
            break
        case '????????????':
            type = 'types.currentW'
            break
        case '????????????':
            type = 'types.overpressureW'
            break
        case '????????????':
            type = 'types.undervoltageW'
            break
        case '????????????':
            type = 'types.communicationA'
            break
        case '????????????':
            type = 'types.missingPhaseA'
            break
        case '??????????????????':
            type = 'types.threePhaseSequenceA'
            break
        case '???????????????????????????':
            type = 'types.threePhaseImbalanceA'
            break
        case '????????????':
            type = 'types.offlineA'
            break
        case '????????????':
            type = 'types.configureA'
            break
        case '????????????':
            type = 'types.powerFailureA'
            break
        case '????????????':
            type = 'types.unpackingA'
            break
        case '????????????':
            type = 'types.linkageA'
            break
        case '????????????':
            type = 'types.smokeA'
            break
        case '????????????':
            type = 'types.pressureA'
            break
        case '????????????':
            type = 'types.liquidLevelA'
            break
        case '????????????':
            type = 'types.openingW'
            break
        case '????????????':
            type = 'types.closingW'
            break
        case '????????????':
            type = 'types.abnormalOpening'
            break
        case '????????????':
            type = 'types.humidityA'
            break
        }
        return type
    },
    routeWhiteList () {
        return ['/']
    },
    windowCountDown (url) {
        let TIME_COUNT = 59
        let count = TIME_COUNT
        let myWindow = window.open('', '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, titlebar=no, scrollbars=yes, resizable=no, copyhistory=yes, width=400, height=400')
        myWindow.document.write(`<div style="text-align: center;margin-top: 160px;font-size: 20px"><p>????????????????????????????????????!</p><p>??????<span id="count-down">${count}</span>??????????????????</p></div>`)
        myWindow.location.href = url
        let windowTime = setInterval(() => {
            if (count > 0 && count <= TIME_COUNT) {
                count--
                myWindow.document.getElementById('count-down').innerHTML = count
            } else {
                myWindow.close()
                clearInterval(windowTime)
                windowTime = null
            }
        }, 1000)
    },
    BD09_To_GCJ02 (lat, lng) {
        var xPi = 3.14159265358979324 * 3000.0 / 180.0
        var x = lng - 0.0065
        var y = lat - 0.006
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPi)
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPi)
        var lngs = z * Math.cos(theta)
        var lats = z * Math.sin(theta)
        return { lng: lngs, lat: lats }
    },
    GCJ02_To_BD09 (lat, lng) {
        var xPi = 3.14159265358979324 * 3000.0 / 180.0
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * xPi)
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * xPi)
        var lngs = z * Math.cos(theta) + 0.0065
        var lats = z * Math.sin(theta) + 0.006
        return { lng: lngs, lat: lats }
    },
    setCookie (name, value) {
        let days = 30
        let exp = new Date()
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000)
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
    },
    getCookie (name) {
        let _cookie = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
        return _cookie ? _cookie[2] : null
    },
    ctxPaths () {
        var ctxName = ''
        var hostName = document.location.protocol + '//' + window.location.host
        var ctxPaths = hostName + ctxName // ????????????????????????
        return ctxPaths
    },

    switchToProject (obj, url, type) {
        let params = {
            projectCode: obj.projectCode
        };
        switchHover(params)
            .then(function (res) {
                if (res.success) {
                    var filterSider = store.getters['admin/menu/filterSider'];
                    store.commit('filterSiders', filterSider)
                    store.commit('projectCode', obj.projectCode);
                    store.commit('fullName', obj.projectName);
                    store.commit('distributionDateType', 1);
                    store.commit('prjTitle', res.data.prjTitle)
                    store.commit('prjName', res.data.prjName)
                    store.commit('switchData', res.data)

                    if (type === '1') {
                        router.push({
                            name: url,
                            params: {
                                projectCode: obj.projectCode,
                                status: 0,
                                workOrderType: 1
                            }
                        })
                    } else if (type === '2') {
                        router.push({
                            name: url,
                            params: {
                                projectCode: obj.projectCode,
                                status: 1,
                                workOrderType: 1
                            }
                        })
                    } else {
                        router.push({ path: url });
                    }
                } else if (res.code === '-1') {
                } else {
                    Message.error({
                        content: res.message
                    });
                }
            })
    }
}
