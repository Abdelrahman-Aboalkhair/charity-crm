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
import AdminForm, { AdminFormData } from "../AdminForm";

const AdminDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  // Fetch admin data
  const { data, isLoading, refetch } = useGetAllUsersQuery({});
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Find the current admin
  const admin = data?.users.find((u: any) => u.id === id && u.role === "ADMIN");

  // Form setup
  const form = useForm<AdminFormData>({
    defaultValues: {
      name: "",
      email: "",
      avatar: "/default-avatar.png",
    },
  });

  // Set form values when admin data is available
  useEffect(() => {
    if (admin) {
      form.reset(admin);
    }
  }, [admin, form]);

  // Deletion state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Handle update
  const onSubmit = async (data: AdminFormData) => {
    try {
      await updateAdmin({ id: id as string, ...data }).unwrap();
      refetch();
      showToast("Admin updated successfully", "success");
    } catch (err) {
      console.error("Failed to update admin:", err);
      showToast("Failed to update admin", "error");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteAdmin(id as string).unwrap();
      showToast("Admin deleted successfully", "success");
      router.push("/dashboard/admins");
    } catch (err) {
      console.error("Failed to delete admin:", err);
      showToast("Failed to delete admin", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          <p className="text-gray-600 font-medium">
            Loading admin information...
          </p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <Shield className="h-12 w-12 mx-auto mb-2 text-red-400" />
          <h2 className="text-xl font-bold">Admin Not Found</h2>
          <p className="mt-2 text-gray-600">
            The requested administrator could not be found or has been deleted.
          </p>
          <button
            onClick={() => router.push("/dashboard/admins")}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
          >
            Return to Admins List
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
          onClick={() => router.push("/dashboard/admins")}
          className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Admins</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={admin.avatar || "/default-avatar.png"}
                alt={admin.name}
                width={64}
                height={64}
                className="object-cover rounded-full border-2 border-white shadow-md"
              />
              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-purple-500 border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{admin.name}</h1>
              <div className="flex items-center text-gray-500 text-sm">
                <Mail size={14} className="mr-1" />
                <span>{admin.email}</span>
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
              <span>{isDeleting ? "Deleting..." : "Delete Admin"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Information Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">
              Admin Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <User size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{admin.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Mail size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{admin.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Shield size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Administrator
                    </span>
                  </div>
                </div>
              </div>

              {admin.lastLogin && (
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Calendar size={18} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Login</p>
                    <p className="font-medium">
                      {new Date(admin.lastLogin).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Permissions Section */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-medium text-gray-700 mb-3">
                Admin Privileges
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Full Dashboard Access
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600">User Management</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Content Management
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600">System Settings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Form Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">
              Edit Admin Profile
            </h2>
            <AdminForm
              form={form}
              onSubmit={onSubmit}
              isLoading={isUpdating}
              submitLabel={isUpdating ? "Saving Changes..." : "Save Changes"}
            />
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="font-semibold text-lg mb-4 text-gray-800">
          Recent Activity
        </h2>
        {admin.activities ? (
          <div className="space-y-3">
            {admin.activities.map((activity: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
              >
                <div className="rounded-full p-2 bg-purple-100">
                  <activity.icon size={16} className="text-purple-600" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center text-gray-500">
            <p>Admin activity tracking will be available in future updates.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message={`Are you sure you want to delete admin ${admin.name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete Administrator"
        type="danger"
      />
    </div>
  );
};

export default AdminDetailPage;
