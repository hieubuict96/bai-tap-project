type A = {
  fn: number;
  action: number;
  data: string | null;
}

const aa: object = {
  fn: 1,
  action: 2,
  data: ''
}

console.log(typeof (aa as A));