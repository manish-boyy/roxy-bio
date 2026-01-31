"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "@/config";

interface OverlayProps {
    onEnter: () => void;
}

export default function Overlay({ onEnter }: OverlayProps) {
    const [visible, setVisible] = useState(true);

    const handleClick = () => {
        setVisible(false);
        onEnter();
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8 } }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer"
                    onClick={handleClick}
                >
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }} // Just a simple fade in
                        style={{
                            color: config.themeColor || '#ffffff',
                            textShadow: `0 0 10px ${config.themeColor || 'transparent'}`
                        }}
                        className="text-lg font-mono tracking-widest uppercase"
                    >
                        Click to enter
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
