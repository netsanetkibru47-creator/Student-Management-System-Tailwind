import { useState } from 'react';
import StudentCard from './StudentCard.jsx';
import StudentForm from './StudentForm.jsx';
import './App.css';

// ---- Validation helpers (letters only for names, strong password rules) ----
function isValidName(name) {
  const trimmed = name.trim();
  return trimmed.length >= 2 && /^\p{L}[\p{L}\s'-]*$/u.test(trimmed);
}

function getPasswordIssues(pw) {
  const issues = [];
  if (pw.length < 8) issues.push('at least 8 characters');
  if (!/[a-z]/.test(pw)) issues.push('a lowercase letter');
  if (!/[A-Z]/.test(pw)) issues.push('an uppercase letter');
  if (!/\d/.test(pw)) issues.push('a number');
  if (!/[^A-Za-z0-9]/.test(pw)) issues.push('a symbol (like ! or @)');
  return issues;
}

function generateStrongPassword(length = 14) {
  const sets = ['abcdefghijkmnopqrstuvwxyz', 'ABCDEFGHJKLMNPQRSTUVWXYZ', '23456789', '!@#$%^&*?'];
  const all = sets.join('');
  const rand = (max) => crypto.getRandomValues(new Uint32Array(1))[0] % max;
  const chars = sets.map((s) => s[rand(s.length)]);
  while (chars.length < length) chars.push(all[rand(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}
// ---------------------------------------------------------------------------

// Shared class strings (replaces repeated inline styles / CSS classes)
const h2Cls = 'my-[0.83em] text-2xl font-bold';
const h3Cls = 'my-4 text-lg font-bold';
const detailsCardCls = 'mt-[30px] rounded-lg bg-white p-5 shadow-sm';
const tableCls = 'w-full border-collapse text-left';
const theadRowCls = 'border-b-2 border-gray-200';
const bodyRowCls = 'border-b border-gray-50';
const metricBoxCls = 'rounded-lg p-5 text-white shadow-sm';
const clickableCls =
  'cursor-pointer transition duration-200 ease-in-out hover:scale-[1.02] hover:brightness-95';
const metricTitleCls = 'my-[1.33em] font-bold';
const metricHintCls = 'block text-[11px] font-normal opacity-80';
const metricNumCls = 'mt-2.5 mb-0 text-[32px] font-bold';
const formControlCls = 'border border-gray-300 p-2.5';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [students, setStudents] = useState([
    { id: 1, name: "Abebe", course: "JavaScript core", grade: "A+" },
    { id: 2, name: "Hana", course: "HTML & CSS Foundations", grade: "A" }
  ]);
  const [courses, setCourses] = useState(["JavaScript Core", "HTML & CSS Foundations", "React Development", "Python Basics"]);
  const [selectedEnrollStudent, setSelectedEnrollStudent] = useState('');
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState('React Development');

  // FOR THE TOGGLE CLICK
  const [isMonthDetailOpen, setIsMonthDetailOpen] = useState(false);
  const [isTopPerformerOpen, setIsTopPerformerOpen] = useState(false);

  const topPerformers = students.filter(s => s.grade.startsWith('A')).slice(0, 3);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authForm.username || !authForm.password) return alert("Fill out all fields");
    if (!isRegistered) {
      if (!isValidName(authForm.username)) return alert("Username can only contain letters");
      const issues = getPasswordIssues(authForm.password);
      if (issues.length) return alert("Password needs: " + issues.join(", "));
      setIsRegistered(true);
      alert("Registration successful! Please login.");
    } else {
      setIsLoggedIn(true);
    }
  };
  const handleAddStudent = (newStudent) => { setStudents([...students, { id: Date.now(), grade: 'A', ...newStudent }]); };
  const handleDeleteStudent = (id) => { setStudents(students.filter(s => s.id !== id)); };
  const handleEnroll = (e) => {
    e.preventDefault();
    if (!isValidName(selectedEnrollStudent)) return alert("Student name can only contain letters");
    setStudents([...students, { id: Date.now(), name: selectedEnrollStudent, course: selectedEnrollCourse, grade: 'B+' }]);
    alert(`${selectedEnrollStudent} successfully enrolled in ${selectedEnrollCourse}!`);
    setSelectedEnrollStudent('');
  };

  // Sidebar button: replaces .sidebar-nav button / .active / :hover
  const navBtnCls = (view) =>
    `mb-[5px] block w-full cursor-pointer rounded p-3 text-left text-base hover:bg-gray-700 hover:text-white ${
      currentView === view ? 'bg-gray-700 text-white' : 'text-gray-300'
    }`;

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-75 rounded-lg bg-white p-7.5 text-center shadow-md">
          <h2 className={h2Cls}>{isRegistered ? "Portal Login" : "Portal Registration"}</h2>
          <form onSubmit={handleAuthSubmit}>
            <input
              className="my-2.5 w-full border border-gray-300 p-2.5"
              type="text"
              placeholder="Username"
              value={authForm.username}
              onChange={e => setAuthForm({ ...authForm, username: e.target.value })}
            />

            <div className="relative my-2.5">
              <input
                className="w-full border border-gray-300 p-2.5 pr-10"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={authForm.password}
                onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  /* crossed eye: password is visible, click to hide */
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  /* open eye: password is hidden, click to show */
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {!isRegistered && (
              <button
                type="button"
                className="mb-2.5 cursor-pointer text-sm text-blue-600"
                onClick={() => {
                  setAuthForm({ ...authForm, password: generateStrongPassword() });
                  setShowPassword(true);
                }}
              >
                Suggest a strong password
              </button>
            )}

            <button
              className="w-full cursor-pointer rounded bg-blue-600 p-3 text-white"
              type="submit"
            >
              {isRegistered ? "Login" : "Register Account"}
            </button>
          </form>
          <p
            className="mt-3.75 mb-4 cursor-pointer text-sm text-gray-600"
            onClick={() => setIsRegistered(!isRegistered)}
          >
            {isRegistered ? "Don't have an account? Register" : "Already registered? Login"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      <aside className="bg-gray-800 px-2.5 py-5 text-white">
        <div>
          <h3 className="mt-4 mb-7.5 text-center text-lg font-bold">SMS Admin</h3>
        </div>
        <nav>
          <button className={navBtnCls('dashboard')} onClick={() => setCurrentView('dashboard')}>Dashboard</button>
          <button className={navBtnCls('courses')} onClick={() => setCurrentView('courses')}>Courses</button>
          <button className={navBtnCls('students')} onClick={() => setCurrentView('students')}>Students</button>
          <button className={navBtnCls('enroll')} onClick={() => setCurrentView('enroll')}>Enroll to Course</button>
          <button
            className="mt-10 mb-1.25 block w-full cursor-pointer rounded p-3 text-left text-base text-red-400 hover:bg-gray-700 hover:text-white"
            onClick={() => setIsLoggedIn(false)}
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="p-7.5">
        {currentView === 'dashboard' && (
          <div>
            <h2 className={h2Cls}>Overview Dashboard</h2>

            <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
              <div className={`${metricBoxCls} bg-blue-500`}>
                <h4 className={metricTitleCls}>Number of Students</h4>
                <p className={metricNumCls}>{students.length}</p>
              </div>
              <div className={`${metricBoxCls} bg-emerald-500`}>
                <h4 className={metricTitleCls}>Total Courses</h4>
                <p className={metricNumCls}>{courses.length}</p>
              </div>

              <div
                className={`${metricBoxCls} ${clickableCls} bg-violet-500`}
                onClick={() => setIsTopPerformerOpen(!isTopPerformerOpen)}
              >
                <h4 className={metricTitleCls}>
                  Top Performing <span className={metricHintCls}>(Click to view 3)</span>
                </h4>
                <p className={metricNumCls}>{students.filter(s => s.grade.startsWith('A')).length}</p>
              </div>

              <div
                className={`${metricBoxCls} ${clickableCls} bg-amber-500`}
                onClick={() => setIsMonthDetailOpen(!isMonthDetailOpen)}
              >
                <h4 className={metricTitleCls}>
                  Enrolled This Month <span className={metricHintCls}>(Click to view)</span>
                </h4>
                <p className={metricNumCls}>{students.length}</p>
              </div>
            </div>

            {isTopPerformerOpen && (
              <div className={detailsCardCls}>
                <h3 className="my-4 text-lg font-bold text-purple-800">🏆 Top 3 Star Performers</h3>
                <table className={tableCls}>
                  <thead>
                    <tr className={theadRowCls}>
                      <th className="py-2.5">Student Name</th>
                      <th>Course</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPerformers.map((student) => (
                      <tr key={student.id} className={bodyRowCls}>
                        <td className="py-3 font-medium">⭐ {student.name}</td>
                        <td className="text-gray-600">{student.course}</td>
                        <td className="font-bold text-green-600">{student.grade}</td>
                      </tr>
                    ))}
                    {topPerformers.length === 0 && (
                      <tr>
                        <td colSpan="3" className="p-5 text-center text-gray-500">
                          No students with 'A' grades yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {isMonthDetailOpen && (
              <div className={detailsCardCls}>
                <h3 className={h3Cls}>Monthly Enrollment Breakdown</h3>
                <table className={tableCls}>
                  <thead>
                    <tr className={theadRowCls}>
                      <th className="py-2.5">Student Name</th>
                      <th>Enrolled Course Course</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className={bodyRowCls}>
                        <td className="py-3 font-medium">👤 {student.name}</td>
                        <td className="text-blue-600">📘 {student.course}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {currentView === 'courses' && (
          <div>
            <h2 className={h2Cls}>Available Institutional Courses</h2>
            <ul className="my-4 list-none p-0">
              {courses.map((course, idx) => (
                <li key={idx} className="mb-2.5 rounded-md bg-white p-3.75 shadow-sm">
                  📘 {course}
                </li>
              ))}
            </ul>
          </div>
        )}

        {currentView === 'students' && (
          <div>
            <h2 className={h2Cls}>Manage Active Student Roster</h2>
            <StudentForm onAddStudent={handleAddStudent} />
            <div className="mt-5 flex flex-wrap gap-5">
              {students.map(student => (
                <StudentCard key={student.id} name={student.name} course={student.course} onDelete={() => handleDeleteStudent(student.id)} />
              ))}
            </div>
          </div>
        )}

        {currentView === 'enroll' && (
          <div>
            <h2 className={h2Cls}>Course Enrollment Registry Form</h2>
            <form onSubmit={handleEnroll}>
              <input
                className={`${formControlCls} mr-2.5`}
                type="text"
                placeholder="Type Student's Name"
                value={selectedEnrollStudent}
                onChange={e => setSelectedEnrollStudent(e.target.value)}
              />
              <select
                className={`${formControlCls} mr-2.5`}
                value={selectedEnrollCourse}
                onChange={e => setSelectedEnrollCourse(e.target.value)}
              >
                {courses.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
              <button className="cursor-pointer bg-emerald-500 px-3.75 py-2.5 text-white" type="submit">
                Submit Enrollment
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
