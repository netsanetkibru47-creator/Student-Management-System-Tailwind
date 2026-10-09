export default function StudentCard({ name, course, onDelete }) {
  return (
    <div className="rounded-lg border border-[#ccc] p-3.75">
      <h2 className="my-[0.83em] text-2xl font-bold">{name}</h2>
      <p className="my-4">Course: <strong>{course}</strong></p>
      <button
        className="cursor-pointer rounded-sm border border-gray-500 bg-gray-100 px-1.5 py-0.5"
        onClick={onDelete}
      >
        Delete Student
      </button>
    </div>
  );
}