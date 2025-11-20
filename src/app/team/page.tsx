'"use client";'
import Image from "next/image"; 

const teamMembers = [ { name: "Jane Doe", role: "CEO", image: "/images/team/jane.jpg", bio: "With over 15 years of leadership experience, Jane drives our vision with passion and innovation.", },
];

export default function ManagementTeamPage()
 { return ( <section className="min-h-screen bg-gradient-to-br  p-8"> 
 <div className="max-w-6xl mx-auto text-center"> <h1 className="text-4xl text-black font-bold mb-6">Meet Our Management Team</h1> <p className="text-lg text-black mb-12"> Our leadership team blends expertise, vision, and dedication to deliver excellence every day. </p> 

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"> {teamMembers.map((member, index) => ( 
    <div key={member.name} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }} > 

    <div className="rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"> <div className="p-4 text-center"> 
    <img src="/mrlaw.jpg" alt="mr.lawrence" />
<h2 className="text-xl text-black font-semibold mb-1">Mr. lawrence </h2> 
<p className="text-sm text-gray-500 mb-2">register</p>
 <p className="text-gray-700">married</p> 
 </div> 
 </div> 

 </div> ))}
  </div>

   </div> </section> ); }