import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CareerForgeX Autonomous Opportunity Platform...");

  // 1. Create Default Admin & Student Users
  const adminPasswordHash = await bcrypt.hash("AdminCareerForgeX2026!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@careerforgex.com" },
    update: {},
    create: {
      email: "admin@careerforgex.com",
      passwordHash: adminPasswordHash,
      name: "CareerForgeX Administrator",
      role: "admin",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@careerforgex.com" },
    update: {},
    create: {
      email: "student@careerforgex.com",
      passwordHash: adminPasswordHash,
      name: "Aryan Sharma",
      role: "student",
    },
  });

  console.log("✓ Admin and student users initialized.");

  // 2. Register Tier-1 Official Premier Sources
  const officialSources = [
    {
      name: "IIT Bombay Summer Research Internship Portal",
      slug: "iit-bombay-research",
      url: "https://www.ircc.iitb.ac.in/IRCC-Web/Research_Internship.jsp",
      sourceType: "iit",
      tier: 1,
      adapterType: "html",
      checkFrequency: 360,
      priority: 1,
      status: "ACTIVE",
      trustStatus: "TRUSTED",
      isAutonomous: true,
    },
    {
      name: "IIT Madras Summer Fellowship Programme (SFP)",
      slug: "iit-madras-sfp",
      url: "https://sfp.iitm.ac.in/",
      sourceType: "iit",
      tier: 1,
      adapterType: "html",
      checkFrequency: 360,
      priority: 1,
      status: "ACTIVE",
      trustStatus: "TRUSTED",
      isAutonomous: true,
    },
    {
      name: "IISc Bangalore Summer Fellowship in Science & Engg",
      slug: "iisc-bangalore-summer",
      url: "https://iisc.ac.in/admissions/summer-fellowship-programme/",
      sourceType: "iisc",
      tier: 1,
      adapterType: "html",
      checkFrequency: 720,
      priority: 1,
      status: "ACTIVE",
      trustStatus: "TRUSTED",
      isAutonomous: true,
    },
    {
      name: "TIFR Visiting Students Research Programme (VSRP)",
      slug: "tifr-vsrp",
      url: "https://www.tifr.res.in/~vsrp/",
      sourceType: "research_lab",
      tier: 1,
      adapterType: "html",
      checkFrequency: 720,
      priority: 1,
      status: "ACTIVE",
      trustStatus: "TRUSTED",
      isAutonomous: true,
    },
    {
      name: "IISER Bhopal Summer Student Programme (SSWP)",
      slug: "iiser-bhopal-sswp",
      url: "https://www.iiserb.ac.in/summer_internship",
      sourceType: "iiser",
      tier: 1,
      adapterType: "html",
      checkFrequency: 720,
      priority: 2,
      status: "ACTIVE",
      trustStatus: "TRUSTED",
      isAutonomous: true,
    },
    {
      name: "Google Student Research & Engineering Careers",
      slug: "google-student-careers",
      url: "https://careers.google.com/api/v3/search/?degree_type=1",
      sourceType: "corporate",
      tier: 1,
      adapterType: "json",
      checkFrequency: 180,
      priority: 1,
      status: "ACTIVE",
      trustStatus: "TRUSTED",
      isAutonomous: true,
    },
    {
      name: "DAAD WISE (German Academic Exchange Service)",
      slug: "daad-wise",
      url: "https://www.daad.in/en/find-funding/scholarship-database/?type=wise",
      sourceType: "scholarship",
      tier: 1,
      adapterType: "html",
      checkFrequency: 1440,
      priority: 2,
      status: "ACTIVE",
      trustStatus: "TRUSTED",
      isAutonomous: true,
    },
    {
      name: "IIT Delhi Summer Undergraduate Research Award (SURA)",
      slug: "iit-delhi-sura",
      url: "https://home.iitd.ac.in/opportunities.php",
      sourceType: "iit",
      tier: 1,
      adapterType: "html",
      checkFrequency: 720,
      priority: 1,
      status: "ACTIVE",
      trustStatus: "TRUSTED",
      isAutonomous: true,
    },
    {
      name: "Prime Minister's Research Fellowship (PMRF)",
      slug: "pmrf-india",
      url: "https://www.pmrf.in/",
      sourceType: "government",
      tier: 1,
      adapterType: "html",
      checkFrequency: 1440,
      priority: 1,
      status: "ACTIVE",
      trustStatus: "TRUSTED",
      isAutonomous: true,
    },
  ];

  const sourceMap = {};
  for (const s of officialSources) {
    const created = await prisma.source.upsert({
      where: { slug: s.slug },
      update: { ...s },
      create: {
        ...s,
        lastCheckedAt: new Date(Date.now() - 3600 * 1000),
        nextCheckAt: new Date(Date.now() + s.checkFrequency * 60 * 1000),
        lastSuccessAt: new Date(),
      },
    });
    sourceMap[s.slug] = created.id;
  }
  console.log(`✓ ${officialSources.length} Premier Official Sources registered.`);

  // 3. Populate Real Structured Opportunities with Verified Details
  const initialOpportunities = [
    {
      title: "IIT Bombay Summer Research Internship 2027",
      slug: "iit-bombay-summer-research-internship-2027",
      organization: "Indian Institute of Technology Bombay",
      opportunityType: "Research",
      category: "Research",
      shortSummary: "Flagship 8-week summer research internship with IIT Bombay faculty across AI, Robotics, Nanotechnology, and Biomedical Engineering.",
      fullDescription: "The Industrial Research and Consultancy Centre (IRCC) at IIT Bombay invites applications from motivated undergraduate students for the prestigious Summer Research Internship. Interns collaborate directly with renowned faculty on active cutting-edge research projects, gain hands-on laboratory experience, and attend guest seminars.",
      eligibility: "Pre-final year students (3rd year B.Tech/B.E., 4th year Dual Degree, or 1st year M.Sc/M.Tech) with top 10% class ranking or minimum 8.0/10 CGPA.",
      degreeRequirements: JSON.stringify(["B.Tech / B.E.", "Dual Degree (B.Tech + M.Tech)", "BS-MS", "M.Sc / MS"]),
      yearRequirements: JSON.stringify(["3rd Year", "4th Year"]),
      branchRequirements: JSON.stringify(["Computer Science & IT", "Electrical & Electronics", "Mechanical Engineering", "Biotechnology", "Chemical & Materials"]),
      domain: "Computer Science / AI",
      skills: JSON.stringify(["Python", "Machine Learning", "Research Methodology", "MATLAB"]),
      location: "Powai, Mumbai, Maharashtra, India",
      mode: "On-site",
      duration: "8 Weeks (May – July)",
      stipend: "₹15,000 / month + Free On-Campus Hostel Accommodation",
      isPaid: true,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // in 14 days
      applicationProcess: "Submit online application through IIT Bombay IRCC portal along with Statement of Purpose (SOP) and letter of recommendation.",
      applicationUrl: "https://www.ircc.iitb.ac.in/IRCC-Web/Research_Internship.jsp",
      sourceUrl: "https://www.ircc.iitb.ac.in/IRCC-Web/Research_Internship.jsp",
      originalSourceUrl: "https://www.ircc.iitb.ac.in/IRCC-Web/Research_Internship.jsp",
      confidenceScore: 98,
      status: "PUBLISHED",
      isVerified: true,
      isFeatured: true,
      sourceId: sourceMap["iit-bombay-research"],
    },
    {
      title: "IIT Madras Summer Fellowship Programme (SFP) 2027",
      slug: "iit-madras-summer-fellowship-programme-sfp-2027",
      organization: "Indian Institute of Technology Madras",
      opportunityType: "Fellowship",
      category: "Fellowship",
      shortSummary: "Two-month summer fellowship designed to spark interest in academic research and innovation among high-achieving undergraduate students.",
      fullDescription: "IIT Madras conducts the Summer Fellowship Programme spanning two months for students from recognized Indian engineering institutes outside IITs. Fellows execute independent research under the supervision of IIT Madras faculty and present findings at a poster symposium.",
      eligibility: "Candidates pursuing 3rd year B.E./B.Tech/B.Sc.(Engg) or 3rd/4th year Integrated M.E./M.Tech with outstanding academic records.",
      degreeRequirements: JSON.stringify(["B.Tech / B.E.", "BS-MS", "Dual Degree (B.Tech + M.Tech)"]),
      yearRequirements: JSON.stringify(["3rd Year"]),
      branchRequirements: JSON.stringify(["All Engineering and Science Disciplines"]),
      domain: "Electronics & VLSI",
      skills: JSON.stringify(["Embedded Systems", "Signal Processing", "Data Analysis", "Research Writing"]),
      location: "Chennai, Tamil Nadu, India",
      mode: "On-site",
      duration: "2 Months",
      stipend: "₹6,000 / month + Subsidized Campus Housing",
      isPaid: true,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days (CLOSING SOON)
      applicationProcess: "Online portal submission with academic transcripts, bona fide certificate, and 1-page research project interest.",
      applicationUrl: "https://sfp.iitm.ac.in/apply",
      sourceUrl: "https://sfp.iitm.ac.in/",
      originalSourceUrl: "https://sfp.iitm.ac.in/",
      confidenceScore: 96,
      status: "PUBLISHED",
      isVerified: true,
      isFeatured: true,
      sourceId: sourceMap["iit-madras-sfp"],
    },
    {
      title: "IISc Bangalore Summer Fellowship in Science & Engineering",
      slug: "iisc-bangalore-summer-fellowship-2027",
      organization: "Indian Institute of Science Bangalore",
      opportunityType: "Research",
      category: "Research",
      shortSummary: "Premier national summer research programme at India's top-ranked research institution for SC/ST and general merit students.",
      fullDescription: "IISc Bangalore invites applications for the prestigious Summer Fellowship Programme in Science and Engineering. Selected students work in state-of-the-art facilities across Physics, Quantum Computing, Material Sciences, and AI.",
      eligibility: "Students studying 1st year M.Sc in Science or 3rd year B.E./B.Tech in relevant disciplines.",
      degreeRequirements: JSON.stringify(["B.Tech / B.E.", "M.Sc / MS", "BS-MS"]),
      yearRequirements: JSON.stringify(["3rd Year", "Enrolled Master's"]),
      branchRequirements: JSON.stringify(["Computer Science & IT", "Physics", "Chemistry", "Mathematics", "Electrical Engineering"]),
      domain: "Physics & Quantum Sciences",
      skills: JSON.stringify(["Quantum Computing", "Python", "Mathematical Modeling", "Lab Instrumentation"]),
      location: "Bengaluru, Karnataka, India",
      mode: "On-site",
      duration: "1 Month (June)",
      stipend: "₹5,000 / month + Round-trip Train Travel Reimbursement + Free Accommodation",
      isPaid: true,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // in 21 days
      applicationProcess: "Apply via IISc Admissions portal with official recommendation letter from the Head of the Institution.",
      applicationUrl: "https://iisc.ac.in/admissions/summer-fellowship-programme/",
      sourceUrl: "https://iisc.ac.in/admissions/summer-fellowship-programme/",
      originalSourceUrl: "https://iisc.ac.in/admissions/summer-fellowship-programme/",
      confidenceScore: 95,
      status: "PUBLISHED",
      isVerified: true,
      isFeatured: true,
      sourceId: sourceMap["iisc-bangalore-summer"],
    },
    {
      title: "TIFR Visiting Students Research Programme (VSRP) 2027",
      slug: "tifr-visiting-students-research-programme-vsrp-2027",
      organization: "Tata Institute of Fundamental Research",
      opportunityType: "Research Project",
      category: "Research Project",
      shortSummary: "National immersion programme for exceptional science and engineering students in fundamental physics, chemistry, biology, and theoretical computer science.",
      fullDescription: "TIFR conducts VSRP annually at its main Mumbai campus and national centres (NCBS Bengaluru, TCIS Hyderabad). Students participate in advanced theoretical and experimental research projects under world-class scientists.",
      eligibility: "Students in 2nd or 3rd year of B.Sc/B.Tech or 1st year M.Sc.",
      degreeRequirements: JSON.stringify(["B.Tech / B.E.", "BS-MS", "M.Sc / MS"]),
      yearRequirements: JSON.stringify(["2nd Year", "3rd Year", "Enrolled Master's"]),
      branchRequirements: JSON.stringify(["Computer Science", "Physics", "Mathematics", "Biology", "Chemistry"]),
      domain: "Computer Science / AI",
      skills: JSON.stringify(["Algorithms", "Theoretical Computer Science", "Discrete Math", "Python"]),
      location: "Mumbai / Bengaluru / Hyderabad, India",
      mode: "On-site",
      duration: "7 Weeks",
      stipend: "₹7,000 / month + Travel Allowance + Hostel Stay",
      isPaid: true,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
      applicationProcess: "Online application submission with project preferences, write-up of academic interests, and two referee contacts.",
      applicationUrl: "https://www.tifr.res.in/~vsrp/",
      sourceUrl: "https://www.tifr.res.in/~vsrp/",
      originalSourceUrl: "https://www.tifr.res.in/~vsrp/",
      confidenceScore: 97,
      status: "PUBLISHED",
      isVerified: true,
      isFeatured: true,
      sourceId: sourceMap["tifr-vsrp"],
    },
    {
      title: "Google Software Engineering Student Internship (Summer 2027)",
      slug: "google-software-engineering-student-internship-summer-2027",
      organization: "Google India",
      opportunityType: "Internship",
      category: "Internship",
      shortSummary: "Full-time 10-12 week paid software engineering internship working on planetary-scale systems, Android, Cloud, or Gemini AI.",
      fullDescription: "Join Google as a Software Engineering Intern to tackle real-world distributed systems, machine learning pipelines, or developer platform problems. Interns receive 1:1 mentorship from senior engineers, code review feedback, and direct full-time return offer consideration.",
      eligibility: "Currently enrolled in an undergraduate or graduate degree program in Computer Science, Computer Engineering, or related technical field graduating in late 2027 or 2028.",
      degreeRequirements: JSON.stringify(["B.Tech / B.E.", "Dual Degree (B.Tech + M.Tech)", "M.Tech / M.E.", "MCA"]),
      yearRequirements: JSON.stringify(["3rd Year", "Enrolled Master's"]),
      branchRequirements: JSON.stringify(["Computer Science & IT", "Electrical & Electronics"]),
      domain: "Computer Science / AI",
      skills: JSON.stringify(["C++", "Java", "Python", "Data Structures", "Algorithms", "Distributed Systems"]),
      location: "Bengaluru / Hyderabad, India",
      mode: "Hybrid",
      duration: "10-12 Weeks",
      stipend: "₹1,15,000 / month + Corporate Housing & Relocation Allowance",
      isPaid: true,
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // in 28 days
      applicationProcess: "Direct application via Google Careers with ATS-friendly resume and un-official transcript.",
      applicationUrl: "https://careers.google.com/jobs/results/",
      sourceUrl: "https://careers.google.com/api/v3/search/?degree_type=1",
      originalSourceUrl: "https://careers.google.com/jobs/results/",
      confidenceScore: 99,
      status: "PUBLISHED",
      isVerified: true,
      isFeatured: true,
      sourceId: sourceMap["google-student-careers"],
    },
    {
      title: "DAAD WISE Working Internships in Science & Engineering (Germany)",
      slug: "daad-wise-working-internships-science-engineering-germany",
      organization: "German Academic Exchange Service (DAAD)",
      opportunityType: "Scholarship",
      category: "Scholarship",
      shortSummary: "Prestigious fully funded scholarship for Indian students to pursue 2-3 month research internships at public German universities and research labs (Max Planck, Fraunhofer).",
      fullDescription: "DAAD WISE enables students of engineering, mathematics, and natural sciences from selected Indian higher education institutions to carry out a research internship under the supervision of a German university professor or scientist.",
      eligibility: "5th or 6th semester students of 4-year Bachelor programmes or 5th to 8th semester of 5-year Dual Degree programmes. Aggregate minimum CGPA of 8.5/10.",
      degreeRequirements: JSON.stringify(["B.Tech / B.E.", "BS-MS", "Dual Degree (B.Tech + M.Tech)"]),
      yearRequirements: JSON.stringify(["3rd Year", "4th Year"]),
      branchRequirements: JSON.stringify(["All Engineering, Natural Sciences & Mathematics"]),
      domain: "Mechanical & Aerospace",
      skills: JSON.stringify(["Research Writing", "Lab Experience", "German (optional)"]),
      location: "Berlin / Munich / Aachen / Stuttgart, Germany",
      mode: "On-site",
      duration: "2 to 3 Months",
      stipend: "€934 / month + €1,075 Travel Subsidy + Health Insurance",
      isPaid: true,
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // in 35 days
      applicationProcess: "Obtain invitation letter from host German professor, submit DAAD portal application with CV and SOP.",
      applicationUrl: "https://www.daad.in/en/find-funding/scholarship-database/?type=wise",
      sourceUrl: "https://www.daad.in/en/find-funding/scholarship-database/?type=wise",
      originalSourceUrl: "https://www.daad.in/en/find-funding/scholarship-database/?type=wise",
      confidenceScore: 98,
      status: "PUBLISHED",
      isVerified: true,
      isFeatured: true,
      sourceId: sourceMap["daad-wise"],
    },
    {
      title: "Prime Minister's Research Fellowship (PMRF) Direct PhD",
      slug: "prime-ministers-research-fellowship-pmrf-direct-phd",
      organization: "Ministry of Education, Government of India",
      opportunityType: "PhD",
      category: "PhD",
      shortSummary: "India's highest doctoral fellowship offering ₹70,000–₹80,000 monthly stipend plus ₹2,00,000 annual research grant for PhD scholars at IITs/IISc.",
      fullDescription: "The PMRF scheme has been designed for improving the quality of research in higher educational institutions in the country. With attractive fellowships, the scheme seeks to attract the best talent into research in contemporary science and technology.",
      eligibility: "Completed or in final year of B.Tech/Integrated M.Tech/M.Sc from IISc/IITs/NITs/IISERs with CGPA >= 8.0 or from other UGC/AICTE recognized institutions with CGPA >= 8.0 and qualifying GATE score.",
      degreeRequirements: JSON.stringify(["B.Tech / B.E.", "Dual Degree (B.Tech + M.Tech)", "M.Sc / MS", "M.Tech / M.E."]),
      yearRequirements: JSON.stringify(["Final Year", "Recent Graduate"]),
      branchRequirements: JSON.stringify(["All Engineering, Science & Technology Disciplines"]),
      domain: "Computer Science / AI",
      skills: JSON.stringify(["Original Research", "Scientific Writing", "Deep Domain Knowledge"]),
      location: "Participating IITs, IISc, IISERs across India",
      mode: "On-site",
      duration: "4 to 5 Years (Doctoral)",
      stipend: "₹70,000 – ₹80,000 / month + ₹2 Lakh/year Contingency Grant",
      isPaid: true,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // in 45 days
      applicationProcess: "Apply through PMRF portal or through direct institutional nomination during PhD admission.",
      applicationUrl: "https://www.pmrf.in/",
      sourceUrl: "https://www.pmrf.in/",
      originalSourceUrl: "https://www.pmrf.in/",
      confidenceScore: 99,
      status: "PUBLISHED",
      isVerified: true,
      isFeatured: true,
      sourceId: sourceMap["pmrf-india"],
    },
    {
      title: "IISER Bhopal Summer Student Programme (SSWP) in Sciences",
      slug: "iiser-bhopal-summer-student-programme-sswp-in-sciences",
      organization: "IISER Bhopal",
      opportunityType: "Research",
      category: "Research",
      shortSummary: "8-week residential summer research program across Biological Sciences, Chemical Sciences, Earth & Environmental Sciences, and Data Science.",
      fullDescription: "IISER Bhopal invites applications from bright undergraduate and postgraduate students for its Summer Student Programme. Participants carry out investigative projects under faculty guidance in well-equipped modern research laboratories.",
      eligibility: "Students having completed at least 2 years of B.Sc/B.Tech/BS-MS or 1st year of M.Sc.",
      degreeRequirements: JSON.stringify(["BS-MS", "B.Tech / B.E.", "M.Sc / MS"]),
      yearRequirements: JSON.stringify(["2nd Year", "3rd Year", "Enrolled Master's"]),
      branchRequirements: JSON.stringify(["Biotechnology", "Chemistry", "Physics", "Data Science", "Earth Sciences"]),
      domain: "Biotechnology & Bioinformatics",
      skills: JSON.stringify(["Molecular Biology", "Data Analysis", "Python", "Microscopy"]),
      location: "Bhopal, Madhya Pradesh, India",
      mode: "On-site",
      duration: "8 Weeks",
      stipend: "₹10,000 total stipend + Subsidized Hostel Room",
      isPaid: true,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // in 10 days
      applicationProcess: "Register online on IISER Bhopal portal with grade sheets, CV, and statement of research purpose.",
      applicationUrl: "https://www.iiserb.ac.in/summer_internship",
      sourceUrl: "https://www.iiserb.ac.in/summer_internship",
      originalSourceUrl: "https://www.iiserb.ac.in/summer_internship",
      confidenceScore: 94,
      status: "PUBLISHED",
      isVerified: true,
      isFeatured: false,
      sourceId: sourceMap["iiser-bhopal-sswp"],
    },
  ];

  for (const opp of initialOpportunities) {
    const created = await prisma.opportunity.upsert({
      where: { slug: opp.slug },
      update: { ...opp },
      create: {
        ...opp,
        viewCount: Math.floor(Math.random() * 300) + 50,
        saveCount: Math.floor(Math.random() * 40) + 5,
      },
    });

    // Seed change log sample to demonstrate automatic update audit trail
    await prisma.opportunityChangeLog.create({
      data: {
        opportunityId: created.id,
        fieldName: "initial_indexing",
        oldValue: null,
        newValue: "PUBLISHED",
        reason: "Autonomous indexing and verification from premier institutional portal",
        actorType: "SYSTEM",
        source: opp.organization,
      },
    });
  }

  console.log(`✓ ${initialOpportunities.length} Initial Premier Opportunities seeded with full metadata & audit logs.`);

  // 4. Seed Discovered Sources (Demonstrating Self-Discovery Registry)
  const discoveredSeed = [
    { url: "https://www.iitk.ac.in/doaa/surge", name: "IIT Kanpur SURGE Portal", domain: "iitk.ac.in", institutionType: "iit", trustTier: 1 },
    { url: "https://www.iitr.ac.in/careers", name: "IIT Roorkee Project Positions", domain: "iitr.ac.in", institutionType: "iit", trustTier: 1 },
    { url: "https://www.iitkgp.ac.in/temporary-jobs", name: "IIT Kharagpur Project Assistants", domain: "iitkgp.ac.in", institutionType: "iit", trustTier: 1 },
    { url: "https://www.isro.gov.in/Careers.html", name: "ISRO Live Recruitment & Student Projects", domain: "isro.gov.in", institutionType: "government", trustTier: 1 },
    { url: "https://www.cern.ch/jobs/students", name: "CERN Summer Student Programme", domain: "cern.ch", institutionType: "foreign_univ", trustTier: 2 },
  ];

  for (const disc of discoveredSeed) {
    await prisma.discoveredSource.upsert({
      where: { url: disc.url },
      update: {},
      create: {
        url: disc.url,
        name: disc.name,
        domain: disc.domain,
        institutionType: disc.institutionType,
        trustTier: disc.trustTier,
        discoveredVia: "institutional_directory",
        status: "DISCOVERED",
        validationNotes: "Discovered Premier Institution ready for automated adapter assignment",
      },
    });
  }
  console.log(`✓ ${discoveredSeed.length} Discovered Sources seeded into registry.`);

  // 5. Initialize System Metrics and Heartbeat
  await prisma.systemMetric.upsert({
    where: { key: "last_worker_heartbeat" },
    update: { value: new Date().toISOString() },
    create: { key: "last_worker_heartbeat", value: new Date().toISOString() },
  });

  await prisma.systemMetric.upsert({
    where: { key: "pipeline_paused" },
    update: { value: "false" },
    create: { key: "pipeline_paused", value: "false" },
  });

  // Student Alert Preference & Initial Notification
  await prisma.userAlertPreference.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      opportunityTypes: JSON.stringify(["Research", "Internship", "Fellowship"]),
      domains: JSON.stringify(["Computer Science / AI", "Electronics & VLSI"]),
      inAppAlerts: true,
      emailAlerts: false,
    },
  });

  console.log("✅ CareerForgeX autonomous platform seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
