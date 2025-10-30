import React from 'react'

const page = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-black">Welcome to your Dashboard 👋</h2>
      <p className="text-black mb-2">
        Here you can view your profile, payment status, and available exams.
      </p>
      <div className="grid  md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow text-black">
          <h3 className="font-semibold mb-2  text-black">Profile Info</h3>
          <p>Name: ifeanyi ugwu</p>
          <p>Email: ifeanyi@gmail.com</p>
          <p>Course: Web Development</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2 text-black">Payment Status</h3>
          <span className="bg-green-600 text-black px-3 py-1 rounded-b-lg text-sm font-bold">
            Paid
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2 text-black">Exams</h3>
          <ul className="list-disc ml-4 text-black">
            <li>Web Dev Final Exam</li>
            <li>React Basics Quiz</li>
          </ul>
        </div>
         <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2 text-black">Courses</h3>
          <ul className="list-disc ml-4 text-black">
            <li>Data Anaylsis</li>
            <li>project Management</li>
          </ul>
          </div>
        </div>
    </div>
  )
}

export default page
