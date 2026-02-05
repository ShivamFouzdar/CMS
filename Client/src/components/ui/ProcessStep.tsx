import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export interface ProcessStepData {
    step: string;
    title: string;
    description: string;
    icon: ReactNode;
}

export interface ProcessTimelineProps {
    steps: ProcessStepData[];
    gradient: string;
    iconBg: string;
    iconColor?: string;
}

export function ProcessTimeline({
    steps,
    gradient,
    iconBg,
    iconColor
}: ProcessTimelineProps) {
    const stepCount = steps.length;

    // Calculate wave path
    const generateWavePath = () => {
        const width = 1200;
        const height = 200;
        const amplitude = 60;
        const centerY = height / 2;

        const points = steps.map((_, index) => {
            const paddingX = 0.05 * width;
            const usableWidth = width - 2 * paddingX;
            const x = paddingX + (index / (stepCount - 1)) * usableWidth;

            const isUp = index % 2 === 0;
            const y = isUp ? centerY - amplitude : centerY + amplitude;
            return { x, y };
        });

        if (points.length === 0) return "";

        let d = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            const dx = next.x - current.x;
            const cp1x = current.x + dx * 0.5;
            const cp1y = current.y;
            const cp2x = next.x - dx * 0.5;
            const cp2y = next.y;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
        }

        return d;
    };

    const wavePath = generateWavePath();

    return (
        <div className="w-full">
            {/* Desktop Sine Wave View - Enhanced Visuals */}
            <div className="relative w-full py-24 hidden md:block select-none my-16">

                {/* SVG Container for the Line */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[200px] w-full overflow-visible">
                    <svg
                        className="w-full h-full min-w-[800px] overflow-visible"
                        preserveAspectRatio="none"
                        viewBox="0 0 1200 200"
                    >
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" className="[stop-color:theme(colors.gray.200)]" />
                                <stop offset="50%" className="[stop-color:theme(colors.gray.400)]" />
                                <stop offset="100%" className="[stop-color:theme(colors.gray.200)]" />
                            </linearGradient>
                        </defs>

                        {/* Background Guide Line - Thicker and more visible */}
                        <path
                            d={wavePath}
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth="16"
                            strokeLinecap="round"
                        />

                        {/* Animated Gradient Line - Thicker */}
                        <motion.path
                            d={wavePath}
                            fill="none"
                            stroke={`url(#waveGradient)`}
                            strokeWidth="6"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            viewport={{ once: true }}
                        />
                    </svg>
                </div>

                {/* Steps Container */}
                <div className="relative h-[440px] w-full max-w-6xl mx-auto">
                    {steps.map((step, index) => {
                        const isEven = index % 2 === 0; // Peak (Up)
                        const leftPercent = 5 + (index / (stepCount - 1)) * 90;

                        return (
                            <div
                                key={index}
                                className="absolute top-1/2 -translate-y-1/2 w-0"
                                style={{ left: `${leftPercent}%` }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                    className="relative flex flex-col items-center w-72 -ml-36"
                                >

                                    {/* Icon Node ON the Wave */}
                                    {/* Larger, stronger border/shadow */}
                                    <div
                                        className={`absolute left-1/2 -translate-x-1/2 z-20 transition-transform duration-300 hover:scale-110
                                        ${isEven ? '-translate-y-[60px]' : 'translate-y-[60px]'}`}
                                    >
                                        <div className={`w-20 h-20 rounded-full bg-white border-[6px] border-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center relative ring-1 ring-gray-100`}>
                                            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 rounded-full`} />
                                            <div className={`${iconColor || 'text-gray-700'} relative z-10 transform scale-110`}>
                                                {step.icon}
                                            </div>

                                            {/* Step Number Bubble - Larger and better positioned */}
                                            <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${gradient} text-white text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white z-20`}>
                                                {step.step}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Connector Line to Icon - Enhanced Visibility */}
                                    <div className={`absolute left-1/2 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-gray-300 h-12
                                        ${isEven ? 'bottom-1/2 translate-y-[60px]' : 'top-1/2 -translate-y-[60px]'}`}
                                        style={{ height: '70px', zIndex: 0 }}
                                    />

                                    {/* Content Card */}
                                    {/* Positioned further away to clear uniform connector length */}
                                    <div
                                        className={`absolute left-1/2 -translate-x-1/2 w-72 text-center z-10
                                        ${isEven ? '-translate-y-[220px]' : 'translate-y-[150px]'}`}
                                    >
                                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 border border-gray-100 group relative overflow-hidden">
                                            {/* Top accent line */}
                                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                            <h3 className="text-lg font-bold text-gray-900 mb-2 mt-2">{step.title}</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>

                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Vertical Stack View (Preserved) */}
            <div className="md:hidden space-y-8 relative pl-4 mt-12 mb-12">
                <div className="absolute left-8 top-6 bottom-6 w-px bg-gray-200" />
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="relative pl-12"
                    >
                        <div className="absolute left-8 top-8 -translate-x-1/2 z-10">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${gradient} ring-4 ring-white shadow-sm`} />
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${iconBg} rounded-xl flex items-center justify-center ${iconColor || ''}`}>
                                    {step.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase tracking-widest`}>
                                            Step {step.step}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Keep ProcessStep export for backward compatibility if ever needed
export interface ProcessStepProps {
    step: string;
    title: string;
    description: string;
    icon: ReactNode;
    gradient: string;
    iconBg: string;
    iconColor?: string;
    isLast?: boolean;
    delay?: number;
}

export function ProcessStep(_props: ProcessStepProps) {
    // Basic fallback render if used directly
    return <div className="hidden">Legacy ProcessStep</div>;
}
