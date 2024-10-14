import { matchToAnswer } from './matchToAnswer';

describe('숫자야구 결과 출력', () => {
  const answer = [1, 2, 3];
  it('위치와 숫자가 모두 맞으면 스트라이크로 카운트 된다.', () => {
    expect(matchToAnswer([1, 2, 4], answer).strike).toBe(2);
    expect(matchToAnswer([1, 5, 4], answer).strike).toBe(1);
    expect(matchToAnswer([7, 3, 4], answer).strike).toBe(0);
    expect(matchToAnswer([7, 2, 3], answer).strike).toBe(0);
  });
  it('맞는 숫자가 있지만 위치가 맞지 않으면 볼로 카운트 된다.', () => {});
});
