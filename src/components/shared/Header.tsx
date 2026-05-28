import Text from "@/components/shared/Text";

function Header() {
  return (
    <header className="flex w-full h-16 justify-between items-center">
      <div className="w-full max-w-[70ch] mx-auto">
        <div>
          <Text variant={"header"} className="uppercase tracking-widest">
            fast-reader
          </Text>
        </div>
      </div>
    </header>
  );
}

export default Header;
