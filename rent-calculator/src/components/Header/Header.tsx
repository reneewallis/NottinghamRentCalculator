import { HeaderProps } from "@/src/types/Header";

function Header({ children }: HeaderProps) {
    return (
        <div className="flex w-full flex-row">
            <h1 className="
              text-xl font-bold text-gray-200
              md:text-2xl
              lg:text-3xl
            ">
                Rent Calculator
            </h1>
            {children}
        </div>
    );
}

export default Header;
