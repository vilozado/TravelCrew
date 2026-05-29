import { useState } from "react";
import { createTrip, updateTrip } from "../services/tripService";
import type { TripData } from "../types/tripData";
import { format } from "date-fns";

interface FormProps {
  onClose: () => void;
  onTripCreate?: () => void;
  trip?: TripData;
  onTripEdit?: () => void;
}
export default function TripForm({
  onClose,
  onTripCreate,
  trip,
  onTripEdit,
}: FormProps) {
  const [formData, setFormData] = useState({
    destination: trip?.destination ?? "",
    startDate: trip?.startDate ?? "",
    endDate: trip?.endDate ?? "",
  });

  const today = format(new Date(), "yyyy-MM-dd");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      if (trip && onTripEdit) {
        if (new Date(formData.startDate).getTime() < Date.now()) {
          console.log("Error updating trip: Start date cannot be in the past");
          return;
        }
        await updateTrip(trip.id, formData as TripData);
        onTripEdit();
        onClose();
        return;
      }
      if (onTripCreate) {
        if (new Date(formData.startDate).getTime() < Date.now()) {
          console.log("Error creating new trip");
          return;
        }
        await createTrip(formData as TripData);
        onTripCreate();
        onClose();
      }
    } catch (error) {
      console.log(error, "Error creating trip");
    }
  };

  return (
    <div
      className="fixed inset-0 text-primary-txt backdrop-blur-sm flex items-center justify-center z-1001"
      onClick={onClose}
    >
      <div
        className="bg-secondary p-6 rounded-xl w-106 h-106"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="">
          <h1 className="text-2xl font-semibold text-primary-txt mb-6">
            {trip ? "Edit Trip" : "Create a Trip"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-primary-txt"
              >
                Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                placeholder="ex: Paris, France"
                className="text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-text"
                value={formData.destination}
                onChange={handleChange}
                disabled={Boolean(trip)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="start-date"
                className="block text-sm font-medium text-primary-txt"
              >
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                name="startDate"
                className="text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-pointer"
                value={formData.startDate}
                min={today}
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="end-date"
                className="block text-sm font-medium text-primary-txt"
              >
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                id="end-date"
                className="text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-pointer"
                value={formData.endDate}
                min={formData.startDate || today}
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-3 bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 cursor-pointer"
            >
              {trip ? "Save Changes" : "Create"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
