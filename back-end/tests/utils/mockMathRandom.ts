export default function mockMathRandom(number: number) {
  const mockMathRandom = Object.create(global.Math);
  mockMathRandom.random = () => number;
  global.Math = mockMathRandom;

  return mockMathRandom;
}