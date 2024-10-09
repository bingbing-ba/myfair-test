'use client';

import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';

export type Todo = {
  id: string;
  done: boolean;
  createdAt: number;
  text: string;
};

type Todos = {
  [id: string]: Todo;
};

const todoKey = 'todo';
export const todosState = atom({
  key: todoKey,
  default: {} as Todos,
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

  useEffect(() => {
    const localTodos = localStorage.getItem(todoKey);
    if (localTodos) {
      setTodos(JSON.parse(localTodos));
    }
  }, []);

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
    const copied = {
      ...todos,
    };
    delete copied[todo.id];
    setTodos({
      ...copied,
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
