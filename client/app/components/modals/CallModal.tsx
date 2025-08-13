"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectOption } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateCallMutation, useUpdateCallMutation, useGetDonorsQuery } from "@/store/api";
import { Call } from "@/store/api";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  call?: Call | null;
  mode: "create" | "edit";
}

export function CallModal({ isOpen, onClose, call, mode }: CallModalProps) {
  const [formData, setFormData] = useState({
    donor_id: "",
    call_date: "",
    outcome: "",
    notes: "",
  });

  const [createCall, { isLoading: isCreating }] = useCreateCallMutation();
  const [updateCall, { isLoading: isUpdating }] = useUpdateCallMutation();
  const { data: donorsData } = useGetDonorsQuery({ page: 1, limit: 100 });

  useEffect(() => {
    if (call && mode === "edit") {
      setFormData({
        donor_id: call.donor_id || "",
        call_date: call.call_date ? new Date(call.call_date).toISOString().split('T')[0] : "",
        outcome: call.outcome || "",
        notes: call.notes || "",
      });
    } else {
      setFormData({
        donor_id: "",
        call_date: new Date().toISOString().split('T')[0],
        outcome: "",
        notes: "",
      });
    }
  }, [call, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === "create") {
        await createCall(formData).unwrap();
      } else if (call) {
        await updateCall({ id: call.id, data: formData }).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Failed to save call:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Add New Call" : "Edit Call"}
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
            <FormLabel>Call Date *</FormLabel>
            <Input
              type="date"
              value={formData.call_date}
              onChange={(e) => handleInputChange("call_date", e.target.value)}
              required
            />
          </FormField>
        </div>

        <FormField>
          <FormLabel>Outcome *</FormLabel>
          <Select
            value={formData.outcome}
            onValueChange={(value) => handleInputChange("outcome", value)}
            required
          >
            <SelectOption value="">Select call outcome</SelectOption>
            <SelectOption value="ANSWERED">Answered</SelectOption>
            <SelectOption value="NO_ANSWER">No Answer</SelectOption>
            <SelectOption value="BUSY">Busy</SelectOption>
            <SelectOption value="WRONG_NUMBER">Wrong Number</SelectOption>
            <SelectOption value="NOT_INTERESTED">Not Interested</SelectOption>
            <SelectOption value="INTERESTED">Interested</SelectOption>
            <SelectOption value="CALLBACK_LATER">Call Back Later</SelectOption>
            <SelectOption value="SCHEDULED">Scheduled</SelectOption>
          </Select>
        </FormField>

        <FormField>
          <FormLabel>Notes</FormLabel>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Enter call notes and details"
            rows={4}
          />
        </FormField>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? "Saving..." : mode === "create" ? "Create Call" : "Update Call"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
