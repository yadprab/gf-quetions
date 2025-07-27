import useStore from "../../store/useStore";
import Button from "../../widgets/button";
import { BsLayoutSidebar } from "react-icons/bs";
import { BUTTON_SIZES, BUTTON_TYPES } from "../../widgets/button/constants";
import { GradientChip } from "../../widgets/gradient_chip";
import { GRADIENT_COLORS } from "../../widgets/gradient_chip/constants";

const Header = () => {
  const { theme, toggleTheme } = useStore();

  return (
    <header className="flex justify-between items-center p-4 bg-card border-b border-gray-300">
      <div className="flex items-center gap-2">
        <Button
          variant={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          onClick={() => useStore.getState().toggleSidebar()}
        >
          <BsLayoutSidebar />
        </Button>
        <div className="flex items-center gap-3">
          <GradientChip>G</GradientChip>
          <span className="font-bold text-xl text-foreground">Growfin</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          onClick={toggleTheme}
          variant={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </Button>
        <GradientChip
          isRounded
          from={GRADIENT_COLORS.GREEN}
          to={GRADIENT_COLORS.GREEN}
        >
          U
        </GradientChip>
      </div>
    </header>
  );
};

export default Header;
