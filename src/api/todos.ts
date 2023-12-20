import { Todo } from '../types/Todo';

export default [
  {
    id: 1,
    title: 'delectus aut autem',
    completed: true,
    userId: 1,
  },
  {
    id: 15,
    title: 'some other todo',
    completed: false,
    userId: 1,
  },
  {
    id: 2,
    title: 'quis ut nam facilis et officia qui',
    completed: false,
    userId: 4,
  },
];

export const PORT = 3004;
export const API_URL = 'http://localhost';

const todosEndpoint = `${API_URL}:${PORT}/todos`;

export const getTodos = async (): Promise<Todo[]> => {
  try {
    const response = await fetch(todosEndpoint);

    if (!response.ok) {
      throw new Error('Coś nie tak z połączeniem');
    }

    const todos: Todo[] = await response.json();

    return todos;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);

    return [];
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${todosEndpoint}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Coś nie tak z połączeniem');
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err);
  }
};

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  try {
    const response = await fetch(todosEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      throw new Error('Coś nie tak z połączeniem');
    }

    return await response.json();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
    throw e;
  }
};
