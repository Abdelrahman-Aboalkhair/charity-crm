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
import { useGetDonorsQuery, useDeleteDonorMutation } from "@/store/api";

export default function DonorsPage() {
  const { data: donorsData, isLoading, error } = useGetDonorsQuery({ page: 1, limit: 100 });
  const [deleteDonor] = useDeleteDonorMutation();

  const donors = donorsData?.donors || [];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this donor?")) {
      try {
        await deleteDonor(id).unwrap();
      } catch (error) {
        console.error("Failed to delete donor:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Donors</h1>
            <p className="text-gray-600">Manage your donor database</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">Loading donors...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Donors</h1>
            <p className="text-gray-600">Manage your donor database</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-red-600">
              Error loading donors
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
          <h1 className="text-3xl font-bold text-gray-900">Donors</h1>
          <p className="text-gray-600">Manage your donor database</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Donor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Donors ({donorsData?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {donors && donors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donors.map((donor) => (
                  <TableRow key={donor.id}>
                    <TableCell className="font-medium">{donor.name}</TableCell>
                    <TableCell>{donor.gender}</TableCell>
                    <TableCell>{donor.phone_number1 || "N/A"}</TableCell>
                    <TableCell>{donor.email || "N/A"}</TableCell>
                    <TableCell>{donor.city || "N/A"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          donor.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {donor.isActive ? "Active" : "Inactive"}
                      </span>
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
                          onClick={() => handleDelete(donor.id)}
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
              No donors found. Add your first donor to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
