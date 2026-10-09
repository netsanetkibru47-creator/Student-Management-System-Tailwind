import { useState } from 'react';

// Letters (any language), spaces, hyphens and apostrophes only. No digits.
function isValidName(name) {
  const trimmed = name.trim();
  return trimmed.length >= 2 && /^\p{L}[\p{L}\s'-]*$/u.test(trimmed);
}

export default function StudentForm({ onAddStudent }) {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('React');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Safety check: name must be letters only (no numbers)
    if (!isValidName(name)) return alert("Student name can only contain letters");

    // Send the data up to the parent array hub
    onAddStudent({ name, course });

    // Reset the input box back to empty
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-7.5 rounded-lg bg-[#f9f9f9] p-5">
      <h3 className="my-4 text-lg font-bold">Register New Student</h3>

      <div className="mb-2.5">
        <input
          type="text"
          placeholder="Enter student name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-62.5 border border-gray-300 p-2"
        />
      </div>

      <div className="mb-2.5">
        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="w-67.5 border border-gray-300 p-2"
        >
          <option value="React">React Development</option>
          <option value="JavaScript">JavaScript Core</option>
          <option value="HTML & CSS">HTML & CSS Foundations</option>
          <option value="Python">Python Basics</option>
        </select>
      </div>

      <button
        type="submit"
        className="cursor-pointer rounded bg-emerald-500 px-3.75 py-2 text-white"
      >
        Add Student
      </button>
    </form>
  );
}
