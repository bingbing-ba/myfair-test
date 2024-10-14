'use client';
import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { sampleMemberState } from '../../state/SampleState';
import { useRecoilState } from 'recoil';
import RandomBallCreator from '../../domain/RandomBallCreator';

const Container = styled.div`
  padding: 1rem;
`;

const Title = styled.p`
  font-size: 2rem;
  font-weight: 700;
`;

const SubTitle = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
`;

const Description = styled.p``;

interface Props {}

const BaseballPage = ({}: Props) => {
  const [answer, setAnswer] = useState(RandomBallCreator.createRandomBalls());
  const resetAnswer = useCallback(() => {
    setAnswer(RandomBallCreator.createRandomBalls());
  }, []);
  const matchAnswer = useCallback((inputNumbers: number[]): { strike: number; ball: number } => {
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
  }, []);

  const [inputNumber, setInputNumber] = useState<number[]>([]);
  const inputStrToNumber = useCallback((str: string) => {
    if (str.length !== 3) {
      alert('3자의 숫자를 입력해주세요');
      return;
    }
    if (!str.split('').every((s) => Number(s) > 0)) {
      alert('1~9 사이의 숫자만 입력해 주세요');
      return;
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
      alert('1~9 사이의 숫자를 겹치치 않게 입력해주세요.');
      return;
    }

    setInputNumber(inputNumber);
  }, []);

  return (
    <Container>
      <Title>⚾️ 숫자 야구 게임</Title>
      <Description>1~9까지의 수를 중복없이 3개 입력해주세요.</Description>
      <input type="text" />
      <button>확인</button>
      <SubTitle>📄 결과</SubTitle>
    </Container>
  );
};

export default BaseballPage;
