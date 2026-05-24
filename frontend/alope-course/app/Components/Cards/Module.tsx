import Link from 'next/link';
import { IconCalendar, IconClock, IconEye } from 'justd-icons';
import Icon from '../Icon';

// helper dummy
const formatDate = (date: string) => {
    try {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return date;
    }
};

const diffForHumans = (date: string) => {
    try {
        const now = new Date().getTime();
        const past = new Date(date).getTime();
        const diff = Math.floor((now - past) / 1000);

        if (diff < 60) return `${diff} detik lalu`;
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;

        return formatDate(date);
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
    description: string;
    created_at?: string;
    reads?: any[];
    writer?: {
        name?: string;
        profile?: string;
        as?: string;
    };
};

export default function ModuleCardComponent({ props }: { props: Module }) {
    return (
        <Link
            href={`/modules/${props.slug}`}
            className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 border-gray-300 bg-white"
        >
            <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                    <p className="font-semibold text-gray-900">
                        {props.title}
                    </p>
                    <div className="mb-2 mt-3 flex items-center gap-3 text-xs text-black">
                        <Icon
                            icon={<IconCalendar />}
                            label={formatDate(props.created_at || '')}
                        />
                        <Icon
                            icon={<IconClock />}
                            label={diffForHumans(props.created_at || '')}
                        />
                        <Icon
                            icon={<IconEye />}
                            label={`${props.reads?.length || 0} Views`}
                        />
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                        {strLimit(props.description, 100)}
                    </p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <img
                        src={
                            props.writer?.profile ||
                            '/images/default-user.png'
                        }
                        className="size-8 rounded-full object-cover"
                        alt={props.writer?.name}
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {props.writer?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-black">
                            {props.writer?.as ||
                                'Machine Learning Mentor'}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}