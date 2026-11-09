import { rt_ctx } from "@lm_fe/env";
import { IDynConfItem } from "@lm_fe/pages";
var ctx = rt_ctx

var conf: IDynConfItem[] = [
  {
    colProps: { span: 12, },

    inputType: 'tabs',
    containerProps: {
      style: { height: '42vh' }
    },

    children: [
      {
        title: '高危分布',
        children: [
          {
            inputType: 'segs',
            inputProps: {
              size: 'small',
            },
            colProps: { span: 24, },

            children: [
              {
                title: '等级分布',
                children: [
                  {
                    colProps: { span: 24, },

                    inputType: 'echarts',
                    dataSource: {
                      url: '/api/search/HIGHRISK_DISTRIBUTION/DISEASE_SITUATION?startDate=2026-09-01&endDate=2026-09-30'
                    },

                    inputProps: {
                      style: { height: '28vh' }
                    },
                    initialSearchValue() {
                      return {
                        date: ctx.utils.getMomentRange()['本月'].map(ctx.utils.formatDate),
                      }
                    },

                    render: function (data, echart) {
                      var option = {
                        tooltip: {
                          trigger: 'axis',
                          axisPointer: {
                            type: 'shadow'
                          }
                        },
                        legend: {},
                        xAxis: [
                          {
                            type: 'category',
                            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                          }
                        ],
                        yAxis: [
                          {
                            type: 'value'
                          }
                        ],
                        series: [
                          {
                            name: 'Direct',
                            type: 'bar',
                            emphasis: {
                              focus: 'series'
                            },
                            data: [320, 332, 301, 334, 390, 330, 320]
                          },
                          {
                            name: 'Email',
                            type: 'bar',
                            stack: 'Ad',
                            emphasis: {
                              focus: 'series'
                            },
                            data: [120, 132, 101, 134, 90, 230, 210]
                          },


                          {
                            name: 'Google',
                            type: 'bar',
                            stack: 'Search Engine',
                            emphasis: {
                              focus: 'series'
                            },
                            data: [120, 132, 101, 134, 290, 230, 220]
                          },
                          {
                            name: 'Bing',
                            type: 'bar',
                            stack: 'Search Engine',
                            emphasis: {
                              focus: 'series'
                            },
                            data: [60, 72, 71, 74, 190, 130, 110]
                          },
                          {
                            name: 'Others',
                            type: 'bar',
                            stack: 'Search Engine',
                            emphasis: {
                              focus: 'series'
                            },
                            data: [62, 82, 91, 84, 109, 110, 120]
                          }
                        ]
                      };

                      echart.clear();
                      echart.setOption(option, true);
                    }
                  },
                ]
              },
              {
                title: '病种情况',
                children: [
                  {
                    colProps: { span: 24, },
                    inputType: 'echarts',
                    dataSource: {
                      url: '/api/search/HIGHRISK_DISTRIBUTION/DISEASE_SITUATION?startDate=2026-09-01&endDate=2026-09-30'
                    },

                    inputProps: {
                      style: { height: '28vh' }
                    },
                    initialSearchValue() {
                      return {
                        date: ctx.utils.getMomentRange()['本月'].map(ctx.utils.formatDate),
                      }
                    },
                    searchConfig: [
                      { inputType: 'rangeDate', name: 'date', label: '住院号', inputProps: { quick_selector: ['本月', '本季', '今年'] } }
                    ],
                    render: function (data, echart) {
                      var option = {
                        xAxis: {
                          type: 'category',
                          data: data.statistics.map(function (item) { return item.name }),
                          axisLabel: {
                            //坐标轴刻度标签的相关设置
                            interval: 0,
                          },
                        },
                        yAxis: {
                          type: 'value',
                        },
                        grid: {
                          top: '60px',
                          bottom: '60px',
                          left: '5%',
                          right: '5%',
                        },
                        series: [
                          {
                            data: data.statistics.map(function (item) { return item.count }),
                            type: 'bar',
                          },
                        ],
                      }

                      echart.clear();
                      echart.setOption(option, true);
                    }
                  },
                ]
              },
            ]


          },
        ]
      },
      {
        title: '复诊率',
        children: [
          {
            colProps: { span: 24, },

            inputType: 'table',
            dataSource: {
              url: '/api/search/HIGHRISK_DISTRIBUTION/GRADE_DISTRIBUTION?startDate=2026-08-01&endDate=2026-09-01'
            },

            inputProps: {
              size: 'small',
              pagination: false,
              columns: [
                {
                  title: '高危等级',
                  dataIndex: 'name',
                },
                {
                  title: '所占比（%）',
                  dataIndex: 'rate',
                },
                {
                  title: '人数（人）',
                  dataIndex: 'count',
                },
              ]
            },
            initialSearchValue() {
              return {
                date: ctx.utils.getMomentRange()['本月'].map(ctx.utils.formatDate),
              }
            },
            searchConfig: [
              { inputType: 'rangeDate', name: 'date', label: '住院号', inputProps: { quick_selector: ['本月', '本季', '今年'] } }
            ],
            render: function (data) {
              return data?.statistics

            }
          },


        ]
      },
    ],
  },

  {
    colProps: { span: 12, },
    inputType: 'grid',

    containerProps: {
      style: { height: '42vh' }
    },

    children: [
      {
        colProps: { span: 24, },

        inputType: 'title',
        inputProps: {
        },
        render: function (data,) {
          return [
            {
              label: '已审核',
              value: 22
            },
            {
              label: '预约今日复诊',
              value: 99
            },
          ]
        },
      },
      {

        colProps: { span: 24, },

        inputType: 'table',
        dataSource: {
          url: '/api/search/HIGHRISK_DISTRIBUTION/GRADE_DISTRIBUTION?startDate=2026-08-01&endDate=2026-09-01'
        },

        inputProps: {
          size: 'small',
          pagination: false,
          columns: [
            {
              title: '姓名',
              dataIndex: 'name',
            },
            {
              title: '职称',
              dataIndex: 'title',
            },
            {
              title: '接诊总数（人）',
              dataIndex: 'count_total',
            },
            {
              title: '接诊类型',
              children: [
                {
                  title: '首诊',
                  dataIndex: 'count_ivisit',
                  key: 'count_ivisit',
                },
                {
                  title: '复诊',
                  dataIndex: 'count_rvisit',
                  key: 'count_rvisit',
                },
                {
                  title: '产后复诊',
                  dataIndex: 'count_postpartumVisit',
                  key: 'count_postpartumVisit',
                },
              ],
            },
            {
              title: '接诊高危情况',
              children: [
                {
                  title: '高危孕产妇总数（人）',
                  dataIndex: 'count_highrisk',
                  key: 'count_highrisk',
                },
                {
                  title: '传染病（人）',
                  dataIndex: 'count_infection',
                  key: 'count_infection',
                },
              ],
            },
          ]
        },
        initialSearchValue() {
          return {
            date: ctx.utils.getMomentRange()['本月'].map(ctx.utils.formatDate),
          }
        },

        render: function (data) {
          return data?.statistics
        }
      },
    ]

  },



  {
    colProps: { span: 24, },

    inputType: 'iframe',
    containerProps: {
      style: { height: '42vh', padding: 0 }
    },

    inputProps: {
      style: {
        height: '99%',
      },
      // src: 'http://120.78.156.10:3351/',
      src: 'https://www.safetyga.com/cnaf/cnafindex.html',
    },

    searchConfig: [
    ],

  },
]

export default conf