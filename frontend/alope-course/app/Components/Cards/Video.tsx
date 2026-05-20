import Link from 'next/link';

export default function VideoCardComponent({
    title,
    video_link,
    video_duration,
    course_name,
    category_name,
    video_slug,
}: {
    title: string;
    video_link: string;
    course_name: string;
    video_duration: string;
    category_name: string;
    video_slug: string;
}) {
    return (
        <Link
            href={`/videos/${video_slug}`}
            className={`mr-5 w-full overflow-hidden rounded-md border border-t-0 border-[#2276f0] bg-gray-50 shadow`}
        >
            <div className="relative h-[200px]">
                <iframe
                    src={video_link}
                    title="YouTube video player"
                    frameBorder="0"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="h-full w-full"
                    allowFullScreen
                ></iframe>
            </div>
            <div className="rounded-b-md px-3 pb-3 pt-2">
                <small className="text-xs italic text-[#2276f0]">
                    #{category_name}
                </small>
                <p className="mt-2 font-semibold">
                    {title}
                </p>
                <p className="mt-1 text-xs text-gray-800">
                    <span className="font-medium">{course_name}</span>
                    {' - '}(Durasi {video_duration})
                </p>
            </div>
        </Link>
    );
}