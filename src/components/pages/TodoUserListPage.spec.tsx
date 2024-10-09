import { Todo, todosState } from '@/src/store/todo.store';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import List from '../parts/List';
import TodoUserListPage from './TodoUserListPage';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname() {
    return '';
  },
}));

describe('Todo User List Page', () => {
  const renderWithEmptyTodos = () => {
    const initializeState = (mutableSnapshot: MutableSnapshot) => {
      mutableSnapshot.set(todosState, {});
    };

    const renderResult = render(
      <RecoilRoot initializeState={initializeState}>
        <TodoUserListPage />
      </RecoilRoot>
    );

    return renderResult;
  };

  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => (key === 'filter' ? 'all' : null),
    });
  });

  afterEach(() => {
    // 테스트간 간섭 없애기 위해
    localStorage.removeItem('todo');
  });

  it('빈 문자열로 todo를 만들 수 없다.', async () => {
    const { container } = renderWithEmptyTodos();

    const input = container.querySelector(`input[type="text"]`) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    await userEvent.click(input);
    await userEvent.keyboard('[Enter]');

    // white space only
    await userEvent.type(input, '    ');
    await userEvent.keyboard('[Enter]');

    const checkBox = container.querySelector(`input[type="checkbox"]`);
    expect(checkBox).not.toBeInTheDocument();
  });

  it('문자열을 입력하고 Enter 하면 해당 문자열의 todo가 생성된다.', async () => {
    const { container } = renderWithEmptyTodos();
    const input = container.querySelector(`input[type="text"]`) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    const todoText = 'first Todo';
    await userEvent.type(input, todoText);
    await userEvent.keyboard('[Enter]');

    expect(screen.getByText(todoText)).toBeInTheDocument();
  });

  const todos: Todo[] = [
    { id: 'foo', text: 'first todo', done: false, createdAt: Date.now() },
    { id: 'bar', text: 'second todo', done: true, createdAt: Date.now() },
    { id: 'zoo', text: 'thrird todo', done: false, createdAt: Date.now() },
  ];
  const renderWith3Todos = () => {
    localStorage.removeItem('todo');
    const initializeState = (mutableSnapshot: MutableSnapshot) => {
      const initialTodos = todos.reduce(
        (acc, cur) => {
          acc[cur.id] = cur;
          return acc;
        },
        {} as { [id: string]: Todo }
      );
      mutableSnapshot.set(todosState, initialTodos);
    };
    const renderResult = render(
      <RecoilRoot initializeState={initializeState}>
        <List />
      </RecoilRoot>
    );
    return renderResult;
  };

  it('세팅된 filter에 맞는 상태의 todo가 출력된다', async () => {
    // filter === all
    (useSearchParams as jest.Mock).mockReturnValue({ get: (key: string) => (key === 'filter' ? 'all' : null) });
    let { container } = renderWith3Todos();

    let checkboxes = container.querySelectorAll(`input[type="checkbox"]`);
    expect(checkboxes.length).toBe(todos.length);

    // filter === todo
    (useSearchParams as jest.Mock).mockReturnValue({ get: (key: string) => (key === 'filter' ? 'todo' : null) });
    container = renderWith3Todos().container;

    checkboxes = container.querySelectorAll(`input[type="checkbox"]`);
    expect(checkboxes.length).toBe(todos.filter((t) => !t.done).length);

    // filter === done
    (useSearchParams as jest.Mock).mockReturnValue({ get: (key: string) => (key === 'filter' ? 'done' : null) });
    container = renderWith3Todos().container;

    checkboxes = container.querySelectorAll(`input[type="checkbox"]`);
    expect(checkboxes.length).toBe(todos.filter((t) => t.done).length);
  });

  it('필터를 클릭하면 query string이 세팅된다', async () => {
    const routerMock = { replace: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(routerMock);

    renderWith3Todos();

    const filterAll = screen.getByText('All');
    const filterTodo = screen.getByText('To Do');
    const filterDone = screen.getByText('Done');

    await userEvent.click(filterAll);
    expect(routerMock.replace).toHaveBeenCalledWith(expect.stringMatching(/filter=all/));

    await userEvent.click(filterTodo);
    expect(routerMock.replace).toHaveBeenCalledWith(expect.stringMatching(/filter=todo/));

    await userEvent.click(filterDone);
    expect(routerMock.replace).toHaveBeenCalledWith(expect.stringMatching(/filter=done/));
  });

  it('todo text나 체크박스를 클릭하면 todo의 완료 상태가 토글된다.', async () => {
    const { container } = renderWith3Todos();

    const targetTodo = todos[0];
    const checkBoxInput = container.querySelector(`input#todo-checkbox-${targetTodo.id}`) as HTMLInputElement;
    const checkBoxInputLabel = container.querySelector(`label[for="todo-checkbox-${targetTodo.id}"`);
    expect(checkBoxInputLabel).toBeInTheDocument();
    // 체크박스 클릭
    await userEvent.click(checkBoxInputLabel!);
    expect(checkBoxInput.checked).toBe(!targetTodo.done);

    // text 클릭
    const todoText = screen.getByText(targetTodo.text);
    await userEvent.click(todoText);
    expect(checkBoxInput.checked).toBe(targetTodo.done);
  });

  it('삭제 버튼을 누르면 해당 todo가 삭제된다', async () => {
    const { container } = renderWith3Todos();
    global.confirm = () => true;

    const targetTodo = todos[0];
    const todoQuery = `#todo-item-${targetTodo.id}`;
    const todoItem = container.querySelector(todoQuery);
    expect(todoItem).toBeInTheDocument();

    const deleteButton = container.querySelector(todoQuery + ' > button');
    await userEvent.click(deleteButton!);

    const deletedTodoItem = screen.queryByText(targetTodo.text);
    expect(deletedTodoItem).not.toBeInTheDocument();
  });
});
