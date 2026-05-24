import Link from 'next/link';

// helper dummy
const formatDateWithTime = (date: string) => {
    try {
        return new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return date;
    }
};

const strLimit = (text: string, limit: number) => {
    if (!text) return '';
    return text.length > limit ? text.slice(0, limit) + '...' : text;
};

type Module = {
    slug: string;
    title: string;
    cover: string;
    created_at?: string;
    course?: {
        title: string;
    };
};

export default function SimpleModuleCardComponent({
    props,
    withoutBorder = false,
}: {
    props: Module;
    withoutBorder?: boolean;
}) {
    return (
        <Link
            href={`/modules/${props.slug}`}
            className={`${!withoutBorder && 'shadow'} mr-5`}
        >
            <img
                src={props.cover || 'https://placehold.co/600x400?text=No+Image'}
                alt="module cover"
                className="max-h-[150px] w-full rounded 2xl:max-h-[200px]"
                width={1280}
                height={720}
            />
            <div
                className={`-mt-1 rounded-b text-sm xl:text-base ${
                    !withoutBorder
                        ? 'border border-t-0 border-[#2276f0] p-4 2xl:p-5'
                        : 'px-1 py-2 xl:py-4'
                }`}
            >
                <div className="mb-2 flex flex-col gap-1 text-sm xl:flex-row xl:gap-2">
                    {props.course ? (
                        <>
                            <p
                                className="text-xs font-semibold text-[#2276f0] xl:text-sm"
                                title={props.course.title}
                            >
                                {strLimit(props.course.title, 15)}
                            </p>
                            <p className="hidden xl:block">&#128900;</p>
                        </>
                    ) : (
                        ''
                    )}
                    <p className="text-xs text-gray-500 xl:text-sm">
                        {formatDateWithTime(props.created_at || '')}
                    </p>
                </div>
                <p className="relative flex font-medium">
                    {props.title}
                </p>
            </div>
        </Link>
    );
}