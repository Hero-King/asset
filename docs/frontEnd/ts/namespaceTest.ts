namespace Part1 {
  export interface Animal {
    name: string
    eat: () => void
  }
}

namespace Runoob {
  export namespace invoiceApp {
    export class Invoice {
      public calculateDiscount(price: number) {
        return price * 0.4
      }
    }
  }
}
