import '@testing-library/jest-dom';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';
import InputField from '../parts/InputField';
import TodoUserListPage from './TodoUserListPage';
import useTodo from '@/src/store/todo.store';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
  useSearchParams() {
    return {
      get: () => null,
    };
  },
  usePathname() {
    return '';
  },
}));

describe('Todo User List Page', () => {
  describe('Input Field', () => {
    it('빈 문자열로 todo를 만들 수 없다.', async () => {
      const testId = 'todo-input';
      render(
        <RecoilRoot>
          <InputField />
        </RecoilRoot>
      );
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
  });
});
