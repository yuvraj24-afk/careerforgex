# Contributing to CareerForgeX

Thank you for your interest in contributing to CareerForgeX! We welcome contributions to improve our autonomous opportunity discovery platform, expand source adapters, enhance duplicate detection algorithms, and improve student interfaces.

---

## 1. Development Workflow

### Step 1: Fork and Clone
```bash
git clone https://github.com/[YOUR_USERNAME]/careerforgex.git
cd careerforgex
```

### Step 2: Create a Feature Branch
```bash
git checkout -b feature/my-new-feature
```

### Step 3: Install Dependencies & Setup Environment
```bash
npm install
cp .env.example .env.local
npm run prisma:push
npm run prisma:generate
npm run prisma:seed
```

### Step 4: Run Locally
```bash
# Start frontend web server
npm run dev

# In a separate terminal, test the worker in one-shot mode
npm run worker:once
```

---

## 2. Testing & Quality Checks

Before submitting a Pull Request, all tests and linters must pass cleanly:

```bash
# Run unit & pipeline integration tests
npm run test

# Run ESLint check
npm run lint

# Run TypeScript type check
npx tsc --noEmit

# Run production build check
npm run build
```

---

## 3. Pull Request Guidelines

1. **Commit Messages**: Write concise, descriptive commit messages (e.g. `feat: add IIT Kanpur SURGE adapter`, `fix: handle null stipend parsing`).
2. **Zero-Hallucination Policy**: If modifying parsers or extractors, ensure data is never fabricated. Missing fields must remain `null`.
3. **Secrets Hygiene**: Double check that no personal API keys, passwords, or `.env` files are included in the git commit diff.
4. **Documentation**: If adding a new source adapter or API route, update `SOURCE_ADAPTER_GUIDE.md` and `docs/API.md`.
