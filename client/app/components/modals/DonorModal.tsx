"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectOption } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCreateDonorMutation, useUpdateDonorMutation, useGetLocationsQuery } from "@/store/api";
import { Donor } from "@/store/api";
import { useToast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

interface DonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor?: Donor | null;
  mode: "create" | "edit";
}

export function DonorModal({ isOpen, onClose, donor, mode }: DonorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "MALE" as "MALE" | "FEMALE",
    phone_number1: "",
    phone_number2: "",
    dob: "",
    email: "",
    job_title: "",
    province: "",
    city: "",
    area: "",
    location_id: "",
    isActive: true,
  });

  const [createDonor, { isLoading: isCreating }] = useCreateDonorMutation();
  const [updateDonor, { isLoading: isUpdating }] = useUpdateDonorMutation();
  const { data: locationsData } = useGetLocationsQuery({ page: 1, limit: 100 });
  const { showToast } = useToast();

  useEffect(() => {
    if (donor && mode === "edit") {
      setFormData({
        name: donor.name || "",
        gender: donor.gender || "MALE",
        phone_number1: donor.phone_number1 || "",
        phone_number2: donor.phone_number2 || "",
        dob: donor.dob || "",
        email: donor.email || "",
        job_title: donor.job_title || "",
        province: donor.province || "",
        city: donor.city || "",
        area: donor.area || "",
        location_id: donor.location_id || "",
        isActive: donor.isActive,
      });
    } else {
      setFormData({
        name: "",
        gender: "MALE",
        phone_number1: "",
        phone_number2: "",
        dob: "",
        email: "",
        job_title: "",
        province: "",
        city: "",
        area: "",
        location_id: "",
        isActive: true,
      });
    }
  }, [donor, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === "create") {
        await createDonor(formData).unwrap();
        showToast("Donor created successfully!", "success");
      } else if (donor) {
        await updateDonor({ id: donor.id, data: formData }).unwrap();
        showToast("Donor updated successfully!", "success");
      }
      onClose();
    } catch (error) {
      console.error("Failed to save donor:", error);
      showToast("Failed to save donor. Please try again.", "error");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Add New Donor" : "Edit Donor"}
      size="lg"
    >
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField>
            <FormLabel>Name *</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter donor name"
              required
            />
          </FormField>

          <FormField>
            <FormLabel>Gender *</FormLabel>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange("gender", value as "MALE" | "FEMALE")}
              required
            >
              <SelectOption value="MALE">Male</SelectOption>
              <SelectOption value="FEMALE">Female</SelectOption>
            </Select>
          </FormField>

          <FormField>
            <FormLabel>Primary Phone</FormLabel>
            <Input
              value={formData.phone_number1}
              onChange={(e) => handleInputChange("phone_number1", e.target.value)}
              placeholder="Enter primary phone number"
            />
          </FormField>

          <FormField>
            <FormLabel>Secondary Phone</FormLabel>
            <Input
              value={formData.phone_number2}
              onChange={(e) => handleInputChange("phone_number2", e.target.value)}
              placeholder="Enter secondary phone number"
            />
          </FormField>

          <FormField>
            <FormLabel>Date of Birth</FormLabel>
            <Input
              type="date"
              value={formData.dob}
              onChange={(e) => handleInputChange("dob", e.target.value)}
            />
          </FormField>

          <FormField>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
            />
          </FormField>

          <FormField>
            <FormLabel>Job Title</FormLabel>
            <Input
              value={formData.job_title}
              onChange={(e) => handleInputChange("job_title", e.target.value)}
              placeholder="Enter job title"
            />
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
            <FormLabel>Province</FormLabel>
            <Input
              value={formData.province}
              onChange={(e) => handleInputChange("province", e.target.value)}
              placeholder="Enter province"
            />
          </FormField>

          <FormField>
            <FormLabel>City</FormLabel>
            <Input
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Enter city"
            />
          </FormField>

          <FormField>
            <FormLabel>Area</FormLabel>
            <Input
              value={formData.area}
              onChange={(e) => handleInputChange("area", e.target.value)}
              placeholder="Enter area"
            />
          </FormField>

          <FormField>
            <FormLabel>Status</FormLabel>
            <Select
              value={formData.isActive ? "true" : "false"}
              onValueChange={(value) => handleInputChange("isActive", value === "true")}
            >
              <SelectOption value="true">Active</SelectOption>
              <SelectOption value="false">Inactive</SelectOption>
            </Select>
          </FormField>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              mode === "create" ? "Create Donor" : "Update Donor"
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
