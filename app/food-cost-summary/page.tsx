"use client";

/**
 * Food Cost Summary Page (หน้าผลลัพธ์และการสรุป)
 * 
 * Page displaying detailed food cost analysis and summary
 */

import Link from "next/link";

export default function FoodCostSummaryPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-[#e8eaed] font-sans transition-colors duration-200 antialiased selection:bg-primary/20 selection:text-primary-dark">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 md:px-8 py-3 flex items-center justify-between max-w-7xl mx-auto h-16">
          <div className="flex items-center gap-3">
            <div className="size-10 flex items-center justify-center bg-primary/10 rounded-full text-primary">
              <span className="material-symbols-outlined text-2xl">calculate</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-text-main dark:text-white">Food Cost Calc</h2>
          </div>
          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <nav className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
              <Link
                href="/"
                className="px-4 py-1.5 text-sm font-medium rounded-full text-text-secondary dark:text-gray-300 hover:text-text-main hover:bg-white dark:hover:bg-gray-700 transition-all"
              >
                หน้าแรก
              </Link>
              <Link
                href="/recipes/new"
                className="px-4 py-1.5 text-sm font-medium rounded-full bg-white dark:bg-gray-600 text-primary dark:text-white shadow-sm transition-all"
              >
                เครื่องคำนวณ
              </Link>
              <Link
                href="/recipes"
                className="px-4 py-1.5 text-sm font-medium rounded-full text-text-secondary dark:text-gray-300 hover:text-text-main hover:bg-white dark:hover:bg-gray-700 transition-all"
              >
                สูตรอาหาร
              </Link>
            </nav>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="size-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 border-2 border-white dark:border-gray-600 shadow-sm">
                <span className="material-symbols-outlined text-xl">person</span>
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-sm font-bold leading-none">เชฟสมชาย</span>
                <span className="text-xs text-text-secondary dark:text-gray-400">Pro Member</span>
              </div>
            </div>
          </div>
          <button className="md:hidden p-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex justify-center py-8 px-4 md:px-6 w-full">
        <div className="flex flex-col max-w-[1080px] w-full gap-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-3 max-w-2xl">
              <Link
                href="/recipes/new"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary dark:text-gray-400 hover:text-primary transition-colors w-fit group"
              >
                <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                กลับไปหน้าคำนวณ
              </Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main dark:text-white mb-2">สรุปต้นทุนอาหาร</h1>
                <div className="flex flex-wrap items-center gap-2 text-lg text-text-secondary dark:text-gray-300">
                  <span>ผลลัพธ์สำหรับ:</span>
                  <span className="font-bold text-text-main dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">&quot;ข้าวกะเพราหมูสับ (สูตรพิเศษ)&quot;</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-gray-200 dark:border-gray-600 bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-700 text-text-main dark:text-white font-medium transition-all shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined text-xl">print</span>
                <span>พิมพ์</span>
              </button>
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-gray-200 dark:border-gray-600 bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-700 text-text-main dark:text-white font-medium transition-all shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined text-xl">share</span>
                <span>แชร์</span>
              </button>
            </div>
          </div>

          {/* Key Statistics Cards */}
          <section aria-label="Key Statistics" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="relative overflow-hidden flex flex-col justify-between h-full rounded-2xl p-6 bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 shadow-soft transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -right-4 -top-4 size-24 bg-gray-50 dark:bg-gray-800 rounded-full opacity-50 z-0"></div>
              <div className="relative z-10 flex items-center gap-3 text-text-secondary dark:text-gray-400 mb-4">
                <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-text-main dark:text-white">
                  <span className="material-symbols-outlined text-2xl">payments</span>
                </div>
                <p className="text-sm font-bold uppercase tracking-wider">ต้นทุนรวมต่อจาน</p>
              </div>
              <div className="relative z-10">
                <p className="text-5xl font-bold tracking-tight text-text-main dark:text-white">฿45.50</p>
                <p className="text-sm font-medium text-text-secondary dark:text-gray-400 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">inventory_2</span>
                  จากวัตถุดิบ 8 รายการ
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden flex flex-col justify-between h-full rounded-2xl p-6 bg-surface-light dark:bg-surface-dark border-2 border-primary/20 dark:border-primary/20 shadow-soft transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -right-4 -top-4 size-24 bg-green-50 dark:bg-green-900/20 rounded-full opacity-50 z-0"></div>
              <div className="relative z-10 flex items-center gap-3 text-primary dark:text-primary mb-4">
                <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-900/30 text-primary">
                  <span className="material-symbols-outlined text-2xl">sell</span>
                </div>
                <p className="text-sm font-bold uppercase tracking-wider">ราคาขายแนะนำ</p>
              </div>
              <div className="relative z-10">
                <p className="text-5xl font-bold tracking-tight text-primary dark:text-green-400">฿120.00</p>
                <p className="text-sm font-medium text-primary/80 dark:text-green-400/80 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">target</span>
                  เพื่อให้ได้กำไรตามเป้า
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden flex flex-col justify-between h-full rounded-2xl p-6 bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 shadow-soft transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -right-4 -top-4 size-24 bg-gray-50 dark:bg-gray-800 rounded-full opacity-50 z-0"></div>
              <div className="relative z-10 flex items-center gap-3 text-text-secondary dark:text-gray-400 mb-4">
                <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-text-main dark:text-white">
                  <span className="material-symbols-outlined text-2xl">trending_up</span>
                </div>
                <p className="text-sm font-bold uppercase tracking-wider">กำไรเบื้องต้น</p>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <p className="text-5xl font-bold tracking-tight text-text-main dark:text-white">60%</p>
                  <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/40 px-3 py-1 text-xs font-bold text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                    ยอดเยี่ยม
                  </span>
                </div>
                <p className="text-sm font-medium text-text-secondary dark:text-gray-400 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-green-500">check_circle</span>
                  อยู่ในเกณฑ์ที่ดีมาก
                </p>
              </div>
            </div>
          </section>

          {/* Profit Health Section */}
          <section className="rounded-3xl bg-surface-light dark:bg-surface-dark p-6 md:p-8 shadow-soft border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">health_metrics</span>
                    สุขภาพกำไร (Profit Health)
                  </h3>
                  <p className="text-text-secondary dark:text-gray-400 mt-1 max-w-xl">
                    อัตรากำไรของคุณอยู่ที่ <strong className="text-primary dark:text-green-400">60%</strong> ซึ่งถือว่าอยู่ในเกณฑ์ <strong className="text-primary dark:text-green-400">&quot;ดีมาก&quot;</strong> สำหรับร้านอาหารประเภทจานเดียว
                  </p>
                </div>
              </div>
              <div className="relative pt-2 pb-6">
                <div className="relative h-6 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex">
                  <div className="w-[30%] bg-red-100 dark:bg-red-900/30 border-r border-white/50 dark:border-black/20" title="เสี่ยง"></div>
                  <div className="w-[30%] bg-yellow-100 dark:bg-yellow-900/30 border-r border-white/50 dark:border-black/20" title="พอใช้"></div>
                  <div className="w-[40%] bg-green-100 dark:bg-green-900/30" title="ดีมาก"></div>
                </div>
                <div className="absolute top-0 h-10 w-1 bg-text-main dark:text-white dark:bg-white rounded-full transition-all duration-1000 shadow-lg z-20 -mt-2" style={{ left: "60%", transform: "translateX(-50%)" }}>
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-text-main dark:bg-white text-surface-light dark:text-black text-xs font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                    คุณอยู่ตรงนี้ (60%)
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-text-main dark:bg-white rotate-45"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-bold text-text-secondary dark:text-gray-500 mt-2 px-1">
                  <span>0%</span>
                  <span className="pl-[25%]">30% (เสี่ยง)</span>
                  <span className="pl-[20%]">60% (พอใช้)</span>
                  <span>100% (ดีมาก)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Cost Breakdown and Ingredients List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Cost Breakdown Section */}
            <section className="flex flex-col rounded-3xl bg-surface-light dark:bg-surface-dark p-6 md:p-8 shadow-soft border border-gray-100 dark:border-gray-700">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500">pie_chart</span>
                  สัดส่วนต้นทุน (Cost Breakdown)
                </h3>
                <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">วิเคราะห์โครงสร้างต้นทุนแยกตามประเภท</p>
              </div>
              <div className="space-y-6">
                <div className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-text-secondary dark:text-gray-300">เนื้อสัตว์ (Meat)</span>
                    <span className="text-sm font-bold text-text-main dark:text-white">55%</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className="h-full bg-red-400 dark:bg-red-500 rounded-full group-hover:bg-red-500 dark:group-hover:bg-red-400 transition-all duration-500 ease-out" style={{ width: "55%" }}></div>
                  </div>
                </div>
                <div className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-text-secondary dark:text-gray-300">ผัก & สมุนไพร (Veg & Herbs)</span>
                    <span className="text-sm font-bold text-text-main dark:text-white">25%</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full group-hover:bg-green-600 dark:group-hover:bg-green-400 transition-all duration-500 ease-out" style={{ width: "25%" }}></div>
                  </div>
                </div>
                <div className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-text-secondary dark:text-gray-300">เครื่องปรุง (Seasoning)</span>
                    <span className="text-sm font-bold text-text-main dark:text-white">15%</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full group-hover:bg-yellow-500 dark:group-hover:bg-yellow-300 transition-all duration-500 ease-out" style={{ width: "15%" }}></div>
                  </div>
                </div>
                <div className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-text-secondary dark:text-gray-300">บรรจุภัณฑ์ (Packaging)</span>
                    <span className="text-sm font-bold text-text-main dark:text-white">5%</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className="h-full bg-gray-400 rounded-full group-hover:bg-gray-500 dark:group-hover:bg-gray-300 transition-all duration-500 ease-out" style={{ width: "5%" }}></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Ingredients List Section */}
            <section className="flex flex-col rounded-3xl bg-surface-light dark:bg-surface-dark p-6 md:p-8 shadow-soft border border-gray-100 dark:border-gray-700 h-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500">list_alt</span>
                    รายการวัตถุดิบ
                  </h3>
                  <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">8 รายการในสูตรนี้</p>
                </div>
                <button className="text-sm text-primary font-bold hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">ดูทั้งหมด</button>
              </div>
              <div className="flex flex-col flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                <div className="group flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl px-2 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 shrink-0">
                      <span className="material-symbols-outlined">egg_alt</span>
                    </div>
                    <div>
                      <p className="font-bold text-base text-text-main dark:text-white">เนื้อหมูสับ</p>
                      <p className="text-sm text-text-secondary dark:text-gray-400">150 กรัม</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-base text-text-main dark:text-white">฿25.00</p>
                    <p className="text-xs text-text-secondary dark:text-gray-400">55%</p>
                  </div>
                </div>
                <div className="group flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl px-2 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                      <span className="material-symbols-outlined">grass</span>
                    </div>
                    <div>
                      <p className="font-bold text-base text-text-main dark:text-white">ใบกะเพรา</p>
                      <p className="text-sm text-text-secondary dark:text-gray-400">20 กรัม</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-base text-text-main dark:text-white">฿5.00</p>
                    <p className="text-xs text-text-secondary dark:text-gray-400">11%</p>
                  </div>
                </div>
                <div className="group flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl px-2 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 dark:text-orange-400 shrink-0">
                      <span className="material-symbols-outlined">local_fire_department</span>
                    </div>
                    <div>
                      <p className="font-bold text-base text-text-main dark:text-white">พริกขี้หนู</p>
                      <p className="text-sm text-text-secondary dark:text-gray-400">10 กรัม</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-base text-text-main dark:text-white">฿3.50</p>
                    <p className="text-xs text-text-secondary dark:text-gray-400">8%</p>
                  </div>
                </div>
                <div className="group flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl px-2 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shrink-0">
                      <span className="material-symbols-outlined">soup_kitchen</span>
                    </div>
                    <div>
                      <p className="font-bold text-base text-text-main dark:text-white">เครื่องปรุงรส</p>
                      <p className="text-sm text-text-secondary dark:text-gray-400">1 ช้อนโต๊ะ</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-base text-text-main dark:text-white">฿8.00</p>
                    <p className="text-xs text-text-secondary dark:text-gray-400">18%</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Smart Insight Section */}
          <div className="rounded-3xl bg-blue-50 dark:bg-blue-900/20 p-6 md:p-8 flex flex-col md:flex-row gap-5 items-start border border-blue-100 dark:border-blue-800/30 shadow-sm relative overflow-hidden">
            <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-[150px] text-blue-100 dark:text-blue-900/40 rotate-12 pointer-events-none">lightbulb</span>
            <div className="size-12 min-w-12 rounded-2xl bg-white dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200 shadow-sm z-10">
              <span className="material-symbols-outlined text-2xl">lightbulb</span>
            </div>
            <div className="flex-1 z-10">
              <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg mb-2">คำแนะนำอัจฉริยะ (Smart Insight)</h4>
              <p className="text-base text-blue-800 dark:text-blue-200/80 leading-relaxed max-w-3xl">
                ต้นทุน <strong>เนื้อสัตว์</strong> ของคุณค่อนข้างสูง (55%) ซึ่งเป็นสัดส่วนหลักของจานนี้ ลองพิจารณา:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-blue-800 dark:text-blue-200/80">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  ซื้อวัตถุดิบจากแหล่งค้าส่ง (Makro หรือตลาดไท) เพื่อลดต้นทุนต่อหน่วยลง 10-15%
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  ปรับลดปริมาณเนื้อสัตว์ลง 10-20 กรัม แล้วเพิ่มผักหรือเห็ดเพื่อรักษาปริมาณจาน
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 pb-12">
            <button className="order-2 sm:order-1 flex items-center justify-center gap-2 h-14 px-8 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-text-main dark:text-white text-base font-bold transition-all">
              <span className="material-symbols-outlined">edit</span>
              <span>แก้ไขข้อมูล</span>
            </button>
            <button className="order-1 sm:order-2 flex items-center justify-center gap-3 h-14 px-10 rounded-2xl bg-primary hover:bg-primary-dark text-white text-lg font-bold shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-1">
              <span className="material-symbols-outlined">save</span>
              <span>บันทึกผลลัพธ์</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-text-secondary dark:text-gray-500 text-sm border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="material-symbols-outlined text-lg">universal_currency_alt</span>
          <span className="font-bold">Food Cost Calculator</span>
        </div>
        <p>© 2024 Designed with Universal Design principles for Everyone.</p>
      </footer>
    </div>
  );
}

