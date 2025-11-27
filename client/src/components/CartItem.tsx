import { Trash2, Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "./imagefallback";

export interface CartItemProps {
  id: string;
  image: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  id,
  image,
  name,
  color,
  size,
  price,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const total = price * quantity;

  return (
    <div className="flex gap-4 py-6 border-b border-gray-200">
      <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{name}</h3>
              <div className="mt-1 text-sm text-gray-500">
                <p>Color: {color}</p>
                <p>Size: {size}</p>
              </div>
            </div>
            <button
              onClick={() => onRemove(id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
            <button
              onClick={() => onQuantityChange(id, Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm min-w-[20px] text-center">{quantity}</span>
            <button
              onClick={() => onQuantityChange(id, quantity + 1)}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">${price.toFixed(2)} each</p>
            <p className="font-medium text-gray-900">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
