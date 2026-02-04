import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { teamService, TeamMember } from '@/services/teamService';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const
    }
  },
};

export function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await teamService.getAllMembers();
        // Check if response is array (direct return) or object with data
        // Based on service implementation: return response.data which is { success: boolean, data: TeamMember[] } 
        // Wait, check service again.
        // service: return response.data;
        // logic: const response = await api.get...
        // so calling getAllMembers returns the body of the response, which is { success: boolean, data: [] }
        if (response && Array.isArray(response.data)) {
          setMembers(response.data);
        } else if (Array.isArray(response)) {
          // Fallback just in case api client unwraps it differently
          setMembers(response);
        }
      } catch (error) {
        console.error('Failed to fetch team members', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (members.length === 0) {
    return null; // Don't show section if empty
  }

  return (
    <div className="relative">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 max-w-7xl mx-auto"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {members.map((member) => (
          <motion.div key={member._id} variants={item} className="h-full">
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg bg-white border border-gray-100 hover:border-blue-200 hover:shadow-blue-100/50 flex flex-col">
              <div className="w-full h-72 sm:h-80 lg:h-96 relative overflow-hidden bg-gray-100 group">
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3b82f6&color=fff&size=400`;
                    target.className = "absolute inset-0 w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-110";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="w-full p-4 sm:p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs sm:text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-7 lg:p-8 flex-1 flex flex-col">
                <div className="space-y-2 sm:space-y-3 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-900">{member.name}</h3>
                  <p className="text-blue-600 text-sm sm:text-base font-medium">{member.role}</p>
                </div>
                <div className="flex space-x-2 sm:space-x-3 pt-3 mt-auto">
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 transition-colors duration-300 p-1.5 rounded hover:bg-blue-50"
                      aria-label={`Connect with ${member.name} on LinkedIn`}
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 transition-colors duration-300 p-1.5 rounded hover:bg-blue-50"
                      aria-label={`Follow ${member.name} on Twitter`}
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  )}
                  {member.social.email && (
                    <a
                      href={member.social.email}
                      className="text-gray-400 hover:text-blue-600 transition-colors duration-300 p-1.5 rounded hover:bg-blue-50"
                      aria-label={`Email ${member.name}`}
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
