const pre = '/safetyMonitor/';

export default {
    path: '/safetyMonitor',
    title: '$t:page.safetyMonitor.title',
    header: 'home',
    custom: 'icon-v5 icon-v5-anquanjianguan',
    children: [
        {
            path: `${pre}allWarn`,
            title: '全部报警',
            custom: 'icon-v5 icon-v5-quanbubaojing1'
        },
        {
            path: `${pre}leakage`,
            title: '漏电流',
            custom: 'icon-v5 icon-v5-loudianliu1'
        },
        {
            path: `${pre}temperature`,
            title: '温度',
            custom: 'icon-v5 icon-v5-wendu2'
        },
        {
            path: `${pre}leakageWarm`,
            title: '漏电报警',
            custom: 'icon-v5 icon-v5-loudianbaojing1'
        },
        {
            path: `${pre}temperatureWarn`,
            title: '温度报警',
            custom: 'icon-v5 icon-v5-wendubaojing1'
        },
        {
            path: `${pre}leakageSelfChecking`,
            title: '漏保自检',
            custom: 'icon-v5 icon-v5-loubaozijian1'
        },
        {
            path: `${pre}shortCircuitWarn`,
            title: '短路报警',
            custom: 'icon-v5 icon-v5-duanlubaojing1'
        },
        {
            path: `${pre}abnormalVoltage`,
            title: '过欠压',
            custom: 'icon-v5 icon-v5-guoqianya1'
        },
        {
            path: `${pre}abnormalCurrent`,
            title: '过流过载',
            custom: 'icon-v5 icon-v5-guoliuguozai1'
        },
        {
            path: `${pre}SparkWarn`,
            title: '电弧报警',
            custom: 'icon-v5 icon-v5-dianhubaojing1'
        },
        {
            path: `${pre}phaseWarn`,
            title: '三相报警',
            custom: 'icon-v5 icon-v5-sanxiangbaojing1'
        },
        {
            path: `${pre}abnormalState`,
            title: '异常状态',
            custom: 'icon-v5 icon-v5-yichangzhuangtai1'
        },
        {
            path: `${pre}ocWarn`,
            title: '分合闸警示',
            custom: 'icon-v5 icon-v5-fenhezha'
        }
    ]
}
