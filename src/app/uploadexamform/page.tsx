"use client";
import React, { useState } from "react";

export default function ExamUploadForm() {
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    accessCode: "",
    date: "",
    duration: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate upload success
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setFormData({
      title: "",
      course: "",
      accessCode: "",
      date: "",
      duration: "",
    });
  };

  return (
    <div>
     
            {/* top navigation */}
        <div className=" sticky top-0 flex  justify-end font-opensans font-bold p-4  text-black text-30 space-x-10 bg-white ">
                    {/* logo */}
          <div className=' flex justify-center  items-center m-auto text-blue-700   '>
          <img src="/zetelog.png"  alt="logo" className='  h-30 w-20  '/>
          <h1 className=' text-center font-extrabold  '>ZETEO CITADEL CONSULT<br /> in collaboration with university of ibadan <br />(consultancy unit)</h1>
          <img src="/ibadanlog.png"  alt="logo" className='  h-17 w-20  '/>
          <a href="#" className="text-black ml-300 absolute cursor-pointer">➜]logout</a>
          </div>

      
        </div>
             {/* navigation */}
        <div className=' sticky top-28 flex justify-between font-opensans font-bold p-3 text-white-700 space-x-10  bg-blue-800 '>
                       
             
                        {/* menus */}
          <div  className='space-x-15 text-center justify-center m-auto text-white-800  ' > <a className=' hover:text-white hover:border hover:rounded-4xl hover:p-1' href="#">home</a> <a href="#" className='hover:text-white hover:border hover:rounded-4xl hover:p-1' >Academic</a> <a className='hover:text-white hover:border hover:rounded-4xl hover:p-1' href="#">Mail</a> <a href="#" className='hover:text-white hover:border hover:rounded-4xl hover:p-1'>Calender</a> <a href="#" className='hover:text-white hover:border hover:rounded-4xl hover:p-1'>News & Blog</a>
          </div>

        </div >

      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Upload New Exam
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Exam Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Exam Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter exam title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Course
            </label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="Enter course name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Access Code */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Access Code
            </label>
            <input
              type="text"
              name="accessCode"
              value={formData.accessCode}
              onChange={handleChange}
              placeholder="Enter access code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter duration"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Upload Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Exam
          </button>
        </form>

        {/* Success Message */}
        {success && (
          <div className="mt-4 text-green-600 text-center font-medium">
            ✅ Exam uploaded successfully!
          </div>
        )}
      </div>
    </div>
    </div>
    
    
  );
}


