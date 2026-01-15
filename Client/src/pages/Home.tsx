import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { About } from '@/components/sections/About';
import { Industries } from '@/components/sections/Industries';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import { SEO } from '@/components/seo/SEO';

function Home() {
  return (
    <>
      <SEO
        title="CareerMap Solutions | Expert Business Solutions"
        description="Comprehensive business solutions including BPO, KPO, Recruitment, and Legal Services. Transforming businesses with expert strategies."
      />
      <Hero />
      <Services showAll={false} />
      <About showFullContent={false} />
      <Industries />
      <Testimonials />
      <Contact showHeader={true} />
    </>
  );
}

export default Home;
