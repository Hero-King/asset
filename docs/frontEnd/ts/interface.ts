interface IPerson {
  firstName: string
  lastName: string
  sayHi: () => string
}

const customer: IPerson = {
  firstName: 'Tom',
  lastName: 'Hanks',
  sayHi: (): string => {
    return 'Hi there'
  }
}

const customer2 = <IPerson>{
  firstName: 'Tom',
  lastName: 'Hanks',
  sayHi: (): string => {
    return 'Hi there'
  }
}
