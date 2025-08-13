"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCallsQuery, useDeleteCallMutation } from "@/store/api";
import { CallModal } from "@/components/modals/CallModal";
import { Call } from "@/store/api";

export default function CallsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const {
    data: callsData,
    isLoading,
    error,
  } = useGetCallsQuery({ page: 1, limit: 100 });
  const [deleteCall] = useDeleteCallMutation();

  const calls = callsData?.calls || [];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this call?")) {
      try {
        await deleteCall(id).unwrap();
      } catch (error) {
        console.error("Failed to delete call:", error);
      }
    }
  };

  const handleCreateCall = () => {
    setSelectedCall(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditCall = (call: Call) => {
    setSelectedCall(call);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCall(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calls</h1>
            <p className="text-gray-600">Manage your call records</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">Loading calls...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calls</h1>
            <p className="text-gray-600">Manage your call records</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-red-600">
              Error loading calls
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calls</h1>
          <p className="text-gray-600">Manage your call records</p>
        </div>
        <Button onClick={handleCreateCall}>
          <Plus className="h-4 w-4 mr-2" />
          Add Call
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Calls ({callsData?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {calls && calls.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Called By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-medium">
                      {call.donor?.name || "Unknown Donor"}
                    </TableCell>
                    <TableCell>
                      {new Date(call.call_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{call.outcome}</TableCell>
                    <TableCell>
                      {call.called_by_user?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCall(call)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(call.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No calls found. Add your first call to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <CallModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        call={selectedCall}
        mode={modalMode}
      />
    </div>
  );
}
