class A {
  fn: number = 1;
  action: number = 2;
  data: string | null = '';
}

const a: object = {
  fn: 1,
  action: 2,
  data: ''
}

console.log(a as A);