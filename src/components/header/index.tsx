import useStore from "../../store/useStore";
import Button from "../../widgets/button";
import { IoBookmarkOutline } from "react-icons/io5";

const Header = () => {
  const { theme, toggleTheme } = useStore();

  return (
    <header className="flex justify-between items-center p-4 bg-card text-foreground shadow-sm border-b border-border">
      <div className="flex items-center gap-2">
        <IoBookmarkOutline className="text-2xl text-secondary" />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            G
          </div>
          <span className="font-bold text-xl text-foreground">Growfin</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={toggleTheme}
          className="p-2 rounded-md bg-foreground text-background"
          color="light"
          size="sm"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </Button>
        <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center text-white font-bold">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;
