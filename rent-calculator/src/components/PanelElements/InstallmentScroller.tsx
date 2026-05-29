import ArrowButton from "../Buttons/ArrowButton";
import { InstallementScrollerProps } from "../../types/PanelElements";
import { InstallmentFrequency } from "@/src/types/RentCalculator";

function InstallementScroller({
    totalInstallments,
    installmentNumber,
    paymentFrequency,
    onChange,
}: InstallementScrollerProps) {
    const weekDown = () => {
        if (installmentNumber > 0) {
            if (onChange) {
                onChange(installmentNumber - 1);
            }
        }
    };

    const weekUp = () => {
        if (installmentNumber < totalInstallments) {
            if (onChange) {
                onChange(installmentNumber + 1);
            }
        }
    };

    let installmentUnit;

    switch (paymentFrequency) {
        case InstallmentFrequency.UNSELECTED: {
            installmentUnit = "Installment";
            break;
        }
        case InstallmentFrequency.MONTHLY: {
            installmentUnit = "Month";
            break;
        }
        case InstallmentFrequency.WEEKLY: {
            installmentUnit = "Week";
            break;
        }
    }
    return (
        <div className="flex items-center justify-between gap-3 pt-4 px-2">
            <ArrowButton direction="left" onClick={weekDown}></ArrowButton>
            <h1 className="text-base md:text-lg lg:text-2xl whitespace-nowrap text-gray-200">
                {installmentUnit} {installmentNumber}
            </h1>
            <ArrowButton direction="right" onClick={weekUp}></ArrowButton>
        </div>
    );
}

export default InstallementScroller;
