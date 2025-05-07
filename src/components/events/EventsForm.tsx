import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

interface EventFormValues {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  seats: number;
  isFree: boolean;
}

interface EventFormProps {
  onSubmit: (
    values: EventFormValues,
    actions: FormikHelpers<EventFormValues>
  ) => void;
  initialValues?: EventFormValues;
}

const EventSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  startDate: Yup.date().required("Required"),
  endDate: Yup.date()
    .required("Required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
  price: Yup.number().min(0, "Must be positive"),
  seats: Yup.number().min(1, "At least 1 seat").required("Required"),
});

export const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  return (
    <Formik
      initialValues={
        initialValues || {
          name: "",
          description: "",
          startDate: "",
          endDate: "",
          price: 0,
          seats: 1,
          isFree: false,
        }
      }
      validationSchema={EventSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-4">
          {/* Form fields with proper TypeScript typing */}
          <div>
            <label className="block">Event Name</label>
            <Field
              name="name"
              type="text"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500"
            />
          </div>

          {/* Other form fields... */}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {initialValues?.id ? "Update Event" : "Create Event"}
          </button>
        </Form>
      )}
    </Formik>
  );
};
