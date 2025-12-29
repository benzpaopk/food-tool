"use client";

import React from "react";
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
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

export default function RecipeCostSummary() {
  // Static dummy data
  const recipeData = {
    name: "ข้าวกะเพราหมูสับ (สูตรพิเศษ)",
    totalCost: 45.50,
    suggestedPrice: 120.00,
    profitMargin: 60,
    ingredientCount: 8,
  };

  const costBreakdown = [
    { category: "เนื้อสัตว์ (Meat)", percentage: 55, color: "bg-red-500" },
    { category: "ผัก & สมุนไพร (Veg & Herbs)", percentage: 25, color: "bg-green-500" },
    { category: "เครื่องปรุง (Seasoning)", percentage: 15, color: "bg-yellow-500" },
    { category: "บรรจุภัณฑ์ (Packaging)", percentage: 5, color: "bg-gray-500" },
  ];

  const ingredients = [
    { name: "เนื้อหมูสับ", amount: "150 กรัม", cost: 25.00, percentage: 55, icon: "meat", color: "text-red-500" },
    { name: "ใบกะเพรา", amount: "20 กรัม", cost: 5.00, percentage: 11, icon: "leaf", color: "text-green-500" },
    { name: "พริกขี้หนู", amount: "10 กรัม", cost: 3.50, percentage: 8, icon: "chili", color: "text-orange-500" },
    { name: "เครื่องปรุงรส", amount: "1 ช้อนโต๊ะ", cost: 8.00, percentage: 18, icon: "spoon", color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="text-lg sm:text-xl font-bold text-primary">
              Food Cost Calc
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-base font-medium text-gray-700 hover:text-primary transition-colors">
                หน้าแรก
              </a>
              <a href="#" className="text-base font-medium text-gray-700 hover:text-primary transition-colors">
                เครื่องคำนวณ
              </a>
              <a href="#" className="text-base font-medium text-gray-700 hover:text-primary transition-colors">
                สูตรอาหาร
              </a>
            </nav>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm sm:text-base">ส</span>
                </div>
                <div className="hidden lg:block">
                  <div className="text-sm font-medium text-gray-900">เชฟสมชาย</div>
                  <div className="text-xs text-primary font-semibold">Pro Member</div>
                </div>
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
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
              <a href="#" className="text-sm sm:text-base text-gray-600 hover:text-primary">
                กลับไปหน้าคำนวณ
              </a>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium">
                <PrinterIcon className="w-5 h-5" />
                <span className="hidden sm:inline">พิมพ์</span>
              </button>
              <button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium">
                <ShareIcon className="w-5 h-5" />
                <span className="hidden sm:inline">แชร์</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            สรุปต้นทุนอาหาร
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            ผลลัพธ์สำหรับ: "{recipeData.name}"
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
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">฿{recipeData.totalCost.toFixed(2)}</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              จากวัตถุดิบ {recipeData.ingredientCount} รายการ
            </p>
          </div>

          {/* Card 2: Suggested Price */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <TagIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div className="mb-2">
              <h3 className="text-sm sm:text-base text-gray-600 mb-1">ราคาขายแนะนำ</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">฿{recipeData.suggestedPrice.toFixed(2)}</p>
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
                  ยอดเยี่ยม
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{recipeData.profitMargin}%</p>
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
            อัตรากำไรของคุณอยู่ที่ {recipeData.profitMargin}% ซึ่งถือว่าอยู่ในเกณฑ์ "ดีมาก" สำหรับร้านอาหารประเภทจานเดียว
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
              {/* Gradient Background */}
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-pink-300"></div>
                <div className="flex-1 bg-yellow-300"></div>
                <div className="flex-1 bg-green-300"></div>
              </div>
              {/* Marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-gray-900 z-10"
                style={{ left: `${recipeData.profitMargin}%` }}
              >
                <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                    คุณอยู่ตรงนี้ ({recipeData.profitMargin}%)
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
                    <span className="text-sm sm:text-base font-semibold text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                    <div
                      className={`${item.color} h-full rounded-full transition-all`}
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
              <a href="#" className="text-sm sm:text-base text-primary hover:underline">
                ดูทั้งหมด
              </a>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {recipeData.ingredientCount} รายการในสูตรนี้
            </p>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${ingredient.color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
                    <span className={`${ingredient.color} font-bold text-lg`}>
                      {ingredient.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                        {ingredient.name}
                      </h3>
                      <span className="text-xs sm:text-sm font-semibold text-gray-600 ml-2">
                        {ingredient.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">{ingredient.amount}</span>
                      <span className="text-sm sm:text-base font-semibold text-gray-900">
                        ฿{ingredient.cost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Smart Insight Section */}
        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-sm mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <LightBulbIcon className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">คำแนะนำอัจฉริยะ (Smart Insight)</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            ต้นทุน <span className="font-semibold">เนื้อสัตว์</span> ของคุณค่อนข้างสูง ({costBreakdown[0].percentage}%) ซึ่งเป็นสัดส่วนหลักของจานนี้ ลองพิจารณา:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-gray-700">
                ซื้อวัตถุดิบจากแหล่งค้าส่ง (Makro หรือตลาดไท) เพื่อลดต้นทุนต่อหน่วยลง 10-15%
              </p>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-gray-700">
                ปรับลดปริมาณเนื้อสัตว์ลง 10-20 กรัม แล้วเพิ่มผักหรือเห็ดเพื่อรักษาปริมาณจาน
              </p>
            </li>
          </ul>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
          <button className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-base sm:text-lg font-medium text-gray-700">
            <PencilIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>แก้ไขข้อมูล</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-base sm:text-lg font-medium shadow-md">
            <BookmarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>บันทึกผลลัพธ์</span>
          </button>
        </div>
      </main>
    </div>
  );
}

