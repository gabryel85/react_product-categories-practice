import React, { useState, useRef, useEffect } from 'react';
import './App.scss';
import { differenceInSeconds } from 'date-fns';

import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { withCache } from './hoc/withCache';
import { useTodoUpdateMethod } from './providers/TodoProvider';
import { Test } from './components/Test';

const TodoFormWithCache = withCache(TodoForm);

const App: React.FC = () => {
  const date = useRef(new Date());
  const intervalId = useRef<ReturnType<typeof setInterval>>();

  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    intervalId.current = setInterval(() => {
      setTime(differenceInSeconds(new Date(), date.current));
    }, 1000);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);

  const [count, setCount] = useState(0);
  const { apply, query, setQuery } = useTodoUpdateMethod();

  return (
    <div className="App">
      <h1>
        Add todo form, czas użytkownika na stronie
        {time}
      </h1>

      <button type="button" onClick={() => setCount(x => x + 1)}>
        {count}
      </button>

      <input
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          apply(e.target.value);
        }}
      />

      <TodoFormWithCache />
      <TodoList />
      <Test />
    </div>
  );
};

export default withCache(App);
