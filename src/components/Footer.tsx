'use client'

import { FaFacebook, FaYoutube, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa'

export default function Footer({ showOnPaths = ['/about', '/contact', '/'] }: { showOnPaths: string[] }) {
  // Get the current path on the client side
  if (typeof window !== 'undefined') {
    const shouldShow = showOnPaths.includes(window.location.pathname)
    if (!shouldShow) return null
  }
  return (
    <footer className="relative bg-[#0A122A] py-12 px-8 text-white overflow-hidden">
      {/* Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-bold text-white/5 whitespace-nowrap z-0">
        MySchedule
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Column */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Company</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-[#ff6e7f] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[#ff6e7f] transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-[#ff6e7f] transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-[#ff6e7f] transition-colors">Legal</a></li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Support</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-[#ff6e7f] transition-colors">Mobile App</a></li>
            <li><a href="#" className="hover:text-[#ff6e7f] transition-colors">Web App</a></li>
            <li><a href="#" className="hover:text-[#ff6e7f] transition-colors">Contact Us</a></li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Resources</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-[#ff6e7f] transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-[#ff6e7f] transition-colors">Community</a></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Get MySchedule updates</h4>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Email"
              className="px-3 py-2 rounded-md flex-grow bg-white text-black"
            />
            <button
              type="submit"
              className="bg-[#ff6e7f] hover:bg-[#4c2c72] px-4 py-2 rounded-md transition-colors"
            >
              &gt;
            </button>
          </form>

          <div className="flex gap-4 mt-4">
            <a href="#" className="text-2xl hover:text-[#ff6e7f] transition-colors"><FaFacebook /></a>
            <a href="#" className="text-2xl hover:text-[#ff6e7f] transition-colors"><FaYoutube /></a>
            <a href="#" className="text-2xl hover:text-[#ff6e7f] transition-colors"><FaLinkedin /></a>
            <a href="#" className="text-2xl hover:text-[#ff6e7f] transition-colors"><FaInstagram /></a>
            <a href="#" className="text-2xl hover:text-[#ff6e7f] transition-colors"><FaTwitter /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
