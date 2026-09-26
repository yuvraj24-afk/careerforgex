import { OpportunityMode, OpportunityType } from "@/types/opportunity";

export interface ClassificationResult {
  opportunityType: OpportunityType;
  category: string;
  domain: string;
  degreeRequirements: string[];
  yearRequirements: string[];
  branchRequirements: string[];
  skills: string[];
  mode: OpportunityMode;
  isPaid: boolean;
}

export class OpportunityClassifier {
  public static readonly DOMAINS = [
    "Computer Science / AI",
    "Data Science & Analytics",
    "Electronics & VLSI",
    "Mechanical & Aerospace",
    "Biotechnology & Bioinformatics",
    "Chemical & Materials",
    "Civil & Environmental",
    "Physics & Quantum Sciences",
    "Mathematics & Statistics",
    "Economics & Finance",
    "Design & Product",
    "Humanities & Social Sciences",
  ] as const;

  public static readonly DEGREES = [
    "B.Tech / B.E.",
    "Dual Degree (B.Tech + M.Tech)",
    "BS-MS",
    "M.Tech / M.E.",
    "M.Sc / MS",
    "MCA",
    "PhD",
    "Post-Doctoral",
    "Any Degree",
  ] as const;

  public static readonly YEARS = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "Graduating / Final Year",
    "Recent Graduate",
    "Enrolled Master's",
    "Enrolled PhD",
  ] as const;

  /**
   * Classifies an opportunity from its title, description, and metadata
   */
  public static classify(
    title: string,
    content: string,
    existingMeta?: Partial<ClassificationResult>
  ): ClassificationResult {
    const combined = `${title} ${content}`.toLowerCase();

    // 1. Determine Opportunity Type
    let opportunityType: OpportunityType = "Internship";

    if (/ph\.?d|doctoral\s+admission|doctoral\s+position|direct\s+phd/i.test(combined)) {
      opportunityType = "PhD";
    } else if (/scholarship|merit\s+scholarship|financial\s+aid/i.test(combined)) {
      opportunityType = "Scholarship";
    } else if (/fellowship|postdoc|visiting\s+fellow/i.test(combined)) {
      opportunityType = "Fellowship";
    } else if (/hackathon|competition|contest|challenge|grand\s+challenge/i.test(combined)) {
      opportunityType = "Competition";
    } else if (/conference|symposium|colloquium|call\s+for\s+papers/i.test(combined)) {
      opportunityType = "Conference";
    } else if (/workshop|bootcamp|summer\s+school|winter\s+school/i.test(combined)) {
      opportunityType = "Workshop";
    } else if (/project\s+assistant|project\s+associate|junior\s+research\s+fellow|jrf|srf/i.test(combined)) {
      opportunityType = "Research Project";
    } else if (/research\s+intern|summer\s+research|winter\s+research|academic\s+intern|surge|vsrp/i.test(combined)) {
      opportunityType = "Research";
    } else if (/full[- ]time|software\s+engineer|associate\s+consultant|graduate\s+trainee|sde/i.test(combined) && !/intern/i.test(combined)) {
      opportunityType = "Job";
    } else if (/ms\s+admission|master's\s+admission|higher\s+study/i.test(combined)) {
      opportunityType = "Higher Education";
    } else if (/intern|summer\s+trainee|winter\s+trainee|internship/i.test(combined)) {
      opportunityType = "Internship";
    }

    // 2. Classify Domain
    let domain = "Computer Science / AI";
    if (/(ai|machine learning|deep learning|computer science|software|nlp|cyber|web dev|cloud|backend|frontend)/i.test(combined)) {
      domain = "Computer Science / AI";
    } else if (/(data science|analytics|statistics|big data|business intelligence)/i.test(combined)) {
      domain = "Data Science & Analytics";
    } else if (/(vlsi|embedded|electronics|hardware|semiconductor|circuits|signal processing)/i.test(combined)) {
      domain = "Electronics & VLSI";
    } else if (/(mechanical|aerospace|fluid|thermal|automobile|robotics|cad|ansys)/i.test(combined)) {
      domain = "Mechanical & Aerospace";
    } else if (/(biotech|biology|genomics|bioinformatics|life sciences|molecular|immunology)/i.test(combined)) {
      domain = "Biotechnology & Bioinformatics";
    } else if (/(chemical|chemistry|materials|polymers|nanotechnology|metallurgy)/i.test(combined)) {
      domain = "Chemical & Materials";
    } else if (/(civil|structural|environmental|transportation|hydrology)/i.test(combined)) {
      domain = "Civil & Environmental";
    } else if (/(physics|quantum|optics|astrophysics|condensed matter)/i.test(combined)) {
      domain = "Physics & Quantum Sciences";
    } else if (/(mathematics|pure math|applied math|cryptography)/i.test(combined)) {
      domain = "Mathematics & Statistics";
    } else if (/(finance|economics|management|operations|consulting)/i.test(combined)) {
      domain = "Economics & Finance";
    } else if (/(design|ui\/ux|graphic|product design)/i.test(combined)) {
      domain = "Design & Product";
    }

    // 3. Classify Mode (Remote / On-site / Hybrid)
    let mode: OpportunityMode = "On-site";
    if (/remote|work\s+from\s+home|virtual|online\s+internship/i.test(combined)) {
      mode = "Remote";
    } else if (/hybrid|flexible\s+location/i.test(combined)) {
      mode = "Hybrid";
    }

    // 4. Classify Paid / Unpaid
    const isPaid =
      /(?:stipend|salary|remuneration|financial\s+support|per\s+month|₹|inr|\$|eur|paid\s+internship)/i.test(
        combined
      ) && !/unpaid/i.test(combined);

    // 5. Extract Degree Requirements
    const degreeRequirements: string[] = [];
    if (/b\.?tech|b\.?e\.?/i.test(combined)) degreeRequirements.push("B.Tech / B.E.");
    if (/dual\s+degree/i.test(combined)) degreeRequirements.push("Dual Degree (B.Tech + M.Tech)");
    if (/bs[- ]ms|integrated\s+m\.?sc/i.test(combined)) degreeRequirements.push("BS-MS");
    if (/m\.?tech|m\.?e\.?/i.test(combined)) degreeRequirements.push("M.Tech / M.E.");
    if (/m\.?sc|master\s+of\s+science/i.test(combined)) degreeRequirements.push("M.Sc / MS");
    if (/ph\.?d|doctoral/i.test(combined)) degreeRequirements.push("PhD");
    if (degreeRequirements.length === 0) degreeRequirements.push("Any Degree");

    // 6. Extract Academic Year
    const yearRequirements: string[] = [];
    if (/1st\s+year|first\s+year/i.test(combined)) yearRequirements.push("1st Year");
    if (/2nd\s+year|second\s+year/i.test(combined)) yearRequirements.push("2nd Year");
    if (/3rd\s+year|third\s+year|pre[- ]final\s+year/i.test(combined)) yearRequirements.push("3rd Year");
    if (/4th\s+year|fourth\s+year|final\s+year/i.test(combined)) yearRequirements.push("4th Year");
    if (yearRequirements.length === 0) yearRequirements.push("Any Year");

    // 7. Extract Branch
    const branchRequirements: string[] = [];
    if (/cse|computer\s+science|information\s+technology/i.test(combined)) branchRequirements.push("Computer Science & IT");
    if (/ece|electrical|electronics/i.test(combined)) branchRequirements.push("Electrical & Electronics");
    if (/mechanical/i.test(combined)) branchRequirements.push("Mechanical Engineering");
    if (/biotech/i.test(combined)) branchRequirements.push("Biotechnology");
    if (/civil/i.test(combined)) branchRequirements.push("Civil Engineering");
    if (branchRequirements.length === 0) branchRequirements.push("Open to all relevant branches");

    // 8. Extract Skills
    const knownSkills = [
      "Python", "C++", "Java", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
      "React", "Node.js", "SQL", "MATLAB", "Data Analysis", "Research Writing", "Linux",
      "CAD", "ANSYS", "ROS", "Bioinformatics", "Microscopy", "Quantum Computing"
    ];
    const skills = knownSkills.filter((s) => new RegExp(`\\b${s.replace("+", "\\+")}\\b`, "i").test(combined));

    return {
      opportunityType: existingMeta?.opportunityType || opportunityType,
      category: opportunityType,
      domain: existingMeta?.domain || domain,
      degreeRequirements: existingMeta?.degreeRequirements?.length ? existingMeta.degreeRequirements : degreeRequirements,
      yearRequirements: existingMeta?.yearRequirements?.length ? existingMeta.yearRequirements : yearRequirements,
      branchRequirements: existingMeta?.branchRequirements?.length ? existingMeta.branchRequirements : branchRequirements,
      skills: existingMeta?.skills?.length ? existingMeta.skills : skills,
      mode: existingMeta?.mode || mode,
      isPaid: existingMeta?.isPaid !== undefined ? existingMeta.isPaid : isPaid,
    };
  }
}
