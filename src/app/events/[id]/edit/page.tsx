import ProtectedRoute from "@/components/ProtectedRoute";
import EditEventPage from "./EditEventPage";

export default function EditEventWrapper() {
  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <EditEventPage />
    </ProtectedRoute>
  );
}
