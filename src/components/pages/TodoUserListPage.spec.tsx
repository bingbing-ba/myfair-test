import useTodo, { Todo, todosState } from '@/src/store/todo.store';
import '@testing-library/jest-dom';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import InputField from '../parts/InputField';
import List from '../parts/List';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname() {
    return '';
  },
}));

describe('Todo User List Page', () => {
  describe('Input Field', () => {
    const testId = 'todo-input';
    const initializeState = (mutableSnapshot: MutableSnapshot) => {
      mutableSnapshot.set(todosState, {});
    };

    beforeEach(() => {
      render(
        <RecoilRoot initializeState={initializeState}>
          <InputField />
        </RecoilRoot>
      );
    });

    afterEach(() => {
      // 테스트간 간섭 없애기 위해
      localStorage.removeItem('todo');
    });

    it('빈 문자열로 todo를 만들 수 없다.', async () => {
      const input = screen.getByTestId(testId) as HTMLInputElement;

      await userEvent.click(input);
      await userEvent.keyboard('[Enter]');

      // white space only
      await userEvent.type(input, '    ');
      await userEvent.keyboard('[Enter]');

      const { result } = renderHook(() => useTodo(), {
        wrapper: RecoilRoot,
      });
      const todoLength = Object.values(result.current.todos).length;

      expect(todoLength).toBe(0);
    });

    it('문자열을 입력하고 Enter 하면 해당 문자열의 todo가 생성된다.', async () => {
      const input = screen.getByTestId(testId) as HTMLInputElement;

      const todoText = 'first Todo';
      await userEvent.type(input, todoText);
      await userEvent.keyboard('[Enter]');

      const { result } = renderHook(() => useTodo(), {
        wrapper: RecoilRoot,
      });

      const todoLength = Object.values(result.current.todos).length;
      expect(todoLength).toBe(1);

      const todo = Object.values(result.current.todos).find((todo) => todo.text === todoText);
      expect(todo?.text).toBe(todoText);
      expect(todo?.done).toBe(false);
    });
  });

  describe('List', () => {
    const todos: Todo[] = [
      { id: 'foo', text: 'first todo', done: false, createdAt: Date.now() },
      { id: 'bar', text: 'second todo', done: true, createdAt: Date.now() },
      { id: 'zoo', text: 'thrird todo', done: false, createdAt: Date.now() },
    ];
    let container: HTMLElement;
    let routerMock: Partial<ReturnType<typeof useRouter>>;

    const renderWithInitialState = () => {
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
      const rendered = render(
        <RecoilRoot initializeState={initializeState}>
          <List />
        </RecoilRoot>
      );
      container = rendered.container;
    };

    beforeEach(() => {
      // useRouter 모의 설정
      routerMock = {
        replace: jest.fn(), // router.push 모의 함수
      };
      (useRouter as jest.Mock).mockReturnValue(routerMock);
      (useSearchParams as jest.Mock).mockReturnValue({
        get: (key: string) => (key === 'filter' ? 'all' : null),
      });
      renderWithInitialState();
    });

    it('세팅된 filter에 맞는 상태의 todo가 출력된다', async () => {
      // filter === all
      (useSearchParams as jest.Mock).mockReturnValue({ get: (key: string) => (key === 'filter' ? 'all' : null) });
      renderWithInitialState();

      let checkboxes = container.querySelectorAll(`input[type="checkbox"]`);
      expect(checkboxes.length).toBe(todos.length);

      // filter === todo
      (useSearchParams as jest.Mock).mockReturnValue({ get: (key: string) => (key === 'filter' ? 'todo' : null) });
      renderWithInitialState();

      checkboxes = container.querySelectorAll(`input[type="checkbox"]`);
      expect(checkboxes.length).toBe(todos.filter((t) => !t.done).length);

      // filter === done
      (useSearchParams as jest.Mock).mockReturnValue({ get: (key: string) => (key === 'filter' ? 'done' : null) });
      renderWithInitialState();

      checkboxes = container.querySelectorAll(`input[type="checkbox"]`);
      screen.debug(Array.from(checkboxes));
      expect(checkboxes.length).toBe(todos.filter((t) => t.done).length);
    });

    it('필터를 클릭하면 query string이 세팅된다', async () => {
      //
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
});
