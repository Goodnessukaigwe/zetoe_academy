import React from 'react';

const Page = () => {
return (
<div className="min-h-screen bg-[#f2f2f2] px-6 py-10 font-['Roboto_Condensed']">

<h2 className="text-3xl font-bold mb-4 text-[#3a0ca3]">  
    Welcome to your Dashboard 👋  
  </h2>  
  <p className="text-gray-700 mb-8">  
    Here you can view your profile, payment status, courses, and available exams.  
  </p>  

  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">  
    <div className=" bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 text-white">  
      <h3 className="font-semibold mb-4 text-xl text-[#3a0ca3]  text-center">Profile Info</h3>  
      <div className="space-y-2  text-gray-800">  
        <p className="text-lg font-bold">Ifeanyi Ugwu</p>  
        <p className="text-sm">ifeanyi@gmail.com</p>  
        <p className="text-sm italic">Web Development</p>  
      </div>  
    </div>  

      
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">  
      <h3 className="font-semibold mb-3 text-[#3a0ca3] text-lg">Payment Status</h3>  
      <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">  
        Paid  
      </span>  
    </div>  

    
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">  
      <h3 className="font-semibold mb-3 text-[#3a0ca3] text-lg">Exams</h3>  
      <ul className="list-disc ml-5 text-gray-800">  
        <li>Web Dev Final Exam</li>  
        <li>React Basics Quiz</li>  
      </ul>  
    </div>  

    
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">  
      <h3 className="font-semibold mb-3 text-[#3a0ca3] text-lg">Courses</h3>  
      <ul className="list-disc ml-5 text-gray-800">  
        <li>Data Analysis</li>  
        <li>Project Management</li>  
      </ul>  
    </div>  
  </div>  
</div>

);
};

export default Page;