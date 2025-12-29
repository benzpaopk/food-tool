"use client";

/**
 * Recipe Management Page (หน้าการจัดการสูตรอาหาร)
 * 
 * Page for viewing and managing all recipes with search, filters, and table view
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecipeStore } from "@/features/recipes/store";
import { formatCurrency } from "@/lib/formatters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Recipe } from "@/types";

export default function RecipesPage() {
  const router = useRouter();
  const recipes = useRecipeStore((state) => state.recipes);
  const removeRecipe = useRecipeStore((state) => state.removeRecipe);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter (simplified - using description or notes as category indicator)
    if (selectedCategory !== "all") {
      // For now, we'll just return all since we don't have category in Recipe type
      // You can extend this based on your needs
    }

    return filtered;
  }, [recipes, searchQuery, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: string) => {
    removeRecipe(id);
    if (paginatedRecipes.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getProfitPercentage = (recipe: Recipe) => {
    if (recipe.salePrice === 0) return 0;
    return ((recipe.salePrice - recipe.totalCost) / recipe.salePrice) * 100;
  };

  const formatThaiDate = (date: Date) => {
    const thaiMonths = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // Convert to Buddhist era
    return `${day} ${month} ${year}`;
  };

  // Sample images for recipes (you can add image URLs to Recipe type later)
  const getRecipeImage = (index: number) => {
    const images = [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqpRpT7LKJyyE9qePI6QgRyI3x_d65rVqYoppr-2M1hlrH9EBtypDK9-Cx61gjJXivf19fXZJ3aSctYjECMbCQdBrh1eLGq6tgTAUHYIaEA5OsjXSVJ-VnEDN3sEW7bhgz05aM_LmMa5wnIaO48ONM5pDxY4CsXYC3fbR9OgYhmo9UmHaguRoyyjSKRFzYXL-XgovkGHL_s05q7-t6wInyUBbuEz9gskerdpoaADTjRo4dSD0KdtcIaDZN_41jgtfJIacbkQl_U3-6",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCI4wsp4fKmT6xQiKQWnQ08LHdWupM2LNpXnye-ZLkairgR8pojmUO0ECut86ae6sq0g3jUa0iTAOMX9rFMSAYhul46T_0vtln7n9hKGjKhmdqToka8S3dx68fU9q4TMvQSHtWPXChZJhYOWazn9trSv4U_FFFLnSxti4giyc64E4qagvSDxuvtn2tdv0yGiwVOQJp0U-N3_aq13JTw6I64cxgXk8YFqfvSLJmMHGKUbcaM3KrllaVLNaabFakKV5FMEGKytHv40ojk",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpQfESGWpuYIsSoPMJdqi-9Sl0L9NKoEayz0V7Id2BjVOBUuK9rRgrzCoqWOu02kQGUiGa_mBmrtWJuFwHq7ABgsug460XqwqxClQjBRYPZNgiAQRwzkVygnJUI0b51N6ylvR7KePQTVBzitS8kCLbrYp-tf4L9K-vaWWFQmGoEOho0UQvYCY8Gf2WvaaDAd9CIj48fYwtLrydUfVrIesJDCrPGPP1Gg19KWgiROMd2nc3SQwLjlgvzZi8R7sfczL1J_LIZUaycRYb",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-7o0pNVrtA2oCHyK4N5R4G9YRIsKAWRLF1IKLBYvfyEmjtq05G_vFFgn0E66cYbTj9yQjLjPVbWr5Emj4bY_7Xe4eYZtG6cgOF0QjhyeFHREpUKJvAbjwUDOP8DFWsu-MIHBsQRDjqJZx23EsSe-weVMb1qAYQiMHLreJAUue6GjPgLO0Fkv2G572f8y63fsM1TdsHVNyJishnrPdlAnNOYc2Q1anAbp1S9dMykFHzUslU56QxCB6aw4J__mqhNRI2iJRxuYk6LcT",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5TXcq3msGuJim2dovP7FzpdU31nLqwW3N8i-_uGMXVRJCF79VHRhJKeNRPeMU72OJHW8lox3yf6dmLLfemdy4mc64hbACSEbEVbxirZlPEigJoWu3IWNhwSWOxJBNBm_cFAwrWgx7V959McFAAZCOnrxvJ0gGUvpzApPZ5qFoxythzBQvTLK0MjqQ4OCFOOkYUy25321b3CATlCTbKu_I5cFr58ToV__jnqMdWKqjHvkBGoFREO5wyDjL9Z-oDHSdCU0ZTRzcABcA",
    ];
    return images[index % images.length];
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-text-main dark:text-gray-100 antialiased transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur supports-[backdrop-filter]:bg-surface-light/60">
        <div className="px-4 md:px-6 lg:px-8 max-w-[1400px] mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center text-primary bg-primary/10 rounded-lg p-1.5">
              <span className="material-symbols-outlined text-3xl">calculate</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-text-main dark:text-white">FoodCost Calc</h2>
          </div>
          <div className="hidden md:flex flex-1 items-center justify-end gap-6">
            <nav className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-full">
              <Link
                href="/"
                className="px-4 py-1.5 rounded-full text-sm font-medium text-text-secondary dark:text-gray-400 hover:text-text-main dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 transition-all"
              >
                หน้าหลัก
              </Link>
              <Link
                href="/recipes"
                className="px-4 py-1.5 rounded-full text-sm font-bold text-black dark:text-white bg-white dark:bg-gray-700 shadow-sm"
              >
                สูตรอาหาร
              </Link>
              <Link
                href="/ingredients"
                className="px-4 py-1.5 rounded-full text-sm font-medium text-text-secondary dark:text-gray-400 hover:text-text-main dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 transition-all"
              >
                วัตถุดิบ
              </Link>
              <Link
                href="#"
                className="px-4 py-1.5 rounded-full text-sm font-medium text-text-secondary dark:text-gray-400 hover:text-text-main dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 transition-all"
              >
                ตั้งค่า
              </Link>
            </nav>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden lg:block">
                <span className="text-sm font-bold leading-none dark:text-white">สมชาย ใจดี</span>
                <span className="text-xs text-text-secondary dark:text-gray-400 leading-none mt-1">เจ้าของร้าน</span>
              </div>
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white dark:ring-gray-700 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBcHTv_lEED9arQA-6AwghB-gNO7hqrTgiPswFdPylVyjTnq91lzhLLETO729ggprbxgjr4gnEM_oyhFy_x4IsfuKj7gUvu6KDQlBoMtqrqMW3S7tBlXtAXHA60o_QwmpwZC9ARMMqc-mrrXzirQtzkQiTTmzczJuKew9dur5B0LzoRftzebil7KNsceXLcWJH26UoFk4CiYcUPGMkeI2Jo38mUNlPXMhjQg-Cxx58z0WSMsJ0hE4ySa5arYL1s5Vb60ZoPjMiTsv1O")'
                }}
              ></div>
              <button className="hidden lg:flex p-2 text-text-secondary hover:text-red-500 transition-colors" title="ออกจากระบบ">
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
          <div className="flex md:hidden text-text-main dark:text-white">
            <button className="p-2 -mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400 mb-1">
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>/</span>
              <span>จัดการสูตรอาหาร</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main dark:text-white">จัดการสูตรอาหาร</h1>
            <p className="text-text-secondary dark:text-gray-400 text-lg font-normal leading-relaxed">
              ดูและจัดการรายการต้นทุนสูตรอาหารทั้งหมดของคุณได้ที่นี่ ง่ายต่อการคำนวณและวางแผนกำไร
            </p>
          </div>
          <Link
            href="/recipes/new"
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary hover:bg-primary-hover text-black text-base font-bold shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span>เพิ่มสูตรใหม่</span>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
          <div className="lg:col-span-5 xl:col-span-4 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-secondary group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input
              className="block w-full h-12 pl-11 pr-4 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-text-main dark:text-white shadow-sm focus:border-primary focus:ring-primary dark:focus:border-primary sm:text-base transition-all placeholder:text-gray-400"
              placeholder="ค้นหาชื่อเมนู, วัตถุดิบ..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="lg:col-span-7 xl:col-span-8 flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-5 font-medium transition-transform active:scale-95 shadow-md ${
                selectedCategory === "all"
                  ? "bg-text-main dark:bg-white text-white dark:text-black"
                  : "bg-white border border-gray-200 hover:border-primary/50 dark:bg-surface-dark dark:border-gray-700 dark:hover:border-primary/50 text-text-main dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <span>ทั้งหมด</span>
              <span className="bg-white/20 dark:bg-black/10 text-xs py-0.5 px-2 rounded-full">{recipes.length}</span>
            </button>
            <button
              onClick={() => setSelectedCategory("single")}
              className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-5 font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 ${
                selectedCategory === "single"
                  ? "bg-text-main dark:bg-white text-white dark:text-black"
                  : "bg-white border border-gray-200 hover:border-primary/50 dark:bg-surface-dark dark:border-gray-700 dark:hover:border-primary/50 text-text-main dark:text-gray-200"
              }`}
            >
              <span>อาหารจานเดียว</span>
            </button>
            <button
              onClick={() => setSelectedCategory("dessert")}
              className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-5 font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 ${
                selectedCategory === "dessert"
                  ? "bg-text-main dark:bg-white text-white dark:text-black"
                  : "bg-white border border-gray-200 hover:border-primary/50 dark:bg-surface-dark dark:border-gray-700 dark:hover:border-primary/50 text-text-main dark:text-gray-200"
              }`}
            >
              <span>ของหวาน</span>
            </button>
            <button
              onClick={() => setSelectedCategory("beverage")}
              className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-5 font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 ${
                selectedCategory === "beverage"
                  ? "bg-text-main dark:bg-white text-white dark:text-black"
                  : "bg-white border border-gray-200 hover:border-primary/50 dark:bg-surface-dark dark:border-gray-700 dark:hover:border-primary/50 text-text-main dark:text-gray-200"
              }`}
            >
              <span>เครื่องดื่ม</span>
            </button>
            <button
              className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-white border border-gray-200 hover:border-primary/50 dark:bg-surface-dark dark:border-gray-700 dark:hover:border-primary/50 text-text-main dark:text-gray-200 px-3 font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95"
              title="ตัวกรองเพิ่มเติม"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        {filteredRecipes.length === 0 ? (
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-12 text-center shadow-sm">
            <p className="text-text-secondary dark:text-gray-400 mb-4">ยังไม่มีสูตรอาหาร</p>
            <Link
              href="/recipes/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary hover:bg-primary-hover text-black text-base font-bold shadow-md shadow-primary/20 transition-all"
            >
              <span className="material-symbols-outlined">add_circle</span>
              <span>สร้างสูตรแรก</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-border-light dark:border-border-dark">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wider w-[35%]">ชื่อเมนู</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wider w-[15%]">หมวดหมู่</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wider w-[15%]">ต้นทุน</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wider w-[15%]">ราคาขาย</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wider w-[10%]">กำไร</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wider w-[10%]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {paginatedRecipes.map((recipe, index) => {
                      const profit = getProfitPercentage(recipe);
                      const updatedDate = formatThaiDate(new Date(recipe.updatedAt));

                      return (
                        <tr
                          key={recipe.id}
                          className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                          onClick={() => router.push(`/recipes/${recipe.id}`)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div
                                className="h-14 w-14 rounded-xl bg-gray-200 bg-cover bg-center shadow-sm"
                                style={{ backgroundImage: `url('${getRecipeImage(index)}')` }}
                              ></div>
                              <div>
                                <p className="font-bold text-text-main dark:text-white text-base">{recipe.name}</p>
                                <p className="text-xs text-text-secondary dark:text-gray-500 mt-0.5">อัปเดต: {updatedDate}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">อาหารจานเดียว</span>
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-red-600 dark:text-red-400">
                            {formatCurrency(recipe.totalCost)}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-text-main dark:text-white">
                            {recipe.salePrice > 0 ? formatCurrency(recipe.salePrice) : "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {profit > 0 ? (
                              <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-bold text-green-700 dark:text-green-400">
                                {profit.toFixed(0)}%
                              </span>
                            ) : (
                              <span className="text-text-secondary dark:text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => router.push(`/recipes/${recipe.id}`)}
                                className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                                title="แก้ไข"
                              >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                              </button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    className="p-2 rounded-lg text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    title="ลบ"
                                  >
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>ลบสูตรอาหาร</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      คุณแน่ใจหรือไม่ว่าต้องการลบ "{recipe.name}"? การกระทำนี้ไม่สามารถยกเลิกได้
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(recipe.id)}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      ลบ
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border-light dark:border-border-dark px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30">
                  <p className="text-sm text-text-secondary dark:text-gray-400">
                    แสดง <span className="font-bold text-text-main dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span>-
                    <span className="font-bold text-text-main dark:text-white">{Math.min(currentPage * itemsPerPage, filteredRecipes.length)}</span> จาก{" "}
                    <span className="font-bold text-text-main dark:text-white">{filteredRecipes.length}</span> รายการ
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center h-8 w-8 rounded-lg border border-border-light dark:border-gray-600 bg-white dark:bg-surface-dark text-text-secondary dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    </button>
                    {[...Array(Math.min(totalPages, 3))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`flex items-center justify-center h-8 w-8 rounded-lg font-medium text-sm ${
                            currentPage === pageNum
                              ? "bg-primary text-black font-bold shadow-sm"
                              : "border border-border-light dark:border-gray-600 bg-white dark:bg-surface-dark text-text-main dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 3 && (
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center h-8 w-8 rounded-lg border border-border-light dark:border-gray-600 bg-white dark:bg-surface-dark text-text-secondary dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4">
              {paginatedRecipes.map((recipe, index) => {
                const profit = getProfitPercentage(recipe);
                const updatedDate = formatThaiDate(new Date(recipe.updatedAt));
                const shortDate = updatedDate.split(" ").slice(0, 2).join(" ") + " " + updatedDate.split(" ")[2].slice(-2);

                return (
                  <div
                    key={recipe.id}
                    className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-4 shadow-sm active:scale-[0.99] transition-transform"
                  >
                    <div className="flex gap-3 mb-3">
                      <div
                        className="h-16 w-16 shrink-0 rounded-lg bg-gray-200 bg-cover bg-center"
                        style={{ backgroundImage: `url('${getRecipeImage(index)}')` }}
                      ></div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <h3 className="font-bold text-text-main dark:text-white text-lg truncate">{recipe.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">อาหารจานเดียว</span>
                          <span>{shortDate}</span>
                        </div>
                      </div>
                      <button className="h-8 w-8 flex items-center justify-center text-text-secondary">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-border-light dark:border-border-dark pt-3">
                      <div>
                        <p className="text-xs text-text-secondary">ต้นทุน</p>
                        <p className="font-bold text-red-600 dark:text-red-400">{formatCurrency(recipe.totalCost)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-secondary">ราคาขาย</p>
                        <p className="font-bold text-green-600 dark:text-green-400">
                          {recipe.salePrice > 0 ? formatCurrency(recipe.salePrice) : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredRecipes.length > itemsPerPage && (
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage >= totalPages}
                  className="w-full py-3 mt-2 rounded-xl border border-border-light dark:border-gray-700 bg-white dark:bg-surface-dark text-primary font-bold shadow-sm active:bg-gray-50 disabled:opacity-50"
                >
                  โหลดเพิ่มเติม
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
