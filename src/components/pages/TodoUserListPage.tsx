'use client';
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
      <InputField />
      <List />
    </Container>
  );
};

export default TodoUserListPage;
