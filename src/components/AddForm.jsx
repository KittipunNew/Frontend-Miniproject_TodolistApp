import { useState } from 'react';
import axios from 'axios';

function AddForm(props) {
  const { setTask } = props;
  const [input, setInput] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  async function handleSubmit(e) {
    const token = localStorage.getItem('token');
    e.preventDefault();
    if (!input.trim()) {
      alert('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }

    if (token) {
      try {
        const response = await axios.post(
          backendUrl,
          {
            name: input.trim(),
          },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        console.log(response);

        console.log('✅ Response จาก API:', response.data);

        if (response.data) {
          setInput(''); // เคลียร์ input
          setTask((prevTasks) => [...prevTasks, response.data]); // อัปเดต state
        }
      } catch (err) {
        console.error('❌ Error:', err);
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div>
        <h1 className="text-center text-3xl font-bold mb-3">To do list</h1>
        <form className="flex" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs rounded-r-none focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-success rounded-l-none text-white">
            ADD
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddForm;
