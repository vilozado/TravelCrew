import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { acceptInvite } from "../services/emailService";
import { currentUser } from "../services/auth";

export default function AcceptInvite() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hasRequested = useRef(false);

  const token = params.get("token"); // Get the invite token from the URL

  useEffect(() => {
    // If the user is authenticated and there's a token, we can accept the invite
    const joinTrip = async () => {
      if (!token || hasRequested.current) return;

      const user = await currentUser();

      if (!user || !user.id) {
        navigate("/", { state: { from: `/accept-invite?token=${token}` } });
        return;
      }
      hasRequested.current = true;

      try {
        const response = await acceptInvite(token);
        navigate(`/trips/${response.tripId}`);
      } catch (error) {
        console.error(error);
        navigate("/dashboard");
      }
    };
    joinTrip();
  }, [token, navigate,]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-xl font-semibold">Accepting invitation...</h1>
    </div>
  );
}
