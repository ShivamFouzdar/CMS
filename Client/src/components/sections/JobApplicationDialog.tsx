import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { JobApplicationForm } from '@/components/forms/JobApplicationForm';
import { Briefcase, ArrowRight } from 'lucide-react';

type JobApplicationDialogProps = {
  /**
   * Trigger button component (e.g., a Button)
   */
  children?: React.ReactNode;

  /**
   * Whether the dialog is open
   */
  open?: boolean;

  /**
   * Callback when dialog open state changes
   */
  onOpenChange?: (open: boolean) => void;
};

/**
 * Job Application Dialog Component
 * A dialog that contains the job application form
 */
export function JobApplicationDialog({
  children: _children,
  open,
  onOpenChange,
}: JobApplicationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const handleSuccess = () => {
    // Close dialog after successful submission (handled by form)
    setTimeout(() => {
      handleOpenChange(false);
    }, 3000);
  };

  return (
    <Dialog open={open ?? isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Join CareerMap Solutions
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-gray-600">
            Welcome to CareerMap Solutions. Please fill out the form below so our HR team can get in touch with you regarding available job opportunities.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <JobApplicationForm
            onSuccess={handleSuccess}
            onError={(error) => {
              console.error('Job application error:', error);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Standalone trigger button for the job application dialog
 */
export function JobApplicationTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-1 sm:gap-2 h-12 sm:h-14 min-h-[48px] px-4 sm:px-8 md:px-10 py-3 sm:py-4 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 rounded-xl font-semibold w-full sm:w-auto backdrop-blur-sm touch-manipulation",
          className
        )}
      >
        Find Your Job <ArrowRight className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
      </button>
      <JobApplicationDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

