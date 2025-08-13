"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectOption } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  useCreateDonationMutation,
  useUpdateDonationMutation,
  useGetDonorsQuery,
  useGetLocationsQuery,
} from "@/store/api";
import { Donation } from "@/store/api";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation?: Donation | null;
  mode: "create" | "edit";
}

export function DonationModal({
  isOpen,
  onClose,
  donation,
  mode,
}: DonationModalProps) {
  const [formData, setFormData] = useState({
    donor_id: "",
    location_id: "",
    date: "",
    status: "PENDING" as "PENDING" | "APPROVED" | "REJECTED",
    notes: "",
  });

  const [createDonation, { isLoading: isCreating }] =
    useCreateDonationMutation();
  const [updateDonation, { isLoading: isUpdating }] =
    useUpdateDonationMutation();
  const { data: donorsData } = useGetDonorsQuery({ page: 1, limit: 100 });
  const { data: locationsData } = useGetLocationsQuery({ page: 1, limit: 100 });

  useEffect(() => {
    if (donation && mode === "edit") {
      setFormData({
        donor_id: donation.donor_id || "",
        location_id: donation.location_id || "",
        date: donation.date
          ? new Date(donation.date).toISOString().split("T")[0]
          : "",
        status: donation.status || "PENDING",
        notes: donation.notes || "",
      });
    } else {
      setFormData({
        donor_id: "",
        location_id: "",
        date: new Date().toISOString().split("T")[0],
        status: "PENDING",
        notes: "",
      });
    }
  }, [donation, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "create") {
        await createDonation(formData).unwrap();
      } else if (donation) {
        await updateDonation({ id: donation.id, data: formData }).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Failed to save donation:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Add New Donation" : "Edit Donation"}
      size="lg"
    >
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField>
            <FormLabel>Donor *</FormLabel>
            <Select
              value={formData.donor_id}
              onValueChange={(value) => handleInputChange("donor_id", value)}
              required
            >
              <SelectOption value="">Select a donor</SelectOption>
              {donorsData?.donors.map((donor) => (
                <SelectOption key={donor.id} value={donor.id}>
                  {donor.name}
                </SelectOption>
              ))}
            </Select>
          </FormField>

          <FormField>
            <FormLabel>Location</FormLabel>
            <Select
              value={formData.location_id}
              onValueChange={(value) => handleInputChange("location_id", value)}
            >
              <SelectOption value="">Select a location</SelectOption>
              {locationsData?.locations.map((location) => (
                <SelectOption key={location.id} value={location.id}>
                  {location.name}
                </SelectOption>
              ))}
            </Select>
          </FormField>

          <FormField>
            <FormLabel>Date *</FormLabel>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              required
            />
          </FormField>

          <FormField>
            <FormLabel>Status *</FormLabel>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleInputChange(
                  "status",
                  value as "PENDING" | "APPROVED" | "REJECTED"
                )
              }
              required
            >
              <SelectOption value="PENDING">Pending</SelectOption>
              <SelectOption value="APPROVED">Approved</SelectOption>
              <SelectOption value="REJECTED">Rejected</SelectOption>
            </Select>
          </FormField>
        </div>

        <FormField>
          <FormLabel>Notes</FormLabel>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Enter any additional notes about this donation"
            rows={3}
          />
        </FormField>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {isCreating || isUpdating
              ? "Saving..."
              : mode === "create"
              ? "Create Donation"
              : "Update Donation"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
