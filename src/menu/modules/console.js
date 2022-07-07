const pre = '/console/';

export default {
    path: '/console',
    title: '$t:page.console.title',
    header: 'home',
    custom: 'icon-v5 icon-v5-shouye',
    children: [
        {
            path: `${pre}project`,
            title: '$t:page.console.project.title',
            custom: 'icon-v5 icon-v5-xiangmuzhuye1'
        },
        {
            path: `${pre}device`,
            title: '$t:page.console.device.title',
            custom: 'icon-v5 icon-v5-shebeigaikuang1'
        },
        {
            path: `${pre}topology`,
            title: '$t:page.console.topology.title',
            custom: 'icon-v5 icon-v5-tuoputu1'
        }
    ]
}
