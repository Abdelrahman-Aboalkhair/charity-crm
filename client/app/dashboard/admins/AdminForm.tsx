import { Controller, UseFormReturn } from "react-hook-form";
import { ShieldCheck } from "lucide-react";

export interface AdminFormData {
  id?: string; // Optional for create
  name: string;
  email: string;
  avatar?: string;
}

interface AdminFormProps {
  form: UseFormReturn<AdminFormData>;
  onSubmit: (data: AdminFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const AdminForm: React.FC<AdminFormProps> = ({
  form,
  onSubmit,
  isLoading,
  submitLabel = "Save",
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <div className="relative">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                placeholder="Admin Name"
              />
            )}
          />
          <ShieldCheck
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              placeholder="admin@example.com"
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Avatar URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avatar URL (Optional)
        </label>
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              placeholder="/default-avatar.png"
              value={field.value || ""}
            />
          )}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default AdminForm;
