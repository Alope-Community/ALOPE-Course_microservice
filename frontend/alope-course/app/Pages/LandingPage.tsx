'use client';

import Head from 'next/head';
import Link from 'next/link';

import AccordionComponent from '../Components/Accordion';
import BodySecondaryText from '../Components/BodySecondaryText';
import SimpleBlogCardComponent from '../Components/Cards/Blog';
import CourseCardComponent from '../Components/Cards/CourseCard';
import ModuleCardComponent from '../Components/Cards/Module';
import TestimonialCardComponent from '../Components/Cards/Testimonial';
import { EmptyStateBox } from '../Components/EmptyStateBox';
import FooterComponent from '../Components/Footer';
import NavbarComponent from '../Components/Navbar';
import NewPrimaryButton from '../Components/PrimaryButton';
import { SubText } from '../Components/SubText';
import { TitleText } from '../Components/TitleText';


import {
    IconBookOpen,
    IconCircleCheckFill,
    IconSend3,
} from 'justd-icons';

const courses = [
    {
        id: 1,
        title: 'Belajar React JS',
        slug: 'belajar-react-js',

        thumbnail: '/images/course-1.jpg',
        cover: '/images/course-1.jpg',

        description: 'Belajar React dari dasar',

        visibility: 'public' as const,

        category: {
            id: 1,
            name: 'Frontend',
            slug: 'frontend',
        },

        modules: [
            {
                id: 1,
                title: 'Pengenalan React',
            },
            {
                id: 2,
                title: 'Component React',
            },
        ],
    },

    {
        id: 2,
        title: 'Belajar Laravel',
        slug: 'belajar-laravel',

        thumbnail: '/images/course-2.jpg',
        cover: '/images/course-2.jpg',

        description: 'Laravel modern framework',

        visibility: 'public' as const,

        category: {
            id: 2,
            name: 'Backend',
            slug: 'backend',
        },

        modules: [
            {
                id: 1,
                title: 'Routing Laravel',
            },
        ],
    },

    {
        id: 3,
        title: 'Belajar Next JS',
        slug: 'belajar-next-js',

        thumbnail: '/images/course-3.jpg',
        cover: '/images/course-3.jpg',

        description: 'Fullstack React framework',

        visibility: 'public' as const,

        category: {
            id: 3,
            name: 'Fullstack',
            slug: 'fullstack',
        },

        modules: [
            {
                id: 1,
                title: 'App Router',
            },
        ],
    },
];

const modules = [
    {
        id: 1,
        title: 'HTML Dasar',
        slug: 'html-dasar',

        description:
            'Belajar struktur dasar HTML untuk membuat website.',
    },

    {
        id: 2,
        title: 'CSS Flexbox',
        slug: 'css-flexbox',

        description:
            'Belajar layout modern menggunakan Flexbox.',
    },

    {
        id: 3,
        title: 'JavaScript DOM',
        slug: 'javascript-dom',

        description:
            'Manipulasi elemen website menggunakan JavaScript DOM.',
    },
];


const blogs = [
    {
        id: 1,
        title: 'Kenapa Harus Belajar React?',
        slug: 'kenapa-react',
        thumbnail: '/images/blog-1.jpg',

        description:
            'React adalah library JavaScript populer untuk membangun UI modern.',
    },

    {
        id: 2,
        title: 'Belajar Tailwind CSS',
        slug: 'belajar-tailwind',
        thumbnail: '/images/blog-2.jpg',

        description:
            'Tailwind CSS membantu membuat tampilan website lebih cepat dan efisien.',
    },

    {
        id: 3,
        title: 'Tips Frontend Developer',
        slug: 'tips-frontend',
        thumbnail: '/images/blog-3.jpg',

        description:
            'Pelajari roadmap frontend developer modern dari dasar hingga advanced.',
    },
];

const testimonials = [
    {
        id: 1,

        rating: 5,

        profession: 'Frontend Developer',

        message: 'Materinya mudah dipahami!',

        user: {
            id: 1,
            name: 'Budi',
            avatar: '/images/user-1.png',
        },
    },

    {
        id: 2,

        rating: 5,

        profession: 'Backend Developer',

        message: 'Cocok untuk pemula.',

        user: {
            id: 2,
            name: 'Andi',
            avatar: '/images/user-2.png',
        },
    },

    {
        id: 3,

        rating: 4,

        profession: 'Fullstack Developer',

        message: 'Penjelasannya detail.',

        user: {
            id: 3,
            name: 'Salsa',
            avatar: '/images/user-3.png',
        },
    },
];



