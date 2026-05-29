import { useEffect, useState } from "react";
import type { ActivityData } from "../types/activityData";
import { createActivity, editActivity } from "../services/activityService";

interface FormProp {
  onClose: () => void;
  onActivityCreate: () => void;
  tripId: number;
  defaultDate: string | null;
  activity?: ActivityData | null;
}

export default function ActivityForm({
  onClose,
  onActivityCreate,
  tripId,
  defaultDate,
  activity
}: FormProp) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: defaultDate || "",
    time: "",
  });
  useEffect(() => {
    if(activity) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: activity.name,
        location: activity.location,
        date: activity.date.split("T")[0],
        time: activity.time
      })
    }
  }, [activity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      if(activity) {
        await editActivity(activity.id, formData);
      } else {
        await createActivity({ ...formData, tripId } as ActivityData);
      }
      onActivityCreate();
      onClose();
    } catch (error) {
      console.log(error, "Error saving activity.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm  flex items-center justify-center z-2000"
      onClick={onClose}
    >
      <div
        className="bg-secondary p-6 rounded-xl w-106 h-125"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h1 className="text-2xl font-semibold mb-6 text-primary-txt">
            Add Activity
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="Name"
                className="block text-sm font-medium text-primary-txt"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="ex: Museum Visit"
                className="text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-primary-txt"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="ex: The Louvre"
                className="text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-text"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-primary-txt"
              >
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                className="text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                value={formData.date}
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-primary-txt"
              >
                Time
              </label>
              <input
                type="time"
                name="time"
                id="time"
                className="text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                value={formData.time}
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-3 bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 cursor-pointer"
            >
              {activity ? "Save Changes" : "Add"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


