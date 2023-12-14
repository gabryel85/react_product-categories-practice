import React, { useRef } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  onTodoDelete: (todoId: number) => void;
  onTodoUpdate: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    onTodoDelete,
    onTodoUpdate,
  }) => {
    const ref = useRef<Todo[]>([]);

    console.log('Rendering TodoList');

    console.log(ref.current === todos);
    ref.current = todos;

    return (
      <section className="TodoList">
        {todos.map(todo => (
          <TodoInfo
            key={todo.id}
            todo={todo}
            onDelete={onTodoDelete}
            onUpdate={onTodoUpdate}
          />
        ))}
      </section>
    );
  },
);
