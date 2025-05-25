"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "@/lib/api-client";
import { toast } from "react-hot-toast";
import Button from "./ui/Button";

export interface EditProfileFormProps {
  initialUser: {
    first_name: string;
    last_name: string;
    email: string;
    profilePicture?: string;
  };
}

type FormData = {
  first_name: string;
  last_name: string;
  profilePicture?: FileList;
};

export default function EditProfileForm({ initialUser }: EditProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      first_name: initialUser.first_name,
      last_name: initialUser.last_name,
    },
  });

  const [preview, setPreview] = useState<string | null>(
    initialUser.profilePicture || null
  );

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);

    if (data.profilePicture && data.profilePicture.length > 0) {
      formData.append("profilePicture", data.profilePicture[0]);
    }

    try {
      await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated!");
      // Optionally, you can refetch profile here
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile.");
    }
  };

  // Handle preview for image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Foto profil */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Profile Picture
        </label>
        <div className="flex items-center gap-4">
          {preview && (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-14 h-14 rounded-full object-cover border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            {...register("profilePicture")}
            onChange={(e) => {
              handleImageChange(e);
              // Let React Hook Form handle file too
              register("profilePicture").onChange(e);
            }}
          />
        </div>
      </div>
      {/* Nama depan */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          First Name
        </label>
        <input
          type="text"
          className="input"
          {...register("first_name", { required: "First name is required" })}
        />
        {errors.first_name && (
          <p className="text-xs text-red-500 mt-1">
            {errors.first_name.message}
          </p>
        )}
      </div>
      {/* Nama belakang */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          className="input"
          {...register("last_name", { required: "Last name is required" })}
        />
        {errors.last_name && (
          <p className="text-xs text-red-500 mt-1">
            {errors.last_name.message}
          </p>
        )}
      </div>
      {/* Email (readonly) */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Email
        </label>
        <input
          type="email"
          className="input bg-gray-100"
          value={initialUser.email}
          readOnly
          disabled
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
