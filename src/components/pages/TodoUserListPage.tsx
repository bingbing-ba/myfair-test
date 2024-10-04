'use client';
import styled from '@emotion/styled';
import TodoUserListHeader from '../parts/Header';

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
    </Container>
  );
};

export default TodoUserListPage;
