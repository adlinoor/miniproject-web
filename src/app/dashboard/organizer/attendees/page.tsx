import ProtectedRoute from "@/components/ProtectedRoute";
import AttendeeListPage from "./list/page";

export default function AttendeesPageWrapper() {
  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <AttendeeListPage />
    </ProtectedRoute>
  );
}
