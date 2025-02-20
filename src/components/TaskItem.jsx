import { useEffect, useState } from 'react';
import AddForm from './AddForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TaskItem() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setToken] = useState('');
  const [tasks, setTask] = useState([]);
  const [editId, setEditId] = useState(null); // ใช้สำหรับเช็คเงื่อนไข
  const [editValue, setEditValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    if (!token) return;
    const fetchList = async () => {
      try {
        const response = await axios.get(backendUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
          setTask(response.data);
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchList();
  }, [token, backendUrl, navigate]);

  // ฟังก์ชันเปลี่ยนค่า Checkbox
  async function toggleCheckbox(index) {
    const taskId = tasks[index]._id;

    const updatedChecked = {
      ...tasks[index],
      completed: !tasks[index]?.completed,
    };

    if (token) {
      try {
        const response = await axios.put(
          `${backendUrl}/${taskId}`,
          updatedChecked,
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          setTask(
            tasks.map((task, i) => (i === index ? updatedChecked : task))
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  // ฟังก์ชันแก้ไข;
  function editTask(indexToEdit) {
    setEditId(indexToEdit);
    setEditValue(tasks[indexToEdit].name); // ตั้งค่า editValue เป็นข้อความเดิม
  }

  // ฟังก์ชันบันทึกข้อความที่แก้ไข
  async function saveEdit(indexToSave) {
    const taskId = tasks[indexToSave]._id;
    const updatedTask = { ...tasks[indexToSave], name: editValue };
    if (token) {
      try {
        await axios.put(`${backendUrl}/${taskId}`, updatedTask, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setTask(
          tasks.map((task, index) =>
            index === indexToSave ? updatedTask : task
          )
        );
        setEditId(null);
        setEditValue('');
      } catch (err) {
        console.log(err);
      }
    }
  }

  // ฟังก์ชันลบ
  async function deleteTask(indexToDelete) {
    const taskId = tasks[indexToDelete]._id; // รับ ObjectId จาก task ที่เลือก

    try {
      const response = await axios.delete(`${backendUrl}/${taskId}`, {
        headers: { 'Authorization': `Bearer ${token}` }, // เพิ่ม token ใน header
      });

      if (response.status === 200) {
        // ลบงานจาก tasks state หลังจากลบสำเร็จ
        setTask(tasks.filter((_, index) => index !== indexToDelete));
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center">
      <AddForm tasks={tasks} setTask={setTask} />
      <div className="py-10 w-[75%] md:w-[45%]">
        {tasks.map((data, index) => (
          <div
            key={data._id}
            className="flex justify-between items-center gap-5 mb-5 p-3 rounded-lg shadow-md"
          >
            <input
              type="checkbox"
              className="checkbox"
              checked={data.completed || false}
              onChange={() => toggleCheckbox(index)}
            />
            {/* ตวจสอบ editId ว่าตรงกับ index ไหม ถ้าใช่ให้แสดงกล่อง input */}
            {editId === index ? (
              <input
                type="text"
                className="input input-bordered input-sm focus:outline-none w-[100%] md:w-auto"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : (
              <h2
                className={`text-xl font-bold px-2 ${
                  data.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                {data.name}
              </h2>
            )}
            <div className="flex gap-3">
              {/* ตวจสอบ editId ว่าตรงกับ index ไหม ถ้าใช้ก็จะแสดงปุ่ม save */}
              {editId === index ? (
                <button
                  onClick={() => saveEdit(index)}
                  className="btn btn-primary btn-sm"
                >
                  Save
                </button>
              ) : (
                <button onClick={() => editTask(index)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              )}
              {editId === index ? (
                ''
              ) : (
                <button onClick={() => deleteTask(index)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-red-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskItem;
