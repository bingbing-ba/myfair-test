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

    it('문자열을 입력하고 Enter 하면 todo가 생성된다.', async () => {});
  });

  describe('List', () => {
    it('선택한 필터에 따라 해당 상태의 todo만 화면에 보인다', async () => {});

    it('todo text나 체크박스를 클릭하면 todo의 완료 상태가 토글된다.', async () => {});

    it('삭제 버튼을 누르면 해당 todo가 삭제된다. 화면에서도 보이지 않는다.', async () => {});
  });
});
