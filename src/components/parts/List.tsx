import CheckSVG from '@/public/Check.svg';
import CloseSVG from '@/public/Close.svg';
import useTodo from '@/src/store/todo.store';
import styled from '@emotion/styled';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

type Filter = 'all' | 'todo' | 'done';

const List = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const filter = correctFilter(searchParams.get('filter'));

  const setFilter = useCallback(
    (filter: Filter) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('filter', filter);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router]
  );

  const { todos } = useTodo();
  const filteredTodos = useMemo(() => {
    const sortedTodos = Object.values(todos).sort((a, b) => a.createdAt - b.createdAt);
    if (filter === 'all') {
      return sortedTodos;
    }
    if (filter === 'todo') {
      return sortedTodos.filter((todo) => !todo.done);
    }
    return sortedTodos.filter((todo) => todo.done);
  }, [todos, filter]);

  return (
    <Container>
      <FilterWrapper>
        <FilterItem active={filter === 'all'} onClick={() => setFilter('all')}>
          All
        </FilterItem>
        <FilterItem active={filter === 'todo'} onClick={() => setFilter('todo')}>
          To Do
        </FilterItem>
        <FilterItem active={filter === 'done'} onClick={() => setFilter('done')}>
          Done
        </FilterItem>
      </FilterWrapper>
      <TodoItemWrapper>
        <TodoCounter>총 {filteredTodos.length}개</TodoCounter>
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id}>
            <Check done={todo.done} />
            <Text>{todo.text}</Text>
            <Close />
          </TodoItem>
        ))}
      </TodoItemWrapper>
    </Container>
  );
};

const Container = styled.div`
  box-shadow:
    0px 16px 32px 0px #00000012,
    0px 0px 6px 0px #00000006;
  width: 100%;
  padding: 32px 0px 0px 0px;
  border-radius: 24px;
  margin-top: 32px;
`;

const FilterItem = styled.div<{ active?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-align: left;
  background: ${(props) => (props.active ? '#ebf4ff' : '#fff')};
  width: 108px;
  padding: 8px 32px 8px 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  color: ${(props) => (props.active ? '#2182F3' : '#111111')};
  cursor: pointer;
  &:hover {
    background: #ebf4ff;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const TodoItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

const NotChecked = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  cursor: pointer;
`;

const Checked = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: #2182f3;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Check = ({ done }: { done?: boolean }) => {
  if (done)
    return (
      <Checked>
        <Image src={CheckSVG} alt="checked" />
      </Checked>
    );

  return <NotChecked />;
};

const TodoItem = styled.div`
  padding: 32px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Text = styled.div`
  flex-grow: 1;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  cursor: pointer;
`;

const TodoCounter = styled.div`
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  padding: 16px;
`;

const Close = () => <Image src={CloseSVG} alt="close" style={{ cursor: 'pointer' }} />;

export default List;

/** search params 오타 방지용 */
const correctFilter = (filter: string | null): Filter => {
  if (filter === 'todo') return filter;
  if (filter === 'done') return filter;
  return 'all';
};
