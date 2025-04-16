"use client";
import { Minus, Plus } from "lucide-react";
import { useUpdateCartItemMutation } from "@/app/store/apis/CartApi";
import Button from "../atoms/Button";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  itemId: string;
};

const QuantitySelector = ({
  value,
  onChange,
  itemId,
}: QuantitySelectorProps) => {
  const [updateCartItem, { isLoading }] = useUpdateCartItemMutation();

  const handleUpdate = async (newQty: number) => {
    if (newQty < 1 || newQty === value) return;

    onChange(newQty); // update form state
    try {
      await updateCartItem({ id: itemId, quantity: newQty }).unwrap();
    } catch (err) {
      console.error("Failed to update quantity:", err);
      // Optional: Rollback on error
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-full max-w-fit border border-gray-300 bg-white px-2 py-1 shadow-sm transition-all hover:shadow-md">
      <Button
        type="button"
        onClick={() => handleUpdate(value - 1)}
        disabled={isLoading || value <= 1}
        className="rounded-full p-2 transition hover:bg-gray-100 disabled:opacity-50"
      >
        <Minus size={16} />
      </Button>

      <span className="min-w-[32px] text-center font-semibold text-gray-800">
        {value}
      </span>

      <Button
        type="button"
        onClick={() => handleUpdate(value + 1)}
        disabled={isLoading}
        className="rounded-full p-2 transition hover:bg-gray-100 disabled:opacity-50"
      >
        <Plus size={16} />
      </Button>
    </div>
  );
};

export default QuantitySelector;
