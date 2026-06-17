import React, { useState } from "react";
import { 
  Phone, 
  MapPin, 
  Clock, 
  Share2, 
  Award, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  User, 
  ExternalLink,
  ChevronRight,
  MessageSquare,
  Search,
  Filter,
  X,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SiteConfig, BlogPost, SuccessfulCase } from "../types";

interface MainWebsiteProps {
  config: SiteConfig;
  onNavigateToAdmin?: () => void;
}

export default function MainWebsite({ config, onNavigateToAdmin }: MainWebsiteProps) {
  const { style, seo, social, members, cases, posts } = config;

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return "";
    const clean = url.trim();
    if (/^https?:\/\//i.test(clean)) {
      return clean;
    }
    return `https://${clean}`;
  };
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [activeTab, setActiveTab] = useState<string>("intro");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [consultForm, setConsultForm] = useState({
    name: "",
    phone: "",
    category: "부동산형사사기",
    message: "",
    agree: false
  });
  const [isConsultSubmitted, setIsConsultSubmitted] = useState(false);

  // Styling derivations
  const fontClass = 
    style.fontFamily === "serif" 
      ? "font-serif" 
      : style.fontFamily === "mono" 
        ? "font-mono" 
        : "font-sans";

  const bgClass = 
    style.themeMode === "pure-black" 
      ? "bg-black text-gray-100" 
      : "bg-slate-950 text-slate-100";

  const accentHex = style.accentColor;

  // Custom inline style for elements that need specific hex color
  const accentBorder = { borderColor: accentHex };
  const accentText = { color: accentHex };
  const accentBg = { backgroundColor: accentHex };

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Filter cases
  const filteredCases = selectedCategory === "전체" 
    ? cases 
    : cases.filter(c => {
        if (selectedCategory === "부동산형사") return c.category === "부동산형사";
        if (selectedCategory === "부동산민사") return c.category === "부동산민사";
        if (selectedCategory === "일반형사") return c.category === "일반형사";
        return c.category === "기타";
      });

  // Filter posts
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultForm.name || !consultForm.phone || !consultForm.message) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }
    if (!consultForm.agree) {
      alert("개인정보 처리방침에 동의해주시기 바랍니다.");
      return;
    }
    setIsConsultSubmitted(true);
    setTimeout(() => {
      setIsConsultSubmitted(false);
      setConsultForm({
        name: "",
        phone: "",
        category: "부동산형사사기",
        message: "",
        agree: false
      });
    }, 4500);
  };

  const shareWebsite = () => {
    if (navigator.share) {
      navigator.share({
        title: seo.metaTitle,
        text: seo.metaDescription,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert("웹사이트 주소가 클립보드에 복사되었습니다.");
    }
  };

  return (
    <div id="website-viewport" className={`${bgClass} ${fontClass} min-h-screen transition-all duration-300 relative select-none selection:bg-emerald-500 selection:text-black`}>
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.08] pointer-events-none" style={accentBg} />
      <div className="absolute top-[40%] right-1/4 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.05] pointer-events-none" style={accentBg} />
      <div className="absolute bottom-[10%] left-10 w-[400px] h-[400px] rounded-full blur-[130px] opacity-[0.06] pointer-events-none" style={accentBg} />

      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full bg-black/75 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <div className="text-xl md:text-2xl font-black tracking-tight" style={accentText}>
            {config.logoText}
          </div>
          <span className="hidden md:inline-block text-xs border border-white/20 text-gray-400 px-2 py-0.5 rounded">
            변호사 직접 상담
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-400">
          <button 
            id="nav-intro"
            onClick={() => scrollToSection("intro")} 
            className={`cursor-pointer hover:text-white transition ${activeTab === "intro" ? "text-white font-bold" : ""}`}
            style={activeTab === "intro" ? { color: accentHex } : {}}
          >
            사무소 소개
          </button>
          <button 
            id="nav-members"
            onClick={() => scrollToSection("members")} 
            className={`cursor-pointer hover:text-white transition ${activeTab === "members" ? "text-white font-bold" : ""}`}
            style={activeTab === "members" ? { color: accentHex } : {}}
          >
            대표 변호사
          </button>
          {social.naverBlog && (
            <a 
              id="nav-blog"
              href={ensureAbsoluteUrl(social.naverBlog)}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer hover:text-white transition flex items-center gap-1 text-gray-400 hover:text-emerald-400"
            >
              공식 블로그 <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            </a>
          )}
          <button 
            id="nav-contact"
            onClick={() => scrollToSection("contact")} 
            className={`cursor-pointer hover:text-white transition ${activeTab === "contact" ? "text-white font-bold" : ""}`}
            style={activeTab === "contact" ? { color: accentHex } : {}}
          >
            오시는 길
          </button>
        </nav>

        {/* QUICK PHONE DIAL AT HEADER */}
        <div className="flex items-center gap-3">
          <a
            id="header-phone-link"
            href={`tel:${config.consultationPhone}`}
            className="flex items-center gap-2 px-4 py-2 border rounded-full text-xs md:text-sm font-semibold transition text-white border-white/10 hover:bg-white/5"
          >
            <Phone className="w-3.5 h-3.5" style={accentText} />
            <span className="hidden sm:inline">{config.consultationPhone}</span>
            <span className="sm:hidden">전화상담</span>
          </a>
          <button 
            id="btn-header-share"
            onClick={shareWebsite}
            className="p-2 border rounded-full border-white/10 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer text-sm"
            title="공유하기"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MOBILE SCROLL NAV (Visible on small screens) */}
      <div className="lg:hidden flex items-center justify-around bg-zinc-950/90 border-b border-white/5 py-3 px-4 text-xs sticky top-[73px] z-30 backdrop-blur-md">
        <button id="mob-nav-intro" onClick={() => scrollToSection("intro")} className={`text-stone-300 font-medium ${activeTab === "intro" ? "text-emerald-500 underline underline-offset-4" : ""}`} style={activeTab === "intro" ? { color: accentHex } : {}}>소개</button>
        <button id="mob-nav-members" onClick={() => scrollToSection("members")} className={`text-stone-300 font-medium ${activeTab === "members" ? "text-emerald-500 underline underline-offset-4" : ""}`} style={activeTab === "members" ? { color: accentHex } : {}}>변호사</button>
        {social.naverBlog && (
          <a 
            id="mob-nav-blog" 
            href={ensureAbsoluteUrl(social.naverBlog)} 
            target="_blank" 
            rel="noreferrer" 
            className="text-stone-300 font-medium flex items-center gap-0.5 hover:text-emerald-400"
          >
            공식 블로그 <ExternalLink className="w-3 h-3 text-stone-500" />
          </a>
        )}
        <button id="mob-nav-contact" onClick={() => scrollToSection("contact")} className={`text-stone-300 font-medium ${activeTab === "contact" ? "text-emerald-500 underline underline-offset-4" : ""}`} style={activeTab === "contact" ? { color: accentHex } : {}}>오시는길</button>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-16 md:pt-28 pb-16 md:pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-xs font-semibold tracking-wider text-stone-300 border border-white/10"
        >
          <span className="h-2 w-2 rounded-full animate-ping" style={accentBg}/>
          {config.tagline}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight md:leading-tight mb-6"
        >
          {config.heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mb-10 leading-relaxed font-light"
        >
          {config.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <a
            id="hero-primary-cta"
            href={`tel:${config.consultationPhone}`}
            className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-black flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.02] hover:brightness-110 cursor-pointer text-base"
            style={accentBg}
          >
            <Phone className="w-5 h-5 text-black" />
            긴급 전화 상담 연결
          </a>
          
          <button
            id="hero-secondary-cta"
            onClick={() => scrollToSection("contact")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-zinc-900 border border-white/11 hover:border-white/30 text-white flex items-center justify-center gap-3 transition cursor-pointer"
          >
            <MapPin className="w-4 h-4" style={accentText} />
            사무소 위치 안내
          </button>
        </motion.div>
      </section>

      {/* CORE IDENTITY (INTRO) */}
      <section id="intro" className="relative py-20 bg-neutral-950/50 border-t border-b border-white/5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-emerald-500 to-green-300" style={accentBg} />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight leading-snug">
              {config.aboutTitle}
            </h2>
            <p className="text-stone-400 text-sm md:text-base leading-relaxed mt-6 font-light white-space-pre-line">
              {config.aboutText}
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={accentText} />
                <div>
                  <h4 className="text-sm font-semibold text-white">철저히 밀착된 변형 전략팀 가동</h4>
                  <p className="text-xs text-stone-400 mt-1">부동산전문, 건설전문, 형사전문, 손해배상전문 변호사가 고난도 사건을 직접 협업하여 대응책을 설계</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={accentText} />
                <div>
                  <h4 className="text-sm font-semibold text-white">사건 무마에 그치지 않는 자산 보전 및 환수</h4>
                  <p className="text-xs text-stone-400 mt-1">형사 고소장 작성과 민사 채무 불이행, 가압류 등의 자산 확보를 동시 타격</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={accentText} />
                <div>
                  <h4 className="text-sm font-semibold text-white">부동산 분쟁관련 민형사 특화 대응가능</h4>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">임대차, 보증금, 소유권, 명도 등 일반 부동산 분쟁 뿐만 아니라 토지 경계, 하자보수, 재개발 재건축 관련 전문 분쟁까지 형사소송과 유기적으로 특화 대응 가능</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
              <div className="p-3 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ color: accentHex }}>
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">검증된 형사 전문 자격</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                일송은 대한변호사협회에 형사전문 변호사로 등록된 오지성변호사가 경찰 수사 첫 단계부터 강력한 진술 방향을 확보합니다.
              </p>
            </div>

            <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
              <div className="p-3 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ color: accentHex }}>
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">정확한 증거분석 및 대응</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                기획부동산이나 시행사 분쟁 시, 방대하고 교묘한 종이 문서를 빠르게 해독하여 은닉된 고의성을 포착하고 이를 검경 수사에 증거로 관철시킵니다.
              </p>
            </div>

            <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
              <div className="p-3 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ color: accentHex }}>
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">부동산 법률 연구를 통한 변론</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                변화하는 사회에 따라 변화하는 법해석에 발빠르게 대응하고 있습니다.
              </p>
            </div>

            <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition" style={{ borderLeft: `3px solid ${accentHex}` }}>
              <div className="p-3 bg-emerald-950/50 w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ color: accentHex }}>
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1:1 비밀 무제한 면담</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                브로커나 사무장 주도의 겉핥기식 대리가 아닌 대표변호사가 직접 사실관계를 일일이 분석하며 면담하는 신뢰를 보장합니다.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ATTORNEYS / MEMBERS SECTION */}
      <section id="members" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/5 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider" style={accentText}>Our Attorneys</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">일송 대표변호사 소개</h2>
          </div>
          <p className="text-stone-400 text-xs md:text-sm max-w-lg mt-4 md:mt-0 font-light leading-relaxed">
            부동산, 건설, 형사 분야의 전문 지식과 법정 변론 경험을 종합하여 개별 사안마다 구체적으로 매칭하여 실전 중심 전문 변호인단이 당신의 재산과 삶의 방패가 되어 드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {members.map((member) => (
            <div 
              key={member.id} 
              className="bg-zinc-950/80 rounded-2xl border border-white/5 p-6 hover:border-white/10 transition group"
            >
              <div className="text-left">
                <span className="text-xs font-semibold" style={accentText}>{member.role}</span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-3">{member.name} 변호사</h3>
                <p className="text-xs md:text-sm text-stone-400 font-light leading-relaxed mb-4">
                  {member.bio}
                </p>
                
                <div className="flex flex-wrap gap-1.5 justify-start">
                  {member.specialties.map((spec, index) => (
                    <span 
                      key={index} 
                      className="text-[11px] px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-full text-stone-300 font-medium"
                    >
                      ▪ {spec}
                    </span>
                  ))}
                </div>

                {/* Naver Profile Verification Banners */}
                {member.name.includes("오지성") && (
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <a 
                      href="https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&ssc=tab.nx.all&query=%EC%98%A4%EC%A7%80%EC%84%B1+%EB%B3%80%ED%98%B8%EC%82%AC&oquery=%EB%B0%95%EB%AF%B8%EC%86%8C+%EB%B3%80%ED%98%B8%EC%82%AC&tqi=jBvGGlqVW9hssAShRjC-193384&ackey=94zal1lr" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-between px-4 py-3 bg-emerald-950/20 hover:bg-emerald-950/45 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl group/btn transition-all duration-300"
                    >
                      <span className="text-xs font-semibold text-emerald-400 group-hover/btn:text-emerald-300 transition-colors flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        오지성 변호사 프로필 확인
                      </span>
                      <span className="text-[10px] text-stone-500 group-hover/btn:text-emerald-400 transition-colors flex items-center gap-1">
                        네이버 검색 <ExternalLink className="w-3 h-3 text-emerald-500" />
                      </span>
                    </a>
                  </div>
                )}

                {member.name.includes("박미소") && (
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <a 
                      href="https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EB%B0%95%EB%AF%B8%EC%86%8C+%EB%B3%80%ED%98%B8%EC%82%AC&ackey=smmv8ycq" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-between px-4 py-3 bg-emerald-950/20 hover:bg-emerald-950/45 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl group/btn transition-all duration-300"
                    >
                      <span className="text-xs font-semibold text-emerald-400 group-hover/btn:text-emerald-300 transition-colors flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        박미소 변호사 프로필 확인
                      </span>
                      <span className="text-[10px] text-stone-500 group-hover/btn:text-emerald-400 transition-colors flex items-center gap-1">
                        네이버 검색 <ExternalLink className="w-3 h-3 text-emerald-500" />
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT & LOCATION (사무소 오시는 길) */}
      <section id="contact" className="py-20 bg-neutral-950/70 border-t border-white/5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT: INFO & CALL FOR SERVICE */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={accentText}>Ready to Consultation</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">사무소 오시는 길 및 영업 정보</h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-4 leading-relaxed font-light">
                법정 기일에 쫓기거나 빠른 면담이 필요하신 경우 직통번호로 전화주시면 변호사 직접 조력 일정을 신속히 조율해 드립니다.
              </p>

              <div className="mt-8 space-y-6 text-xs md:text-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10" style={accentText}>
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block text-sm">사무소 주소</span>
                    <span className="text-stone-300 font-light block mt-1 leading-relaxed">{config.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10" style={accentText}>
                    <Phone className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block text-sm">유선 상담 및 예약전화</span>
                    <a href={`tel:${config.consultationPhone}`} className="text-emerald-400 font-bold block mt-1 hover:underline text-base sm:text-lg" style={{ color: accentHex }}>
                      {config.consultationPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10" style={accentText}>
                    <Clock className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block text-sm">상담 가능 시간</span>
                    <span className="text-stone-300 font-light block mt-1">{config.businessHours}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-white mb-2">방문 및 상담 전 유의사항</h4>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                공동법률사무소 일송은 의뢰인의 사건 하나하나를 변호사들이 완벽히 직무 분석하여 최고의 대처방안을 준비합니다. 미리 긴급 유선 상담번호로 사건 내용 및 일정을 예약해 주시면 훨씬 명확한 1차 진단 및 깊이 있는 실전 변론 자문이 제공됩니다.
              </p>
            </div>
          </div>

          {/* RIGHT: MAP SIMULATION BLOCK */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-zinc-900/30 border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden min-h-[400px]">
            <div 
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)",
                backgroundSize: "24px 24px"
              }}
            />
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase">Interactive Map Projection</span>
                <h3 className="text-lg font-bold text-white mt-1">상세 위치 지도 및 편리한 대중교통 이용 안내</h3>
                <p className="text-xs text-stone-400 mt-2 font-light leading-relaxed">
                  대중교통 이용 시 대전 지하철 1호선 <span className="text-emerald-400 font-semibold">시청역 8번 출구</span>에서 도보 약 3분 거리에 위치하고 있어 쉽게 방문하실 수 있습니다.
                </p>
              </div>

              {/* Styled Visual Map Graphic */}
              <div className="flex-grow w-full rounded-2xl bg-black/60 border border-white/10 p-6 flex flex-col items-center justify-center relative min-h-[180px] group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none rounded-2xl" />
                
                {/* Visual coordinate lines */}
                <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-white/5 border-dashed pointer-events-none" />
                <div className="absolute left-4 right-4 top-1/2 h-[1px] bg-white/5 border-dashed pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 duration-300">
                      <MapPin className="w-6 h-6 text-emerald-400" style={accentText} />
                    </span>
                    <span className="absolute inset-0 rounded-full h-12 w-12 animate-ping bg-emerald-400/20 pointer-events-none"></span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">공동법률사무소 일송</h4>
                  <p className="text-[11px] text-stone-400 font-light max-w-xs px-4">
                    대전광역시 서구 둔산중로78번길 26, 206호 (둔산동, 민석타워 206호)
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                <a 
                  href={`https://map.naver.com/v5/search/${encodeURIComponent("공동법률사무소 일송")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 bg-white text-black hover:bg-neutral-200 font-bold text-xs sm:text-sm text-center rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  네이버 지도앱 길찾기 연결 <ExternalLink className="w-4 h-4 text-black" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-12 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          <div>
            <div className="text-lg md:text-xl font-black text-white" style={accentText}>
              {config.logoText}
            </div>
            
            <p className="text-[10px] text-stone-500 max-w-2xl mt-4 leading-normal font-light">
              주소: {config.address} | 대표번호: {config.consultationPhone}
            </p>
            <p className="text-[10px] text-stone-500 max-w-2xl mt-1 leading-normal font-light">
              광고책임변호사 : 오지성 변호사, 박미소 변호사
            </p>
            <p className="text-[10px] text-stone-600 mt-2 font-mono">
              © 2026 {config.siteName}. All Rights Reserved. Designed for Ultimate Premium Trust.
            </p>
          </div>

          {/* SOCIAL ACTIONS */}
          <div className="flex flex-wrap items-center gap-3">
            {social.naverBlog && (
              <a 
                href={ensureAbsoluteUrl(social.naverBlog)} 
                target="_blank" 
                rel="noreferrer" 
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-[10px] rounded border border-white/5 text-gray-300"
              >
                네이버 블로그
              </a>
            )}
            {social.tistory && (
              <a 
                href={ensureAbsoluteUrl(social.tistory)} 
                target="_blank" 
                rel="noreferrer" 
                className="px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-900/30 text-[10px] rounded text-amber-400 font-semibold transition"
              >
                티스토리 블로그
              </a>
            )}
            {social.kakaoTalk && (
              <a 
                href={ensureAbsoluteUrl(social.kakaoTalk)} 
                target="_blank" 
                rel="noreferrer" 
                className="px-3 py-1.5 bg-[#FEE500] hover:brightness-95 text-[10px] rounded text-black font-semibold"
              >
                카카오 상담
              </a>
            )}
            {social.youtube && (
              <a 
                href={ensureAbsoluteUrl(social.youtube)} 
                target="_blank" 
                rel="noreferrer" 
                className="px-3 py-1.5 bg-rose-950/50 hover:bg-rose-900/50 text-[10px] text-rose-300 rounded border border-rose-900/20"
              >
                유튜브 채널
              </a>
            )}
          </div>

        </div>
      </footer>
    </div>
  );
}
