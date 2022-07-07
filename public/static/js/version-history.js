export const versionHistory = {
    'current': {
        'deploy_time': '2022-05-19',
        'version_no': 'v6.0.3',
        'content': [
            '1.支持808模块的接入',
            '2.优化了设备类型显示',
            '3.修复了一些BUG'
        ]
    },
    'hislist': [{
                    'deploy_time': '2022-04-07',
                    'version_no': 'v5.7.6-sp2',
                    'content': [
                        '1.修复了一些BUG',
                        '2.接入ZLWW的SIM卡平台'
                    ]
                }, {
                    'deploy_time': '2022-03-23',
                    'version_no': 'v5.7.6',
                    'content': [
                        '1.优化ROLA设备的接入和功能展现的业务',
                        '2.优化nb设备（7858端口）数据上报后下发的指令无法到达的问题',
                        '3.优化ZAC烟感4G在线时长的处理逻辑(区别于NB设备)',
                        '4.优化区间漏电流小时聚合天、天聚合月的计算逻辑(调整为取峰值)',
                        '5.优化区间统计电量处理时节点进线直连标记的识别',
                        '6.实现t30(http)的POSTSTAT机制'
                    ]
                }, {
                    'deploy_time': '2022-03-14',
                    'version_no': 'v5.7.5',
                    'content': [
                        '1.开放数据平台新增对空开远程锁定、解锁、异常分闸解锁的支持',
                        '2.修复了一些BUG'
                    ]
                }, {
                    'deploy_time': '2021-12-30',
                    'version_no': 'v5.7.0',
                    'content': [
                        '1.调整了首屏页部分展现细节',
                        '2.报警列表新增“工单号”列',
                        '3.提醒修改设备的初始密码',
                        '4.修复了一些BUG'
                    ]
                }, {
                    'deploy_time': '2021-12-20',
                    'version_no': 'v5.6.0',
                    'content': [
                        '1.新增一些用能的页面',
                        '2.修复了一些BUG'
                    ]
                }, {
                    'deploy_time': '2021-12-15',
                    'version_no': 'v5.5.3',
                    'content': [
                        '1.新增智能水表的接入',
                        '2.实现电流、电压、温度的A级报警',
                        '3.修复了一些BUG'
                    ]
                }, {
                    'deploy_time': '2021-11-23',
                    'version_no': 'v5.5.2',
                    'content': [
                        '1.优化告警相关查询的性能',
                        '2.新增APP专用单线路历史功率曲线数据接口',
                        '3.新增APP专用项目组的关联项目统计数接口',
                        '4.可设置空开的远程锁定使能',
                        '5.可通过开放接口实现报警使能的配置',
                        '6.支持联动动作配置不同的告警',
                        '7.修复了一些BUG'
                    ]
                }, {
                    'deploy_time': '2021-11-11',
                    'version_no': 'v5.5.0',
                    'content': [
                        '1.可根据开关状态筛选内置定时配置',
                        '2.支持批量对内置定时配置进行修改',
                        '3.空开历史曲线可体现开关的分合闸状态',
                        '4.报预警列表增加了告警类型的筛选条件',
                        '5.优化了部分页中方便弹出设备详情窗',
                        '6.实现了线路列表页勾选态控制逻辑',
                        '7.优化了联动功能可按空开电气值和分合态联合触发',
                        '8.实现了设备内置经纬定时的配置管理',
                        '9.修复了一些BUG'
                    ]
                }, {
                    'deploy_time': '2021-11-03',
                    'version_no': 'v5.4.3',
                    'content': [
                        '1.重构实时数据的处理链逻辑',
                        '2.调整了openapi报警数据提取的时间限制',
                        '3.修复了一些BUG'
                    ]
                }, {
                    'deploy_time': '2021-10-22',
                    'version_no': 'v5.4.0',
                    'content': [
                        '1.优化项目联动配置的归属',
                        '2.优化空开锁定解锁功能的可用性和可见性',
                        '3.实现光照传感设备的接入以及联动支持',
                        '4.优化电气火灾设备列表和详情弹窗状态不一致问题',
                        '5.优化报警数据消费JOB的逻辑',
                        '6.优化设备内置定时的更新和清除逻辑',
                        '7.优化了一些后管的功能',
                        '8.修复了一些BUG'
                    ]
                }, {
                    'deploy_time': '2021-09-16',
                    'version_no': 'v5.3.1',
                    'content': [
                        '1.修复sim卡过期、流量耗尽监测提醒有误的问题',
                        '2.实现恶性负载功率下限的阈值配置',
                        '3.实现后管设备线路分配的批量导入功能',
                        '4.完成时序数据的存储架构切换',
                        '5.修复了一些BUG'
                    ]
                },
                {
                    'deploy_time': '2021-09-07',
                    'version_no': 'v5.3.0',
                    'content': [
                        '1.实现对报警的催促功能',
                        '2.首页增加“离线设备数”的统计值',
                        '3.私有化部署版实现分析报告的功能',
                        '4.实现设备巡检的功能',
                        '5.对app部分接口安全加固处理',
                        '6.实现烟感、燃气设备与开关的联动',
                        '7.实现对设备的线路设置“是否遥控”的配置',
                        '8.升级了时序数据的存储架构',
                        '9.修复了一些BUG'
                    ]
                },
                {
                    'deploy_time': '2021-08-17',
                    'version_no': 'v5.2.3',
                    'content': [
                        '1.优化物业版APP设备列表的排序',
                        '2.完善“调节设备状态数据上报频率”的操作日志描述',
                        '3.修复 定时删除不了的问题'
                    ]
                },
                {
                    'deploy_time': '2021-08-13',
                    'version_no': 'v5.2.1',
                    'content': [
                        '1.修复内置定时编辑时页面报错问题',
                        '2.修复个人版APP维保提交时出现错误',
                        '3.修复拓扑瑞设备协议事件数据解析（压力下限报警消除）的BUG'
                    ]
                },
                {
                    'deploy_time': '2021-08-06',
                    'version_no': 'v5.2.0',
                    'content': [
                        '1.优化将场景下推为内置定时配置的功能',
                        '2.优化内置定时页面的排序等',
                        '3.实现智安城可燃气体探测设备的接入',
                        '4.优化登陆验证码的校验机制',
                        '5.实现设备电量可按“小时”维度查询',
                        '6.实现第三方订阅消息（告警）推送失败的重试机制',
                        '7.实现项目可配置按分组（树形）进行组织',
                        '8.实现不同身份用户配置最新报警的分级可见',
                        '9.优化了后管的一些功能',
                        '10.修复了一些其它可知的BUG'
                    ]
                },
                {
                    'deploy_time': '2021-07-16',
                    'version_no': 'v5.1.4',
                    'content': [
                        '1.修复APP批量删除定时出错的问题',
                        '2.优化告警首选项、推送渠道的配置页新增分页功能'
                    ]
                },
                {
                    'deploy_time': '2021-07-05',
                    'version_no': 'v5.1.2',
                    'content': [
                        '修正了某些通信模块上传的锁状态位'
                    ]
                },
                {
                    'deploy_time': '2021-07-03',
                    'version_no': 'v5.1.1',
                    'content': [
                        '修复了一些轻微的BUG'
                    ]
                },
                {
                    'deploy_time': '2021-07-01',
                    'version_no': 'v5.1.0',
                    'content': [
                        '1.新增基本资料页,可修改真实姓名、电话、邮箱',
                        '2.新增设备上线提醒的预警类型',
                        '3.当空开异常分闸后,远程解锁操作将弹出提示信息',
                        '4.优化空开远程解锁、分/合闸操作的判断机制',
                        '5.优化温度历史趋势页面显示某小时每个空开的温度值',
                        '7.新增空开分闸锁定的功能',
                        '6.新增空开分闸锁定、检修模式的状态识别和使能配置功能',
                        '8.新增空开漏报档位的识别',
                        '9.优化缺相报警的识别（识别电压缺相、电流缺相）',
                        '10.内置定时配置指令下发后可以跟踪反馈结果',
                        '11.空开阈值配置指令下发后可以跟踪反馈结果',
                        '12.优化首页统计值不准确的问题',
                        '13.优化了执行异常时操作日志的收集逻辑',
                        '14.优化了一些后台管理的功能'
                    ]
                },
                {
                    'deploy_time': '2021-06-05',
                    'version_no': 'v5.0.0',
                    'content': [
                        '1.实现版本更新的提示',
                        '2.优化了一些后台管理的功能',
                        '3.分合闸指令下发后可以跟踪反馈结果',
                        '4.实现电器火灾类设备的详情弹窗中,双击曲线区域可弹窗放大曲线的显示'
                    ]
                },
                {
                    'deploy_time': '2021-05-28',
                    'version_no': 'v4.9.2',
                    'content': [
                        '实现分合闸指令下发失败的重试机制'
                    ]
                },
                {
                    'deploy_time': '2021-05-18',
                    'version_no': 'v4.9.1',
                    'content': [
                        '调整设备实时数据历史曲线展现方式，如有报警数值将在曲线上体现'
                    ]
                }
    ]
}