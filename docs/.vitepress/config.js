module.exports = {
    title: ' flowmix',
    description: 'flowmix开箱即用的多模态可视化解决方案.',
    lastUpdated: true,
    base:'/docz/',
    head: [['meta', { name: 'keywords', content: 'flowmix,文档编辑器, 多模态, 流程编辑器, 工作流, 零代码搭建,可视化搭建' }]],
    themeConfig: {
        logo: '',
        nav: [
          { text: '工作流编辑器', link: 'http://flowmix.turntip.cn/flow' },
          {
            text: '文档搭建引擎',
            link: 'http://flowmix.turntip.cn/docx'
          },
        ],
        socialLinks: [{ icon: "github", link: "https://github.com/MrXujiang" }],
        sidebar: [
            // { text: '产品使用指南', link: '/help' },
            {
              text: 'flowmix/docx文档搭建引擎',
              items: [
                { text: '介绍', link: '/flowmix/index' },
                { text: '快速开始', link: '/flowmix/start' },
                { text: '开发指南', link: '/flowmix/dev' },
                { text: '更新日志', link: '/flowmix/log' },
              ],
              collapsible: true,
              collapsed: false
            },
        ],
        docFooter: { prev: '上一章', next: '下一章' },
        lastUpdatedText: "最近更新时间",
        footer: {
            message: '专注 | 高效 | 深耕可视化场景',
            copyright: 'Copyright © 2024-flowmix产研团队'
          }
      },
  }