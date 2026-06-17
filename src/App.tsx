import React, { useState, useEffect } from "react";
import { 
  Eye, 
  Settings, 
  Layout, 
  RotateCcw, 
  Monitor, 
  Smartphone, 
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Shield,
  HelpCircle
} from "lucide-react";
import { SiteConfig } from "./types";
import { initialSiteConfig } from "./initialData";
import AdminPanel from "./components/AdminPanel";
import MainWebsite from "./components/MainWebsite";

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(initialSiteConfig);
  const [viewMode, setViewMode] = useState<"split" | "website" | "admin">("website");
  const [deviceSim, setDeviceSim] = useState<"desktop" | "mobile">("desktop");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Load from local storage on mount
  useEffect(() => {
    // Check if user is in admin editing mode via URL query or hash
    const hasAdminQuery = window.location.search.includes("admin") || window.location.hash.includes("admin");
    if (hasAdminQuery) {
      setIsAdminMode(true);
      setViewMode("split");
    } else {
      setIsAdminMode(false);
      setViewMode("website");
    }

    try {
      const savedConfigV8 = localStorage.getItem("ilsong_law_site_config_v8");
      const savedConfigV7 = localStorage.getItem("ilsong_law_site_config_v7");
      const savedConfigV6 = localStorage.getItem("ilsong_law_site_config_v6");
      const savedConfigV5 = localStorage.getItem("ilsong_law_site_config_v5");
      const savedConfigV4 = localStorage.getItem("ilsong_law_site_config_v4");
      const savedConfigV2 = localStorage.getItem("ilsong_law_site_config_v2");
      
      let finalConfig: SiteConfig | null = null;
      if (savedConfigV8) {
        finalConfig = JSON.parse(savedConfigV8);
      } else if (savedConfigV7) {
        finalConfig = JSON.parse(savedConfigV7);
      } else if (savedConfigV6) {
        finalConfig = JSON.parse(savedConfigV6);
      } else if (savedConfigV5) {
        finalConfig = JSON.parse(savedConfigV5);
      } else if (savedConfigV4) {
        finalConfig = JSON.parse(savedConfigV4);
      } else if (savedConfigV2) {
        const parsedV2 = JSON.parse(savedConfigV2);
        finalConfig = {
          ...initialSiteConfig,
          ...parsedV2,
          social: {
            ...initialSiteConfig.social,
            ...(parsedV2.social || {})
          }
        };
      } else {
        finalConfig = { ...initialSiteConfig };
      }

      if (finalConfig) {
        // Enforce latest requested defaults:
        finalConfig.tagline = "부동산·건설분쟁, 형사 범죄, 경험으로 검증된 승소 노하우";
        finalConfig.heroTitle = "부동산/건설전문 박미소 변호사, 형사/손해배상전문 오지성변호사가 함께하는 공동법률사무소 일송";
        finalConfig.heroSubtitle = "부동산 분쟁, 임대차 분쟁, 명도소송, 기획부동산 사기, 지역주택조합 분쟁, 시행 계약 사기, 전세 사기 등 복잡한 부동산 형사 사건을 박미소, 오지성 대표변호사가 동행합니다.";
        finalConfig.aboutText = "부동산 법률 분쟁은 일반 민사 소송뿐만 아니라 형사 고소가 맞물려 진행되는 복잡한 소송입니다. 공동법률사무소 일송은 부동산 법리와 형사 소송 절차 모두를 꿰뚫는 부동산 형사 전문 변호사들로 구성되어 있습니다. 의뢰인의 재산과 자유를 구제하기 위해 맞춤형 전략을 수립합니다.";
        finalConfig.consultationPhone = "042-471-7770";
        finalConfig.address = "대전 서구 둔산중로 78번길 26, 206호(둔산동, 민석타워)";
        finalConfig.businessHours = "평일 09:00 - 18:30";

        if (!finalConfig.social) {
          finalConfig.social = { ...initialSiteConfig.social };
        }
        finalConfig.social.phone = "042-471-7770";

        // 2. Change '일송 공동법률사무소' to '공동법률사무소 일송'
        if (finalConfig.siteName) {
          finalConfig.siteName = finalConfig.siteName.replace(/일송 공동법률사무소/g, "공동법률사무소 일송");
        }
        if (finalConfig.logoText) {
          finalConfig.logoText = finalConfig.logoText.replace(/일송 공동법률사무소/g, "공동법률사무소 일송");
        }
        if (finalConfig.seo && finalConfig.seo.metaTitle) {
          finalConfig.seo.metaTitle = finalConfig.seo.metaTitle.replace(/일송 공동법률사무소/g, "공동법률사무소 일송");
        }

        // 3. Blog urls
        finalConfig.social.naverBlog = "https://blog.naver.com/1song-law";
        finalConfig.social.tistory = "https://mslaw09.tistory.com/";

        // 4. Member updates
        if (finalConfig.members && Array.isArray(finalConfig.members)) {
          finalConfig.members = finalConfig.members.map(member => {
            if (member.name === "오지성") {
              const cleaned = member.specialties.filter(spec => spec !== "영장실질심사/구속 기각 전문");
              if (!cleaned.includes("형사범죄 피해 손해배상청구소송")) {
                cleaned.push("형사범죄 피해 손해배상청구소송");
              }
              return {
                ...member,
                specialties: cleaned
              };
            }
            if (member.name === "박미소") {
              return {
                ...member,
                role: "대표 변호사 (대한변호사협회 등록 부동산 건설 전문)",
                bio: "부동산, 건설 분쟁에서 의뢰인의 온전한 권리를 위한 맞춤 대응책으로 소송을 진행합니다."
              };
            }
            return member;
          });
        }

        setConfig(finalConfig);
        localStorage.setItem("ilsong_law_site_config_v8", JSON.stringify(finalConfig));
      }
    } catch (e) {
      console.error("Failed to load local storage site config:", e);
    }
  }, []);

  // Update config & save to localStorage
  const handleUpdateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem("ilsong_law_site_config_v8", JSON.stringify(newConfig));
      
      // Update browser tab title and dynamic description for simulation
      document.title = newConfig.seo.metaTitle || newConfig.siteName;
    } catch (e) {
      console.error("Failed to persist site config in localStorage:", e);
    }
  };

  // Reset to default presets
  const handleReset = () => {
    if (confirm("정말로 모든 추가 사항과 게시글들을 삭제하고 최초 기본 법률사무소 일송 프리미엄 정보로 복구하시겠습니까?")) {
      handleUpdateConfig(initialSiteConfig);
    }
  };

  // Synchronize initial title
  useEffect(() => {
    if (config) {
      document.title = config.seo.metaTitle || "부동산 형사전문 공동법률사무소 일송";
    }
  }, [config]);

  // If NOT in admin mode, show the premium MainWebsite clean and full screen directly without any framing or control bar.
  if (!isAdminMode) {
    return (
      <div className="w-screen h-screen bg-slate-950 overflow-y-auto">
        <MainWebsite 
          config={config}
          onNavigateToAdmin={() => {
            // Activating admin mode on demand
            setIsAdminMode(true);
            setViewMode("split");
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden font-sans select-none">
      
      {/* GLOBAL BUILDER HEADER CONTROL PANEL (Simulated builder workspace) */}
      <div className="bg-slate-900 border-b border-slate-800 text-white h-14 px-4 flex items-center justify-between flex-shrink-0 z-50 shadow-md">
        
        {/* Logo and branding */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center font-black text-black text-sm shadow-md shadow-emerald-950/40">
            일松
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold tracking-tight">공동법률사무소 일송</h1>
              <span className="text-[9px] bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 px-1.5 py-0.5 rounded font-black">
                CMS BUILDER ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">프리미엄 부동산/형사전문 변호사 통합 관리 홈페이지</p>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode("split")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === "split" 
                ? "bg-slate-800 text-emerald-400 shadow" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span className="hidden md:inline">분할 화면 (실시간 편집)</span>
            <span className="md:hidden">실시간편집</span>
          </button>
          
          <button
            onClick={() => {
              setViewMode("website");
              setDeviceSim("desktop");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === "website" 
                ? "bg-slate-800 text-emerald-400 shadow" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">웹사이트 단독 전체보기</span>
            <span className="md:hidden">전체보기</span>
          </button>

          <button
            onClick={() => setViewMode("admin")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === "admin" 
                ? "bg-slate-800 text-emerald-400 shadow" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden md:inline">관리 대시보드 단독보기</span>
            <span className="md:hidden">대시보드</span>
          </button>
        </div>

        {/* Device responsive simulators (Only active in Split or Website views) */}
        <div className="flex items-center gap-3">
          {viewMode !== "admin" && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setDeviceSim("desktop")}
                className={`p-1.5 rounded transition cursor-pointer ${
                  deviceSim === "desktop" ? "bg-slate-800 text-emerald-400" : "text-zinc-500 hover:text-white"
                }`}
                title="PC 레이아웃 화면"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceSim("mobile")}
                className={`p-1.5 rounded transition cursor-pointer ${
                  deviceSim === "mobile" ? "bg-slate-800 text-emerald-400" : "text-zinc-500 hover:text-white"
                }`}
                title="스마트폰 반응형 레이아웃 화면"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick share or tips */}
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          
          <button
            onClick={handleReset}
            className="p-2 border border-slate-800 hover:border-rose-900/40 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 transition cursor-pointer"
            title="모든 편집 내용 포맷화 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* CORE FRAMEWORK WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* COLLAPSIBLE SIDEBAR CONTAINER ENCLOSING ADMIN CMS PANEL */}
        <div 
          className={`h-full transition-all duration-300 border-r border-slate-800 flex-shrink-0 z-30 ${
            viewMode === "website" 
              ? "w-0 opacity-0 overflow-hidden" 
              : viewMode === "admin" 
                ? "w-full" 
                : isSidebarCollapsed 
                  ? "w-0 opacity-0 overflow-hidden" 
                  : "w-full md:w-[480px] lg:w-[440px]"
          }`}
        >
          <AdminPanel 
            config={config} 
            onUpdateConfig={handleUpdateConfig}
            onReset={handleReset}
          />
        </div>

        {/* SIDEBAR MINI TOGGLER PIN (Visible in split screen only) */}
        {viewMode === "split" && (
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 z-40 bg-slate-900 border border-slate-800 hover:border-slate-700 text-emerald-400 p-1.5 rounded-r-xl shadow-lg hover:text-white transition cursor-pointer hidden md:flex items-center justify-center w-6 h-14"
            style={{ left: isSidebarCollapsed ? '0px' : undefined }}
            title={isSidebarCollapsed ? "대시보드 열기" : "대시보드 닫기"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}

        {/* PREVIEW CONTAINER (Always renders the MainWebsite unless viewmode is strictly Admin-only) */}
        <div 
          className={`flex-1 h-full bg-slate-950 flex items-center justify-center transition-all duration-300 relative ${
            viewMode === "admin" ? "hidden" : "block"
          }`}
        >
          {deviceSim === "mobile" ? (
            /* PHONE MOCKUP SHELL SIMULATOR */
            <div className="w-[375px] h-[780px] bg-black border-[10px] border-slate-800 rounded-[35px] shadow-2xl relative overflow-hidden flex flex-col justify-between my-4 transition-all duration-300 ring-4 ring-emerald-950/20">
              {/* Speaker / Notch simulator */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-50 flex items-center justify-center">
                <span className="w-12 h-1 bg-black rounded-full" />
              </div>
              
              <div className="flex-1 overflow-y-auto pt-6 scrollbar-none">
                <MainWebsite 
                  config={config}
                  onNavigateToAdmin={viewMode === "website" ? () => setViewMode("split") : undefined}
                />
              </div>

              {/* Bottom indicator home bar */}
              <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />
            </div>
          ) : (
            /* FULL UNBOUNDED RESPONSIVE SCREEN VIEW */
            <div className="w-full h-full overflow-y-auto">
              <MainWebsite 
                config={config}
                onNavigateToAdmin={viewMode === "website" ? () => setViewMode("split") : undefined}
              />
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
