import { useEffect, useState } from "react";
import axios from "axios";
import './index.css'; 


type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchTodos = async () => {
    const res = await axios.get<Todo[]>(`${API_URL}/todos`);
    setTodos(res.data);
  };

  const addTodo = async () => {
    await axios.post(`${API_URL}/todos`, { title, description, completed });
    setTitle("");
    setDescription("");
    setCompleted(false);
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await axios.delete(`${API_URL}/todos/${id}`);
    fetchTodos();
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
    setCompleted(todo.completed);
  };

  const updateTodo = async () => {
    await axios.put(`${API_URL}/todos/${editingId}`, {
      title,
      description,
      completed,
    });
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCompleted(false);
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e293b]">
      <div className="w-full max-w-2xl bg-[#1e293b] p-6 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Todo App
        </h1>

        <div className="flex flex-col space-y-3 mb-6">
          <input
            className="p-2 border border-black rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="p-2 border border-black rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <span>Completed</span>
          </label>
          {editingId ? (
            <button
              onClick={updateTodo}
              className="bg-yellow-500 text-black p-2 rounded hover:bg-yellow-600"
            >
              Update Todo
            </button>
          ) : (
            <button
              onClick={addTodo}
              className="bg-blue-500 text-black p-2 rounded hover:bg-blue-600"
            >
              Add Todo
            </button>
          )}
        </div>

        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-black text-left">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Completed</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id} className="bg-gray-black">
                <td className="border px-4 py-2">{todo.title}</td>
                <td className="border px-4 py-2">{todo.description}</td>
                <td className="border px-4 py-2">
                  {todo.completed ? "✅ Yes" : "❌ No"}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => startEdit(todo)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
