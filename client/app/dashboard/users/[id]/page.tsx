"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/app/store/apis/UserApi";
import useToast from "@/app/hooks/ui/useToast";
import {
  ArrowLeft,
  Trash2,
  User,
  Shield,
  Mail,
  Calendar,
  Loader2,
} from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import { useForm } from "react-hook-form";
import Image from "next/image";
import UserForm, { UserFormData } from "../UserForm";

const UserDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  // Fetch user data
  const { data, isLoading, refetch } = useGetAllUsersQuery({});
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Find the current user
  const user = data?.users.find((u) => u.id === id);

  // Form setup
  const form = useForm<UserFormData>({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      role: "user",
      emailVerified: false,
    },
  });

  // Set form values when user data is available
  useEffect(() => {
    if (user) {
      form.reset(user);
    }
  }, [user, form]);

  // Deletion state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Handle update
  const onSubmit = async (data: UserFormData) => {
    try {
      await updateUser(data).unwrap();
      refetch();
      showToast("User updated successfully", "success");
    } catch (err) {
      console.error("Failed to update user:", err);
      showToast("Failed to update user", "error");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteUser(id).unwrap();
      showToast("User deleted successfully", "success");
      router.push("/dashboard/users");
    } catch (err) {
      console.error("Failed to delete user:", err);
      showToast("Failed to delete user", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <p className="text-gray-600 font-medium">
            Loading user information...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <User className="h-12 w-12 mx-auto mb-2 text-red-400" />
          <h2 className="text-xl font-bold">User Not Found</h2>
          <p className="mt-2 text-gray-600">
            The requested user could not be found or has been deleted.
          </p>
          <button
            onClick={() => router.push("/dashboard/users")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Return to Users List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/users")}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Users</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt={user.name}
                width={64}
                height={64}
                className="object-cover rounded-full border-2 border-white shadow-md"
              />
              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <div className="flex items-center text-gray-500 text-sm">
                <Mail size={14} className="mr-1" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 w-full md:w-auto"
              disabled={isDeleting}
            >
              <Trash2 size={16} />
              <span>{isDeleting ? "Deleting..." : "Delete User"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Information Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">
              User Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <User size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Mail size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Shield size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Calendar size={18} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Verification</p>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.emailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.emailVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Form Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">
              Edit Profile
            </h2>
            <UserForm
              form={form}
              onSubmit={onSubmit}
              isLoading={isUpdating}
              submitLabel={isUpdating ? "Saving Changes..." : "Save Changes"}
            />
          </div>
        </div>
      </div>

      {/* Activity Log or Additional Info (placeholder) */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="font-semibold text-lg mb-4 text-gray-800">
          Recent Activity
        </h2>
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center text-gray-500">
          <p>User activity tracking will be available in future updates.</p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete User"
        type="danger"
      />
    </div>
  );
};

export default UserDetailPage;
