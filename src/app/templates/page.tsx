"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import GlobalNavigation from '@/components/GlobalNavigation';
import {
  FileText,
  Star,
  Shield,
  Zap,
  Filter,
  CheckCircle,
  Lock,
  TrendingUp,
  Award,
  Users,
  Clock,
  ArrowRight,
  X,
  Sparkles,
  BarChart,
  Target,
  Eye,
  Briefcase,
  Code,
  Heart,
  GraduationCap,
  Building,
  Palette,
  DollarSign,
  Globe,
  Microscope,
  Crown,
  Hammer,
  Stethoscope,
  FlaskConical,
  Calculator,
  Wrench,
  BookOpen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

import UserDropdown from "@/components/UserDropdown";

// Premium Upgrade Banner Component
const PremiumUpgradeBanner = () => (
  <div className="bg-gradient-to-r from-pink-600 via-pink-500 to-pink-600 rounded-2xl p-8 text-white text-center shadow-2xl mb-8 border border-pink-400/30 relative overflow-hidden">
    {/* Animated background effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-pink-400/20 to-pink-600/20 animate-pulse"></div>

    <div className="relative z-10">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Crown className="w-10 h-10 animate-bounce text-yellow-300" />
        <h3 className="text-2xl md:text-3xl font-bold">
          Unlock ALL Premium Templates!
        </h3>
        <Crown
          className="w-10 h-10 animate-bounce text-yellow-300"
          style={{ animationDelay: "0.5s" }}
        />
      </div>
      <p className="mb-2 text-pink-100 text-lg">
        🚀 <strong>3x More Interviews</strong> • 🎯{" "}
        <strong>98% ATS Pass Rate</strong> • ⚡{" "}
        <strong>AI-Powered Optimization</strong>
      </p>
      <p className="mb-6 text-pink-200 text-sm">
        Join 50,000+ job seekers who landed their dream jobs with our premium
        templates
      </p>
      <Link href="/pricing">
        <button className="px-8 py-4 bg-white text-pink-600 font-bold rounded-xl hover:bg-pink-50 transform hover:scale-105 transition-all cursor-pointer shadow-lg text-lg">
          Get Premium Access - Only $22/month
        </button>
      </Link>
      <p className="text-xs mt-3 text-pink-200">✨ Cancel anytime</p>
    </div>
  </div>
);

const EnhancedTemplatesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPreview, setShowPreview] = useState<TemplateType | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // Use the premium status hook
  const {
    isPremium,
    loading: premiumLoading,
    error: premiumError,
    refreshStatus,
  } = usePremiumStatus();

  const [userData, setUserData] = useState<{
    email?: string;
    name?: string;
  } | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Check user basic data on component mount
  useEffect(() => {
    const checkUserData = async () => {
      try {
        setUserLoading(true);
        const supabase = createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          console.log("No authenticated user found");
          setUserData(null);
          setUserLoading(false);
          return;
        }

        // Get basic user profile data (premium status handled by hook)
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          // Fallback to basic user data
          setUserData({
            email: user.email || "",
            name: user.user_metadata?.full_name || "User",
          });
          setUserLoading(false);
          return;
        }

        // Set user data (premium status comes from hook)
        setUserData({
          email: profile?.email || user.email || "",
          name: profile?.full_name || user.user_metadata?.full_name || "User",
        });
        setUserLoading(false);
      } catch (error) {
        console.error("Error checking user status:", error);
        setUserData(null);
        setUserLoading(false);
      }
    };

    checkUserData();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("upgraded") === "true") {
      // Clear any cached data and refresh user status
      setTimeout(() => {
        checkUserData();
      }, 1000);
    }
  }, []);

  const templates = [
    {
      id: "medical-professional",
      name: "Medical Professional",
      category: "industry",
      description:
        "LaTeX template designed for physicians, residents, and healthcare professionals",
      atsScore: 98,
      isPremium: true,
      popularityRank: 1,
      downloads: 18450,
      rating: 4.9,
      features: [
        "ATS Optimized",
        "License Display",
        "Board Certifications",
        "Clinical Experience",
      ],
      industries: ["Healthcare", "Medical", "Hospital", "Clinical", "Nursing"],
      preview: {
        name: "[Firstname Lastname, M.D./D.O.]",
        title: "Medical Professional",
        email: "[your.email@server.com]",
        phone: "[Phone Number]",
        location: "[City, State ZIP]",
        summary:
          "Professional summary highlighting medical expertise and clinical experience...",
        experience: [
          {
            title: "[Your Title, e.g., Attending Physician]",
            company: "[Hospital/Clinic Name]",
            years: "[Month YYYY] - Present",
          },
          {
            title: "[Previous Position]",
            company: "[Previous Hospital]",
            years: "[Start - End]",
          },
        ],
        skills: [
          "Medical License",
          "Board Certification",
          "DEA License",
          "ACLS/BLS/PALS",
        ],
        sections: [
          "Licensure & Certifications",
          "Education & Training",
          "Research & Publications",
        ],
      },
    },
    {
      id: "academic-research",
      name: "Academic Research",
      category: "professional",
      description:
        "LaTeX template for Ph.D. candidates, postdocs, and research professionals",
      atsScore: 97,
      isPremium: true,
      popularityRank: 2,
      downloads: 12340,
      rating: 4.8,
      features: [
        "Publication Focus",
        "Research Interests",
        "Grant History",
        "ORCID Integration",
      ],
      industries: [
        "Academia",
        "Research",
        "University",
        "Science",
        "Education",
      ],
      preview: {
        name: "Dr. Firstname Lastname",
        title: "Research Professional",
        email: "[email@domain.com]",
        phone: "[Phone Number]",
        location: "[City, State, ZIP]",
        summary:
          "Research interests in [Interest Area 1], [Interest Area 2], [Interest Area 3]...",
        experience: [
          {
            title: "[Job Title, e.g., Postdoctoral Fellow]",
            company: "[University/Institution Name]",
            years: "[Dates]",
          },
        ],
        skills: [
          "Research Methods",
          "Grant Writing",
          "Teaching",
          "Publications",
        ],
        sections: [
          "Education",
          "Research Interests",
          "Publications",
          "Grants & Fellowships",
        ],
      },
    },
    {
      id: "finance-professional",
      name: "Finance Professional",
      category: "professional",
      description:
        "LaTeX template for finance professionals, analysts, and MBA graduates",
      atsScore: 96,
      isPremium: true,
      popularityRank: 3,
      downloads: 23450,
      rating: 4.85,
      features: [
        "Technical Skills",
        "Certifications",
        "Financial Modeling",
        "MBA Focus",
      ],
      industries: [
        "Finance",
        "Banking",
        "Investment",
        "Corporate Finance",
        "Consulting",
      ],
      preview: {
        name: "Firstname Lastname, [MBA/CFA]",
        title: "Finance Professional",
        email: "[email@domain.com]",
        phone: "[Phone Number]",
        location: "[City, State]",
        summary:
          "Results-driven finance professional with expertise in FP&A, corporate strategy, and M&A...",
        experience: [
          {
            title: "[Job Title]",
            company: "[Company Name]",
            years: "[Month YYYY] - Present",
          },
          {
            title: "[Previous Job Title]",
            company: "[Previous Company]",
            years: "[Start - End]",
          },
        ],
        skills: [
          "Advanced Excel",
          "Financial Modeling",
          "DCF Valuation",
          "SQL",
          "Tableau",
        ],
        sections: [
          "Professional Summary",
          "Professional Experience",
          "Education",
          "Certifications",
        ],
      },
    },
    {
      id: "engineering-student",
      name: "Engineering Student",
      category: "entry-level",
      description:
        "LaTeX template perfect for engineering students and recent graduates",
      atsScore: 99,
      isPremium: false,
      popularityRank: 4,
      downloads: 32540,
      rating: 4.8,
      features: [
        "Education Focus",
        "Project Showcase",
        "Technical Skills",
        "Leadership Activities",
      ],
      industries: [
        "Engineering",
        "Technology",
        "Entry Level",
        "Student",
        "STEM",
      ],
      preview: {
        name: "Firstname Lastname",
        title: "Engineering Student",
        email: "[email@domain.com]",
        phone: "[Phone Number]",
        location: "[City, State]",
        summary:
          "Mechanical Engineering student with hands-on project experience...",
        experience: [
          {
            title: "[Job Title, e.g., Engineering Intern]",
            company: "[Company Name]",
            years: "[Dates]",
          },
        ],
        skills: ["MATLAB", "SolidWorks", "Python", "C++", "AutoCAD"],
        sections: [
          "Education",
          "Skills",
          "Projects",
          "Experience",
          "Leadership & Activities",
        ],
      },
    },
    {
      id: "creative-designer",
      name: "Creative Designer",
      category: "creative",
      description:
        "LaTeX template for UX/UI designers and creative professionals",
      atsScore: 94,
      isPremium: true,
      popularityRank: 5,
      downloads: 15670,
      rating: 4.7,
      features: [
        "Portfolio Focus",
        "Visual Layout",
        "Project Showcase",
        "Design Tools",
      ],
      industries: ["Design", "UX/UI", "Creative", "Digital Media", "Branding"],
      preview: {
        name: "Firstname Lastname",
        title: "[UX/UI Designer | Brand Strategist]",
        email: "[email@domain.com]",
        phone: "[Phone Number]",
        location: "your-portfolio.com",
        summary:
          "A multidisciplinary designer creating intuitive, human-centered digital experiences...",
        experience: [
          {
            title: "[Job Title]",
            company: "[Company/Agency Name]",
            years: "[Month YYYY] - Present",
          },
          {
            title: "[Previous Job Title]",
            company: "[Previous Company]",
            years: "[Start - End]",
          },
        ],
        skills: [
          "UX/UI",
          "Figma",
          "Adobe Creative Suite",
          "Prototyping",
          "User Research",
        ],
        sections: [
          "Profile",
          "Experience",
          "Selected Projects",
          "Proficiencies",
        ],
      },
    },
    {
      id: "software-developer",
      name: "Software Developer",
      category: "technical",
      description:
        "LaTeX template optimized for software engineers and developers",
      atsScore: 98,
      isPremium: true,
      popularityRank: 6,
      downloads: 28560,
      rating: 4.9,
      features: [
        "Tech Stack Focus",
        "GitHub Integration",
        "Project Links",
        "Clean Layout",
      ],
      industries: [
        "Software Development",
        "Technology",
        "Engineering",
        "Web Development",
      ],
      preview: {
        name: "Firstname Lastname",
        title: "Software Developer",
        email: "[email@domain.com]",
        phone: "[Phone Number]",
        location: "[City, State]",
        summary:
          "Full-stack developer with expertise in modern web technologies...",
        experience: [
          {
            title: "[Job Title]",
            company: "[Company Name]",
            years: "[Month YYYY] - Present",
          },
          {
            title: "[Previous Job Title]",
            company: "[Previous Company]",
            years: "[Start - End]",
          },
        ],
        skills: [
          "Python",
          "JavaScript",
          "React",
          "Node.js",
          "AWS",
          "Docker",
          "PostgreSQL",
        ],
        sections: [
          "Technical Skills",
          "Professional Experience",
          "Projects",
          "Education",
        ],
      },
    },
    {
      id: "basic-professional",
      name: "Basic Professional",
      category: "basic",
      description: "Clean, simple LaTeX template suitable for any profession",
      atsScore: 99,
      isPremium: false,
      popularityRank: 7,
      downloads: 45230,
      rating: 4.7,
      features: [
        "ATS Optimized",
        "Clean Layout",
        "Easy to Customize",
        "Universal Design",
      ],
      industries: [
        "All Industries",
        "General Purpose",
        "Entry Level",
        "Professional",
      ],
      preview: {
        name: "Your Name",
        title: "Your Professional Title",
        email: "your.email@example.com",
        phone: "(555) 000-0000",
        location: "Your City, State",
        summary:
          "Professional summary highlighting your key qualifications and experience...",
        experience: [
          {
            title: "Your Job Title",
            company: "Company Name",
            years: "Start - End",
          },
          {
            title: "Previous Position",
            company: "Previous Company",
            years: "Start - End",
          },
        ],
        skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
        sections: [
          "Education",
          "Experience",
          "Skills",
          "Additional Information",
        ],
      },
    },
  ];

  const categories = [
    {
      id: "all",
      name: "All Templates",
      icon: <FileText className="w-4 h-4" />,
    },
    { id: "basic", name: "Basic", icon: <FileText className="w-4 h-4" /> },
    {
      id: "professional",
      name: "Professional",
      icon: <Briefcase className="w-4 h-4" />,
    },
    { id: "technical", name: "Technical", icon: <Code className="w-4 h-4" /> },
    { id: "creative", name: "Creative", icon: <Palette className="w-4 h-4" /> },
    {
      id: "industry",
      name: "Industry Specific",
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: "entry-level",
      name: "Entry Level",
      icon: <GraduationCap className="w-4 h-4" />,
    },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  type TemplateType = (typeof templates)[number];
  interface TemplatePreviewModalProps {
    template: TemplateType | null;
    onClose: () => void;
  }

  const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
    template,
    onClose,
  }) => {
    if (!template) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-800">
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div>
              <h3 className="text-2xl font-bold text-white">{template.name}</h3>
              <p className="text-gray-400 mt-1">{template.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div className="bg-gray-800 rounded-2xl p-8 flex items-center justify-center">
              <div className="w-full max-w-sm h-96 bg-white rounded-xl shadow-xl overflow-hidden">
                <LaTeXResumePreview template={template} />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">
                  ATS Performance
                </h4>
                <div className="bg-green-900/30 rounded-xl p-4 border border-green-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-300">ATS Score</span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-green-400">
                        {template.atsScore}
                      </span>
                      <span className="text-gray-500">/100</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                      style={{ width: `${template.atsScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">
                  Key Features
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {template.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">
                  Best For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {template.industries.map((industry, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-teal-900/30 text-teal-300 rounded-full text-sm border border-teal-700/50"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    onClose();
                    if (template.isPremium && !isPremium) {
                      window.location.href = "/pricing";
                    } else {
                      window.location.href = `/builder?template=${template.id}`;
                    }
                  }}
                  className={`flex-1 font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 ${
                    template.isPremium && !isPremium
                      ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white"
                      : "bg-gradient-to-r from-teal-600 to-amber-600 text-white"
                  }`}
                >
                  {template.isPremium && !isPremium ? (
                    <>
                      <Crown className="w-5 h-5" />
                      Upgrade to Use
                    </>
                  ) : (
                    <>
                      Use This Template
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-700 rounded-xl font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LaTeXResumePreview: React.FC<{ template: TemplateType }> = ({
    template,
  }) => {
    const baseStyles =
      "h-full text-xs leading-tight overflow-hidden bg-white text-black p-4";

    // Medical Professional Template (LaTeX style)
    if (template.id === "medical-professional") {
      return (
        <div className={`${baseStyles} font-serif`}>
          <div className="text-center mb-3">
            <div className="text-base font-bold">{template.preview.name}</div>
            <div className="text-[10px] text-gray-700 mt-1">
              {template.preview.location}
              <br />
              {template.preview.phone} · {template.preview.email} · LinkedIn
              Profile
            </div>
          </div>

          <div className="border-t border-gray-400 my-2"></div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Professional Summary
            </div>
            <div className="border-t border-gray-300 mb-1"></div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Licensure & Certifications
            </div>
            <div className="border-t border-gray-300 mb-1"></div>
            <div className="text-[9px] leading-relaxed">
              • Medical License: [State], License #[Number]
              <br />
              • Board Certification: [Board Name]
              <br />
              • DEA License: #[Number]
              <br />• ACLS/BLS/PALS: Certified
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Education & Training
            </div>
            <div className="border-t border-gray-300 mb-1"></div>
            <div className="text-[9px]">
              <div className="mb-1">
                <span className="font-bold">Fellowship, [Subspecialty]</span>
                <span className="float-right">[YYYY] - [YYYY]</span>
                <br />
                <i>[Institution], [City, State]</i>
              </div>
              <div className="mb-1">
                <span className="font-bold">Residency, [Specialty]</span>
                <span className="float-right">[YYYY] - [YYYY]</span>
                <br />
                <i>[Institution], [City, State]</i>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Academic Research Template (LaTeX style)
    if (template.id === "academic-research") {
      return (
        <div className={`${baseStyles} font-serif`}>
          <div className="text-center mb-3">
            <div className="text-base font-bold">{template.preview.name}</div>
            <div className="text-[10px] text-gray-700 mt-1">
              [Street Address] · [City, State, ZIP]
              <br />
              {template.preview.phone} · {template.preview.email} · LinkedIn ·
              ORCID
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Education
            </div>
            <div className="border-t border-gray-800 mb-1"></div>
            <div className="text-[9px]">
              <div className="mb-1">
                <span className="font-bold">Ph.D. in [Your Field]</span>
                <span className="float-right">[Year]</span>
                <br />
                [University Name], [City, State]
                <br />
                Dissertation: "[Title of Your Dissertation]"
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Research Interests
            </div>
            <div className="border-t border-gray-800 mb-1"></div>
            <div className="text-[9px]">{template.preview.summary}</div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Academic Appointments
            </div>
            <div className="border-t border-gray-800 mb-1"></div>
            <div className="text-[9px]">
              {template.preview.experience.map((exp, idx) => (
                <div key={idx} className="mb-1">
                  <span className="font-bold">{exp.title}</span>
                  <span className="float-right">{exp.years}</span>
                  <br />
                  {exp.company}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Finance Professional Template (LaTeX style)
    if (template.id === "finance-professional") {
      return (
        <div className={`${baseStyles} font-serif`}>
          <div className="text-center mb-3">
            <div className="text-base font-bold">{template.preview.name}</div>
            <div className="text-[10px] text-gray-700 mt-1">
              {template.preview.location} · {template.preview.phone} ·{" "}
              {template.preview.email} · LinkedIn
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Professional Summary
            </div>
            <div className="border-t border-gray-800 mb-1"></div>
            <div className="text-[9px]">{template.preview.summary}</div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Professional Experience
            </div>
            <div className="border-t border-gray-800 mb-1"></div>
            <div className="text-[9px]">
              {template.preview.experience.map((exp, idx) => (
                <div key={idx} className="mb-2">
                  <div className="flex justify-between">
                    <span className="font-bold">{exp.title}</span>
                    <span>{exp.years}</span>
                  </div>
                  <div>{exp.company}</div>
                  <div className="ml-2 mt-1">
                    • Achievement or responsibility
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Skills & Certifications
            </div>
            <div className="border-t border-gray-800 mb-1"></div>
            <div className="text-[9px]">
              <span className="font-bold">Technical:</span>{" "}
              {template.preview.skills.slice(0, 3).join(", ")}
              <br />
              <span className="font-bold">Financial:</span>{" "}
              {template.preview.skills.slice(3).join(", ")}
            </div>
          </div>
        </div>
      );
    }

    // Engineering Student Template (LaTeX style)
    if (template.id === "engineering-student") {
      return (
        <div className={`${baseStyles} font-serif`}>
          <div className="text-center mb-3">
            <div className="text-base font-bold">{template.preview.name}</div>
            <div className="text-[10px] text-gray-700 mt-1">
              {template.preview.location} · {template.preview.phone} ·{" "}
              {template.preview.email} · LinkedIn
            </div>
          </div>
            <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Education
            </div>
            <div className="border-t border-gray-800 mb-1"></div>
            <div className="text-[9px]">
              <div className="flex justify-between">
                <span className="font-bold">[University Name]</span>
                <span>[City, State]</span>
              </div>
              <div>
                [Degree, e.g., Bachelor of Science in Mechanical Engineering]
              </div>
              <div>• GPA: [3.8/4.0]; Honors: [Dean's List]</div>
              <div>
                • Relevant Coursework: Thermodynamics, Fluid Mechanics, CAD/CAM
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Skills
            </div>
            <div className="border-t border-gray-800 mb-1"></div>
            <div className="text-[9px]">
              <div>
                <span className="font-bold">Technical:</span>{" "}
                {template.preview.skills.slice(0, 3).join(", ")}
              </div>
              <div>
                <span className="font-bold">Software:</span>{" "}
                {template.preview.skills.slice(3).join(", ")}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
              Experience
            </div>
            <div className="border-t border-gray-800 mb-1"></div>
            <div className="text-[9px]">
              {template.preview.experience.map((exp, idx) => (
                <div key={idx} className="mb-1">
                  <div className="flex justify-between">
                    <span className="font-bold">{exp.title}</span>
                    <span>{exp.years}</span>
                  </div>
                  <div>{exp.company}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Creative Designer Template (LaTeX style)
    if (template.id === "creative-designer") {
      return (
        <div className={`${baseStyles} font-sans`}>
          <div className="text-center mb-3">
            <div className="text-base font-bold">{template.preview.name}</div>
            <div className="text-[10px] text-gray-700 mt-1">
              {template.preview.title}
              <br />
              {template.preview.location}
              <br />
              {template.preview.phone} · {template.preview.email} · LinkedIn
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold mb-1">Profile</div>
            <div className="text-[9px] text-gray-700">
              {template.preview.summary}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold mb-1">Experience</div>
            {template.preview.experience.map((exp, idx) => (
              <div key={idx} className="text-[9px] mb-2">
                <div className="flex justify-between">
                  <span className="font-semibold">{exp.title}</span>
                  <span>{exp.years}</span>
                </div>
                <div className="text-gray-600">{exp.company}</div>
                <div className="ml-2 mt-1">• Key achievement or project</div>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold mb-1">Selected Projects</div>
            <div className="text-[9px]">
              <div className="mb-1">
                <span className="font-semibold">[Project Title]</span> | Mobile
                App Redesign
                <br />
                <span className="text-gray-600">
                  Full case study at portfolio.com/project-1
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold mb-1">Proficiencies</div>
            <div className="text-[9px]">
              <div>
                <span className="font-semibold">Design:</span> UX/UI,
                Wireframing, Prototyping
              </div>
              <div>
                <span className="font-semibold">Tools:</span>{" "}
                {template.preview.skills.slice(1, 4).join(", ")}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Software Developer Template (LaTeX style)
    if (template.id === "software-developer") {
      return (
        <div className={`${baseStyles} font-mono text-[9px]`}>
          <div className="text-center mb-3">
            <div className="text-sm font-bold">{template.preview.name}</div>
            <div className="text-[9px] text-gray-700 mt-1">
              {template.preview.location} · {template.preview.phone} ·{" "}
              {template.preview.email}
              <br />
              LinkedIn · GitHub · Portfolio
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase mb-1">
              Technical Skills
            </div>
            <div className="border-t border-gray-800 mb-1"></div>
            <div>
              <span className="font-semibold">Languages:</span>{" "}
              {template.preview.skills.slice(0, 3).join(", ")}
              <br />
              <span className="font-semibold">Frameworks:</span>{" "}
              {template.preview.skills.slice(3, 5).join(", ")}
              <br />
              <span className="font-semibold">Tools:</span>{" "}
              {template.preview.skills.slice(5).join(", ")}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase mb-1">
              Professional Experience
            </div>
            <div className="border-t border-gray-800 mb-1"></div>
            {template.preview.experience.map((exp, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex justify-between">
                  <span className="font-bold">{exp.title}</span>
                  <span>{exp.years}</span>
                </div>
                <div className="text-gray-600">{exp.company}</div>
                <div className="ml-2 mt-1">• Built scalable APIs...</div>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase mb-1">Projects</div>
            <div className="border-t border-gray-800 mb-1"></div>
            <div>
              <div className="font-semibold">[Project Name] [GitHub Link]</div>
              <div className="text-gray-600">
                Tech Stack: React, Python, AWS
              </div>
              <div className="ml-2">• Key feature or achievement</div>
            </div>
          </div>
        </div>
      );
    }

    // Basic Professional Template (LaTeX style)
    if (template.id === "basic-professional") {
      return (
        <div className={`${baseStyles} font-serif`}>
          <div className="text-center mb-3">
            <div className="text-base font-bold">{template.preview.name}</div>
            <div className="text-sm">{template.preview.title}</div>
            <div className="text-[10px] text-gray-700 mt-1">
              {template.preview.location} · {template.preview.phone} ·{" "}
              {template.preview.email}
            </div>
          </div>

          <div className="border-t border-gray-400 my-2"></div>

          <div className="mb-3">
            <div className="text-[11px] font-bold mb-1">
              Professional Summary
            </div>
            <div className="text-[10px] text-gray-700">
              {template.preview.summary}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[11px] font-bold mb-1">Experience</div>
            {template.preview.experience.map((exp, idx) => (
              <div key={idx} className="text-[10px] mb-2">
                <div className="font-semibold">
                  {exp.title} - {exp.company}
                </div>
                <div className="text-gray-600">{exp.years}</div>
                <div className="ml-2 mt-1">
                  • Key responsibility or achievement
                </div>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <div className="text-[11px] font-bold mb-1">Education</div>
            <div className="text-[10px]">
              <div className="font-semibold">Bachelor's Degree</div>
              <div className="text-gray-600">University Name, Year</div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold mb-1">Skills</div>
            <div className="text-[10px]">
              {template.preview.skills.join(" • ")}
            </div>
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div className={baseStyles}>
        <div className="text-center">Default Template Preview</div>
      </div>
    );
  };

  // Get icon for template based on category/industry
  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case "medical-professional":
        return <Stethoscope className="w-5 h-5" />;
      case "academic-research":
        return <BookOpen className="w-5 h-5" />;
      case "finance-professional":
        return <Calculator className="w-5 h-5" />;
      case "engineering-student":
        return <Wrench className="w-5 h-5" />;
      case "creative-designer":
        return <Palette className="w-5 h-5" />;
      case "software-developer":
        return <Code className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black relative">
      {/* Global Navigation */}
      <GlobalNavigation
        userData={userData ? {
          email: userData.email,
          name: userData.name,
          isPremium: isPremium,
        } : null}
        showBuilderActions={false}
        showMainNav={true}
        showAuthButtons={true}
      />

      {/* Premium Banner for Non-Premium Users - Top of Page */}
      {!isPremium && (
        <section className="py-6 px-6">
          <div className="max-w-5xl mx-auto">
            <PremiumUpgradeBanner />
          </div>
        </section>
      )}

      {/* Background Logo - Large and Faded */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5">
          <img
            src="/horse-logo.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-amber-900/20 to-pink-900/20 opacity-50"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-900/50 border border-teal-700/50 rounded-full mb-6">
            <Shield className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium text-teal-300">
              Professional LaTeX Templates with 98%+ ATS Score
            </span>
          </div>

          <h1 className="text-7xl font-bold text-purple-200 mb-4">
            Choose Your Perfect
            <span className="block mt-2 text-gradient-primary from-teal-400 to-amber-400 bg-transparent">
              LaTeX Resume Template
            </span>
          </h1>

          <div className="flex items-center justify-center">
            <div className="relative">
              <img
                alt="SmartATS Enterprise Dashboard"
                className="w-80 h-85 rounded-2xl shadow-2xl border border-gray-700"
                src="/Donkey.png"
              />
            </div>
          </div>

          <p className="font-bold text-4xl text-yellow-100">Simplified LaTeX Resume Designs That Actually Work!<br />
            At Smart ATS We Prioritize Getting You<br />
            <span className="font-bold text-6xl text-pink-600">HIRED</span>
          </p>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-400 mb-1">98%</div>
              <div className="text-sm text-gray-500">ATS Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-400 mb-1">7</div>
              <div className="text-sm text-gray-500">LaTeX Templates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-1">3x</div>
              <div className="text-sm text-gray-500">More Interviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-[73px] z-20 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-teal-600 to-amber-600 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  template.isPremium
                    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-gradient-to-r from-amber-400 to-orange-400 hover:border-amber-300 hover:shadow-amber-400/20"
                    : "bg-gray-900 border border-gray-800"
                }`}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
              >
                {/* Premium Glow Effect */}
                {template.isPremium && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-orange-400/5 to-amber-400/10 pointer-events-none"></div>
                )}

                {/* Premium Badge */}
                {template.isPremium && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <Crown className="w-4 h-4" />
                      PREMIUM
                    </div>
                  </div>
                )}

                {/* Popularity Badge */}
                {template.popularityRank <= 3 && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Popular
                    </div>
                  </div>
                )}

                {/* Template Preview */}
                <div
                  className="h-64 relative overflow-hidden cursor-pointer bg-gray-800"
                  onClick={() => setShowPreview(template)}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div
                      className="w-full max-w-[200px] h-full bg-white rounded-lg shadow-xl transform transition-transform duration-300"
                      style={{
                        transform:
                          hoveredTemplate === template.id
                            ? "scale(1.05) rotate(-1deg)"
                            : "scale(1)",
                      }}
                    >
                      <LaTeXResumePreview template={template} />
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                      hoveredTemplate === template.id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transform hover:scale-105 transition-transform">
                      <Eye className="w-5 h-5" />
                      Preview Template
                    </button>
                  </div>
                </div>

                {/* Template Info */}
                <div
                  className={`p-6 ${
                    template.isPremium
                      ? "bg-gradient-to-b from-gray-800/50 to-gray-900/50"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          template.isPremium ? "bg-amber-400/20" : "bg-gray-800"
                        }`}
                      >
                        {getTemplateIcon(template.id)}
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-bold mb-1 ${
                            template.isPremium ? "text-amber-100" : "text-white"
                          }`}
                        >
                          {template.name}
                          {template.isPremium && (
                            <span className="ml-2 text-amber-400">✨</span>
                          )}
                        </h3>
                        <p
                          className={`text-sm ${
                            template.isPremium
                              ? "text-amber-200/80"
                              : "text-gray-400"
                          }`}
                        >
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Stats for Premium */}
                  <div
                    className={`grid grid-cols-3 gap-3 mb-4 ${
                      template.isPremium
                        ? "bg-amber-400/10 rounded-lg p-3 border border-amber-400/20"
                        : ""
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`text-sm font-bold ${
                          template.isPremium ? "text-amber-300" : "text-white"
                        }`}
                      >
                        {template.atsScore}%
                      </div>
                      <div
                        className={`text-xs ${
                          template.isPremium
                            ? "text-amber-200/70"
                            : "text-gray-500"
                        }`}
                      >
                        ATS Score
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star
                          className={`w-3 h-3 fill-amber-400 ${
                            template.isPremium
                              ? "text-amber-300"
                              : "text-amber-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-bold ${
                            template.isPremium ? "text-amber-300" : "text-white"
                          }`}
                        >
                          {template.rating}
                        </span>
                      </div>
                      <div
                        className={`text-xs ${
                          template.isPremium
                            ? "text-amber-200/70"
                            : "text-gray-500"
                        }`}
                      >
                        Rating
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-sm font-bold ${
                          template.isPremium ? "text-amber-300" : "text-white"
                        }`}
                      >
                        {(template.downloads / 1000).toFixed(1)}k
                      </div>
                      <div
                        className={`text-xs ${
                          template.isPremium
                            ? "text-amber-200/70"
                            : "text-gray-500"
                        }`}
                      >
                        Uses
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Features for Premium */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium ${
                          template.isPremium
                            ? "bg-amber-400/20 text-amber-200 border-amber-400/30"
                            : "bg-gray-800 text-gray-300 border-gray-700"
                        }`}
                      >
                        {template.isPremium && "✨ "}
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Premium Value Proposition */}
                  {template.isPremium && (
                    <div className="mb-4 p-3 bg-amber-400/10 rounded-lg border border-amber-400/20">
                      <div className="flex items-center gap-2 text-amber-300 text-sm font-medium">
                        <Crown className="w-4 h-4" />
                        Premium LaTeX Benefits
                      </div>
                      <div className="text-xs text-amber-200/80 mt-1">
                        Professional typesetting • Academic standards • Priority
                        support
                      </div>
                    </div>
                  )}

                  {/* Enhanced Action Button */}
                  <button
                    onClick={() => {
                      if (template.isPremium && !isPremium) {
                        window.location.href = "/pricing";
                      } else {
                        window.location.href = `/builder?template=${template.id}`;
                      }
                    }}
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-lg ${
                      template.isPremium
                        ? "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 text-gray-900 hover:shadow-xl hover:shadow-amber-400/25 transform hover:scale-[1.02]"
                        : "bg-gradient-to-r from-teal-600 to-amber-600 text-white hover:shadow-lg"
                    }`}
                  >
                    {template.isPremium && !isPremium ? (
                      <>
                        <Crown className="w-5 h-5" />
                        Upgrade for $22/mo
                      </>
                    ) : (
                      <>
                        {template.isPremium && <Crown className="w-5 h-5" />}
                        Use Template
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-teal-900/20 to-amber-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can't Find the Perfect Template?
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            Start with our smart builder and create a custom ATS-optimized
            resume
          </p>
          <button
            onClick={() => (window.location.href = "/builder")}
            className="bg-gradient-to-r from-teal-600 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <Zap className="w-5 h-5" />
            Start Smart Builder
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        template={showPreview}
        onClose={() => setShowPreview(null)}
      />
    </div>
  );
};

export default EnhancedTemplatesPage;
