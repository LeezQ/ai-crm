import { useQuery } from "@tanstack/react-query";

interface Opportunity {
  id: string;
  name: string;
  amount: number;
  status: string;
  createdAt: string;
}

async function fetchOpportunities(): Promise<Opportunity[]> {
  const response = await fetch("/api/opportunities");
  if (!response.ok) {
    throw new Error("获取商机数据失败");
  }
  return response.json();
}

export function useOpportunities() {
  return useQuery({
    queryKey: ["opportunities"],
    queryFn: fetchOpportunities,
  });
}
