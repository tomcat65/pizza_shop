"use client";

import { useState, useEffect } from "react";
import type { Database } from "@/lib/supabase/database.types";
import { ChevronDown, ChevronUp } from "lucide-react";

type ToppingCategory = "cheese" | "meat" | "veggie";
type Topping = Database["public"]["Tables"]["toppings"]["Row"];

interface ToppingsSelectorProps {
  toppings: Topping[];
  itemType: "pizza" | "cheesesteak";
  size: 'Personal (10")' | 'Regular (12")' | 'Family (17")';
  onToppingsChange: (
    selectedToppings: Array<{ topping: Topping; isGrilled?: boolean }>
  ) => void;
}

export function ToppingsSelector({
  toppings,
  itemType,
  size,
  onToppingsChange,
}: ToppingsSelectorProps) {
  const [selectedToppings, setSelectedToppings] = useState<
    Array<{ topping: Topping; isGrilled?: boolean }>
  >([]);
  const [openCategory, setOpenCategory] = useState<ToppingCategory | null>(null);

  const getPriceMultiplier = (size: string) => {
    switch (size) {
      case 'Personal (10")':
        return 0.85;
      case 'Family (17")':
        return 1.6;
      default:
        return 1;
    }
  };

  const priceMultiplier = getPriceMultiplier(size);

  // Use useEffect to notify parent of changes
  useEffect(() => {
    onToppingsChange(selectedToppings);
  }, [selectedToppings, onToppingsChange]);

  const handleToppingToggle = (topping: Topping, isGrilled?: boolean) => {
    setSelectedToppings((prev) => {
      const exists = prev.find((t) => t.topping.id === topping.id);
      if (exists) {
        return prev.filter((t) => t.topping.id !== topping.id);
      }
      return [...prev, { topping, isGrilled }];
    });
  };

  const groupedToppings = toppings.reduce(
    (acc, topping) => {
      if (topping.item_type === itemType || topping.item_type === "both") {
        acc[topping.category].push(topping);
      }
      return acc;
    },
    { cheese: [], meat: [], veggie: [] } as Record<ToppingCategory, Topping[]>
  );

  const renderToppings = (category: ToppingCategory) => {
    if (openCategory !== category) return null;

    return (
      <div className="space-y-2 mt-2">
        {groupedToppings[category].map((topping) => (
          <div
            key={topping.id}
            className="flex items-center justify-between hover:bg-orange-50 p-2 rounded transition-colors"
          >
            <span className="font-medium">{topping.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-orange-600 font-semibold">
                ${(topping.price * priceMultiplier).toFixed(2)}
              </span>
              {category === "veggie" && topping.veggie_state === "both" ? (
                <div className="flex gap-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name={`veggie-${topping.id}`}
                      checked={selectedToppings.some(
                        (t) =>
                          t.topping.id === topping.id && t.isGrilled === true
                      )}
                      onChange={() => handleToppingToggle(topping, true)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm">Grilled</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name={`veggie-${topping.id}`}
                      checked={selectedToppings.some(
                        (t) =>
                          t.topping.id === topping.id && t.isGrilled === false
                      )}
                      onChange={() => handleToppingToggle(topping, false)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm">Fresh</span>
                  </label>
                </div>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedToppings.some(
                      (t) => t.topping.id === topping.id
                    )}
                    onChange={() => handleToppingToggle(topping)}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="sr-only">Add {topping.name}</span>
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getCategoryCount = (category: ToppingCategory) => {
    return selectedToppings.filter(
      (t) => t.topping.category === category
    ).length;
  };

  return (
    <div className="space-y-4">
      {/* Cheese Section */}
      <div className="rounded-lg border">
        <button
          onClick={() => setOpenCategory(openCategory === "cheese" ? null : "cheese")}
          className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Cheese</h3>
            {getCategoryCount("cheese") > 0 && (
              <span className="bg-orange-100 text-orange-600 text-sm px-2 py-0.5 rounded-full">
                {getCategoryCount("cheese")}
              </span>
            )}
          </div>
          {openCategory === "cheese" ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {openCategory === "cheese" && (
          <div className="px-4 py-2">{renderToppings("cheese")}</div>
        )}
      </div>

      {/* Meat Section */}
      <div className="rounded-lg border">
        <button
          onClick={() => setOpenCategory(openCategory === "meat" ? null : "meat")}
          className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Meat</h3>
            {getCategoryCount("meat") > 0 && (
              <span className="bg-orange-100 text-orange-600 text-sm px-2 py-0.5 rounded-full">
                {getCategoryCount("meat")}
              </span>
            )}
          </div>
          {openCategory === "meat" ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {openCategory === "meat" && (
          <div className="px-4 py-2">{renderToppings("meat")}</div>
        )}
      </div>

      {/* Veggies Section */}
      <div className="rounded-lg border">
        <button
          onClick={() => setOpenCategory(openCategory === "veggie" ? null : "veggie")}
          className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Veggies</h3>
            {getCategoryCount("veggie") > 0 && (
              <span className="bg-orange-100 text-orange-600 text-sm px-2 py-0.5 rounded-full">
                {getCategoryCount("veggie")}
              </span>
            )}
          </div>
          {openCategory === "veggie" ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {openCategory === "veggie" && (
          <div className="px-4 py-2">{renderToppings("veggie")}</div>
        )}
      </div>
    </div>
  );
}
