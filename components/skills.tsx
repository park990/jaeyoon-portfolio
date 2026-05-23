"use client";

import { motion, type Variants } from "framer-motion";

// 카테고리 데이터. 추후 추가/수정이 잦을 가능성 있어서 상수로 분리.
const categories: { title: string; items: string[] }[] = [
  {
    title: "Languages",
    items: ["Python", "TypeScript", "Java", "Dart", "SQL"],
  },
  {
    title: "AI / NLP",
    items: [
      "PyTorch",
      "HuggingFace Transformers",
      "LoRA",
      "RAG",
      "LangChain",
      "OpenAI API",
      "Pydantic",
    ],
  },
  {
    title: "Backend",
    items: ["FastAPI", "Spring Boot", "JPA", "WebSocket (STOMP)", "JWT", "OAuth 2.0"],
  },
  {
    title: "Frontend",
    items: ["Next.js", "React", "Flutter", "Riverpod", "Tailwind CSS"],
  },
  {
    title: "Database",
    items: ["PostgreSQL", "pgvector", "MySQL", "Redis", "ChromaDB"],
  },
  {
    title: "DevOps / Infra",
    items: ["Docker", "Docker Compose", "AWS (EC2, S3)", "GitHub Actions", "nginx", "pm2"],
  },
  {
    title: "Tools",
    items: ["Git", "Linux", "VS Code", "Colab", "DBeaver"],
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col gap-10"
      >
        <motion.h2
          variants={item}
          className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          Skills
        </motion.h2>

        {/* 카테고리 그리드: 모바일 1열, sm 2열. 7개라 마지막 행은 1개일 수 있음 */}
        <motion.div
          variants={container}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.title}
              variants={item}
              className="rounded-xl border border-border bg-card p-5 sm:p-6"
            >
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs text-secondary-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
