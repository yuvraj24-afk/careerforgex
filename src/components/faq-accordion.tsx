"use client";

import { useState } from "react";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import { FAQItemData } from "@/data/faqs";

interface FAQAccordionProps {
  items: FAQItemData[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ "faq-1": true });

  const categories = ["All", "General", "Technical", "Security", "Process", "Pricing"];

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = items.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      search.trim() === "" ||
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-card border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-brand-600 text-white"
                  : "bg-dark-card border border-dark-border text-gray-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-dark-card border border-dark-border text-xs text-gray-500">
            No matching questions found for "{search}". Try searching for terms like "security", "agent", or "CRM".
          </div>
        ) : (
          filtered.map((item) => {
            const isOpen = !!openIds[item.id];
            return (
              <div
                key={item.id}
                className="rounded-xl bg-dark-card/90 border border-dark-border overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-dark-elevated/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-bg border border-dark-border text-brand-400">
                      {item.category}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-300 leading-relaxed border-t border-dark-border/40 animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
