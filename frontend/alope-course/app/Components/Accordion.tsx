import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { IconChevronDown } from 'justd-icons';
import BodySecondaryText from './BodySecondaryText';

interface AccordionProps {
    title: string;
    content: string;
    isOpen: boolean;
    onClick: () => void;
}

interface AccordionDataProps {
    title: string;
    content: string;
}

const AccordionItem: React.FC<AccordionProps> = ({
    title,
    content,
    isOpen,
    onClick,
}) => {
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div
            className={`w-full p-3 ${
                isOpen
                    ? 'rounded-xl bg-[#F9FAFB]'
                    : 'border-b border-gray-300'
            }`}
        >
            <button
                className="flex w-full items-center justify-between px-2 py-4 text-left text-[16px] font-semibold"
                onClick={onClick}
            >
                {title}
                <Icon
                    icon={
                        <IconChevronDown
                            className={`h-5 w-5 transition-transform duration-300 ${
                                isOpen ? 'rotate-180' : ''
                            }`}
                        />
                    }
                />
            </button>
            <div
                ref={contentRef}
                className={`overflow-hidden px-4 transition-all duration-300 ease-in-out ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                    maxHeight: isOpen
                        ? `${contentRef.current?.scrollHeight}px`
                        : '0px',
                }}
            >
                <div className="pb-4">
                    <BodySecondaryText text={content} />
                </div>
            </div>
        </div>
    );
};

const dummyAccordionData: AccordionDataProps[] = [
    {
        title: 'Apa itu ALOPE?',
        content:
            'ALOPE adalah platform belajar coding yang membantu pemula memahami dunia programming dengan lebih mudah.',
    },
    {
        title: 'Apakah cocok untuk pemula?',
        content:
            'Tentu saja. Semua materi dirancang agar mudah dipahami bahkan untuk yang baru mulai belajar coding.',
    },
    {
        title: 'Materi apa saja yang tersedia?',
        content:
            'Tersedia materi HTML, CSS, JavaScript, React, Laravel, dan berbagai topik web development lainnya.',
    },
];

const AccordionComponent = ({
    data = dummyAccordionData,
    defaultActive = 0,
}: {
    data?: AccordionDataProps[];
    defaultActive?: number;
}) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        if (
            defaultActive !== undefined &&
            defaultActive >= 0 &&
            defaultActive < data.length
        ) {
            setActiveIndex(defaultActive);
        }
    }, [defaultActive, data.length]);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="w-full rounded">
            {data.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    content={item.content}
                    isOpen={activeIndex === index}
                    onClick={() => toggleAccordion(index)}
                />
            ))}
        </div>
    );
};

export default AccordionComponent;