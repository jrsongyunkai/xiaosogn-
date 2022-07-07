import BasicLayout from '@/pages/News';

const meta = {
    auth: true,
    title: '消息列表'
};

export default {
    path: '/news',
    name: 'news',
    meta,
    component: BasicLayout
};
