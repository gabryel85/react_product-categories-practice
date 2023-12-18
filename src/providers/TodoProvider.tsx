import React, {
  ComponentType,
  createContext, Dispatch, FC, useCallback, useContext, useMemo, useState,
} from 'react';
import { Todo } from '../types/Todo';
import todosFromServer from '../api/todos';
// eslint-disable-next-line import/no-cycle
import { getUser } from '../components/TodoForm';
import { debounce } from '../utils/debeunce';

type Props = {
  children: React.ReactNode
};

type TodoUpdateContextType = {
  deleteTodo: (id: number) => void,
  addTodo: (data: Omit<Todo, 'id'>) => void,
  updateTodo: (data: Todo) => void,
  apply: (v: string) => void,
  query: string,
  setQuery: Dispatch<string>,
};

const TodoContext = createContext<Todo[]>([] as Todo[]);
const TodoUpdateContext = createContext<TodoUpdateContextType>(
  {} as TodoUpdateContextType,
);
const TodoProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    return todosFromServer.map(todo => ({
      ...todo,
      user: getUser(todo.userId),
    }));
  });

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const apply = useMemo(() => {
    return debounce(setAppliedQuery, 1000);
  }, []);

  const lowerQuery = appliedQuery.toLocaleLowerCase();
  const visibleTodos = useMemo(() => todos.filter(
    todo => {
      // eslint-disable-next-line no-console
      console.log('filter');

      return todo.title.toLocaleLowerCase().includes(lowerQuery);
    },
  ), [todos, lowerQuery]);

  const addTodo = (todoData: Omit<Todo, 'id'>) => {
    const newTodo = {
      ...todoData,
      id: Math.max(...todos.map(todo => todo.id)) + 1,
    };

    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  const deleteTodo = useCallback((todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(
      todo => todo.id !== todoId,
    ));
  }, []);

  const updateTodo = useCallback((updatedTodo: Todo) => {
    setTodos(currentTodos => currentTodos.map(
      todo => (todo.id === updatedTodo.id ? updatedTodo : todo),
    ));
  }, []);

  const value = useMemo(() => ({
    addTodo,
    deleteTodo,
    updateTodo,
    apply,
    query,
    setQuery,
  }), [query, apply]);

  return (
    <TodoContext.Provider value={visibleTodos}>
      <TodoUpdateContext.Provider value={value}>
        {children}
      </TodoUpdateContext.Provider>
    </TodoContext.Provider>
  );
};

export default TodoProvider;

export const useTodo = () => useContext(TodoContext);
export const useTodoUpdateMethod = () => useContext(TodoUpdateContext);

export function withTodoContext<T extends ComponentType>(WrappedComponent: T) {
  const ComponentWithTodo = (props: any) => {
    const todo = useTodo();
    const methods = useTodoUpdateMethod();

    return (
      <WrappedComponent
        {...props as unknown as T}
        todo={todo}
        methods={methods}
      />
    );
  };

  return ComponentWithTodo;
}
