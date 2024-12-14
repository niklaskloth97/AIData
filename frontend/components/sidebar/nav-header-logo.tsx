import Image from "next/image";
import hiltiLogo from "@/public/hilti_logo.svg";
import ercisLogo from "@/public/ercis_logo.png";

export default function NavLogoHeader() {
    return (
        <div className="flex flex-row items-center justify-center h-16 border-0 rounded-md">
            <div className="w-1/2 h-5/6 flex flex-row-reverse">
                <Image
                    src={hiltiLogo}
                    alt="Hilti Logo"
                    className="w-5/6"
                />
            </div>
            <div className="mx-2 text-primary">
                X
            </div>
            <div className="w-1/2 h-5/6 flex flex-row">
                <Image 
                    src={ercisLogo} 
                    alt="ERCIS Logo"
                    className="w-5/6"
                />
            </div>
        </div>
    );
}