export default function LandingPage() {
    return (
        <div className="bg-white">
            <Head>
                <title>Welcome</title>
            </Head>
            <NavbarComponent />
            <header className="relative min-h-[800px] overflow-hidden bg-gradient-to-tr from-white to-yellow-50 pt-20 md:pt-16">
                <div className="container relative z-10 mx-auto flex flex-col items-center justify-between px-4 py-10 text-center md:px-10 lg:px-14 lg:text-left xl:flex-row xl:px-20">
                    <div className="order-2 flex w-full flex-col gap-10 px-3 text-center sm:w-3/4 sm:px-0 xl:order-1 xl:w-1/2 xl:text-left">
                        <h1 className="font-spartan text-[40px] font-medium leading-tight text-black md:text-5xl xl:text-6xl">
                            Tingkatkan Skill Coding dari Nol hingga Mahir!
                        </h1>

                        <BodySecondaryText
                            text="Belajar coding dari nol hingga mahir dengan panduan lengkap dan materi terstruktur."
                        />

                        <div className="flex justify-center xl:justify-start">
                            <Link href="/courses">
                                <NewPrimaryButton
                                    text="Mulai Belajar Sekarang"
                                    circleIcon
                                    showIcon
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="relative order-1 mt-10 hidden w-[70%] justify-center lg:mt-0 lg:flex xl:order-2 xl:w-1/2">
                        <img
                            src="/images/header.png"
                            alt="Belajar coding"
                            className="relative z-10 object-cover md:w-[70%] md:object-contain lg:object-cover xl:h-auto xl:w-[85%] xl:max-w-[600px] xl:object-contain"
                        />
                        <div className="absolute left-[10%] top-10 z-20 flex translate-x-6 items-center gap-2 rounded-xl bg-white px-3 py-1.5 shadow-lg">
                            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-yellow-400 text-white">
                                <IconSend3 className="h-3 w-3" />
                            </div>

                            <span className="text-xs font-semibold text-grey">
                                Effective Learning
                            </span>
                        </div>
                        <div className="absolute bottom-20 left-[8%] z-20 flex translate-x-8 items-center gap-2 rounded-xl bg-white px-3 py-1.5 shadow-lg">
                            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-600 text-white">
                                <IconSend3 className="h-3 w-3" />
                            </div>

                            <span className="text-xs font-semibold text-grey">
                                Upgrade Skill
                            </span>
                        </div>
                        <div className="absolute bottom-12 right-6 z-20 flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 shadow-lg">
                            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-white">
                                <IconBookOpen className="h-3 w-3" />
                            </div>

                            <span className="text-xs font-semibold text-grey">
                                Learn by Doing
                            </span>
                        </div>
                    </div>
                </div>
            </header>
            <section className="py-10">
                <div className="container mx-auto px-4 py-4 md:px-10 xl:px-20">
                    <div className="hidden w-[90%] text-black sm:block lg:hidden">
                        <SubText text="Why Choose Us" />

                        <TitleText text="Belajar Coding dengan Pendekatan yang Tepat" />
                    </div>

                    <div className="flex flex-col items-center gap-12 text-black md:flex-row md:items-center">
                        <div className="flex w-full justify-center md:w-1/2">
                            <img
                                src="/images/why-choose-us.png"
                                alt="student"
                                className="w-full max-w-sm object-contain md:max-w-md"
                            />
                        </div>

                        <div className="flex w-full flex-col items-center gap-5 text-center md:w-1/2 md:items-start md:text-left">
                            <div className="block sm:hidden lg:block">
                                <SubText text="Why Choose Us" />

                                <TitleText text="Belajar Coding dengan Pendekatan yang Tepat" />
                            </div>

                            <ul className="space-y-3 text-grey">
                                {[
                                    'Materi Terarah & Terstruktur',
                                    'Fokus pada Konsep Dasar',
                                    'Fleksibel & Ramah Pemula',
                                    'Komunitas yang Mendukung',
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3"
                                    >
                                        <IconCircleCheckFill className="size-5 text-green-500" />

                                        <BodySecondaryText text={item} />
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-3">
                                <Link href="/courses">
                                    <NewPrimaryButton
                                        text="Mulai Belajar Sekarang"
                                        circleIcon
                                        showIcon
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-10">
                <div className="container mx-auto flex flex-col gap-5 px-6 py-8 text-black md:px-10 lg:px-14 xl:px-20">
                    <SubText text="Choose Your Path" />

                    <TitleText text="Pilih Jalur Pembelajaran Sesuai Minatmu" />

                    <div className="mt-5 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courses.slice(0, 3).map((course, index) => (
                            <CourseCardComponent
                                key={index}
                                course={course}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-10">
                <div className="container mx-auto px-6 py-8 text-black md:px-10 lg:px-14 xl:px-20">
                    <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-start lg:justify-between">
                        <div className="flex flex-col gap-5">
                            <SubText text="POPULAR MODULES" />

                            <TitleText text="Materi Pembelajaran Terpopuler Saat Ini" />
                        </div>

                        <Link
                            href="/modules"
                            className="hidden min-w-fit gap-2 text-sm font-medium text-primary hover:underline md:flex"
                        >
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {modules.map((module, index) => (
                            <div
                                key={index}
                                className={
                                    index >= 2
                                        ? 'md:hidden lg:block'
                                        : ''
                                }
                            >
                                <ModuleCardComponent props={module} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-10">
                <div className="container mx-auto px-6 py-8 text-black md:px-10 lg:px-14 xl:px-20">
                    <div className="flex flex-col gap-10 md:flex-row md:items-center lg:justify-between">
                        <div className="flex flex-col gap-5">
                            <SubText text="From Our Blog" />

                            <TitleText text="Cerita, Tren & Insight Seputar Dunia Teknologi" />
                        </div>
                    </div>

                    <div className="mt-5">
                        {blogs.length > 0 ? (
                            <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-3">
                                {blogs.slice(0, 3).map((blog, index) => (
                                    <div
                                        key={index}
                                        className={
                                            index >= 2
                                                ? 'md:hidden lg:block'
                                                : ''
                                        }
                                    >
                                        <SimpleBlogCardComponent props={blog} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyStateBox
                                title="Belum ada artikel terbaru"
                                description="Saat ini belum ada artikel yang tersedia."
                            />
                        )}
                    </div>
                </div>
            </section>
            <section className="my-10 bg-[#F9FAFB] py-10">
                <div className="container mx-auto px-6 py-8 text-black md:px-10 lg:px-14 xl:px-20">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-5">
                            <SubText text="What They Say" />

                            <TitleText text="Apa Kata Mereka yang Sudah Belajar" />
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {testimonials.length > 0 ? (
                            testimonials.map((item, i) => (
                                <div
                                    key={i}
                                    className={
                                        i >= 2
                                            ? 'md:hidden lg:block'
                                            : ''
                                    }
                                >
                                    <TestimonialCardComponent
                                        testimonial={item}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-1 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 py-16 text-center text-gray-500 sm:col-span-2 lg:col-span-3">
                                <p className="text-lg font-semibold text-gray-900">
                                    Belum ada testimoni
                                </p>

                                <p className="max-w-md text-sm text-gray-500">
                                    Jadilah yang pertama memberikan
                                    testimoni
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <section className="py-10">
                <div className="container mx-auto grid grid-cols-1 gap-10 px-6 py-8 text-black md:px-10 lg:grid-cols-2 lg:px-14 xl:px-20">
                    <div className="flex flex-col gap-5">
                        <SubText text="Frequently Asked Questions" />

                        <TitleText text="Hal-hal yang Sering Kamu Tanyakan" />
                    </div>

                    <div className="w-full">
                        <AccordionComponent
                            data={[
                                {
                                    title: 'Apa itu ALOPE?',
                                    content:
                                        'ALOPE adalah komunitas programming untuk pemula.',
                                },
                                {
                                    title: 'Apakah cocok untuk pemula?',
                                    content:
                                        'Ya, semua materi dimulai dari dasar.',
                                },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <FooterComponent />
        </div>
    );
}