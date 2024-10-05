'use client';
import React from 'react';
import styled from '@emotion/styled';
import TodoUserListHeader from '../parts/Header';
import InputField from '../parts/InputField';
import List from '../parts/List';

const Container = styled.div`
  max-width: 760px;
  margin: 0 auto;
  margin-top: 108px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  box-sizing: border-box;
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
      <List />
    </Container>
  );
};

export default TodoUserListPage;
