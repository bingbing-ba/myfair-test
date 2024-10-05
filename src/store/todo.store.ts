import { atom, useRecoilState } from 'recoil';

type Todo = {
  id: string;
  done: boolean;
  createdAt: number;
  text: string;
};

type Todos = {
  [id: string]: Todo;
};

const todoKey = 'todo';
const initialTodos = JSON.parse(localStorage.getItem(todoKey) ?? '{}') as Todos;
const todosState = atom({
  key: todoKey,
  default: initialTodos,
  effects: [
    ({ onSet }) => {
      onSet((newTodos) => {
        localStorage.setItem(todoKey, JSON.stringify(newTodos));
      });
    },
  ],
});

const useTodo = () => {
  const [todos, setTodos] = useRecoilState(todosState);
  const addTodo = (todo: Todo) => {
    setTodos((oldTodos) => ({
      ...oldTodos,
      [todo.id]: todo,
    }));
  };

  const updateTodo = (todo: Todo) => {
    if (todos[todo.id] === undefined) {
      throw new Error(`todo ${todo.id} not found`);
    }
    setTodos((oldTodos) => ({
      ...oldTodos,
      [todo.id]: todo,
    }));
  };

  const deleteTodo = (todo: Todo) => {
    if (todos[todo.id] === undefined) {
      throw new Error(`todo ${todo.id} not found`);
    }
    delete todos[todo.id];
    setTodos({
      ...todos,
    });
  };

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
  };
};

export default useTodo;
