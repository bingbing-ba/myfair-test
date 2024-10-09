import useTodo from '@/src/store/todo.store';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useCallback, useState } from 'react';

const InputBase = ({ className }: { className?: string }) => {
  const { addTodo } = useTodo();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const temporarySetError = useCallback(
    (msg: string) => {
      if (error === msg) return;
      setError(msg);
      setTimeout(() => setError(''), 3000);
    },
    [error]
  );

  const addNewTodo = useCallback(() => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      temporarySetError('1자 이상 입력하세요!');
      return;
    }
    addTodo({
      id: generateRandomId(),
      done: false,
      text: trimmed,
      createdAt: Date.now(),
    });
    setText('');
  }, [addTodo, text, temporarySetError]);

  return (
    <div className={className}>
      <input
        type="text"
        placeholder="할일을 입력해 주세요"
        value={text}
        onChange={(e) => {
          setText((e.target as HTMLInputElement).value);
        }}
        onKeyDown={(e) => {
          // 한글 IME
          if (e.nativeEvent.isComposing) {
            return;
          }
          if (e.code === 'Enter') {
            addNewTodo();
          }
        }}
      />
      {error && <ErrorField>{error}</ErrorField>}
    </div>
  );
};

const shake = keyframes`
  0% { transform: translateX(0) }
  25% { transform: translateX(2px) }
  50% { transform: translateX(-2px) }
  75% { transform: translateX(2px) }
  100% { transform: translateX(0) }
`;

const ErrorField = styled.div`
  color: #df8686;
  position: absolute;
  bottom: -24px;
  left: 16px;
  animation: ${shake} 0.2s ease 1;
`;

const InputField = styled(InputBase)`
  margin-top: 64px;
  width: 100%;
  position: relative;
  & > input {
    padding: 32px;
    border-radius: 24px;
    background: #e5e5e5;
    color: #111;
    border: none;
    width: 100%;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    text-align: left;
    box-sizing: border-box;
    &:focus {
      outline: none;
    }
  }
`;

export default InputField;

function generateRandomId(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  return Array(10)
    .fill(0)
    .map(() => characters.charAt(Math.floor(Math.random() * charactersLength)))
    .join('');
}
