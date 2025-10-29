export interface Review {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  date: string;
  category: string;
}

export const mockReviews: Review[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO, TechStart Inc.',
    content: 'CareerMap Solutions transformed our customer support operations. Their BPO services helped us scale efficiently while maintaining excellent service quality. The team was professional, responsive, and delivered results beyond our expectations.',
    rating: 5,
    image: '/images/avatar-1.jpg',
    date: '2024-01-15',
    category: 'BPO Services'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Director of Operations, Global Retail',
    content: 'The IT solutions provided by CareerMap have been game-changing for our e-commerce platform. Their team delivered beyond our expectations and helped us achieve a 40% increase in operational efficiency.',
    rating: 5,
    image: '/images/avatar-2.jpg',
    date: '2024-01-10',
    category: 'IT Solutions'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'HR Manager, HealthPlus',
    content: 'Their recruitment team understood our needs perfectly. We found exceptional talent in record time. Highly recommended! The quality of candidates was outstanding.',
    rating: 4,
    image: '/images/avatar-3.jpg',
    date: '2024-01-08',
    category: 'Recruitment'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Founder, LegalEase',
    content: 'The legal advisory services saved us countless hours and potential compliance issues. Professional and knowledgeable team that provided excellent guidance.',
    rating: 5,
    image: '/images/avatar-4.jpg',
    date: '2024-01-05',
    category: 'Legal Services'
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'Operations Director, TravelMasters',
    content: 'Their KPO services provided us with valuable market insights that shaped our business strategy. Exceptional analytical capabilities and detailed reporting.',
    rating: 4,
    image: '/images/avatar-5.jpg',
    date: '2024-01-03',
    category: 'KPO Services'
  },
  {
    id: 6,
    name: 'Robert Wilson',
    role: 'CTO, FinanceFlow',
    content: 'Outstanding technical support and implementation. Their team helped us modernize our infrastructure with minimal downtime. Excellent project management.',
    rating: 5,
    image: '/images/avatar-6.jpg',
    date: '2023-12-28',
    category: 'IT Solutions'
  },
  {
    id: 7,
    name: 'Maria Garcia',
    role: 'VP Marketing, RetailMax',
    content: 'The market research insights provided by CareerMap were invaluable for our expansion strategy. Data-driven and actionable recommendations.',
    rating: 5,
    image: '/images/avatar-7.jpg',
    date: '2023-12-25',
    category: 'Market Research'
  },
  {
    id: 8,
    name: 'James Anderson',
    role: 'CEO, DataCorp',
    content: 'Exceptional data analytics services. They helped us uncover hidden patterns in our customer data that led to significant revenue growth.',
    rating: 5,
    image: '/images/avatar-8.jpg',
    date: '2023-12-20',
    category: 'Data Analytics'
  },
  {
    id: 9,
    name: 'Jennifer Lee',
    role: 'Operations Manager, TechFlow',
    content: 'Their process optimization services streamlined our workflows and reduced costs by 30%. Highly professional team with great attention to detail.',
    rating: 4,
    image: '/images/avatar-9.jpg',
    date: '2023-12-18',
    category: 'Process Optimization'
  },
  {
    id: 10,
    name: 'Mark Thompson',
    role: 'Founder, StartupHub',
    content: 'CareerMap provided comprehensive business consulting that helped us scale from startup to mid-size company. Their strategic guidance was invaluable.',
    rating: 5,
    image: '/images/avatar-10.jpg',
    date: '2023-12-15',
    category: 'Business Consulting'
  },
  {
    id: 11,
    name: 'Anna Smith',
    role: 'HR Director, GlobalTech',
    content: 'Outstanding talent acquisition services. They found us the perfect candidates for our technical roles. The recruitment process was smooth and efficient.',
    rating: 5,
    image: '/images/avatar-11.jpg',
    date: '2023-12-12',
    category: 'Recruitment'
  },
  {
    id: 12,
    name: 'Carlos Rodriguez',
    role: 'CEO, EcoSolutions',
    content: 'Their sustainability consulting helped us implement green practices that improved our brand reputation and reduced operational costs.',
    rating: 4,
    image: '/images/avatar-12.jpg',
    date: '2023-12-10',
    category: 'Sustainability Consulting'
  }
];

// Service categories for filtering
export const reviewCategories = [
  'All',
  'BPO Services',
  'IT Solutions',
  'Recruitment',
  'Legal Services',
  'KPO Services',
  'Market Research',
  'Data Analytics',
  'Process Optimization',
  'Business Consulting',
  'Sustainability Consulting'
];

// Function to get reviews by category
export const getReviewsByCategory = (category: string): Review[] => {
  if (category === 'All') {
    return mockReviews;
  }
  return mockReviews.filter(review => review.category === category);
};

// Function to search reviews
export const searchReviews = (query: string): Review[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockReviews.filter(review => 
    review.name.toLowerCase().includes(lowercaseQuery) ||
    review.role.toLowerCase().includes(lowercaseQuery) ||
    review.content.toLowerCase().includes(lowercaseQuery) ||
    review.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Function to get reviews with pagination
export const getReviewsWithPagination = (page: number, limit: number = 6): { reviews: Review[], totalPages: number, currentPage: number } => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReviews = mockReviews.slice(startIndex, endIndex);
  const totalPages = Math.ceil(mockReviews.length / limit);
  
  return {
    reviews: paginatedReviews,
    totalPages,
    currentPage: page
  };
};
