import { useEffect, useState } from "react";
import { getTrips } from "../services/tripService";
import TripCard from "./TripCard";
import type { TripData } from "../types/tripData";
import TripForm from "./TripForm";
import NavBar from "./NavBar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { format, parseISO, addDays } from "date-fns";

export default function Dashboard() {
  const [ownTrips, setOwnTrips] = useState<TripData[]>([]);
  const [memberTrips, setMemberTrips] = useState<TripData[]>([]);
  const [isSeen, setIsSeen] = useState(false);
  const [userName] = useState(() => {
    return localStorage.getItem("userName") || "";
  });

  const fetchTrips = async () => {
    const data = await getTrips();
    setOwnTrips(data.ownTrips);
    setMemberTrips(data.memberTrips);
  };

  useEffect(() => {
     // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTrips();
  }, []);


  //combine trips you own and trips you are a member of for calendar view
  const allTrips = [...ownTrips, ...memberTrips];

  // Trip view in calendar
  const calendarEvents = allTrips.map((trip) => {
    const end = addDays(parseISO(trip.endDate), 1);

    return {
      start: format(parseISO(trip.startDate), "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
      display: "background",
      backgroundColor: "#cfdfe3",
    };
  });

  return (
    <div>
      <NavBar />
      <div className="bg-primary min-h-screen">
        <div className="flex justify-between items-center container mx-auto mb-6 pb-4 pt-5 border-b border-mist-300">
          <div className="flex flex-col justify-center">
            <span className="text-md text-primary-txt">Welcome back,</span>
            <h1 className="font-semibold text-2xl text-primary-txt">{userName.split(" ")[0]}</h1>
          </div>
          <button
            className="bg-linear-to-br from-orange-400 to-rose-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 transition-all duration-200 shadow-sm"
            onClick={() => setIsSeen(true)}
          >
            + Add a trip
          </button>
        </div>
        <div className="container mx-auto grid lg:grid-cols-[1fr_320px] gap-8 pb-10">
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-primary-txt">
                Your Upcoming Trips
              </h2>
              {ownTrips.length > 0 ? (
                <div className="flex flex-wrap gap-5">
                  {ownTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <div className="border rounded-2xl border-mist-300 text-center shadow-[0_4px_10px_rgba(0,0,0,0.20)]">
                  <p className="text-primary-txt p-7">No upcoming trips.</p>
                </div>
              )}
            </div>
            <div>
              <h2 className="mb-4 text-lg font-semibold text-primary-txt">
                Shared With You
              </h2>
              {memberTrips.length > 0 ? (
                <div className="flex flex-wrap gap-5">
                  {memberTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <div className="border rounded-2xl border-mist-300 text-center shadow-[0_4px_10px_rgba(0,0,0,0.20)]">
                  <p className="text-primary-txt p-7">No trips shared with you.</p>
                </div>
              )}
            </div>
          </div>
          {isSeen && (
            <TripForm
              onClose={() => setIsSeen(false)}
              onTripCreate={fetchTrips}
            />
          )}
          <div>
            <div className="w-80 calendar-wrapper bg-secondary rounded-2xl border border-gray-200 shadow-sm p-5">
              {" "}
              <h2 className="font-semibold text-lg text-primary-txt mb-4">
                Trip Calendar
              </h2>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                height="267px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
