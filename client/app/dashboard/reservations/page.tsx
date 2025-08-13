"use client";

import { Plus, Edit, Trash2, Eye, Calendar } from "lucide-react";
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
import {
  useGetReservationsQuery,
  useDeleteReservationMutation,
} from "@/store/api";

export default function ReservationsPage() {
  const { data: reservations, isLoading, error } = useGetReservationsQuery();
  const [deleteReservation] = useDeleteReservationMutation();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this reservation?")) {
      try {
        await deleteReservation(id).unwrap();
      } catch (error) {
        console.error("Failed to delete reservation:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "EXPIRED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
            <p className="text-gray-600">Manage appointment scheduling</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">Loading reservations...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
            <p className="text-gray-600">Manage appointment scheduling</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-red-600">
              Error loading reservations
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
          <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600">Manage appointment scheduling</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Reservation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reservations ({reservations?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {reservations && reservations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reserved By</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">
                      {reservation.donor?.name || "Unknown Donor"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span
                          className={
                            isExpired(reservation.expires_at)
                              ? "text-red-600"
                              : ""
                          }
                        >
                          {new Date(
                            reservation.expires_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          reservation.status
                        )}`}
                      >
                        {reservation.status}
                      </span>
                    </TableCell>
                    <TableCell>{reservation.reserved_by_user_id}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {reservation.notes || "No notes"}
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
                          onClick={() => handleDelete(reservation.id)}
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
              No reservations found. Add your first reservation to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
