var template = require('art-template')
var fs = require('fs')
var data = {
  dataList: [
    {
      bank: '中国建设银行',
      product: '主动积存',
      buyPrice: '782.22',
      sellPrice: '778.22',
      fixedPrice: '782.22'
    },
    {
      bank: '中国建设银行',
      product: '实物金投资金条50g',
      buy_price: '794.40',
      sell_price: '',
      fixed_price: ''
    },
    {
      bank: '中国工商银行',
      product: '积存金',
      buy_price: '779.73',
      sell_price: '779.73',
      fixed_price: '778.99'
    },
    {
      bank: '中国工商银行',
      product: '如意金积存',
      buy_price: '793.06',
      sell_price: '774.73',
      fixed_price: ''
    },
    {
      bank: '招商银行',
      product: '经典款招行金投资金条',
      buy_price: '796.92',
      sell_price: '',
      fixed_price: ''
    }
  ]
}
var html = template(__dirname + '/goldTemplate', data)


fs.writeFileSync(__dirname + '/gold.html', html)
