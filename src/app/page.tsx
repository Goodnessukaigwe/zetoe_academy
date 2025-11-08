import React from 'react'

const page = () => {
  return (
    <div>
                {/* top navigation */}
        <div className=" sticky top-0 flex  justify-end font-opensans font-bold p-4  text-black text-20 space-x-10 bg-white ">
                    {/* logo */}
          <div className=' flex justify-center mr-180 items-center text-blue-700 w-100 h-10 space-x-0 '>
          <img src="/zetelog.png"  alt="logo" className='  h-30 w-25 ml-10 '/>
          <h1 className=' text-center font-extrabold  '>ZETEO CITADEL CONSULT  </h1>
          </div>

          <a className=' hover:text-blue-700 ' href="@link1">HOME</a><a  className=' hover:text-blue-700 ' href="@link2">ALUMNI</a> <a className=' hover:text-blue-700 ' href="@link3">CONTACT</a> <a href="li"  className=' hover:text-blue-700  mr-20'>MAIL</a>
        </div>

             {/* navigation */}
        <div className=' sticky top-18 flex justify-between font-opensans font-bold p-3 text-white-700 space-x-10  bg-blue-800 '>
                       
             
                        {/* menus */}
          <div  className='space-x-15 ml-50 text-white-800  ' > <a className=' hover:text-white hover:border hover:rounded-4xl hover:p-1' href="#">Courses</a> <a href="#" className='hover:text-white hover:border hover:rounded-4xl hover:p-1' >Academic</a> <a className='hover:text-white hover:border hover:rounded-4xl hover:p-1' href="#">About</a> <a href="#" className='hover:text-white hover:border hover:rounded-4xl hover:p-1'>Calender</a> <a href="#" className='hover:text-white hover:border hover:rounded-4xl hover:p-1'>News & Blog</a>
          </div>
                          {/* reg and signin */}
         <div className=' space-x-5 mr-20 ' ><a href="#"  className='text-white rounded-md  bg-red-700 px-4 py-2 hover:bg-blue-700 hover:text-white'>REGISTER NOW</a> <a className=' border-white p-1  text-white-700 hover:border hover:rounded-4xl hover:p-1' href="#">Sign in</a></div> 

        </div >
                
                 {/* HERO SITE */}
        <div  className='bg-amber-500 w-320 m-auto justify-center text-center rounded mt-5 h-130 p-4 rounded-1g shadow  '>

         <img src="/zetelog.png" alt="heroimage" className='  text-center m-auto w-100 h-100 object-cover '/>
         <h1 className='text-blue-600 font-bold text-4xl'>WELCOME TO ZETEO CITADEL CONSULT IN COLLABORATION WITH UNIVERSITY OF IBADAN(consultancy unit)</h1>

         </div>
         <br />
         <hr  className='shadow'/>

                      {/* programm */}

      <div className=' justify-center text-center  text-2xl ' >
         <a href="#"> <h1 className=' text-black font-bold m-10'>Our Programs</h1><p className='text-black'>...</p></a>
         
           <div className='flex justify-center text-center '>
         <div className=' rounded-3xl  text-center mt-10  m-10 bg-white w-80 h-auto p-4 rounded-1g shadow' >
             <h1 className='text-6xl m-4 border-red-600 rounded-4xl p-3'>🎓</h1>
          <h3 className='font-semibold mb-2 text-black' >Undergraduate</h3>
          <hr className='mt-5 mb-5' />
          <a href="#"  className='text-white rounded-md border bg-blue-700 px-4 py-2 hover:bg-red-700 hover:text-white'>READ MORE</a> 
        </div>

          <div className='  rounded-3xl text-center mt-10  m-10 bg-white w-80 h-auto p-4 rounded-1g shadow' >
          <h1 className='text-6xl m-4 border-red-600 rounded-4xl p-3'>🎓</h1>
          <h3 className='font-semibold mb-2 text-black' >Postgraduate</h3>
          <hr className='mt-5 mb-5' />
          <a href="#"  className='text-white rounded-md border bg-blue-700 px-4 py-2 hover:bg-red-700 hover:text-white'>READ MORE</a> 
        </div>

          <div className='  rounded-3xl text-center mt-10 m-10 bg-white w-80 h-auto p-4 rounded-1g shadow' >
           <h1 className='text-6xl m-4 border-red-600 rounded-4xl p-3'>🎓</h1>
          <h3 className='font-semibold mb-2 text-black' >Institute of Education</h3>
          <hr className='mt-5 mb-5' />
          <a href="#"  className='text-white rounded-md border bg-blue-700 px-4 py-2 hover:bg-red-700 hover:text-white'>READ MORE</a> 
        </div>

           </div>

      </div>
      <hr  className=' rounded-3xl shadow' /><br />

        {/* about us */}
      <div  className='ml-20 ' >
         <a href="#"><h1 className=' text-3xl font-bold font-10 text-black'>ABOUT US</h1></a>
          <div className='flex gap-5 w-250 m-auto h-200 pt-5'>
             <img src="/mrlaw.jpg" alt="" className='w-100 h-80 rounded-3xl' />
             <p className='text-black text-center pt-8'>The role of professionalism is key for effective and efficient work delivery. As 21st century organisation, we understand the Dynamics of the time and the ever changing world and as such, our organisation is a cutting-edge for any organisation, person, students, corps members and corporate executive who want to enhance their knowledge in Management and software application. We have seasoned professionals and experts who are passionate towards knowledge delivery alongside coaching, mentorship and consultancy.</p>

             <h2>jst trying something sh</h2>

          </div>
          
         </div>
                            
  

    
      
                    {/* footer working */}
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-25 font-bold text-white mb-3">ZETEO CITADEL CONSULT</h2>
          <p className="text-sm leading-6">
            Partner with us to tackle your unique challenges and unlock your organization’s full potential.
          </p>
          <br />
          <p>
            <span className='text-23 text-white font-bold'>North west zone address:</span> No 6 Sabr Plaza Station, Block B, Room 17 , Kachia Road
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">About</a></li>
            <li><a href="#" className="hover:text-white transition">Services</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Blog</a></li>
            <li><a href="#" className="hover:text-white transition">FAQs</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Connect With Us</h3>
          <div className="  space-x-8">
            
            <a href="#" className="  flex gap-3 hover:text-white transition">
               <img src="/twister.png" className=' w-7 ' alt="logo" />twitter
            </a>
            <br />
            <a href="#" className="  flex gap-3 hover:text-white transition">
             <img src="/instag.png" className=' w-7 ' alt="logo" /> instagram
            </a>
            <br />
            <a href="#" className=" flex gap-3 hover:text-white transition">
              <img src="/facebook.png" className=' w-7 ' alt="logo" />facebook
            </a>
            <br />
            <a href="#" className=" flex gap-3 hover:text-white transition">
             <img src="/whatsapp.png" className=' w-7 ' alt="logo" />whatsapp
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} <span className="text-white font-semibold">ZETEO CITADEL CONSULT</span>. 
          All rights reserved.
        </p>
      </div>
      </footer>

      
      <div/>
      
      
      </div>
      
      
      
  )
}

export default page



