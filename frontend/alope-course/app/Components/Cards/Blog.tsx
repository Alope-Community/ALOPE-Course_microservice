import Link from 'next/link';
import NewPrimaryButton from '../PrimaryButton';

type Blog = {
    slug: string;
    title: string;
    description: string;
    cover?: string;
};

export default function SimpleBlogCardComponent({
    props,
    tag = 'Blog',
    tagColor = 'bg-blue-100 text-blue-600',
}: {
    props: Blog;
    tag?: string;
    tagColor?: string;
}) {
    return (
        <Link
            href={`/blogs/${props.slug}`}
            className="block w-full max-w-md overflow-hidden rounded-2xl bg-white transition shadow-md"
        >
            <img
                src={props.cover || '/images/thumb.png'}
                alt={props.title}
                className="h-48 w-full object-cover"
                width={1280}
                height={720}
            />
            <div className="p-5">
                <span
                    className={`mb-3 inline-block rounded-full px-3 py-1 text-sm font-medium ${tagColor}`}
                >
                    {tag}
                </span>
                <p className="mb-2 line-clamp-2 min-h-[56px] text-xl font-semibold">
                    {props.title}
                </p>
                <p className="mb-4 line-clamp-3 min-h-[60px] text-sm text-gray-600">
                    {props.description}
                </p>
                <NewPrimaryButton
                    text="Baca Selengkapnya"
                    showIcon
                    circleIcon
                    className="!px-4 !py-2 text-sm"
                    onClick={(e) => e.preventDefault()}
                />
            </div>
        </Link>
    );
}