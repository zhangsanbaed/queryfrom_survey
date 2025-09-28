import { ConfidentialHealthSurveyDemo } from "@/components/ConfidentialHealthSurveyDemo";

export default function Home() {
  return (
    <main className="">
      <div className="flex flex-col gap-8 items-center sm:items-start w-full px-3 md:px-0">
        <ConfidentialHealthSurveyDemo />
      </div>
    </main>
  );
}