import React, { useState } from "react";
import { 
  Settings, 
  Palette, 
  Users, 
  Briefcase, 
  BookOpen, 
  Globe, 
  Plus, 
  Trash2, 
  Edit, 
  Undo2, 
  Check, 
  Save, 
  Info,
  Maximize2,
  Minimize2,
  Sparkles,
  Link2
} from "lucide-react";
import { SiteConfig, TeamMember, SuccessfulCase, BlogPost } from "../types";

interface AdminPanelProps {
  config: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => void;
  onReset: () => void;
}

const ACCENT_COLOR_PRESETS = [
  { name: "에메랄드 그린", hex: "#10b981", text: "#4ade80" },
  { name: "네온 그린", hex: "#00ff66", text: "#a3e635" },
  { name: "신비한 숲속 그린", hex: "#059669", text: "#34d399" },
  { name: "비취색 (Jade)", hex: "#0d9488", text: "#2dd4bf" },
  { name: "전통 한방 마취 그린", hex: "#15803d", text: "#86efac" },
  { name: "올리브 그린", hex: "#65a30d", text: "#a3e635" }
];

const UNSPLASH_IMAGES_PRESETS = [
  { label: "법원 전경", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600&h=400" },
  { label: "법률 서적 & 정칭", url: "https://images.unsplash.com/photo-1505664194779-8bebcb95c539?auto=format&fit=crop&q=80&w=600&h=400" },
  { label: "계약 거래 도장", url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600&h=400" },
  { label: "부동산 미니어처 빌딩", url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=600&h=400" },
  { label: "계약 전문 서명", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600&h=400" },
  { label: "비즈니스 회의", url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600&h=400" }
];

export default function AdminPanel({ config, onUpdateConfig, onReset }: AdminPanelProps) {
  const [activeMenu, setActiveMenu] = useState<"general" | "style" | "members" | "cases" | "posts" | "seo">("general");
  
  // Local edit states
  const [selectedPresetImage, setSelectedPresetImage] = useState<string>("");

  // Handler helpers
  const handleGeneralChange = (key: keyof SiteConfig, val: any) => {
    onUpdateConfig({
      ...config,
      [key]: val
    });
  };

  const handleStyleChange = (key: string, val: any) => {
    onUpdateConfig({
      ...config,
      style: {
        ...config.style,
        [key]: val
      }
    });
  };

  const handleSEOChange = (key: string, val: any) => {
    onUpdateConfig({
      ...config,
      seo: {
        ...config.seo,
        [key]: val
      }
    });
  };

  const handleSocialChange = (key: string, val: any) => {
    onUpdateConfig({
      ...config,
      social: {
        ...config.social,
        [key]: val
      }
    });
  };

  // --- CASES MANAGEMENT ---
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  const [newCase, setNewCase] = useState<Partial<SuccessfulCase>>({
    title: "",
    category: "부동산형사",
    result: "",
    description: "",
    date: ""
  });

  const handleAddOrEditCase = () => {
    if (!newCase.title || !newCase.result) {
      alert("판결명과 결과를 채워주세요.");
      return;
    }

    if (editingCaseId) {
      // Edit existing
      const updated = config.cases.map(c => 
        c.id === editingCaseId ? { ...c, ...newCase as SuccessfulCase } : c
      );
      onUpdateConfig({ ...config, cases: updated });
      setEditingCaseId(null);
    } else {
      // Add new
      const created: SuccessfulCase = {
        id: "case_" + Date.now(),
        title: newCase.title || "새로운 사건 종결",
        category: (newCase.category as any) || "부동산형사",
        result: newCase.result || "종결 처리",
        description: newCase.description || "상세 설명",
        date: newCase.date || new Date().toISOString().substring(0, 7)
      };
      onUpdateConfig({ ...config, cases: [created, ...config.cases] });
    }

    // Reset status
    setNewCase({ title: "", category: "부동산형사", result: "", description: "", date: "" });
  };

  const handleDeleteCase = (id: string) => {
    if (confirm("정말로 이 성공 사례를 삭제하시겠습니까?")) {
      onUpdateConfig({
        ...config,
        cases: config.cases.filter(c => c.id !== id)
      });
    }
  };

  const handleStartEditCase = (c: SuccessfulCase) => {
    setEditingCaseId(c.id);
    setNewCase(c);
    // Auto-scroll to form top
    const formElement = document.getElementById("case-form-anchor");
    if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
  };

  // --- BLOG POSTS MANAGEMENT ---
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: "",
    summary: "",
    content: "",
    author: "송명근 대표변호사",
    category: "부동산 법조대응",
    imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=600&h=400",
    date: new Date().toISOString().substring(0, 10)
  });

  const handleAddOrEditPost = () => {
    if (!newPost.title || !newPost.content) {
      alert("글 제목과 본문 내용을 채워주세요.");
      return;
    }

    if (editingPostId) {
      const updated = config.posts.map(p => 
        p.id === editingPostId ? { ...p, ...newPost as BlogPost } : p
      );
      onUpdateConfig({ ...config, posts: updated });
      setEditingPostId(null);
    } else {
      const created: BlogPost = {
        id: "post_" + Date.now(),
        title: newPost.title || "새 칼럼 제목",
        summary: newPost.summary || "새 칼럼 요약본",
        content: newPost.content || "새 본문",
        author: newPost.author || "일송 공동법률사무소",
        category: newPost.category || "부동산 특별대책",
        imageUrl: newPost.imageUrl || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=600&h=400",
        date: newPost.date || new Date().toISOString().substring(0, 10)
      };
      onUpdateConfig({ ...config, posts: [created, ...config.posts] });
    }

    setNewPost({
      title: "",
      summary: "",
      content: "",
      author: "송명근 대표변호사",
      category: "부동산 법조대응",
      imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=600&h=400",
      date: new Date().toISOString().substring(0, 10)
    });
  };

  const handleDeletePost = (id: string) => {
    if (confirm("정말로 이 법률 칼럼을 영구 삭제하시겠습니까?")) {
      onUpdateConfig({
        ...config,
        posts: config.posts.filter(p => p.id !== id)
      });
    }
  };

  // --- ATTORNEY EDIT STATE ---
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
    bio: "",
    imageUrl: "",
    specialties: []
  });

  const handleUpdateMember = (id: string) => {
    const updated = config.members.map(m => {
      if (m.id === id) {
        return { ...m, ...newMember };
      }
      return m;
    });
    onUpdateConfig({ ...config, members: updated });
    setEditingMemberId(null);
    setNewMember({});
  };

  return (
    <div className="w-full bg-slate-900 border-r border-slate-800 text-slate-100 h-full flex flex-col justify-between overflow-hidden">
      
      {/* CMS BAR TOP BRANDING */}
      <div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center flex-shrink-0">
        <div>
          <h2 className="text-sm font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
            <Sparkles className="w-4 h-4" /> ILSONG LAW CMS
          </h2>
          <p className="text-[10px] text-slate-400 font-light mt-0.5">
            부동산 형사전문 일송 변호사 홈페이지 편집 대시보드
          </p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/40 rounded text-[10px] text-rose-300 transition cursor-pointer"
          title="초기 샘플 데이터로 복구"
        >
          <Undo2 className="w-3.5 h-3.5" /> 포맷화 초기화
        </button>
      </div>

      {/* QUICK SECTION CHANGER BAR */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 overflow-x-auto scrollbar-none flex-shrink-0">
        <button
          onClick={() => setActiveMenu("general")}
          className={`flex-1 py-3 px-3 text-xs font-bold transition flex flex-col items-center gap-1.5 border-b-2 hover:bg-slate-800 ${
            activeMenu === "general" ? "border-emerald-500 text-emerald-400 bg-slate-800/40" : "border-transparent text-slate-400"
          }`}
        >
          <Settings className="w-4 h-4" /> <span>기본문구</span>
        </button>
        
        <button
          onClick={() => setActiveMenu("style")}
          className={`flex-1 py-3 px-3 text-xs font-bold transition flex flex-col items-center gap-1.5 border-b-2 hover:bg-slate-800 ${
            activeMenu === "style" ? "border-emerald-500 text-emerald-400 bg-slate-800/40" : "border-transparent text-slate-400"
          }`}
        >
          <Palette className="w-4 h-4" /> <span>테마/색상</span>
        </button>

        <button
          onClick={() => setActiveMenu("members")}
          className={`flex-1 py-3 px-3 text-xs font-bold transition flex flex-col items-center gap-1.5 border-b-2 hover:bg-slate-800 ${
            activeMenu === "members" ? "border-emerald-500 text-emerald-400 bg-slate-800/40" : "border-transparent text-slate-400"
          }`}
        >
          <Users className="w-4 h-4" /> <span>변호인단</span>
        </button>

        <button
          onClick={() => setActiveMenu("cases")}
          className={`flex-1 py-3 px-3 text-xs font-bold transition flex flex-col items-center gap-1.5 border-b-2 hover:bg-slate-800 ${
            activeMenu === "cases" ? "border-emerald-500 text-emerald-400 bg-slate-800/40" : "border-transparent text-slate-400"
          }`}
        >
          <Briefcase className="w-4 h-4" /> <span>승소사례</span>
        </button>

        <button
          onClick={() => setActiveMenu("posts")}
          className={`flex-1 py-3 px-3 text-xs font-bold transition flex flex-col items-center gap-1.5 border-b-2 hover:bg-slate-800 ${
            activeMenu === "posts" ? "border-emerald-500 text-emerald-400 bg-slate-800/40" : "border-transparent text-slate-400"
          }`}
        >
          <BookOpen className="w-4 h-4" /> <span>법률칼럼</span>
        </button>

        <button
          onClick={() => setActiveMenu("seo")}
          className={`flex-1 py-3 px-3 text-xs font-bold transition flex flex-col items-center gap-1.5 border-b-2 hover:bg-slate-800 ${
            activeMenu === "seo" ? "border-emerald-500 text-emerald-400 bg-slate-800/40" : "border-transparent text-slate-400"
          }`}
        >
          <Globe className="w-4 h-4" /> <span>SEO/SNS</span>
        </button>
      </div>

      {/* ACTIVE PANEL CONTENT */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* TAB 1: GENERAL WRITING */}
        {activeMenu === "general" && (
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider">웹사이트 기본 정보 문구 설정</h3>
            
            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">상호명 및 상단 큰 로고텍스트</label>
              <input 
                type="text" 
                value={config.logoText}
                onChange={(e) => handleGeneralChange("logoText", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">상단 바 태그라인 (소형 배지)</label>
              <input 
                type="text" 
                value={config.tagline}
                onChange={(e) => handleGeneralChange("tagline", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">히어로 대형 헤드라인 타이틀</label>
              <textarea 
                rows={3}
                value={config.heroTitle}
                onChange={(e) => handleGeneralChange("heroTitle", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">히어로 보조 상세설명</label>
              <textarea 
                rows={3}
                value={config.heroSubtitle}
                onChange={(e) => handleGeneralChange("heroSubtitle", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">소개 섹션 헤더</label>
              <input 
                type="text" 
                value={config.aboutTitle}
                onChange={(e) => handleGeneralChange("aboutTitle", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">소개 섹션 상세 본문</label>
              <textarea 
                rows={4}
                value={config.aboutText}
                onChange={(e) => handleGeneralChange("aboutText", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-3">
              <h4 className="text-[11px] font-bold text-emerald-400">긴급 연락처 및 오시는길 주소 세팅</h4>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">대표 상담 연결전화</label>
                <input 
                  type="text" 
                  value={config.consultationPhone}
                  onChange={(e) => handleGeneralChange("consultationPhone", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">사무실 정확한 주소</label>
                <input 
                  type="text" 
                  value={config.address}
                  onChange={(e) => handleGeneralChange("address", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">영업 요일 및 방문가능 시간</label>
                <input 
                  type="text" 
                  value={config.businessHours}
                  onChange={(e) => handleGeneralChange("businessHours", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STYLE CUSTOMIZE */}
        {activeMenu === "style" && (
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider">럭셔리 디자인 전반 색상 및 폰트 커스터마이징</h3>
            
            <div>
              <span className="block text-[11px] text-slate-400 font-semibold mb-1">기본 배경 테마 모드 선택</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => handleStyleChange("themeMode", "pure-black")}
                  className={`px-3 py-2 rounded text-xs font-bold border transition ${
                    config.style.themeMode === "pure-black"
                      ? "bg-black border-emerald-500 text-white"
                      : "bg-slate-950 border-transparent text-slate-400"
                  }`}
                >
                  퓨어 블랙 (심플 럭셔리)
                </button>
                <button
                  onClick={() => handleStyleChange("themeMode", "dark-slate")}
                  className={`px-3 py-2 rounded text-xs font-bold border transition ${
                    config.style.themeMode === "dark-slate"
                      ? "bg-slate-950 border-emerald-500 text-white"
                      : "bg-slate-900 border-transparent text-slate-400"
                  }`}
                >
                  차콜 슬레이트 (모던 세련)
                </button>
              </div>
            </div>

            <div>
              <span className="block text-[11px] text-slate-400 font-semibold mb-1">웹서체 (글끼 스타일링)</span>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { key: "serif", label: "명조선 (Serif)" },
                  { key: "sans", label: "고딕선 (Sans)" },
                  { key: "mono", label: "코딩선 (Mono)" }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleStyleChange("fontFamily", opt.key)}
                    className={`px-2 py-2 rounded text-xs font-bold border transition ${
                      config.style.fontFamily === opt.key
                        ? "bg-slate-800 border-emerald-500 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                - 명조(Serif) 서체는 정통적이며 고급스러운 법조 윤리 신뢰 분위기를 풍깁니다.<br/>
                - 고딕(Sans) 서체는 명확하고 가독성이 뛰어납니다.
              </p>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <span className="block text-[11px] text-slate-400 font-semibold mb-2">시그니처 포인트 컬러설정 (그린/녹색 계열)</span>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                {ACCENT_COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() => {
                      handleStyleChange("accentColor", preset.hex);
                      handleStyleChange("accentText", preset.text);
                    }}
                    className={`flex items-center gap-2 p-2 rounded text-[11px] bg-slate-950 border text-left transition ${
                      config.style.accentColor === preset.hex ? "border-white" : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.hex }} />
                    <span className="truncate">{preset.name}</span>
                    {config.style.accentColor === preset.hex && <Check className="w-3 h-3 text-white ml-auto flex-shrink-0" />}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">사용자 커스텀 헥사코드(Hex) 직접입력</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={config.style.accentColor}
                    onChange={(e) => handleStyleChange("accentColor", e.target.value)}
                    placeholder="#10b981"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-stone-200 focus:outline-none"
                  />
                  <span className="w-8 h-8 rounded border border-slate-800" style={{ backgroundColor: config.style.accentColor }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ATTORNEYS MEMBERS */}
        {activeMenu === "members" && (
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider">법률사무소 변호인단 상술 관리</h3>
            
            <div className="space-y-4">
              {config.members.map((member) => (
                <div key={member.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex justify-between items-center bg-slate-900 -mx-4 -mt-4 px-4 py-2 rounded-t-xl border-b border-slate-800">
                    <span className="text-xs font-bold text-white">{member.name} 변호사 단독 정보</span>
                    <button 
                      onClick={() => {
                        if (editingMemberId === member.id) {
                          setEditingMemberId(null);
                        } else {
                          setEditingMemberId(member.id);
                          setNewMember(member);
                        }
                      }}
                      className="text-[10px] text-emerald-400 font-bold hover:underline"
                    >
                      {editingMemberId === member.id ? "수정 완료" : "편집 모드 격상"}
                    </button>
                  </div>

                  {editingMemberId === member.id ? (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">성명 및 이름</label>
                        <input 
                          type="text" 
                          value={newMember.name || ""}
                          onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">직함 및 역할 요지</label>
                        <input 
                          type="text" 
                          value={newMember.role || ""}
                          onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">변호인 약력 / 소개글</label>
                        <textarea 
                          rows={4}
                          value={newMember.bio || ""}
                          onChange={(e) => setNewMember({...newMember, bio: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">투수형 상세 주특기 분야 (쉼표로 구분)</label>
                        <input 
                          type="text" 
                          value={newMember.specialties?.join(", ") || ""}
                          onChange={(e) => setNewMember({...newMember, specialties: e.target.value.split(",").map(s => s.trim())})}
                          placeholder="기획부동산 분쟁 전문, 사기 방어율 1위"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">인물 이미지 주소 (Unsplash 등 프로필 이미지)</label>
                        <input 
                          type="text" 
                          value={newMember.imageUrl || ""}
                          onChange={(e) => setNewMember({...newMember, imageUrl: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none text-white"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => handleUpdateMember(member.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-black rounded transition"
                        >
                          저장 완료
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs space-y-1 text-slate-300">
                      <div><span className="text-slate-500 font-bold block">직함:</span> {member.role}</div>
                      <div><span className="text-slate-500 font-bold block">소개글:</span> <span className="line-clamp-2">{member.bio}</span></div>
                      <div><span className="text-slate-500 font-bold block">전문:</span> {member.specialties.join(" | ")}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SUCCESS CASES */}
        {activeMenu === "cases" && (
          <div className="space-y-4">
            <div id="case-form-anchor" className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider">부동산 형사/민사 소송 승소 사례 등록기</h3>
              {editingCaseId && (
                <button 
                  onClick={() => {
                    setEditingCaseId(null);
                    setNewCase({ title: "", category: "부동산형사", result: "", description: "", date: "" });
                  }}
                  className="text-[10px] text-rose-400 font-bold"
                >
                  기존 수정상태 취소
                </button>
              )}
            </div>

            {/* CREATE / EDIT FORM */}
            <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-3">
              <span className="block text-xs font-bold text-white mb-1">
                {editingCaseId ? "📌 선택 사례 수정하기" : "➕ 신규 성공 사례 등록"}
              </span>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">종결 판결 및 보상 명칭</label>
                <input 
                  type="text" 
                  value={newCase.title}
                  onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                  placeholder="예: 100억대 기획부동산 사기 전원 무죄 이끌어"
                  className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">사건 본질 분류</label>
                  <select 
                    value={newCase.category}
                    onChange={(e) => setNewCase({...newCase, category: e.target.value as any})}
                    className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none"
                  >
                    <option value="부동산형사">부동산형사</option>
                    <option value="부동산민사">부동산민사</option>
                    <option value="일반형사">일반형사</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">사건 일자</label>
                  <input 
                    type="month"
                    value={newCase.date}
                    onChange={(e) => setNewCase({...newCase, date: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">최종 판결/조력 성과</label>
                <input 
                  type="text" 
                  value={newCase.result}
                  onChange={(e) => setNewCase({...newCase, result: e.target.value})}
                  placeholder="예: 피고인 전원 벌금형 무마 및 무죄 선고"
                  className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">사건 변론 및 상세 전략 해설</label>
                <textarea 
                  rows={4}
                  value={newCase.description}
                  onChange={(e) => setNewCase({...newCase, description: e.target.value})}
                  placeholder="당사 대리인이 직접 증명법안을 수립하여 소송 기각 및 송치 처리에 성공했던 구체적인 변론 노하우를 기재하세요."
                  className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                onClick={handleAddOrEditCase}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 hover:scale-[1.01] transition-all duration-200 text-xs font-bold text-black rounded flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> {editingCaseId ? "수정 내용 영구 반영" : "새 성공사례 등록 추가"}
              </button>
            </div>

            {/* CASES LIST VIEW FOR REMOVE/EDIT */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="block text-[11px] text-slate-400 font-bold mb-2">현재 게시되어 있는 성공사례 리스트 ({config.cases.length}개)</span>
              {config.cases.map((c) => (
                <div key={c.id} className="p-3 bg-slate-950 border border-slate-850 rounded-lg flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] bg-slate-900 border border-slate-700 font-bold px-1.5 py-0.5 rounded text-emerald-400">
                        {c.category}
                      </span>
                      <span className="text-[10px] text-slate-500">{c.date}</span>
                    </div>
                    <h4 className="text-xs font-black truncate text-white">{c.title}</h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{c.result}</p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStartEditCase(c)}
                      className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-white"
                      title="수정하기"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCase(c.id)}
                      className="p-1 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/40 rounded text-rose-400"
                      title="소송 사례 삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 5: BLOG POSTS */}
        {activeMenu === "posts" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider">부동산 형사·법조 전문 칼럼 작성 관리</h3>
              {editingPostId && (
                <button 
                  onClick={() => {
                    setEditingPostId(null);
                    setNewPost({
                      title: "", summary: "", content: "", author: "송명근 대표변호사", 
                      category: "부동산 법조대응", imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=600&h=400", date: new Date().toISOString().substring(0, 10)
                    });
                  }}
                  className="text-[10px] text-rose-400 font-bold"
                >
                  수정 취소
                </button>
              )}
            </div>

            {/* POSTS EDITOR FORM */}
            <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-3">
              <span className="block text-xs font-bold text-white mb-1">
                {editingPostId ? "📝 선택 칼럼 수정 가동" : "✍️ 새로운 법률 전문 칼럼 발행"}
              </span>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">칼럼 제목</label>
                <input 
                  type="text" 
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="예: 기획부동산 사기를 판단할 수 있는 수집 지식"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">목록 요약본 설명 (간결 설명)</label>
                <input 
                  type="text" 
                  value={newPost.summary}
                  onChange={(e) => setNewPost({...newPost, summary: e.target.value})}
                  placeholder="예: 지식산업센터 전매 기망 유형과 가이드라인 요약"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">전담 집필 변호사</label>
                  <input 
                    type="text" 
                    value={newPost.author}
                    onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                    placeholder="예: 송명근 대표변호사"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">칼럼 유형 카테고리</label>
                  <input 
                    type="text" 
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    placeholder="예: 부동산 사기 퇴치법"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">칼럼 본문 글쓰기</label>
                <textarea 
                  rows={6}
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="여기에 실제 의뢰인이 참고할 중요한 대법원 법정 판례나 법률 전개 구조를 자세하게 기술하세요. 풍부한 내용일수록 신뢰도가 높습니다."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none font-sans whitespace-pre-wrap"
                />
              </div>

              <div className="border-t border-slate-850 pt-3">
                <span className="block text-[10px] text-slate-400 mb-1.5">칼럼 대문 이미지 설정</span>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {UNSPLASH_IMAGES_PRESETS.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setNewPost({...newPost, imageUrl: img.url})}
                      className={`px-1.5 py-1 bg-slate-900 border rounded text-[9px] truncate text-slate-300 hover:border-slate-600 cursor-pointer ${
                        newPost.imageUrl === img.url ? "border-emerald-500 font-bold text-emerald-400" : "border-transparent"
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
                
                <input 
                  type="text" 
                  value={newPost.imageUrl}
                  onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
                  placeholder="또는 직접 이미지 URL 주소를 복사 입안하세요"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-[10px] text-white focus:outline-none"
                />
              </div>

              <button
                onClick={handleAddOrEditPost}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-black rounded flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-3.5 h-3.5" /> {editingPostId ? "수정 완료 저장" : "새 법률 칼럼 동시 발행"}
              </button>
            </div>

            {/* DUSTBIN & SELECTION LIST */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="block text-[11px] text-slate-400 font-bold mb-1">현재 등재된 법률 기사 리스트 ({config.posts.length}개)</span>
              {config.posts.map((post) => (
                <div key={post.id} className="p-3 bg-slate-950 border border-slate-850 rounded-lg flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] text-slate-500 block">{post.date} | {post.category}</span>
                    <h4 className="text-xs font-bold text-white truncate my-0.5">{post.title}</h4>
                    <p className="text-[10px] text-stone-400 line-clamp-1">{post.summary}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingPostId(post.id);
                        setNewPost(post);
                      }}
                      className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-705 rounded text-slate-400"
                      title="소개글 수정"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/40 rounded text-rose-400"
                      title="영구 삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 6: SEO & SOCIAL INTEGRATION */}
        {activeMenu === "seo" && (
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider">SEO 최적화 기본값 설정 & SNS 연동</h3>
            
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/10 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-300 leading-relaxed font-light">
                <strong>SEO 검색 메타 태그 시스템:</strong> 작성하신 정보는 실제 검색 포털봇이 웹 크롤링 시 우선적으로 색인 적용하여 네이버 서치어드바이저 및 구글 서치콘솔 최적화 지표로 자동 전달됩니다.
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">검색 노출 최적화용 메타 제목(Title)</label>
              <input 
                type="text" 
                value={config.seo.metaTitle}
                onChange={(e) => handleSEOChange("metaTitle", e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-stone-300"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">검색 포털 스니펫용 메타 요약 설명(Description)</label>
              <textarea 
                rows={3}
                value={config.seo.metaDescription}
                onChange={(e) => handleSEOChange("metaDescription", e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-stone-300"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">키워드 메타 태그 (쉼표로 구분)</label>
              <input 
                type="text" 
                value={config.seo.keywords}
                onChange={(e) => handleSEOChange("keywords", e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-stone-300"
              />
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              <h4 className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" /> 외부 소셜 미디어 연동 링크 설정
              </h4>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">네이버 공식 블로그 주소</label>
                <input 
                  type="text" 
                  value={config.social.naverBlog}
                  onChange={(e) => handleSocialChange("naverBlog", e.target.value)}
                  className="w-full bg-slate-955 border border-slate-850 rounded px-3 py-2 text-xs focus:outline-none text-stone-300"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">카카오톡 채널 상담 주소</label>
                <input 
                  type="text" 
                  value={config.social.kakaoTalk}
                  onChange={(e) => handleSocialChange("kakaoTalk", e.target.value)}
                  className="w-full bg-slate-955 border border-slate-850 rounded px-3 py-2 text-xs focus:outline-none text-stone-300"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">소개 유튜브 채널 주소</label>
                <input 
                  type="text" 
                  value={config.social.youtube}
                  onChange={(e) => handleSocialChange("youtube", e.target.value)}
                  className="w-full bg-slate-955 border border-slate-850 rounded px-3 py-2 text-xs focus:outline-none text-stone-300"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">공식 티스토리 블로그 주소</label>
                <input 
                  type="text" 
                  value={config.social.tistory || ""}
                  onChange={(e) => handleSocialChange("tistory", e.target.value)}
                  className="w-full bg-slate-955 border border-slate-850 rounded px-3 py-2 text-xs focus:outline-none text-stone-300"
                />
              </div>
            </div>

          </div>
        )}

      </div>

      {/* FOOTER METRICS */}
      <div className="p-4 bg-slate-950 border-t border-slate-850 text-[10px] text-slate-500 flex justify-between items-center sm:flex-shrink-0">
        <span>CMS STATE ENGINE ACTIVE</span>
        <span className="font-mono bg-emerald-900/10 text-emerald-400 px-1.5 py-0.5 rounded">LOCAL_STORAGE_PERSISTENCE</span>
      </div>
    </div>
  );
}
