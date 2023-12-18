import classNames from 'classnames';
import React, { useState, useEffect, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoForm } from '../TodoForm';
import { UserInfo } from '../UserInfo';
import { useTodoUpdateMethod } from '../../providers/TodoProvider';

type Props = {
  todo: Todo;
};

const TodoInfoTemp: React.FC<Props> = ({ todo }) => {
  const [editing, setEditing] = useState(false);

  const { updateTodo, deleteTodo } = useTodoUpdateMethod();

  // eslint-disable-next-line no-console
  console.log(`Rendering ${todo.id}`);
  // eslint-disable-next-line no-console
  useEffect(() => console.log(`${todo.id} todo changed - info`), [todo]);
  // eslint-disable-next-line no-console
  useEffect(() => console.log(`${todo.id} onDelete changed - info`), [deleteTodo]);
  // eslint-disable-next-line no-console
  useEffect(() => console.log(`${todo.id} onUpdate changed - info`), [updateTodo]);

  return (
    <article
      data-id={todo.id}
      className={classNames('TodoInfo', {
        'TodoInfo--completed': todo.completed,
      })}
    >
      {editing ? (
        <TodoForm
          todo={todo}
        />
      ) : (
        <>
          <h2 className="TodoInfo__title">{todo.title}</h2>

          {todo.user && (
            <UserInfo user={todo.user} />
          )}

          <button type="button" onClick={() => deleteTodo(todo.id)}>
            x
          </button>

          <button type="button" onClick={() => setEditing(true)}>
            edit
          </button>
        </>
      )}
    </article>
  );
};

// id: number;
// title: string;
// completed: boolean;

const isEqual = (prevProps: Props, nextProps: Props) => {
  return prevProps.todo.id === nextProps.todo.id
    && prevProps.todo.title === nextProps.todo.title
    && prevProps.todo.completed === nextProps.todo.completed;
};

export const TodoInfo = memo(TodoInfoTemp, isEqual);
