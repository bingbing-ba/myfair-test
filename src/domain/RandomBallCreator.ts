export default class RandomBallCreator {
  static createRandomBalls(): number[] {
    const ballNumbers: number[] = [];
    while (ballNumbers.length < 3) {
      const randomNumber = Math.floor(Math.random() * 9) + 1;
      if (!ballNumbers.includes(randomNumber)) {
        ballNumbers.push(randomNumber);
      }
    }
    return ballNumbers
  }
}
