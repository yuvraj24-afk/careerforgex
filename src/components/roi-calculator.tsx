"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, RotateCcw, Clock, DollarSign, Users, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function ROICalculator() {
  const [employees, setEmployees] = useState<number>(4);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(12);
  const [hourlyCost, setHourlyCost] = useState<number>(55);
  const [weeksPerYear, setWeeksPerYear] = useState<number>(50);
  const [automationPct, setAutomationPct] = useState<number>(70);

  // Computed metrics
  const totalAnnualHours = employees * hoursPerWeek * weeksPerYear;
  const currentAnnualCost = totalAnnualHours * hourlyCost;
  const automatedHours = Math.round(totalAnnualHours * (automationPct / 100));
  const recoveredCapacityCost = Math.round(currentAnnualCost * (automationPct / 100));
  const weeklyHoursSaved = Math.round(employees * hoursPerWeek * (automationPct / 100));

  const handleReset = () => {
    setEmployees(4);
    setHoursPerWeek(12);
    setHourlyCost(55);
    setWeeksPerYear(50);
    setAutomationPct(70);
  };

  const handleCalculate = () => {
    trackEvent("roi_calculated", {
      employees,
      hoursPerWeek,
      hourlyCost,
      recoveredCapacityCost,
    });
  };

  return (
    <div className="rounded-2xl bg-dark-card/90 border border-dark-border p-6 lg:p-10 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-dark-border">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-brand-400 mb-1">
            <Calculator className="w-3.5 h-3.5" />
            <span>LABOR CAPACITY & ROI ESTIMATOR</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Estimate Recoverable Team Capacity
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Adjust the sliders below to calculate hours and capital reclaimed by deploying intelligent automations.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-elevated text-xs text-gray-400 hover:text-white border border-dark-border transition-colors self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders Input Area */}
        <div className="lg:col-span-7 space-y-6">
          {/* Input 1: Employees */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-gray-300">Employees Performing Repetitive Tasks</span>
              <span className="font-mono text-brand-400 font-bold">{employees} team members</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={employees}
              onChange={(e) => {
                setEmployees(Number(e.target.value));
                handleCalculate();
              }}
              className="w-full accent-brand-500 cursor-pointer h-2 bg-dark-elevated rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>1</span>
              <span>25</span>
              <span>50+</span>
            </div>
          </div>

          {/* Input 2: Hours/Week */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-gray-300">Repetitive Hours Spent Per Employee / Week</span>
              <span className="font-mono text-brand-400 font-bold">{hoursPerWeek} hrs/week</span>
            </div>
            <input
              type="range"
              min="2"
              max="35"
              value={hoursPerWeek}
              onChange={(e) => {
                setHoursPerWeek(Number(e.target.value));
                handleCalculate();
              }}
              className="w-full accent-brand-500 cursor-pointer h-2 bg-dark-elevated rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>2 hrs</span>
              <span>15 hrs</span>
              <span>35 hrs</span>
            </div>
          </div>

          {/* Input 3: Hourly Cost */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-gray-300">Average Blended Hourly Compensation (Loaded)</span>
              <span className="font-mono text-brand-400 font-bold">${hourlyCost} / hour</span>
            </div>
            <input
              type="range"
              min="25"
              max="200"
              step="5"
              value={hourlyCost}
              onChange={(e) => {
                setHourlyCost(Number(e.target.value));
                handleCalculate();
              }}
              className="w-full accent-brand-500 cursor-pointer h-2 bg-dark-elevated rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>$25/hr</span>
              <span>$100/hr</span>
              <span>$200/hr</span>
            </div>
          </div>

          {/* Input 4: Target Automation % */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-gray-300">Target Automation Percentage</span>
              <span className="font-mono text-emerald-400 font-bold">{automationPct}% automated</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={automationPct}
              onChange={(e) => {
                setAutomationPct(Number(e.target.value));
                handleCalculate();
              }}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-dark-elevated rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>20% (Assisted)</span>
              <span>60% (Typical)</span>
              <span>90% (Autonomous)</span>
            </div>
          </div>
        </div>

        {/* Output Metrics Card */}
        <div className="lg:col-span-5 rounded-xl bg-dark-elevated border border-brand-500/30 p-6 space-y-6">
          <div>
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
              Estimated Annual Labor Capacity Recovered
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">
              ${recoveredCapacityCost.toLocaleString()}
              <span className="text-sm font-normal text-gray-400 ml-1">/ year</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-border">
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase">Hours Reclaimed</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">
                {automatedHours.toLocaleString()} <span className="text-xs text-gray-400 font-normal">hrs/yr</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase">Weekly Hours Saved</span>
              <div className="text-xl font-bold text-brand-400 mt-0.5">
                {weeklyHoursSaved} <span className="text-xs text-gray-400 font-normal">hrs/week</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-gray-400 leading-relaxed border-t border-dark-border">
            <span className="font-semibold text-gray-300">Important Disclaimer:</span> This calculation is an estimate
            based on input parameters, not a guaranteed financial outcome. Results vary by workflow complexity, tool APIs, and team adoption.
          </div>

          <Link
            href="/book"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-brand-600/30 transition-all"
          >
            <span>Book a Free Automation Audit</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
