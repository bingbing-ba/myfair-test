export const inputTextToNumber = (str: string): number[] => {
  if (str.length !== 3) {
    throw new Error('3자의 숫자를 입력해주세요');
  }
  if (!str.split('').every((s) => Number(s) > 0)) {
    throw new Error('1~9 사이의 숫자만 입력해 주세요');
  }
  // 숫자가 겹치지 않을 것
  const inputNumber = str.split('').map((s) => Number(s));
  const numberMap = Array(10).fill(0);
  let isWrong = false;
  inputNumber.forEach((n) => {
    numberMap[n] = numberMap[n] + 1;
    if (numberMap[n] > 1) {
      isWrong = true;
    }
  });
  if (isWrong) {
    throw new Error('1~9 사이의 숫자를 겹치치 않게 입력해주세요.');
  }

  return inputNumber;
};
