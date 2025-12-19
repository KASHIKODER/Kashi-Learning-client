// app/course/[id]/page.tsx
import CourseDetailsPage from "../../components/Course/CourseDetailsPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ unwrap promise on server side

  return (
    <div>
      <CourseDetailsPage id={id} />
    </div>
  );
}
