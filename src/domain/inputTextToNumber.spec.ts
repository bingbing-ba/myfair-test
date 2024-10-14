import { inputTextToNumber } from './inputTextToNumber';

describe('사용자 입력 테스트', () => {
  it('문자열의 길이가 3이 아니면 에러가 발생한다', () => {
    expect(() => inputTextToNumber('1234')).toThrow();
  });
  it('중복된 숫자가 있으면 에러가 발생한다', () => {
    expect(() => inputTextToNumber('112')).toThrow();
  });
  it('1~9 사이의 문자만 입력된다.', () => {
    expect(() => inputTextToNumber('a12')).toThrow();
    expect(() => inputTextToNumber('012')).toThrow();
  });
});
