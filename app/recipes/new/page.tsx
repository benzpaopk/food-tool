"use client";

/**
 * Calculator Page (หน้าคำนวณต้นทุนอาหาร)
 * 
 * Page for calculating food costs with recipe input and ingredients list
 * Integrated with RecipeForm component for backend logic
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RecipeForm } from "@/features/recipes";
import { formatCurrency } from "@/lib/formatters";
import { useRecipeStore } from "@/features/recipes/store";

export default function CalculatorPage() {
  const router = useRouter();
  const [profitPercentage, setProfitPercentage] = useState(60);
  const [totalCost, setTotalCost] = useState(76.75);
  const [servings, setServings] = useState(1);

  // Calculate suggested selling price
  const suggestedPrice = useMemo(() => {
    if (totalCost === 0) return 0;
    return totalCost / ((100 - profitPercentage) / 100);
  }, [totalCost, profitPercentage]);

  const handleSave = () => {
    // This will be handled by RecipeForm's submit
    router.push("/recipes");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-body text-text-main dark:text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border-color dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-black shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[24px]">calculate</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-main dark:text-white">Food Cost Calc</h2>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl mr-2">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-white dark:bg-white/10 shadow-sm text-text-main dark:text-white transition-all"
              >
                หน้าแรก
              </Link>
              <Link
                href="#"
                className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-white/50 dark:hover:bg-white/5 text-text-secondary dark:text-gray-400 transition-all"
              >
                คู่มือ
              </Link>
            </nav>
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-primary/20 cursor-pointer shadow-sm"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnj2WnSXTDd-XZLVQCC3J24AkChI3S73QKbYmd7twNTd-stcveYD2sbquV6uQAPhXzE0gE5UhncPPgRBOdcAJKdokL3BwfiYveeB8HsGU-vS59MrpJ1oIlyR8SXtGoCKiscjjty1AkjkNwP8nMoJvhnBqQKR1rmhusbOEQm9GHq5LxLdcQazxQE8gsAO4-ltBf_zPbRvGdEnphCTCpSVq6RcUa_SmQUcP_WKMGDFsO9BzATtvJQpJ3_6MPLTsYgvwJAYSM2RmyyTmC")'
              }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 md:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-text-main dark:text-white mb-4 leading-tight">
              เครื่องคำนวณต้นทุนอาหาร
            </h1>
            <p className="text-text-secondary dark:text-gray-400 text-lg md:text-xl max-w-3xl leading-relaxed">
              ออกแบบมาเพื่อทุกคน ใช้งานง่ายเพียงกรอกข้อมูลวัตถุดิบ ระบบจะคำนวณต้นทุนต่อจานให้อัตโนมัติ
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column - Form */}
            <div className="flex-1 w-full space-y-6">
              {/* Recipe Details Card */}
              <div className="bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-2xl border border-border-color dark:border-white/10 shadow-sm">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                      ชื่อเมนูอาหาร
                    </label>
                    <input
                      className="input-lg w-full bg-gray-50 dark:bg-black/20 text-text-main dark:text-white placeholder:text-gray-400"
                      placeholder="เช่น ผัดไทยกุ้งสด, แกงเขียวหวาน"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                      จำนวนที่ทำได้
                      <span className="material-symbols-outlined text-gray-400 text-[20px]" title="สูตรนี้ทำได้กี่จาน?">info</span>
                    </label>
                    <div className="relative">
                      <input
                        className="input-lg w-full bg-gray-50 dark:bg-black/20 text-center text-2xl font-bold text-primary-dark dark:text-primary pr-14"
                        placeholder="1"
                        type="number"
                        value={servings}
                        onChange={(e) => setServings(Number(e.target.value))}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-medium">จาน</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main dark:text-white">
                    <span className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary-dark">
                      <span className="material-symbols-outlined">grocery</span>
                    </span>
                    รายการวัตถุดิบ (Ingredients)
                  </h2>
                  <span className="text-sm text-text-secondary bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">3 รายการ</span>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-12 gap-6 px-6 py-3 text-sm font-bold text-text-secondary dark:text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-white/5 rounded-xl border border-border-color dark:border-white/5">
                  <div className="col-span-4">ชื่อวัตถุดิบ</div>
                  <div className="col-span-3">ปริมาณที่ใช้</div>
                  <div className="col-span-3">ราคาที่ซื้อ / หน่วย</div>
                  <div className="col-span-2 text-right">ต้นทุน (บาท)</div>
                </div>

                {/* Ingredients List */}
                <div className="space-y-4">
                  {/* Ingredient 1 */}
                  <div className="group bg-surface-light dark:bg-surface-dark border border-border-color dark:border-white/10 rounded-2xl p-5 md:px-6 md:py-5 shadow-sm hover:shadow-md transition-all relative ring-1 ring-transparent hover:ring-primary/20">
                    <button
                      aria-label="ลบรายการ"
                      className="absolute -right-2 -top-2 md:top-1/2 md:-translate-y-1/2 md:right-4 size-10 md:size-8 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 text-red-500 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-100 hover:text-red-600 shadow-sm md:shadow-none z-10 transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
                      <div className="col-span-4">
                        <label className="md:hidden text-xs font-bold text-gray-400 uppercase mb-1 block">ชื่อวัตถุดิบ</label>
                        <input
                          className="w-full bg-transparent border-0 border-b-2 border-gray-100 dark:border-gray-700 focus:border-primary focus:ring-0 px-0 py-2 text-lg font-medium text-text-main dark:text-white placeholder:text-gray-300 transition-colors"
                          placeholder="ชื่อวัตถุดิบ"
                          type="text"
                          defaultValue="เส้นจันท์"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="md:hidden text-xs font-bold text-gray-400 uppercase mb-1 block">ปริมาณที่ใช้</label>
                        <div className="flex items-center gap-2">
                          <input
                            className="w-full bg-gray-50 dark:bg-black/30 border border-transparent focus:border-primary focus:ring-primary rounded-lg py-2 px-3 text-right font-mono text-lg font-medium"
                            type="number"
                            defaultValue={150}
                          />
                          <div className="relative min-w-[80px]">
                            <select className="w-full appearance-none bg-transparent font-medium text-text-secondary py-2 pr-6 cursor-pointer focus:ring-0 border-0">
                              <option>กรัม</option>
                              <option>กก.</option>
                            </select>
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none text-sm">expand_more</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <label className="md:hidden text-xs font-bold text-gray-400 uppercase mb-1 block">ราคาซื้อ / หน่วย</label>
                        <div className="flex items-center gap-2">
                          <input
                            className="w-full bg-gray-50 dark:bg-black/30 border border-transparent focus:border-primary focus:ring-primary rounded-lg py-2 px-3 text-right font-mono text-lg text-text-secondary dark:text-gray-300"
                            type="number"
                            defaultValue={45}
                          />
                          <span className="text-gray-300">/</span>
                          <div className="relative min-w-[80px]">
                            <select className="w-full appearance-none bg-transparent font-medium text-text-secondary py-2 pr-6 cursor-pointer focus:ring-0 border-0">
                              <option>กก.</option>
                              <option>แพ็ค</option>
                            </select>
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none text-sm">expand_more</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 text-right pt-2 md:pt-0 border-t md:border-0 border-dashed border-gray-200 dark:border-gray-700 mt-2 md:mt-0 flex justify-between md:block items-center">
                        <span className="md:hidden text-sm font-bold text-gray-500">รวมเป็นเงิน</span>
                        <div>
                          <span className="text-xl font-bold text-text-main dark:text-white">6.75</span>
                          <span className="text-xs text-gray-400 ml-1">บาท</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ingredient 2 */}
                  <div className="group bg-surface-light dark:bg-surface-dark border border-border-color dark:border-white/10 rounded-2xl p-5 md:px-6 md:py-5 shadow-sm hover:shadow-md transition-all relative ring-1 ring-transparent hover:ring-primary/20">
                    <button
                      aria-label="ลบรายการ"
                      className="absolute -right-2 -top-2 md:top-1/2 md:-translate-y-1/2 md:right-4 size-10 md:size-8 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 text-red-500 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-100 hover:text-red-600 shadow-sm md:shadow-none z-10 transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
                      <div className="col-span-4">
                        <label className="md:hidden text-xs font-bold text-gray-400 uppercase mb-1 block">ชื่อวัตถุดิบ</label>
                        <input
                          className="w-full bg-transparent border-0 border-b-2 border-gray-100 dark:border-gray-700 focus:border-primary focus:ring-0 px-0 py-2 text-lg font-medium text-text-main dark:text-white placeholder:text-gray-300 transition-colors"
                          type="text"
                          defaultValue="กุ้งสด"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="md:hidden text-xs font-bold text-gray-400 uppercase mb-1 block">ปริมาณที่ใช้</label>
                        <div className="flex items-center gap-2">
                          <input
                            className="w-full bg-gray-50 dark:bg-black/30 border border-transparent focus:border-primary focus:ring-primary rounded-lg py-2 px-3 text-right font-mono text-lg font-medium"
                            type="number"
                            defaultValue={4}
                          />
                          <div className="relative min-w-[80px]">
                            <select className="w-full appearance-none bg-transparent font-medium text-text-secondary py-2 pr-6 cursor-pointer focus:ring-0 border-0">
                              <option>ตัว</option>
                              <option>กก.</option>
                            </select>
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none text-sm">expand_more</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <label className="md:hidden text-xs font-bold text-gray-400 uppercase mb-1 block">ราคาซื้อ / หน่วย</label>
                        <div className="flex items-center gap-2">
                          <input
                            className="w-full bg-gray-50 dark:bg-black/30 border border-transparent focus:border-primary focus:ring-primary rounded-lg py-2 px-3 text-right font-mono text-lg text-text-secondary dark:text-gray-300"
                            type="number"
                            defaultValue={350}
                          />
                          <span className="text-gray-300">/</span>
                          <div className="relative min-w-[80px]">
                            <select className="w-full appearance-none bg-transparent font-medium text-text-secondary py-2 pr-6 cursor-pointer focus:ring-0 border-0">
                              <option>กก.</option>
                            </select>
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none text-sm">expand_more</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 text-right pt-2 md:pt-0 border-t md:border-0 border-dashed border-gray-200 dark:border-gray-700 mt-2 md:mt-0 flex justify-between md:block items-center">
                        <span className="md:hidden text-sm font-bold text-gray-500">รวมเป็นเงิน</span>
                        <div>
                          <span className="text-xl font-bold text-text-main dark:text-white">70.00</span>
                          <span className="text-xs text-gray-400 ml-1">บาท</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* New Ingredient Row */}
                  <div className="group bg-surface-light/60 dark:bg-surface-dark/60 border border-border-color dark:border-white/10 rounded-2xl p-5 md:px-6 md:py-5 shadow-sm transition-all relative">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center opacity-60 group-hover:opacity-100 transition-opacity">
                      <div className="col-span-4">
                        <input
                          className="w-full bg-transparent border-0 border-b-2 border-gray-100 dark:border-gray-700 focus:border-primary focus:ring-0 px-0 py-2 text-lg font-medium text-text-main dark:text-white placeholder:text-gray-400 transition-colors"
                          placeholder="เพิ่มวัตถุดิบใหม่..."
                          type="text"
                        />
                      </div>
                      <div className="col-span-3 hidden md:flex items-center gap-2">
                        <input
                          className="w-full bg-gray-50 dark:bg-black/30 border-0 rounded-lg py-2 px-3 text-right"
                          disabled
                          placeholder="0"
                          type="number"
                        />
                        <span className="text-sm text-gray-400">หน่วย</span>
                      </div>
                      <div className="col-span-3 hidden md:flex items-center gap-2">
                        <input
                          className="w-full bg-gray-50 dark:bg-black/30 border-0 rounded-lg py-2 px-3 text-right"
                          disabled
                          placeholder="0"
                          type="number"
                        />
                        <span className="text-sm text-gray-400">/หน่วย</span>
                      </div>
                      <div className="col-span-2 text-right hidden md:block">
                        <span className="text-xl font-bold text-gray-300 dark:text-gray-600">0.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Ingredient Button */}
                <button className="w-full py-5 mt-4 border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 rounded-2xl flex items-center justify-center gap-3 text-primary-dark font-bold text-lg transition-all group active:scale-[0.99]">
                  <div className="bg-primary text-black rounded-full size-8 flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 transition-all duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">add</span>
                  </div>
                  เพิ่มวัตถุดิบอีกรายการ
                </button>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="w-full lg:w-[400px] flex-shrink-0 lg:sticky lg:top-28 space-y-6">
              {/* Cost Summary Card */}
              <div className="bg-background-dark text-white dark:bg-surface-dark dark:border dark:border-white/10 rounded-3xl p-8 shadow-2xl shadow-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none"></div>
                <h3 className="text-xl font-bold text-gray-200 mb-8 flex items-center gap-3 relative z-10">
                  <span className="material-symbols-outlined text-primary">receipt_long</span>
                  สรุปต้นทุน (Summary)
                </h3>
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <span className="text-gray-400 font-medium">ต้นทุนรวมทั้งหมด</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold tracking-tight font-mono text-white">{totalCost.toFixed(2)}</span>
                      <span className="text-sm text-gray-400 font-medium">THB</span>
                    </div>
                  </div>
                  <div className="py-2">
                    <span className="text-primary text-sm font-bold uppercase tracking-wider mb-2 block">ต้นทุนต่อจาน (Cost/Serving)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black text-white font-mono tracking-tight drop-shadow-[0_0_15px_rgba(19,236,19,0.3)]">
                        {(totalCost / servings).toFixed(2)}
                      </span>
                      <span className="text-xl font-medium text-gray-400">บาท</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      คำนวณจากจำนวนเสิร์ฟ {servings} จาน
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 space-y-4 border border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-300">กำไรที่ต้องการ (%)</span>
                      <div className="relative w-24">
                        <input
                          className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-1.5 text-right text-white font-mono font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          type="number"
                          value={profitPercentage}
                          onChange={(e) => setProfitPercentage(Number(e.target.value))}
                        />
                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <span className="text-base font-bold text-primary">ราคาขายแนะนำ</span>
                      <span className="text-2xl font-bold font-mono text-white">{suggestedPrice.toFixed(2)} ฿</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                  <button
                    onClick={handleSave}
                    className="w-full bg-primary text-black hover:bg-primary-dark font-bold text-lg py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
                  >
                    <span className="material-symbols-outlined">save</span>
                    บันทึก
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full bg-white/5 border border-white/20 hover:bg-white/10 text-white font-bold text-lg py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined">print</span>
                    พิมพ์
                  </button>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-6 rounded-2xl">
                <div className="flex gap-4">
                  <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-200">lightbulb</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-2 uppercase tracking-wide">เกร็ดความรู้ (Tips)</h4>
                    <p className="text-sm text-text-main dark:text-gray-300 leading-relaxed">
                      อย่าลืมรวมค่าเครื่องปรุงเล็กๆ น้อยๆ เช่น น้ำมัน น้ำปลา พริกไทย โดยอาจจะบวกเพิ่มเป็น % ของต้นทุนรวม (Buffer) ประมาณ{" "}
                      <span className="font-bold text-blue-600 dark:text-blue-400">5-10%</span> เพื่อความแม่นยำ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border-color dark:border-white/10 py-10 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">eco</span>
          </div>
          <p className="text-text-secondary dark:text-gray-500 text-sm">© 2023 Food Cost Calculator. Designed for everyone.</p>
        </div>
      </footer>
    </div>
  );
}
