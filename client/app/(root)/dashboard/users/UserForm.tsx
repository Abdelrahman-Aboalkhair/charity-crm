import { Controller, UseFormReturn } from "react-hook-form";
import { Users } from "lucide-react";

export interface UserFormData {
  id: string | number;
  name: string;
  email: string;
  role: "admin" | "user"; // Assuming roles from your table
  emailVerified: boolean;
}

interface UserFormProps {
  form: UseFormReturn<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const UserForm: React.FC<UserFormProps> = ({
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
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="John Doe"
              />
            )}
          />
          <Users className="absolute left-3 top-3.5 text-gray-400" size={18} />
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
              message: "Invalid email format",
            },
          }}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="john.doe@example.com"
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <Controller
          name="role"
          control={control}
          rules={{ required: "Role is required" }}
          render={({ field }) => (
            <select
              {...field}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}
        />
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* Email Verified */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Verified
        </label>
        <Controller
          name="emailVerified"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              value={field.value ? "true" : "false"}
              onChange={(e) => field.onChange(e.target.value === "true")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          )}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
