import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { fadeIn } from '@/lib/utils';

const teamMembers = [
  {
    id: 1,
    name: 'Shivam Fouzdar',
    role: 'CEO & Founder',
    image: '/images/team/shivam-fouzdar.jpg',
    bio: 'Shivam has over 15 years of experience in business strategy and leadership, helping companies scale and achieve their goals.',
    social: {
      twitter: '#',
      linkedin: '#',
      email: 'mailto:shivam@careermapsolutions.com'
    }
  },
  {
    id: 2,
    name: 'Asheesh Rathore',
    role: 'CTO',
    image: '/images/team/asheesh-rathore.jpg',
    bio: 'Asheesh leads our technology initiatives with 12+ years of experience in software development and technical leadership.',
    social: {
      twitter: '#',
      linkedin: '#',
      email: 'mailto:asheesh@careermapsolutions.com'
    }
  },
  {
    id: 3,
    name: 'Kaushal Chaudhar',
    role: 'Head of Product',
    image: '/images/team/kaushal-chaudhar.jpg',
    bio: 'Kaushal specializes in product strategy and user experience, ensuring our solutions meet real business needs.',
    social: {
      twitter: '#',
      linkedin: '#',
      email: 'mailto:kaushal@careermapsolutions.com'
    }
  },
  {
    id: 4,
    name: 'Shushant Singh',
    role: 'Head of Customer Success',
    image: '/images/team/shushant-singh.jpg',
    bio: 'Shushant ensures our clients achieve their desired outcomes through exceptional service and support.',
    social: {
      twitter: '#',
      linkedin: '#',
      email: 'mailto:shushant@careermapsolutions.com'
    }
  }
];

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
  return (
    <div className="relative">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {teamMembers.map((member) => (
          <motion.div key={member.id} variants={item} className="h-full">
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg bg-white border border-gray-100 hover:border-blue-200 hover:shadow-blue-100/50">
              <div className="aspect-square w-full overflow-hidden relative group">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3b82f6&color=fff&size=400`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-6">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs sm:text-sm">{member.bio}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-900">{member.name}</h3>
                  <p className="text-blue-600 text-xs sm:text-sm font-medium">{member.role}</p>
                  <div className="flex space-x-2 sm:space-x-3 pt-2">
                    <a 
                      href={member.social.linkedin} 
                      className="text-gray-400 hover:text-blue-600 transition-colors duration-300 p-1 rounded hover:bg-blue-50"
                      aria-label={`Connect with ${member.name} on LinkedIn`}
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a 
                      href={member.social.email} 
                      className="text-gray-400 hover:text-blue-600 transition-colors duration-300 p-1 rounded hover:bg-blue-50"
                      aria-label={`Email ${member.name}`}
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
