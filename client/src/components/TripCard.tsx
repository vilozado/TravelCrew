import { useNavigate } from "react-router";
import type { TripData } from "../types/tripData";
import { format, parseISO } from "date-fns";
import { CiCalendar } from "react-icons/ci";
import { GrMapLocation } from "react-icons/gr";

interface TripCardProps {
  trip: TripData;
}

export default function TripCard({ trip }: TripCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/trips/${trip.id}`)}
      className="relative rounded-xl flex flex-col w-60 cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.50)] transition duration-200 hover:scale-110 overflow-hidden"
    >
      <div className="bg-linear-to-br from-orange-400 to-rose-500 h-50 w-full"></div>
      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        <div className="flex flex-col items-center gap-2">
          <div className="text-white text-2xl">
            <GrMapLocation />
          </div>
          <h3 className="text-white font-bold text-2xl pb-1 leading-tight">
            {trip.destination}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-white text-lg">
            <CiCalendar />
          </div>
          <p className="text-white text-sm  opacity-90">
            {format(parseISO(trip.startDate), "MMM dd, yyyy")} –{" "}
            {format(parseISO(trip.endDate), "MMM dd, yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
}
