import { memo, useState } from 'react';
import { Mail, Phone, MapPin, Check, Copy, Clock } from 'lucide-react';

// Optimized sub-components with Memoization
export const ContactInfoCard = memo(() => {
    const [emailCopied, setEmailCopied] = useState(false);
    const [phoneCopied, setPhoneCopied] = useState(false);

    return (
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
                Have questions about our services or want to discuss a project? Reach out to us using the information below.
            </p>

            <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                        <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Email</h4>
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <a href="mailto:info@careermapsolutions.com" className="text-gray-900 hover:text-purple-600 transition-colors font-medium break-all">
                                info@careermapsolutions.com
                            </a>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText('info@careermapsolutions.com');
                                            setEmailCopied(true);
                                            setTimeout(() => setEmailCopied(false), 1500);
                                        } catch { }
                                    }}
                                    className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-300 transition-colors text-xs font-medium flex items-center gap-1 min-h-[44px] touch-manipulation"
                                >
                                    {emailCopied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                                    {emailCopied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                        <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Phone</h4>
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <a href="tel:+919012950370" className="text-gray-900 hover:text-green-600 transition-colors font-medium">
                                +91 90129 50370
                            </a>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText('+919012950370');
                                            setPhoneCopied(true);
                                            setTimeout(() => setPhoneCopied(false), 1500);
                                        } catch { }
                                    }}
                                    className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-green-600 hover:border-green-300 transition-colors text-xs font-medium flex items-center gap-1 min-h-[44px] touch-manipulation"
                                >
                                    {phoneCopied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                                    {phoneCopied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                        <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Location</h4>
                        <p className="text-gray-900 font-medium">Gurgaon, Haryana, India</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export const BusinessHoursCard = memo(() => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Business Hours</h4>
        </div>
        <ul className="space-y-4">
            <li className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                <span className="text-gray-600 font-medium">Monday - Friday</span>
                <span className="text-gray-900 font-bold">9:00 AM - 6:00 PM</span>
            </li>
            <li className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                <span className="text-gray-500">Saturday</span>
                <span className="text-gray-500">Closed</span>
            </li>
            <li className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                <span className="text-gray-500">Sunday</span>
                <span className="text-gray-500">Closed</span>
            </li>
        </ul>
    </div>
));
