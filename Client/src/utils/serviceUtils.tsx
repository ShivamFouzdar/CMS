
import { Briefcase, Scale, BarChart3, Code, UserPlus, Megaphone, Headphones, Sparkles, Monitor, ShoppingCart, Heart, Stethoscope, Home, Factory, TrendingUp, Truck, Rocket, Layers } from 'lucide-react';

export const getServiceIcon = (iconName: string, className?: string) => {
    const props = { className: className || "w-6 h-6" };

    switch (iconName) {
        case 'Briefcase': return <Briefcase {...props} />;
        case 'Scale': return <Scale {...props} />;
        case 'BarChart3': return <BarChart3 {...props} />;
        case 'Code': return <Code {...props} />;
        case 'UserPlus': return <UserPlus {...props} />;
        case 'Megaphone': return <Megaphone {...props} />;
        case 'Headphones': return <Headphones {...props} />;
        case 'Monitor': return <Monitor {...props} />;
        case 'ShoppingCart': return <ShoppingCart {...props} />;
        case 'Heart': return <Heart {...props} />;
        case 'Stethoscope': return <Stethoscope {...props} />;
        case 'Home': return <Home {...props} />;
        case 'Factory': return <Factory {...props} />;
        case 'TrendingUp': return <TrendingUp {...props} />;
        case 'Truck': return <Truck {...props} />;
        case 'Rocket': return <Rocket {...props} />;
        case 'Sparkles': return <Sparkles {...props} />;
        default: return <Layers {...props} />;
    }
};

export const getServiceGradient = (slug: string) => {
    switch (slug) {
        case 'bpo': return { gradient: "from-blue-500 to-cyan-500", bgGradient: "from-blue-50 to-cyan-50" };
        case 'kpo': return { gradient: "from-purple-500 to-pink-500", bgGradient: "from-purple-50 to-pink-50" };
        case 'legal': return { gradient: "from-indigo-500 to-purple-500", bgGradient: "from-indigo-50 to-purple-50" };
        case 'recruitment': return { gradient: "from-emerald-500 to-teal-500", bgGradient: "from-emerald-50 to-teal-50" };
        case 'it': return { gradient: "from-violet-500 to-purple-500", bgGradient: "from-violet-50 to-purple-50" };
        case 'brand-promotion': return { gradient: "from-orange-500 to-pink-500", bgGradient: "from-orange-50 to-pink-50" };
        case 'support': return { gradient: "from-indigo-500 to-blue-500", bgGradient: "from-indigo-50 to-blue-50" };
        default: return { gradient: "from-gray-500 to-slate-500", bgGradient: "from-gray-50 to-slate-50" };
    }
};

// Features map if backend doesn't provide them, or fallback
export const getServiceFeatures = (slug: string): string[] => {
    switch (slug) {
        case 'bpo': return [
            "Customer Service & Support",
            "Data Entry & Processing",
            "Sales & Lead Generation",
            "Backend Operations Management"
        ];
        case 'kpo': return [
            "Market Research & Analysis",
            "Business Intelligence",
            "Financial Research",
            "Content & Documentation"
        ];
        case 'legal': return [
            "Document Preparation",
            "Contract Management",
            "Compliance Support",
            "Legal Research"
        ];
        case 'recruitment': return [
            "Talent Sourcing",
            "Candidate Screening",
            "Interview Management",
            "Onboarding Support"
        ];
        case 'it': return [
            "React Frontend Development",
            "Express.js Backend",
            "MongoDB Database",
            "Full-Stack Integration"
        ];
        case 'brand-promotion': return [
            "Personal Branding",
            "Digital Marketing",
            "Social Media Management",
            "Creative Visual Branding"
        ];
        case 'support': return [
            "24/7 Availability",
            "Multi-channel Support",
            "AI-Powered Chatbots",
            "Global Coverage"
        ];
        default: return [
            "Professional Service",
            "Quality Assurance",
            "Dedicated Support",
            "Timely Delivery"
        ];
    }
};
