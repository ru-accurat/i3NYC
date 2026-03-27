"use client";

import { HBarChart, VBarChart } from "@/components/report/report-charts";

const institutions = [
  { name: "Columbia University", value: 11 },
  { name: "New York University", value: 9 },
  { name: "Mt Sinai School of Med", value: 6 },
  { name: "Princeton University", value: 5 },
  { name: "Stony Brook University", value: 4 },
  { name: "Weill Cornell Medicine", value: 4 },
  { name: "Columbia Irving Medical", value: 4 },
  { name: "Einstein College of Med", value: 3 },
  { name: "St. John's University", value: 3 },
  { name: "NYU Grossman Medical", value: 3 },
  { name: "Columbia GSAPP", value: 2 },
  { name: "Mt Sinai Health System", value: 2 },
  { name: "FIT", value: 2 },
  { name: "Baruch College", value: 2 },
  { name: "Yale University", value: 2 },
];

const academicTitles = [
  { name: "Assistant Professor", value: 29 },
  { name: "Associate Professor", value: 17 },
  { name: "Professor", value: 17 },
  { name: "Adjunct Professor", value: 6 },
  { name: "Adj. Assistant Prof", value: 4 },
  { name: "Lecturer", value: 4 },
  { name: "Visiting Asst Prof", value: 2 },
  { name: "Research Asst Prof", value: 2 },
  { name: "Adjunct Lecturer", value: 2 },
];

const academicIndustry = [
  { name: "Higher Education", value: 104 },
  { name: "Hospital & Health Care", value: 24 },
  { name: "Research", value: 4 },
  { name: "Architecture", value: 2 },
  { name: "IT & Services", value: 1 },
  { name: "Medical Practice", value: 1 },
  { name: "Education Mgmt", value: 1 },
  { name: "Media Production", value: 1 },
];

export function AcademiaCharts() {
  return (
    <div className="flex flex-col gap-16">
      <HBarChart data={institutions} title="Top Academic Institutions" color="rgb(0, 115, 206)" height={560} />
      <div className="grid gap-12 md:grid-cols-2">
        <HBarChart data={academicTitles} title="Academic Titles Distribution" color="rgb(139, 51, 255)" />
        <VBarChart data={academicIndustry} title="Academic Industry Classification" />
      </div>
    </div>
  );
}
