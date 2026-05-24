'use client';

import Link from 'next/link';

type Quiz = {
    id: number;
    title: string;
    slug: string;
    cover: string;
    created_at?: string;
};

function formatDateWithTime(date: string) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

export default function QuizCardComponent({
    props,
}: {
    props: Quiz;
}) {
    return (
        <Link
            href={`/quizzes/${props.slug}`}
            className="mr-5 block"
        >
            <img
                src={props.cover}
                alt="quiz cover"
                className="max-h-[150px] w-full rounded 2xl:max-h-[200px]"
                width={1280}
                height={720}
            />

            <div className="-mt-1 rounded-b text-sm xl:text-base">
                <p className="mb-2 mt-3 text-xs text-gray-500 xl:text-sm">
                    {props.created_at
                        ? formatDateWithTime(props.created_at)
                        : '-'}
                </p>

                <p className="relative flex font-medium">
                    {props.title}
                </p>
            </div>
        </Link>
    );
}