"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/api-client";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";

interface Props {
  initialUser: {
    first_name: string;
    last_name: string;
    profilePicture?: string;
  };
}

interface FormData {
  first_name: string;
  last_name: string;
  profilePicture?: FileList;
}

export default function EditProfileForm({ initialUser }: Props) {
  const [loading, setLoading] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState<
    string | undefined
  >(initialUser.profilePicture);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      first_name: initialUser.first_name,
      last_name: initialUser.last_name,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      let updatedUrl = profilePictureUrl;

      if (data.profilePicture?.[0]) {
        const formData = new FormData();
        formData.append("first_name", data.first_name);
        formData.append("last_name", data.last_name);
        formData.append("profilePicture", data.profilePicture[0]);

        const response = await api.put("/users/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        updatedUrl = response.data.user.profilePicture;
      } else {
        const response = await api.put("/users/profile", {
          first_name: data.first_name,
          last_name: data.last_name,
        });

        updatedUrl = response.data.user.profilePicture;
      }

      toast.success("Profile updated successfully");
      setProfilePictureUrl(updatedUrl);
      setSelectedPreview(null);

      reset({
        first_name: data.first_name,
        last_name: data.last_name,
        profilePicture: undefined,
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {(selectedPreview || profilePictureUrl) && (
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-500 mb-2">Profile Picture Preview</p>
          <img
            src={selectedPreview || profilePictureUrl}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full mx-auto border"
          />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            {...register("first_name")}
            className="input"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            {...register("last_name")}
            className="input"
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("profilePicture")}
            className="input"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Update Profile"}
        </Button>
      </form>
    </>
  );
}
