export const matchToAnswer = (inputNumbers: number[], answer: number[]): { strike: number; ball: number } => {
  const result = { strike: 0, ball: 0 } as { strike: number; ball: number };
  answer.forEach((num, index) => {
    if (inputNumbers[index] === num) {
      result.strike = result.strike + 1;
    } else {
      if (answer.includes(inputNumbers[index])) {
        result.ball = result.ball + 1;
      }
    }
  });
  return result;
}