import React from 'react'

const page = () => {
  return (
    <div>
                {/* top navigation */}
        <div className=" sticky top-0 flex  justify-end font-opensans font-bold p-3 text-blue-800 text-sm space-x-10 bg-white ">
          <a href="@link1">HOME</a><a href="@link2">ALUMNI</a> <a href="@link3">CONTACT</a> <a href="li">MAIL</a>
        </div>

             {/* navigation */}
        <div className=' sticky top-11 flex justify-between font-opensans font-bold p-3 text-white-700 space-x-10  bg-blue-800 '>
                       
                       {/* logo */}
          <div className=' flex justify-center items-center  w-40 h-10 space-x-3 '>
          <img src="/zetelog.png"  alt="logo" className='  rounded-bl-md bg-white h-16 w-16 '/>
          <h1 className=' text-1xl text-white-800 '>ZETEO CITADEL </h1>
          </div>
                        {/* menus */}
          <div  className='space-x-15 text-white-800 ' > <a className='hover:text-red-800' href="#">Courses</a> <a href="#" className='hover:text-red-800' >Academic</a> <a className='hover:text-red-800' href="#">About</a> <a href="#" className='hover:text-red-800'>Calender</a> <a href="#" className='hover:text-red-800'>News & Blog</a>
          </div>
                          {/* reg and signin */}
         <div className=' space-x-5  mr-20' ><a href="#"  className='text-white rounded-md border bg-red-700 px-4 py-2 hover:bg-blue-700 hover:text-white'>REGISTER NOW</a> <a className='hover:text-red-800 text-white-700' href="#">Signin</a></div> 

        </div >
                
                 {/* HERO SITE */}
        <div  className='bg-white w-320 m-auto rounded mt-5 h-130 p-4 rounded-1g shadow  '>

         <img src="/ibadan.jpg" alt="heroimage" className=' w-full h-133 object-cover '/>

         </div>

                      {/* programm */}

      <div className=' justify-center text-2xl text-center' >
         <a href="#"> <h1 className=' text-blue-500 font-bold m-10'>Our Programs</h1><p className='text-black'>...</p></a>
         <hr  className='shadow'/>
       <div className='flex'>
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

        {/* display */}
      <div  className='ml-20' >
         <a href="#"><h1 className=' font-bold font-10 text-black'>ABOUT US</h1></a>
        <div className='   flex text-center mt-10 rounded   w-300 h-105 p-4  ' >
          <img src="/mrlaw.jpg" alt="" className=' rounded-4xl w-120 h-90' />
          <p className='text-center justify-center mt-10 text-black font-roboto ' >The role of professionalism is key for effective and efficient work delivery. As 21st century organisation, we understand the Dynamics of the time and the ever changing world and as such, our organisation is a cutting-edge for any organisation, person, students, corps members and corporate executive who want to enhance their knowledge in Management and software application. We have seasoned professionals and experts who are passionate towards knowledge delivery alongside coaching, mentorship and consultancy.</p>
          
           </div>

        </div>


        <div/>
 

      
                    {/* footer working */}
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">YourBrand</h2>
          <p className="text-sm leading-6">
            Building modern web experiences with passion and creativity. 
            Follow us to stay inspired.
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
              <img src="/fb1.png" className=' w-7 ' alt="logo" />facebook
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
