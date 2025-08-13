"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectOption } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateReservationMutation, useUpdateReservationMutation, useGetDonorsQuery } from "@/store/api";
import { Reservation } from "@/store/api";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation?: Reservation | null;
  mode: "create" | "edit";
}

export function ReservationModal({ isOpen, onClose, reservation, mode }: ReservationModalProps) {
  const [formData, setFormData] = useState({
    donor_id: "",
    expires_at: "",
    status: "ACTIVE" as string,
    notes: "",
  });

  const [createReservation, { isLoading: isCreating }] = useCreateReservationMutation();
  const [updateReservation, { isLoading: isUpdating }] = useUpdateReservationMutation();
  const { data: donorsData } = useGetDonorsQuery({ page: 1, limit: 100 });

  useEffect(() => {
    if (reservation && mode === "edit") {
      setFormData({
        donor_id: reservation.donor_id || "",
        expires_at: reservation.expires_at ? new Date(reservation.expires_at).toISOString().split('T')[0] : "",
        status: reservation.status || "ACTIVE",
        notes: reservation.notes || "",
      });
    } else {
      // Set default expiration to 7 days from now
      const defaultExpiry = new Date();
      defaultExpiry.setDate(defaultExpiry.getDate() + 7);
      
      setFormData({
        donor_id: "",
        expires_at: defaultExpiry.toISOString().split('T')[0],
        status: "ACTIVE",
        notes: "",
      });
    }
  }, [reservation, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === "create") {
        await createReservation(formData).unwrap();
      } else if (reservation) {
        await updateReservation({ id: reservation.id, data: formData }).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Failed to save reservation:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Add New Reservation" : "Edit Reservation"}
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
            <FormLabel>Expires At *</FormLabel>
            <Input
              type="date"
              value={formData.expires_at}
              onChange={(e) => handleInputChange("expires_at", e.target.value)}
              required
            />
          </FormField>

          <FormField>
            <FormLabel>Status *</FormLabel>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
              required
            >
              <SelectOption value="ACTIVE">Active</SelectOption>
              <SelectOption value="EXPIRED">Expired</SelectOption>
              <SelectOption value="CANCELLED">Cancelled</SelectOption>
              <SelectOption value="COMPLETED">Completed</SelectOption>
            </Select>
          </FormField>
        </div>

        <FormField>
          <FormLabel>Notes</FormLabel>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Enter reservation notes and details"
            rows={4}
          />
        </FormField>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? "Saving..." : mode === "create" ? "Create Reservation" : "Update Reservation"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
