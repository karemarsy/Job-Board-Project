// src/app/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import JobBoardPage from "@/components/JobBoardPage";

export default function Home() {
  return (
    <MainLayout>
      <JobBoardPage />
    </MainLayout>
  );
}
