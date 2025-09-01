import React from "react";

interface GenderInput {
    maleSvg: React.ReactNode;
    femaleSvg: React.ReactNode;
    value: string;
    onChange: (value: string) => void;
}

export default function GenderInput({ maleSvg, femaleSvg, value, onChange }: GenderInput) {
    return (
        <div className="flex items-center rounded-full border bg-white shadow-sm">
            <div
                onClick={() => onChange("male")}
                className={`w-[50%] rounded-l-full border-r px-4 py-2 ${value === "male" ? "bg-gray-100" : "cursor-pointer"} transition-colors duration-300 ease-in-out hover:bg-gray-100`}
            >
                <div className="flex justify-center">{maleSvg}</div>
            </div>
            <div
                onClick={() => onChange("female")}
                className={`w-[50%] rounded-r-full px-4 py-2 ${value === "female" ? "bg-gray-100" : "cursor-pointer"} transition-colors duration-300 ease-in-out hover:bg-gray-100`}
            >
                <div className="flex justify-center">{femaleSvg}</div>
            </div>
        </div>
    );
}
