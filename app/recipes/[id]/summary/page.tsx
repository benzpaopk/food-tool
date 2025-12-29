"use client";

/**
 * Recipe Summary/Results Page (หน้าผลลัพธ์และการสรุป)
 * 
 * Detailed cost summary and analysis for a recipe
 */

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useRecipeStore } from "@/features/recipes/store";
import { useIngredientStore } from "@/features/ingredients/store";
import { formatCurrency } from "@/lib/formatters";
import { calculateIngredientCost } from "@/lib/calculations";
import type { Recipe, Ingredient } from "@/types";
import {
  ArrowLeftIcon,
  PrinterIcon,
  ShareIcon,
  DocumentTextIcon,
  TagIcon,
  ChartBarIcon,
  BeakerIcon,
  ListBulletIcon,
  LightBulbIcon,
  PencilIcon,
  BookmarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolidIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";

export default function RecipeSummaryPage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params?.id as string;
  const getRecipe = useRecipeStore((state) => state.getRecipe);
  const getIngredient = useIngredientStore((state) => state.getIngredient);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (recipeId) {
      const foundRecipe = getRecipe(recipeId);
      if (!foundRecipe) {
        router.push("/recipes");
      } else {
        setRecipe(foundRecipe);
      }
    }
  }, [recipeId, getRecipe, router]);

  // Calculate cost breakdown by category
  const costBreakdown = useMemo(() => {
    if (!recipe) return [];

    const categories: Record<string, { cost: number; percentage: number }> = {};

    recipe.items.forEach((item) => {
      const ingredient = getIngredient(item.ingredientId);
      if (ingredient) {
        const itemCost = calculateIngredientCost({
          pricePerUnit: ingredient.pricePerUnit,
          purchaseQuantity: ingredient.purchaseQuantity,
          purchaseUnit: ingredient.purchaseUnit,
          yieldPercentage: ingredient.yieldPercentage,
          usedQuantity: item.usedQuantity,
          usedUnit: item.usedUnit,
        });

        const category = ingredient.category;
        if (!categories[category]) {
          categories[category] = { cost: 0, percentage: 0 };
        }
        categories[category].cost += itemCost;
      }
    });

    const total = recipe.totalCost;
    return Object.entries(categories).map(([category, data]) => ({
      category,
      cost: data.cost,
      percentage: total > 0 ? (data.cost / total) * 100 : 0,
    }));
  }, [recipe, getIngredient]);

  // Calculate profit margin
  const profitMargin = useMemo(() => {
    if (!recipe || recipe.salePrice === 0) return 0;
    return ((recipe.salePrice - recipe.totalCost) / recipe.salePrice) * 100;
  }, [recipe]);

  // Get profit health status
  const getProfitHealth = (margin: number) => {
    if (margin >= 60) return { label: "ยอดเยี่ยม", color: "bg-green-500" };
    if (margin >= 30) return { label: "พอใช้", color: "bg-yellow-400" };
    return { label: "เสี่ยง", color: "bg-pink-300" };
  };

  const profitHealth = getProfitHealth(profitMargin);

  // Category color mapping
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      protein: "bg-red-500",
      vegetable: "bg-green-500",
      fruit: "bg-green-500",
      dairy: "bg-yellow-500",
      grain: "bg-yellow-500",
      spice: "bg-yellow-500",
      oil: "bg-yellow-500",
      beverage: "bg-gray-500",
      other: "bg-gray-500",
    };
    return colorMap[category] || "bg-gray-500";
  };

  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">กำลังโหลด...</p>
      </div>
    );
  }

  const suggestedPrice = recipe.totalCost / 0.3; // 30% food cost

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">+</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">Food Cost Calc</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-base font-medium text-gray-700 hover:text-primary transition-colors">
                หน้าแรก
              </Link>
              <Link href="/recipes/new" className="text-base font-medium text-gray-700 hover:text-primary transition-colors">
                เครื่องคำนวณ
              </Link>
              <Link href="/recipes" className="text-base font-medium text-gray-700 hover:text-primary transition-colors">
                สูตรอาหาร
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-700 font-semibold">ส</span>
              </div>
              <div className="hidden lg:block">
                <div className="text-sm font-medium text-gray-900">เชฟสมชาย</div>
                <div className="text-xs text-primary font-semibold">Pro Member</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Back Button & Title Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="lg" asChild>
                <Link href="/recipes/new">
                  <ArrowLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </Link>
              </Button>
              <Link href="/recipes/new" className="text-sm sm:text-base text-gray-600 hover:text-primary">
                กลับไปหน้าคำนวณ
              </Link>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <PrinterIcon className="w-5 h-5" />
                <span className="hidden sm:inline">พิมพ์</span>
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <ShareIcon className="w-5 h-5" />
                <span className="hidden sm:inline">แชร์</span>
              </Button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            สรุปต้นทุนอาหาร
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            ผลลัพธ์สำหรับ: "{recipe.name}"
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Card 1: Total Cost */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <DocumentTextIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div className="mb-2">
              <h3 className="text-sm sm:text-base text-gray-600 mb-1">ต้นทุนรวมต่อจาน</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatCurrency(recipe.totalCost)}</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              จากวัตถุดิบ {recipe.items.length} รายการ
            </p>
          </div>

          {/* Card 2: Suggested Price */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <TagIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div className="mb-2">
              <h3 className="text-sm sm:text-base text-gray-600 mb-1">ราคาขายแนะนำ</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatCurrency(suggestedPrice)}</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              เพื่อให้ได้กำไรตามเป้า
            </p>
          </div>

          {/* Card 3: Gross Profit */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <ChartBarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm sm:text-base text-gray-600">กำไรเบื้องต้น</h3>
                <span className="px-2 py-1 bg-primary-light text-primary-dark rounded-full text-xs font-semibold">
                  {profitHealth.label}
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{profitMargin.toFixed(0)}%</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              อยู่ในเกณฑ์ที่ดีมาก
            </p>
          </div>
        </div>

        {/* Profit Health Section */}
        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-sm mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BeakerIcon className="w-6 h-6 text-primary" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">สุขภาพกำไร (Profit Health)</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            อัตรากำไรของคุณอยู่ที่ {profitMargin.toFixed(0)}% ซึ่งถือว่าอยู่ในเกณฑ์ "{profitHealth.label}" สำหรับร้านอาหารประเภทจานเดียว
          </p>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
              <span>0%</span>
              <span>30% (เสี่ยง)</span>
              <span>60% (พอใช้)</span>
              <span>100% (ดีมาก)</span>
            </div>
            <div className="relative h-4 sm:h-6 bg-gray-200 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-pink-300"></div>
                <div className="flex-1 bg-yellow-300"></div>
                <div className="flex-1 bg-green-300"></div>
              </div>
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-gray-900 z-10"
                style={{ left: `${profitMargin}%` }}
              >
                <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                    คุณอยู่ตรงนี้ ({profitMargin.toFixed(0)}%)
                  </div>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Cost Breakdown */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ChartBarIcon className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">สัดส่วนต้นทุน (Cost Breakdown)</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              วิเคราะห์โครงสร้างต้นทุนแยกตามประเภท
            </p>

            <div className="space-y-4">
              {costBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm sm:text-base text-gray-700">{item.category}</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900">{item.percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                    <div
                      className={`${getCategoryColor(item.category)} h-full rounded-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Materials List */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ListBulletIcon className="w-6 h-6 text-orange-500" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">รายการวัตถุดิบ</h2>
              </div>
              <Link href="#" className="text-sm sm:text-base text-primary hover:underline">
                ดูทั้งหมด
              </Link>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {recipe.items.length} รายการในสูตรนี้
            </p>

            <div className="space-y-3">
              {recipe.items.slice(0, 4).map((item, index) => {
                const ingredient = getIngredient(item.ingredientId);
                if (!ingredient) return null;

                const itemCost = calculateIngredientCost({
                  pricePerUnit: ingredient.pricePerUnit,
                  purchaseQuantity: ingredient.purchaseQuantity,
                  purchaseUnit: ingredient.purchaseUnit,
                  yieldPercentage: ingredient.yieldPercentage,
                  usedQuantity: item.usedQuantity,
                  usedUnit: item.usedUnit,
                });

                const percentage = recipe.totalCost > 0 ? (itemCost / recipe.totalCost) * 100 : 0;
                const categoryColor = getCategoryColor(ingredient.category);

                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${categoryColor} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
                      <span className={`${categoryColor.replace('bg-', 'text-')} font-bold text-lg`}>
                        {ingredient.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {ingredient.name}
                        </h3>
                        <span className="text-xs sm:text-sm font-semibold text-gray-600 ml-2">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">
                          {item.usedQuantity} {item.usedUnit}
                        </span>
                        <span className="text-sm sm:text-base font-semibold text-gray-900">
                          {formatCurrency(itemCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Smart Insight Section */}
        {costBreakdown.length > 0 && costBreakdown[0].percentage > 50 && (
          <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-sm mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4">
              <LightBulbIcon className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">คำแนะนำอัจฉริยะ (Smart Insight)</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              ต้นทุน <span className="font-semibold">{costBreakdown[0].category}</span> ของคุณค่อนข้างสูง ({costBreakdown[0].percentage.toFixed(0)}%) ซึ่งเป็นสัดส่วนหลักของจานนี้ ลองพิจารณา:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircleSolidIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-gray-700">
                  ซื้อวัตถุดิบจากแหล่งค้าส่ง (Makro หรือตลาดไท) เพื่อลดต้นทุนต่อหน่วยลง 10-15%
                </p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleSolidIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-gray-700">
                  ปรับลดปริมาณเนื้อสัตว์ลง 10-20 กรัม แล้วเพิ่มผักหรือเห็ดเพื่อรักษาปริมาณจาน
                </p>
              </li>
            </ul>
          </div>
        )}

        {/* Footer Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center justify-center gap-2"
            asChild
          >
            <Link href={`/recipes/${recipe.id}`}>
              <PencilIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>แก้ไขข้อมูล</span>
            </Link>
          </Button>
          <Button
            size="lg"
            className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-dark"
          >
            <BookmarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>บันทึกผลลัพธ์</span>
          </Button>
        </div>
      </main>
    </div>
  );
}

