import React from 'react';
 
 const Todos = ({ todos }) => {
  if (!todos) {
    return <></>;
  }
  
  if (todos.length === 0) {
    return <div>Todo list is empty</div>;
  }
  
  return (
    <div>
      {todos.map((todo) => (
        <h1 key={todo}>{todo}</h1>
      ))}
    </div>
  );
};
  
 export default Todos;
