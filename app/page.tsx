"use client";

/**
 * Landing Page (หน้าหลัก)
 * 
 * Main landing page with hero section, features, how it works, testimonials
 */

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main font-display overflow-x-hidden antialiased selection:bg-primary/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 dark:border-white/10 bg-white/80 backdrop-blur-md dark:bg-background-dark/80 supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
        <div className="px-4 md:px-8 py-4 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[24px]">restaurant_menu</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              FoodCost<span className="text-primary-dark dark:text-primary">Easy</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary transition-colors">
              หน้าหลัก
            </Link>
            <Link href="/recipes/new" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary transition-colors">
              เครื่องคิดเลข
            </Link>
            <Link href="/recipes" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary transition-colors">
              สูตรอาหาร
            </Link>
            <Link href="/food-cost-summary" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary transition-colors">
              ต้นทุนอาหาร
            </Link>
            <Link href="#" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary transition-colors">
              ติดต่อเรา
            </Link>
            <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-bold px-5 py-2.5 rounded-full shadow-md">
              เข้าสู่ระบบ
            </button>
          </div>
          <button className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative px-4 pt-16 pb-20 md:pt-24 md:pb-32 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col gap-6 lg:gap-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 shadow-sm w-fit animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs md:text-sm font-bold text-gray-600 dark:text-gray-200 uppercase tracking-wider">ออกแบบเพื่อคนทำร้านอาหาร</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-gray-900 dark:text-white text-balance">
              คำนวณต้นทุน <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary">ง่าย...จนงง</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-lg text-balance">
              เลิกปวดหัวกับตัวเลข ไม่ต้องจบบัญชีก็ทำได้ เครื่องมือที่ช่วยให้คุณรู้กำไรที่แท้จริงใน 3 คลิก
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link
                href="/recipes/new"
                className="group bg-primary hover:bg-primary-dark transition-all duration-300 text-gray-900 text-lg font-bold px-8 py-4 rounded-2xl shadow-[0_10px_20px_-10px_rgba(19,236,19,0.5)] hover:shadow-[0_20px_25px_-15px_rgba(19,236,19,0.6)] flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">calculate</span>
                เริ่มคำนวณฟรี
              </Link>
              <button className="group bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:text-white transition-all text-gray-700 text-lg font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-2xl text-gray-400 group-hover:text-primary transition-colors">play_circle</span>
                ดูวิดีโอ 1 นาที
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-sm font-semibold text-gray-400 mt-4">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg text-primary">check_circle</span>
                ใช้งานฟรีตลอดชีพ
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg text-primary">check_circle</span>
                ไม่ต้องลงโปรแกรม
              </span>
            </div>
          </div>
          <div className="relative group perspective-1000">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 transform transition-transform duration-500 hover:rotate-1 hover:scale-[1.01]">
              <div className="aspect-[4/3] bg-gray-100">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJdVPn1KXyKe3jaefInd4DZbbrVy6I6Lc7RyXhm-EtwoMxWt-QKvYYYh0LthVPcQR5qfwTkUQ7dJ0Q67o6otqyqBBWi9SC7BkJqwQg7FsrCR31c0epPQKwFApKFs8-lC0gAa-I2o37QVR_oxgMeFAMlyMAS0xDaXurGOuY_JphdOrFGJ7tOgVC6B_4zDHtow_3mskfFtDwa5dfr5EwSqVF9L3F8CRCkL7s76_Ibrs2V5YeGJcQRfUA9e2GRrMnH5FbMsvbIOubYl44")'
                  }}
                ></div>
              </div>
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur shadow-lg rounded-2xl p-4 flex items-center gap-3 animate-[bounce_4s_infinite]">
                <div className="bg-green-100 text-green-700 p-2 rounded-xl">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">กำไรเพิ่มขึ้น</p>
                  <p className="text-lg font-black text-gray-900">+35%</p>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-xl rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">เมนูยอดฮิต</p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">ข้าวกะเพราหมูสับ</h3>
                  </div>
                  <span className="bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold px-2 py-1 rounded-md">ขายดี</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mb-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "45%" }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    ต้นทุน: <span className="text-gray-900 dark:text-white font-bold">฿25.50</span>
                  </span>
                  <span className="text-primary-dark dark:text-primary font-bold">กำไร: ฿24.50</span>
                </div>
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-green-300 rounded-[2.5rem] -z-10 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="border-y border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
            <div className="px-4 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mb-2">
                  <span className="material-symbols-outlined text-3xl">sentiment_satisfied</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">ง่ายกว่า Excel 10 เท่า</h3>
                <p className="text-gray-500 dark:text-gray-400">ไม่ต้องใส่สูตร ไม่ต้องกลัวพัง แค่กรอกตัวเลข</p>
              </div>
            </div>
            <div className="px-4 text-center md:text-left pt-8 md:pt-0">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl mb-2">
                  <span className="material-symbols-outlined text-3xl">visibility</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">ตัวใหญ่ อ่านชัด</h3>
                <p className="text-gray-500 dark:text-gray-400">ออกแบบ Universal Design มองเห็นชัดเจนทุกคน</p>
              </div>
            </div>
            <div className="px-4 text-center md:text-left pt-8 md:pt-0">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="p-3 bg-green-50 text-green-600 rounded-2xl mb-2">
                  <span className="material-symbols-outlined text-3xl">savings</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">รู้กำไรทุกบาท</h3>
                <p className="text-gray-500 dark:text-gray-400">เห็นต้นทุนแฝงที่มองไม่เห็น หยุดเงินรั่วไหล</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-gray-50 dark:bg-background-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2">
              <span className="text-primary-dark dark:text-primary font-bold tracking-widest uppercase text-xs mb-3 block">ขั้นตอนง่ายๆ</span>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
                3 ขั้นตอน <br/> <span className="text-gray-400">เปลี่ยนร้านให้รวย</span>
              </h2>
              <div className="space-y-10 relative">
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-800 -z-10"></div>
                <div className="flex gap-6 group">
                  <div className="flex-none w-10 h-10 rounded-full bg-white border-2 border-primary text-primary font-bold flex items-center justify-center text-lg z-10 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">1</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ใส่ราคาของที่ซื้อมา</h4>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">ซื้อหมูมาโลละ 150 บาท ซื้อไข่มาแผงละ 120 บาท กรอกลงไปตามจริง</p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="flex-none w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold flex items-center justify-center text-lg z-10 shadow-sm group-hover:border-primary group-hover:text-primary transition-colors">2</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">บอกปริมาณที่ใช้</h4>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">จานนี้ใส่หมู 1 ขีด ใส่ไข่ 1 ฟอง ระบบจะคิดเลขให้เอง</p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="flex-none w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold flex items-center justify-center text-lg z-10 shadow-sm group-hover:border-primary group-hover:text-primary transition-colors">3</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">รู้ต้นทุน รู้กำไรทันที</h4>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">จบปัญหาขายดีแต่ไม่มีเงินเหลือ เพราะคุณจะรู้ว่าควรขายกี่บาท</p>
                  </div>
                </div>
              </div>
              <div className="mt-12">
                <Link
                  href="/recipes/new"
                  className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition-opacity font-bold text-lg px-8 py-4 rounded-xl shadow-lg w-full sm:w-auto inline-block text-center"
                >
                  ลองใช้งานจริงฟรี
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl transform translate-x-10 translate-y-10"></div>
                <div className="grid grid-cols-2 gap-4 relative">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transform translate-y-8">
                    <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                      <div
                        className="w-full h-full bg-cover bg-center hover:scale-110 transition-transform duration-700"
                        style={{
                          backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDseiFoLK8yO2hYEX6SZzatyaFUsq39PGSpoyw7rEwdngr42bedERXofKcmJ8XZ-sujvl7qGftzfBDiedVQuD0jBkA7TfdnBK3CVbX6XXsP-Jb5QxRyy1-dg3NniFURh5g2mj8VrL7LBz1ism30fAJNNelboRo92RfBwmDnyAMoVvMYNpkRhofSVlwNcgy6eBDbR7quFbt7Q108L4jJBhQ8Q1rXM7aKAQFQTpF1B7H4kR20ahPRjopSdl9ysFAd4t1Ybu7hV8_ZBm1M")'
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">ไข่ไก่</p>
                        <p className="text-xs text-gray-500">เบอร์ 2</p>
                      </div>
                      <p className="font-mono text-sm font-bold text-primary-dark dark:text-primary">฿4.00</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                      <div
                        className="w-full h-full bg-cover bg-center hover:scale-110 transition-transform duration-700"
                        style={{
                          backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDm2XTIBb5VTMjtpvaCrXKxkUkgPlIhcAl5qGBv0RMZ67UEz0sWCDEA9a5gwtkKXBKsQEnhYwo5lK8TXzckZl3Hj9ycEli6t-5WTswvTl-BFLLca2RS_8VPG8RckWDZu0i24CbshVJTg94QhcGseHq29KmHZRpQajSx5u12Dt-2phd2yE5tEyLow0ROBgj6LTIIew74T01Rctq3t5RpWz_xBLquFLKOAaoa62KBxBSows2OWxng6bhojcHGA18x8YJ09HpabMVtGA7u")'
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">หมูสับ</p>
                        <p className="text-xs text-gray-500">เกรด A</p>
                      </div>
                      <p className="font-mono text-sm font-bold text-primary-dark dark:text-primary">฿15.00</p>
                    </div>
                  </div>
                  <div className="col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 p-6 rounded-2xl shadow-xl mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-70 mb-1">กำไรสุทธิ / จาน</p>
                      <p className="text-4xl font-black tracking-tight">฿25.50</p>
                    </div>
                    <div className="bg-white/20 dark:bg-black/10 p-3 rounded-full backdrop-blur-sm">
                      <span className="material-symbols-outlined text-3xl">trending_up</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">คนใช้จริง...ว่ายังไง?</h2>
            <p className="text-lg text-gray-500">เสียงตอบรับจากเจ้าของร้านอาหารทั่วไทย</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl relative">
              <span className="material-symbols-outlined absolute top-8 right-8 text-4xl text-gray-200 dark:text-gray-800">format_quote</span>
              <div className="flex gap-1 text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined fill-current text-lg">star</span>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg font-medium leading-relaxed mb-8">
                &quot;ป้าใช้คอมไม่ค่อยเป็น แต่เว็บนี้ใช้ง่ายมาก แค่กดๆ ก็รู้ว่าต้องขายเท่าไหร่ถึงจะไม่เจ๊ง ดีใจมากที่เจอเว็บนี้&quot;
              </p>
              <div className="flex items-center gap-4">
                <Image
                  alt="Portrait of an elderly Thai woman smiling"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpWXpvAW7p8d5bkK9KtFyNz8LAZpU9szJ4hGguCkJ7S53NI9V-1BIiTtz12H9fwlByzSL8MNr_l1cjx8QV369BY87sK-y-_fIMjgTBAqoBTqCkzgp2pX1j-BrebbKZQ_Oz1sbl7MiyBBcIY1YP0v1bo4MEgBRlhQFb86dM1pp1_EWst_4QWQsWdE6ZZkHQmk4xCXMc9kr_om3jckaoBr4a4gXuuFHxyx2LNkBxjRL2GFqAhC0-5ucxnFCorLBXPhMl6kyaUvS3Zskl"
                  width={48}
                  height={48}
                />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">ป้านิด</p>
                  <p className="text-sm text-gray-500">ร้านข้าวแกงป้านิด</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl relative">
              <span className="material-symbols-outlined absolute top-8 right-8 text-4xl text-gray-200 dark:text-gray-800">format_quote</span>
              <div className="flex gap-1 text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined fill-current text-lg">star</span>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg font-medium leading-relaxed mb-8">
                &quot;ช่วยได้เยอะเลยครับ ปกติกะเอาเองตลอด พอมาคำนวณจริงถึงรู้ว่ากำไรหายไปไหน แนะนำเลยครับ&quot;
              </p>
              <div className="flex items-center gap-4">
                <Image
                  alt="Portrait of a middle-aged Thai man smiling"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgy5gp2Af8NhN1_khfbwnZBh4Yk66zgKA7dhRNt_vCQrXna_VuRKV4xFKF1VEKZQAPe5j4phxUcP-Q-5zoGfmohtakba72sqythRGGSQGcXtx621XnRN74ZdfmmiUxuZzPOwPpJlWsivx4zsAeTurCO5aFYmluUQn4TFErNB7nRbMqrxzcEFAtaHWQIAhACZUH3KxNEJUESqirUHYXIcn9t1-nQ7U1Y93C0pKLqFqUwuiuIH_tv4ZkEcSGSMkqr0bDpiDe_TzPd3WQ"
                  width={48}
                  height={48}
                />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">คุณสมชาย</p>
                  <p className="text-sm text-gray-500">ร้านตามสั่งปากซอย 5</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl relative hidden md:block">
              <span className="material-symbols-outlined absolute top-8 right-8 text-4xl text-gray-200 dark:text-gray-800">format_quote</span>
              <div className="flex gap-1 text-yellow-400 mb-6">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined fill-current text-lg">star</span>
                ))}
                <span className="material-symbols-outlined fill-current text-lg">star_half</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg font-medium leading-relaxed mb-8">
                &quot;ชอบที่ตัวหนังสือใหญ่ดีค่ะ อ่านง่าย สบายตา ไม่ซับซ้อน เหมาะกับคนรุ่นใหญ่แบบเราที่สายตาไม่ค่อยดี&quot;
              </p>
              <div className="flex items-center gap-4">
                <Image
                  alt="Portrait of a Thai woman wearing glasses smiling"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjuHYs1SBDDcrsb61BTvMCqQmKRA8o72S-bbalvsnBh2sml_ghuxSgtK3bPU3FZS4EvUBk1fl0YebFMTWy0z7ebUPdFX9Sw6waJJEgjrLKVsQJSLyqtp5YkgQHGT-FsqaX2Cp5hefLLqGQAZ9lKTzHQFcJC86REeiHGqo5nU5Mr4cOcUuH2tDFVTUJ7ZN9S8tpPn2Hm8Hv2EpnDBMkzugiP2k-ejLPYWf0QYxCQcHdvaIcqiGpnpTOQG3rAO_tgVMPyu8wLnEry2vB"
                  width={48}
                  height={48}
                />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">พี่อ้อย</p>
                  <p className="text-sm text-gray-500">ร้านเบเกอรี่โฮมเมด</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-primary rounded-[2.5rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">หยุด &quot;ขายดี จนเจ๊ง&quot;</h2>
              <p className="text-xl text-gray-800 font-medium mb-10 max-w-2xl mx-auto">
                เริ่มต้นคำนวณต้นทุนอย่างถูกต้องวันนี้ เพื่อกำไรที่ยั่งยืนของร้านคุณ
                <br className="hidden md:block"/>ใช้งานง่าย ฟรี ไม่มีข้อผูกมัด
              </p>
              <Link
                href="/recipes/new"
                className="bg-gray-900 text-white hover:bg-black hover:scale-105 transition-all duration-300 text-xl font-bold px-12 py-5 rounded-2xl shadow-xl inline-block"
              >
                เริ่มใช้งานทันที
              </Link>
              <p className="mt-6 text-sm font-semibold text-gray-700 opacity-70">
                * ไม่ต้องใช้บัตรเครดิต
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-lg text-primary-dark dark:text-primary">
                  <span className="material-symbols-outlined text-lg">restaurant_menu</span>
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">FoodCost Easy</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                เพื่อนคู่คิดร้านอาหารไทย ให้ก้าวไกลด้วยเทคโนโลยีที่เข้าใจง่าย เพื่อคนไทยทุกคน
              </p>
              <div className="flex gap-4">
                <a className="text-gray-400 hover:text-primary transition-colors" href="#">
                  <span className="material-symbols-outlined">social_leaderboard</span>
                </a>
                <a className="text-gray-400 hover:text-primary transition-colors" href="#">
                  <span className="material-symbols-outlined">smart_display</span>
                </a>
                <a className="text-gray-400 hover:text-primary transition-colors" href="#">
                  <span className="material-symbols-outlined">chat</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">เมนูหลัก</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link href="/" className="hover:text-primary transition-colors">หน้าแรก</Link></li>
                <li><Link href="/recipes/new" className="hover:text-primary transition-colors">เครื่องคิดเลข</Link></li>
                <li><Link href="/recipes" className="hover:text-primary transition-colors">บทความ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">ช่วยเหลือ</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-primary transition-colors">วิธีใช้งาน</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">คำถามที่พบบ่อย</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">ติดต่อเรา</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">การเข้าถึง</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">text_fields</span>
                  ปรับขนาดตัวอักษร
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">contrast</span>
                  โหมดสีเข้ม
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2024 FoodCost Easy. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</Link>
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">ข้อกำหนดการใช้งาน</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
