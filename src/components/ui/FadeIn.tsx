import { motion } from "framer-motion"
import type { ReactNode } from "react"

type Direction = "up" | "down" | "left" | "right";

interface FadeInProps {
    children: ReactNode;
    direction?: Direction; // Por defecto, ira hacia arriba.-
    duration?: number; // Eligir la velocidad, rapido o lento.-
    delay?: number; // Tiempo de espera.-
}

export default function FadeIn({ 
    children, 
    direction = "up", 
    duration = 0.6,
    delay = 0 
}: FadeInProps) {
    
    const getDirectionOffset = () => {
        switch (direction) {
            case "up":
                return { x: 0, y: 40 };
            case "down":
                return { x: 0, y: -40 };
            case "left":
                return { x: 40, y: 0 }; // De derecha a izquierda.-
            case "right":
                return { x: -40, y: 0 }; // De izquierda a derecha.-
            default:
                return { x: 0, y: 40 };
        }
    };

    const offset = getDirectionOffset();

    return (
        <motion.div
            initial={{ 
                opacity: 0, 
                x: offset.x, 
                y: offset.y 
            }}
            whileInView={{ 
                opacity: 1, 
                x: 0, 
                y: 0 
            }}
            transition={{ 
                duration: duration,
                delay: delay,
                ease: "easeOut"
            }}
            viewport={{ once: true, margin: "-100px" }}
        >
            {children}
        </motion.div>
    );
}