import { tv } from "tailwind-variants";
import { STATUS_CHIP_TYPES, type StatusChipType } from "./constants";

const statusClass = tv({
  base: "rounded-lg text-sm flex justify-center items-center w-20",
  variants: {
    type: {
      [STATUS_CHIP_TYPES.INFO]:
        "bg-purple-100 border border-purple-600 text-purple-600",
      [STATUS_CHIP_TYPES.SUCCESS]:
        "bg-green-100 border border-green-600 text-green-600",
      [STATUS_CHIP_TYPES.WARNING]:
        "bg-yellow-100 border border-yellow-600 text-yellow-600",
      [STATUS_CHIP_TYPES.ERROR]:
        "bg-red-100 border border-red-600 text-red-600",
    },
  },
});

export const StatusChip = ({
  content,
  type = STATUS_CHIP_TYPES.INFO,
}: {
  content: string;
  type: StatusChipType;
}) => {
  return <div className={statusClass({ type })}>{content}</div>;
};
