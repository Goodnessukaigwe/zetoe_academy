
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen bg-[#f2f2f2] flex justify-center items-center 
    font-['Roboto_Condensed'] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-cyan-950 text-center">
          Student payment form
        </h2>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Student Name
            </label>
            <input
              type="text"
              placeholder="Enter student name "
              className="w-full border border-gray-300 rounded-lg px-3 py-2
              text-black focus:outline-none focus:ring-2 focus:ring-blue-400 " />
          </div>

          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 
               placeholder-gray-500 text-black focus:outline-none focus:ring-2
                focus:ring-blue-400"/>
          </div>

  
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Payment Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                text-gray-500 focus:outline-none 
               focus:ring-2 focus:ring-blue-400"/>
          </div>

        
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Payment Method
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 
              text-black focus:outline-none focus:ring-2
              focus:ring-blue-400 ">
        
              <option value="">Select method</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="POS">POS</option>
              {/* <option value="Online">Online</option> */}
            </select>
          </div>

        
          <button
            type="button"
            className="w-full  text-white font-semibold py-2 
            rounded-lg bg-[#3a0ca3] hover:bg-[#1d0555] transition duration-300"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  )
}

export default page