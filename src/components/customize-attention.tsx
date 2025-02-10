import Image from "next/image";

export function CustomizeAttention() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Image 
        src="/images/pizza_slice.svg"
        alt="Pizza"
        width={24}
        height={24}
        className="w-6 h-6"
      />
      <span>Click a size to customize</span>
    </div>
  );
}
