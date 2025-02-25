import { getAllSettlements } from "@/lib/queries/getAllSettlements";
import { BackButton } from "@/components/BackButton";
import CitiesTable from "./citiestable";
import { Settlement } from "./columns";
import { Suspense } from "react";

export default async function CitiesPage() {
    const settlements: Array<any> = await getAllSettlements();
    
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-4">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-right w-full mb-2 sm:mb-0">
                        רשימת היישובים
                    </h1>
                </header>

                <main className="w-full overflow-x-auto rounded-lg shadow">
                    {!settlements || settlements.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-6 text-center rounded-lg">
                            <h2 className="text-xl font-semibold">No Cities were found</h2>
                        </div>
                    ) : (
                        <Suspense fallback={<div className="p-4 text-center">Loading cities...</div>}>
                            <CitiesTable settlements={settlements} />
                        </Suspense>
                    )}
                </main>
            </div>
        </div>
    );
}