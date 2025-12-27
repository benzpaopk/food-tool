import EditRecipeView from "@/features/recipes/components/EditRecipeView"; 
// 👆 เช็ค Path นี้ให้ตรงกับที่นายท่านสร้างไฟล์ไว้นะครับ 
// (ถ้าอยู่ใน features/recipes ก็อาจจะเป็น "@/features/recipes/EditRecipeView")

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Next.js 15: รอแกะซองจดหมายเพื่อเอา ID (Server Side)
  const { id } = await params;

  // 2. ส่ง ID ไปให้ Client Component ทำงานต่อ
  return <EditRecipeView id={id} />;
}