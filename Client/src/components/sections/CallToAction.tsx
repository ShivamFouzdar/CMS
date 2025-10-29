import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { fadeIn } from '@/lib/utils';
import { cn } from '@/lib/utils';

type CallToActionProps = {
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
  variant?: 'default' | 'centered' | 'simple';
  className?: string;
};

export function CallToAction({
  title,
  description,
  buttonText = 'Get Started',
  buttonHref = '#contact',
  variant = 'default',
  className = '',
}: CallToActionProps) {
  const isCentered = variant === 'centered';
  const isSimple = variant === 'simple';

  return (
    <section className={`${!isSimple ? 'py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden' : ''} ${className}`}>
      {/* Decorative elements */}
      {!isSimple && (
        <div className="absolute inset-0 w-full h-full opacity-30 sm:opacity-40 pointer-events-none">
          <div className="absolute -top-10 -right-10 sm:-top-20 sm:-right-20 w-32 h-32 sm:w-64 sm:h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute -bottom-10 -left-10 sm:-bottom-20 sm:-left-20 w-32 h-32 sm:w-64 sm:h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        </div>
      )}
      
      <div className={`container mx-auto px-3 sm:px-4 lg:px-6 relative z-10 ${!isSimple ? 'bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 border border-white/20 shadow-lg' : ''}`}>
        <div 
          className={cn(
            'flex flex-col',
            isCentered ? 'items-center text-center max-w-3xl mx-auto' : 'lg:flex-row lg:items-center lg:justify-between',
            isSimple ? 'gap-3 sm:gap-4' : 'gap-6 sm:gap-8'
          )}
        >
          <motion.div
            className={isCentered ? 'w-full' : 'lg:w-2/3'}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn('up', 0.2)}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 ${isSimple ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h2>
            <p className={`text-sm sm:text-base md:text-lg ${isSimple ? 'text-white/90' : 'text-gray-600'}`}>
              {description}
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn('up', 0.3)}
            className={isCentered ? 'mt-4 sm:mt-6' : 'mt-4 sm:mt-6 lg:mt-0 lg:ml-6'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              as="a"
              href={buttonHref}
              size="lg"
              className={`whitespace-nowrap transition-all duration-300 transform hover:scale-105 w-full sm:w-auto ${
                !isSimple 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base' 
                  : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base'
              }`}
            >
              {buttonText}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


