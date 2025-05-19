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
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      first_name: initialUser.first_name,
      last_name: initialUser.last_name,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (data.profilePicture?.[0]) {
        // Kalau ada file, kirim pakai FormData
        const formData = new FormData();
        formData.append("first_name", data.first_name);
        formData.append("last_name", data.last_name);
        formData.append("profilePicture", data.profilePicture[0]);

        await api.put("/users/profile", formData);
      } else {
        // Kalau tidak ada file, kirim biasa (JSON)
        await api.put("/users/profile", {
          first_name: data.first_name,
          last_name: data.last_name,
        });
      }

      toast.success("Profile updated successfully");
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <input type="text" {...register("first_name")} className="input" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Last Name
        </label>
        <input type="text" {...register("last_name")} className="input" />
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
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Update Profile"}
      </Button>
    </form>
  );
}
