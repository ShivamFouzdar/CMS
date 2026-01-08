const URL = 'http://localhost:5000/api/services';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTVkMzBmM2NlYWYxODI2ODZhZGE2ZTciLCJlbWFpbCI6ImFkbWluQGNhcmVlcm1hcHNvbHV0aW9ucy5jb20iLCJyb2xlIjoiYWRtaW4iLCJzZXNzaW9uSWQiOiJzZXNzXzRhODk3OTEwLWRiYTktNDM2OS1hZjYxLTZkMWMyYmM5MTU3NiIsImlhdCI6MTc2Nzc3MzEwMCwiZXhwIjoxNzY4Mzc3OTAwfQ.Xm5X0Vmtv1OOIMDDw8Jucin5mmnrhKLG_grBYtS9XAg';

const services = [
  {
    name: 'BPO Services',
    slug: 'bpo',
    shortDescription: 'Comprehensive business process outsourcing solutions.',
    description: 'Comprehensive business process outsourcing solutions to streamline your operations and reduce costs and improve efficiency across all departments.',
    category: 'BPO Services',
    icon: 'Briefcase'
  },
  {
    name: 'IT Services',
    slug: 'it',
    shortDescription: 'Modern web applications and digital solutions.',
    description: 'Full-stack development services for modern web applications and digital solutions using the latest technologies and best practices in the industry.',
    category: 'IT Services',
    icon: 'Code'
  },
  {
    name: 'Recruitment',
    slug: 'recruitment',
    shortDescription: 'Talent acquisition and HR solutions.',
    description: 'Comprehensive talent acquisition and HR solutions to build high-performing teams and find the best fit for your organization culture and goals.',
    category: 'Recruitment',
    icon: 'UserPlus'
  },
  {
    name: 'Legal Services',
    slug: 'legal',
    shortDescription: 'Expert legal support and documentation.',
    description: 'Professional legal support and documentation services for businesses of all sizes, ensuring compliance and peace of mind in all legal matters.',
    category: 'Legal Services',
    icon: 'Scale'
  },
  {
    name: 'KPO Services',
    slug: 'kpo',
    shortDescription: 'Research, analysis, and intellectual property solutions.',
    description: 'Knowledge process outsourcing for research, analysis, and intellectual property solutions, providing deep insights and strategic value to your business.',
    category: 'KPO Services',
    icon: 'BarChart3'
  },
  {
    name: 'Brand Promotion & Marketing',
    slug: 'brand-promotion',
    shortDescription: 'Build a strong professional identity.',
    description: 'Build a strong professional identity with comprehensive branding and marketing solutions designed to reach your target audience effectively.',
    category: 'Other',
    icon: 'Megaphone'
  },
  {
    name: 'Customer Support',
    slug: 'support',
    shortDescription: '24/7 round-the-clock customer assistance.',
    description: 'Exceptional customer support that never sleeps, providing round-the-clock assistance across multiple channels to keep your customers happy.',
    category: 'Customer Support',
    icon: 'Headphones'
  }
];

async function seed() {
  for (const service of services) {
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(service)
      });
      const result = await response.json();
      if (response.ok) {
        console.log(`Seeded: ${service.name}`);
      } else if (result.message && result.message.includes('already exists')) {
        console.log(`Skipping (already exists): ${service.name}`);
      } else {
        console.error(`Error seeding ${service.name}:`, result);
      }
    } catch (error) {
      console.error(`Error seeding ${service.name}:`, error.message);
    }
  }
}

seed();
