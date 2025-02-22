import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api";

const subcounties = [
  "likoni",
  "mvita",
  "kisauni",
  "nyali",
  "changamwe",
  "jomvu",
] as const;

interface SubcountyData {
  subcounty: string;
  count: number;
}

const SubcountyDistribution = () => {
  const [data, setData] = useState<SubcountyData[]>(
    subcounties.map((subcounty) => ({
      subcounty: subcounty.charAt(0).toUpperCase() + subcounty.slice(1),
      count: 0,
    })),
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const mentees = await api.getMentees();
        const counts = mentees.reduce(
          (acc, mentee) => {
            acc[mentee.subcounty] = (acc[mentee.subcounty] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const formattedData = subcounties.map((subcounty) => ({
          subcounty: subcounty.charAt(0).toUpperCase() + subcounty.slice(1),
          count: counts[subcounty] || 0,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error loading mentee distribution:", error);
      }
    };
    loadData();
  }, []);

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>Mentee Distribution by Subcounty</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="subcounty" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1a365d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubcountyDistribution;
