import Link from "next/link";

const accreditations = [
  { name: "University of Ibadan", detail: "Academic & Research Affiliation" },
  { name: "SMPIN", detail: "Strategic Management Institute" },
  { name: "NYSC Skill Acquisition (SAED)", detail: "National Youth Service Partner" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.2fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <img src="/zetelog.png" alt="" className="h-8 w-8 object-contain" />
            <h2 className="font-bold text-slate-900">Zeteo Citadel Consult</h2>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6">Partnering with institutions and learners to deliver high-quality training, certification and assessment support across Nigeria.</p>
          <address className="mt-4 space-y-1 text-xs not-italic leading-5">
            <p>North West Zone: No 6 Sabr Plaza Station, Block B, Room 17, Kachia Road</p>
            <p><a href="tel:+2348064691255" className="hover:text-[#214397]">08064691255</a></p>
            <p><a href="mailto:zeteocitadel08@gmail.com" className="hover:text-[#214397]">zeteocitadel08@gmail.com</a></p>
          </address>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900">Quick Links</h2>
          <nav className="mt-4 flex flex-col gap-3 text-sm" aria-label="Footer navigation">
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Mentorship Programs</Link>
            <Link href="/verify-certificate">Credential Verification</Link>
            <Link href="/contact">Contact Desk</Link>
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900">Accreditations</h2>
          <div className="mt-4 space-y-2">
            {accreditations.map((item) => (
              <div key={item.name} className="rounded-md bg-[#eef4ff] px-3 py-2 text-xs">
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900">Connect & Social</h2>
          <p className="mt-4 text-sm leading-6">Stay updated with application cohorts, exam centres, and institutional notices.</p>
          <div className="mt-4 flex gap-3">
            <a href="https://web.facebook.com/Zeteocitadel" target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full bg-[#eef4ff] p-2 text-xs font-bold text-[#214397]">f</a>
            <a href="mailto:zeteocitadel08@gmail.com" aria-label="Email" className="rounded-full bg-[#eef4ff] p-2 text-xs font-bold text-[#214397]">@</a>
            <a href="https://wa.me/2348064691255" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-full bg-[#eef4ff] p-2 text-xs font-bold text-[#214397]">wa</a>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-slate-100 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Zeteo Citadel Consult. All rights reserved.</p>
        <div className="flex gap-4"><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms-of-service">Terms of Service</Link></div>
      </div>
    </footer>
  );
}