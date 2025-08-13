"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectOption } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  useCreateLocationMutation,
  useUpdateLocationMutation,
} from "@/store/api";
import { Location } from "@/store/api";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: Location | null;
  mode: "create" | "edit";
}

export function LocationModal({
  isOpen,
  onClose,
  location,
  mode,
}: LocationModalProps) {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
  });

  const [createLocation, { isLoading: isCreating }] =
    useCreateLocationMutation();
  const [updateLocation, { isLoading: isUpdating }] =
    useUpdateLocationMutation();

  useEffect(() => {
    if (location && mode === "edit") {
      setFormData({
        type: location.type || "",
        name: location.name || "",
      });
    } else {
      setFormData({
        type: "",
        name: "",
      });
    }
  }, [location, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "create") {
        await createLocation(formData).unwrap();
      } else if (location) {
        await updateLocation({ id: location.id, data: formData }).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Failed to save location:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Add New Location" : "Edit Location"}
      size="md"
    >
      <Form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormField>
            <FormLabel>Type *</FormLabel>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
              required
            >
              <SelectOption value="">Select location type</SelectOption>
              <SelectOption value="HOSPITAL">Hospital</SelectOption>
              <SelectOption value="CLINIC">Clinic</SelectOption>
              <SelectOption value="BLOOD_BANK">Blood Bank</SelectOption>
              <SelectOption value="MOBILE_UNIT">Mobile Unit</SelectOption>
              <SelectOption value="OFFICE">Office</SelectOption>
              <SelectOption value="OTHER">Other</SelectOption>
            </Select>
          </FormField>

          <FormField>
            <FormLabel>Name *</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter location name"
              required
            />
          </FormField>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {isCreating || isUpdating
              ? "Saving..."
              : mode === "create"
              ? "Create Location"
              : "Update Location"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
