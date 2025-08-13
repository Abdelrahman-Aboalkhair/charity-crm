"use client";

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

export default function CallsPage() {
  const { data: calls, isLoading, error } = useGetCallsQuery();
  const [deleteCall] = useDeleteCallMutation();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this call record?")) {
      try {
        await deleteCall(id).unwrap();
      } catch (error) {
        console.error("Failed to delete call:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calls</h1>
            <p className="text-gray-600">Track donor communication</p>
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
            <p className="text-gray-600">Track donor communication</p>
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
          <p className="text-gray-600">Track donor communication</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Call
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Calls ({calls?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {calls && calls.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Call Date</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Called By</TableHead>
                  <TableHead>Notes</TableHead>
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
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {call.outcome}
                      </span>
                    </TableCell>
                    <TableCell>{call.called_by_user_id}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {call.notes || "No notes"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
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
              No calls found. Add your first call record to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
