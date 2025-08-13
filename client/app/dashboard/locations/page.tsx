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
import { useGetLocationsQuery, useDeleteLocationMutation } from "@/store/api";

export default function LocationsPage() {
  const { data: locationsData, isLoading, error } = useGetLocationsQuery({ page: 1, limit: 100 });
  const [deleteLocation] = useDeleteLocationMutation();

  const locations = locationsData?.locations || [];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this location?")) {
      try {
        await deleteLocation(id).unwrap();
      } catch (error) {
        console.error("Failed to delete location:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
            <p className="text-gray-600">Manage your donation locations</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">Loading locations...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
            <p className="text-gray-600">Manage your donation locations</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-red-600">
              Error loading locations
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
          <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-600">Manage your donation locations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Locations ({locationsData?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {locations && locations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell>{location.type}</TableCell>
                    <TableCell>
                      {new Date(location.createdAt).toLocaleDateString()}
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
                          onClick={() => handleDelete(location.id)}
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
              No locations found. Add your first location to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
