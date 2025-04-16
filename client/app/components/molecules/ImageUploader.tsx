import { UploadCloud, Trash2 } from "lucide-react";
import Image from "next/image";
import { Controller } from "react-hook-form";

const ImageUploader = ({ control, errors, watch, setValue }) => {
  const images = watch("images") || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("images", [...images, reader.result]);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue("images", newImages);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Product Images
      </label>

      {images.length > 0 && (
        <div className="flex gap-3 flex-wrap mb-3">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group w-24 h-24 rounded-lg border border-gray-200 overflow-hidden"
            >
              {img !== "" && (
                <Image
                  src={img}
                  alt={`Uploaded ${index}`}
                  width={200}
                  height={200}
                  className="object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-white/80 hover:bg-white p-1 rounded-full transition-all shadow group-hover:scale-100 scale-90"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Controller
        name="images"
        control={control}
        render={() => (
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Paste image URL"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  setValue("images", [...images, e.currentTarget.value.trim()]);
                  e.currentTarget.value = "";
                }
              }}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
            <UploadCloud
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>
        )}
      />

      <div className="mb-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {errors.images && (
        <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>
      )}
    </div>
  );
};

export default ImageUploader;
