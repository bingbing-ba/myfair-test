'use client';
import React from 'react';
import styled from '@emotion/styled';
import TodoUserListHeader from '../parts/Header';
import InputField from '../parts/InputField';

const Container = styled.div`
  max-width: 760px;
  margin: 0 auto;
  margin-top: 108px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
`;

interface Props {}

const TodoUserListPage = ({}: Props) => {
  return (
    <Container>
      <TodoUserListHeader />
      <InputField
        style={{ marginTop: '64px' }}
        placeholder="할일을 입력해 주세요"
        onKeyDown={(e) => {
          console.log(e.code);
          if (e.code === 'Enter') {
            // set todo
            alert('set todo');
          }
        }}
      />
    </Container>
  );
};

export default TodoUserListPage;
