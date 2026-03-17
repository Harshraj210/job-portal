import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Globe, Target, Heart, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- HERO SECTION --- */}
      <div className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#7315c7_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Empowering Careers, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7315c7] to-[#9324bc]">
              Connecting Talent.
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We are more than just a job board. We are a bridge between ambitious professionals and world-class companies, built on trust and innovation.
          </p>
        </div>
      </div>

      {/* --- OUR MISSION --- */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-100 rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-50 rounded-full -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                alt="Team collaborating" 
                className="rounded-2xl shadow-xl w-full object-cover h-[400px]"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                At JobPortal, we believe that everyone deserves a career they love. Our mission is to democratize access to opportunities by creating a seamless, transparent, and intelligent hiring platform.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Target, text: "Matching the right talent with the right culture." },
                  { icon: Shield, text: "Prioritizing privacy and data security." },
                  { icon: Heart, text: "Building a community, not just a database." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[#7315c7]">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="bg-[#7315c7] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { icon: Users, count: "150k+", label: "Active Users" },
              { icon: Briefcase, count: "45k+", label: "Jobs Posted" },
              { icon: Globe, count: "80+", label: "Countries" },
              { icon: Target, count: "92%", label: "Success Rate" }
            ].map((stat, idx) => (
              <div key={idx} className="p-4">
                <stat.icon className="w-8 h-8 mx-auto mb-4 opacity-80" />
                <div className="text-4xl font-bold mb-2">{stat.count}</div>
                <div className="text-purple-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- TEAM SECTION --- */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            We are a diverse group of engineers, designers, and dreamers working together to shape the future of work.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "HARSH RAJ", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" },
              
              { name: "AKSHIT AMAN", role: "Lead Engineer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80" }
            ].map((member, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-purple-50 group-hover:ring-[#7315c7] transition-all">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-[#7315c7] font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to start your journey?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of users who have found their dream jobs and built successful careers through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="px-8 py-3.5 bg-[#7315c7] text-white font-bold rounded-xl hover:bg-[#9324bc] transition-colors shadow-lg shadow-purple-200"
            >
              Get Started Now
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-3.5 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;