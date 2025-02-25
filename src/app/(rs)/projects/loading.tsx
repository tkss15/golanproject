'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';
import { WordRotate } from '@/components/ui/wordrotate';
// ... existing code ...
export default function Loading() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='flex items-center justify-center h-screen'
        >
            <div className='flex flex-col items-center justify-center'>
                <Image src="/images/logo.png" alt="Logo" width={300} height={300} />
                <div className='flex items-center gap-2 justify-center text-2xl'>
                    <p>טוען </p>
                    <WordRotate duration={2000} className='font-bold' words={['מחלקות', 'פרויקטים', 'משתתפים', 'משתתפים']} />
                </div>
            </div>
        </motion.div>
    );
}
