import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { About } from '@/components/sections/About';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';

function Home() {
  return (
    <>
      <Hero />
      <Services showAll={false} />
      <About showFullContent={false} />
      <Testimonials />
      <Contact showHeader={true} />
    </>
  );
}

export default Home;
