import RandomBallCreator from "./RandomBallCreator";

describe("RandomBallCreator", () => {
  it('랜덤으로 숫자 3개가 생성된다.', () => {
    const randomBall = RandomBallCreator.createRandomBalls();
    expect(randomBall.length).toBe(3);
  });
})
