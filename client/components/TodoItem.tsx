export default function TodoItem({ todo, onToggle, onDelete }: any) {
  return (
    <div className="flex justify-between bg-blue-200 p-3 rounded">
       <div className="flex items-center gap-3">
        {/* ✅ checkbox */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo._id, !todo.completed)}
          className="w-5 h-5 cursor-pointer"
        />

        {/* todo text */}
        <span
          className={`${
            todo.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {todo.title}
        </span>
      </div>

      {/* delete button */}
      <button
        onClick={() => onDelete(todo._id)}
        className="text-red-600"
      >
        ❌
      </button>
    </div>
  );
}