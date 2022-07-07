const pre = '/energyMonitor/';

export default {
    path: '/energyMonitor',
    title: '$t:page.energyMonitor.title',
    header: 'home',
    custom: 'icon-v5 icon-v5-jieneng',
    children: [
        {
            path: `${pre}power`,
            title: '$t:page.energyMonitor.power.title',
            custom: 'icon-v5 icon-v5-dianliang1'
        },
        {
            path: `${pre}load`,
            title: '$t:page.energyMonitor.load.title',
            custom: 'icon-v5 icon-v5-fuzai1'
        },
        {
            path: `${pre}period`,
            title: '$t:page.energyMonitor.period.title',
            custom: 'icon-v5 icon-v5-fenshiduandianliang1'
        },
        {
            path: `${pre}report`,
            title: '$t:page.energyMonitor.report.title',
            custom: 'icon-v5 icon-v5-dianliangbaobiao'
        },
        {
            path: `${pre}price`,
            title: '$t:page.energyMonitor.price.title',
            custom: 'icon-v5 icon-v5-dianjiapeizhi'
        }

    ]
}
