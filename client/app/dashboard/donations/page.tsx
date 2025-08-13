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
import { useGetDonationsQuery, useDeleteDonationMutation } from "@/store/api";

export default function DonationsPage() {
  const { data: donationsData, isLoading, error } = useGetDonationsQuery({ page: 1, limit: 100 });
  const [deleteDonation] = useDeleteDonationMutation();

  const donations = donationsData?.donations || [];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this donation?")) {
      try {
        await deleteDonation(id).unwrap();
      } catch (error) {
        console.error("Failed to delete donation:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Donations</h1>
            <p className="text-gray-600">Manage your donation records</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">Loading donations...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Donations</h1>
            <p className="text-gray-600">Manage your donation records</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-red-600">
              Error loading donations
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
          <h1 className="text-3xl font-bold text-gray-900">Donations</h1>
          <p className="text-gray-600">Manage your donation records</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Donation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Donations ({donationsData?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {donations && donations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">
                      {donation.donor?.name || "Unknown Donor"}
                    </TableCell>
                    <TableCell>
                      {new Date(donation.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          donation.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : donation.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {donation.status}
                      </span>
                    </TableCell>
                    <TableCell>{donation.created_by_user?.name || "Unknown"}</TableCell>
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
                          onClick={() => handleDelete(donation.id)}
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
              No donations found. Add your first donation to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
