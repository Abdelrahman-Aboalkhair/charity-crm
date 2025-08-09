"use client";
import Table from "@/app/components/layout/Table";
import {
  useCreateAdminMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/app/store/apis/UserApi";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Loader2,
  AlertCircle,
  Trash2,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import useToast from "@/app/hooks/ui/useToast";
import ToggleableText from "@/app/components/atoms/ToggleableText";
import { useForm } from "react-hook-form";
import AdminForm, { AdminFormData } from "./AdminForm";

const AdminsDashboard = () => {
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useGetAllUsersQuery({});
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteUserMutation();
  const admins =
    data?.users?.filter((user: any) => user.role === "ADMIN") || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminFormData | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);

  const form = useForm<AdminFormData>({
    defaultValues: {
      name: "",
      email: "",
      avatar: "/default-avatar.png",
    },
  });

  const handleCreateOrUpdate = async (data: AdminFormData) => {
    try {
      if (editingAdmin) {
        await updateAdmin({ id: editingAdmin.id!, ...data }).unwrap();
        showToast("Admin updated successfully", "success");
      } else {
        await createAdmin({ ...data, role: "ADMIN" }).unwrap();
        showToast("Admin created successfully", "success");
      }
      setIsModalOpen(false);
      setEditingAdmin(null);
      form.reset();
      refetch();
    } catch (err) {
      console.error("Failed to save admin:", err);
      showToast("Failed to save admin", "error");
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      await deleteAdmin(adminToDelete).unwrap();
      setIsConfirmModalOpen(false);
      setAdminToDelete(null);
      refetch();
      showToast("Admin deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete admin:", err);
      showToast("Failed to delete admin", "error");
    }
  };

  const columns = [
    {
      key: "id",
      label: "Admin ID",
      sortable: true,
      render: (row: any) => (
        <ToggleableText content={row.id} truncateLength={10} />
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row: any) => (
        <div className="flex items-center space-x-3">
          <Image
            src={row.avatar || "/default-avatar.png"}
            alt={row.name}
            width={36}
            height={36}
            className="object-cover rounded-full border border-gray-200 shadow-sm"
          />
          <span className="text-sm font-medium text-gray-800">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      render: (row: any) => (
        <a
          href={`mailto:${row.email}`}
          className="text-sm text-blue-600 hover:underline"
        >
          {row.email}
        </a>
      ),
      sortable: true,
    },
    {
      key: "emailVerified",
      label: "Verified",
      render: (row: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.emailVerified
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.emailVerified ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-gray-600">
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Updated",
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-gray-600">
          {new Date(row.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingAdmin(row);
              form.reset(row);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <Pencil size={16} />
            Edit
          </button>
          <button
            onClick={() => {
              setAdminToDelete(row.id);
              setIsConfirmModalOpen(true);
            }}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
            disabled={isDeleting && adminToDelete === row.id}
          >
            <Trash2 size={16} />
            {isDeleting && adminToDelete === row.id ? "Deleting..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Admins Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {admins.length} {admins.length === 1 ? "admin" : "admins"}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingAdmin(null);
                form.reset();
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              New Admin
            </motion.button>
          </div>
        </div>

        {/* Card Container */}
        <motion.div
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading admins...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-red-600">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>Error loading admins. Please try again.</span>
            </div>
          ) : (
            <Table
              data={admins}
              columns={columns}
              isLoading={isLoading}
              className="w-full"
            />
          )}
        </motion.div>
      </motion.div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingAdmin ? "Edit Admin" : "Create Admin"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <AdminForm
                form={form}
                onSubmit={handleCreateOrUpdate}
                isLoading={editingAdmin ? isUpdating : isCreating}
                submitLabel={editingAdmin ? "Update" : "Create"}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this admin? This action cannot be undone."
        onConfirm={handleDeleteAdmin}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete Admin"
        type="danger"
      />
    </div>
  );
};

export default AdminsDashboard;
