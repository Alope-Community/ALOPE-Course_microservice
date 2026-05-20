import Link from "next/link";
import Icon from "../Icon";
import { IconCalendar, IconLocation } from "justd-icons";
import Chip from "../Chip";
import TitleHeadline from "../TitleHeadline";

const formatDateShort = (date: string) => {
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date; 
  }
};

type Event = {
  id: number | string;
  name: string;
  cover?: string;
  date: string;
  location: string;
  category: {
    name: string;
  };
};

const EventCard = ({ event }: { event: Event }) => {
  return (
    <Link
      href={`/events/${event.id}`}
      className="relative group flex min-h-96 h-[30rem] w-full min-w-sm flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md transition-all hover:shadow-xl"
    >
      <div className="h-full w-full overflow-hidden">
        <img
          src={event.cover || "https://placehold.co/600x400?text=No+Image"}
          alt={event.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white p-5">
        <div className="flex flex-col gap-4">
          <Chip label={event.category.name} />
          <TitleHeadline
            text={event.name}
            textClassName="font-sans font-semibold line-clamp-2"
          />
          <div className="flex gap-5">
            <Icon
              icon={
                <IconCalendar className="h-fit w-10 rounded-full bg-primary/20 p-2 text-primary" />
              }
              label={formatDateShort(event.date)}
              labelClassName="text-sm"
            />
            <Icon
              icon={
                <IconLocation className="h-fit w-10 rounded-full bg-primary/20 p-2 text-primary" />
              }
              label={event.location}
              labelClassName="text-sm"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
