var template = require('art-template')
var fs = require('fs')
var data = {
  date: '2025-06-23',
  dataList: [
    {
      date: '2025-06-23',
      bank: '建设银行',
      product: '主动积存',
      buyPrice: 781.29,
      sellPrice: 777.29,
      regularBuyPrice: 781.84
    },
    {
      date: '2025-06-23',
      bank: '建设银行',
      product: '投资金条',
      buyPrice: 793.20,
      sellPrice: null,
      regularBuyPrice: null
    },
    {
      date: '2025-06-23',
      bank: '工商银行',
      product: '积存金',
      buyPrice: 779.19,
      sellPrice: 779.19,
      regularBuyPrice: 779.73
    },
    {
      date: '2025-06-23',
      bank: '工商银行',
      product: '如意金积存',
      buyPrice: 793.19,
      sellPrice: 774.86,
      regularBuyPrice: null
    },
    {
      date: '2025-06-23',
      bank: '招商银行',
      product: '投资金条',
      buyPrice: 799.49,
      sellPrice: null,
      regularBuyPrice: null
    }
  ]
}
var html = template(__dirname + '/goldTemplate.art', data)

fs.writeFileSync(__dirname + '/gold.html', html)
