import React from 'react';
import { TodoInfo } from '../TodoInfo';
import { useTodo } from '../../providers/TodoProvider';

type Props = {};

export const TodoList: React.FC<Props> = React.memo(
  () => {
    const todos = useTodo();

    // eslint-disable-next-line no-console
    console.log('Rendering TodoList');

    return (
      <section className="TodoList">
        {todos.map(todo => (
          <TodoInfo
            key={todo.id}
            todo={todo}
          />
        ))}
      </section>
    );
  },
);
