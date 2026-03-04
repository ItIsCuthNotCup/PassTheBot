import { notFound } from "next/navigation";
import { getScan } from "@/lib/store";
import ResultsDashboard from "./ResultsDashboard";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}

export default async function ResultsPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { success } = await searchParams;
  const scan = getScan(id);
  if (!scan) notFound();

  return (
    <ResultsDashboard
      scan={scan}
      scanId={id}
      justPaid={success === "1"}
    />
  );
}
