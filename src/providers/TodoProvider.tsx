import React, {
  createContext,
  Dispatch,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import {
  getTodos,
  deleteTodo as deleteTodoFromApi,
  createTodo,
} from '../api/todos';
// eslint-disable-next-line import/no-cycle
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
  const [todos, setTodos] = useState<Todo[]>([] as Todo[]);

  useEffect(() => {
    const getTodosFormApi = async () => {
      const data: Todo[] = await getTodos();

      setTodos(data);
    };

    getTodosFormApi();

    // (async () => {
    //   const data: Todo[] = await getTodos();
    //
    //   setTodos(data);
    // })();
  }, []);

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const apply = useMemo(() => {
    return debounce(setAppliedQuery, 1000);
  }, []);

  const lowerQuery = appliedQuery.toLocaleLowerCase();
  const visibleTodos = useMemo(() => todos?.filter(
    todo => {
      // eslint-disable-next-line no-console
      console.log('filter');

      return todo.title.toLocaleLowerCase().includes(lowerQuery);
    },
  ), [todos, lowerQuery]);

  const addTodo = async (todoData: Omit<Todo, 'id'>) => {
    const newTodo = await createTodo(todoData);

    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  const deleteTodo = useCallback(async (todoId: number) => {
    await deleteTodoFromApi(todoId);
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
