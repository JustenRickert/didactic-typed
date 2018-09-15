enum BaseCommodity {
  Red = 'red',
  Blue = 'blue',
  Green = 'green'
}

interface Commodity {
  kind: BaseCommodity
  price: number
  quantity: number
}

interface CommodityRate {
  kind: BaseCommodity
  rate: number
  amount: number
}
