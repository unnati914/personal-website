export const resumeKnowledge = [
  {
    topics: ['who', 'about', 'introduce', 'profile'],
    answer: 'Unnati Chhabra is an AI/GenAI Engineer with 3+ years of experience building and shipping production systems, including RAG pipelines, generative AI agents, and payment infrastructure.'
  },
  {
    topics: ['experience', 'career', 'work', 'company', 'job'],
    answer: 'Unnati is currently an AI Engineer in Generative AI at Grid Dynamics. Previously, she was a Software Engineer at Paysecure and Zomato.'
  },
  {
    topics: ['grid', 'dynamics', 'current', 'now'],
    answer: 'At Grid Dynamics, Unnati built and deployed Generative AI agents for VISA used by 200 to 300 users, an internal developer assistance tool that saves about 40 engineering hours per week, and production RAG pipelines using pgvector and OpenAI APIs with 80% retrieval accuracy. She also built a Next.js and React scenario dashboard adopted by 300 to 400 developers.'
  },
  {
    topics: ['zomato', 'ocr', 'hyperpure', 'vernacular'],
    answer: 'At Zomato, Unnati designed the Parchi Orders system for HyperPure, covering about 70% of company GMV. She also built internal OCR that reduced invoice extraction costs by more than 80%, created a GenAI bot evaluation framework, added regional language support, and automated expiry date extraction.'
  },
  {
    topics: ['paysecure', 'payment', 'backend', 'infrastructure'],
    answer: 'At Paysecure, Unnati built a Shopify payment gateway plugin with Node.js and App Proxy for 40 merchants, delivered BigCommerce and WooCommerce integrations, built a Streamlit chatbot backed by pgvector and OpenAI APIs, and developed a Redis-based cashier settings utility in Java.'
  },
  {
    topics: ['education', 'college', 'degree', 'igdtuw', 'btech'],
    answer: 'Unnati studied Information Technology at IGDTUW in Delhi and graduated with a CGPA of 8.01.'
  },
  {
    topics: ['skill', 'stack', 'technology', 'tech', 'tools', 'python', 'react', 'llm'],
    answer: 'Her technical skills include Python, Java, JavaScript, SQL, LLMs, RAG, prompt engineering, model tuning, pgvector, agentic systems, REST APIs, Redis, PostgreSQL, Node.js, React, Next.js, Streamlit, Docker, Kubernetes, and CI/CD.'
  },
  {
    topics: ['project', 'build', 'built', 'agent', 'eval'],
    answer: 'Unnati builds production AI products, agents, RAG systems, and backend infrastructure. Her current portfolio projects include Imlea, Resume Roaster, LinkGenie, Paysecure, Cart Healthifier, and Anomalyzer.'
  },
  {
    topics: ['imlea'],
    answer: 'Imlea is a learning platform Unnati is building for kids to study their school curriculum.'
  },
  {
    topics: ['experiment', 'experiments', 'dating', 'open', 'source'],
    answer: 'Unnati keeps failed experiments in the portfolio too, including an X dating idea. Her public GitHub work includes Care4ther, Hirvana Website, and OopsBot. She is also a GitHub Campus Expert, former LFX Mentee, and founder of CodXCrypt.'
  },
  {
    topics: ['oopsbot', 'excuse', 'streamlit', 'texts'],
    answer: 'OopsBot is a Streamlit app that generates believable or absurd excuses for not responding to texts, with categories for people such as a boss, friend, partner, or colleague.'
  },
  {
    topics: ['hirvana', 'website', 'typescript', 'checklist'],
    answer: 'Hirvana is a TypeScript website project with a documented GitHub code push checklist covering formatting, builds, commits, and releases.'
  },
  {
    topics: ['contact', 'email', 'hire', 'hello'],
    answer: 'You can reach Unnati at chhabraunnati234@gmail.com or through the social links in the contact section of this site.'
  }
];

export function answerFromResume(question) {
  const normalizedQuestion = question.toLowerCase();
  const privateTopics = /\b(age|old|birthday|birth date|date of birth|address|home address|where do you live|phone number|mobile number|salary|compensation|relationship|boyfriend|girlfriend|married|family|parents|religion|caste|password|private|personal life)\b/;
  if (privateTopics.test(normalizedQuestion)) {
    return 'I do not answer private or personal questions. I can help with Unnati’s public work, projects, education, skills, and professional experience.';
  }

  if (/\bimlea\b/.test(normalizedQuestion)) {
    return 'Imlea is a learning platform Unnati is building for kids to study their school curriculum.';
  }

  const words = normalizedQuestion.match(/[a-z0-9]+/g) || [];
  let best = null;
  let bestScore = 0;

  for (const entry of resumeKnowledge) {
    const score = entry.topics.reduce((total, topic) => total + (words.includes(topic) ? 1 : 0), 0);
    if (score > bestScore) {
      best = entry.answer;
      bestScore = score;
    }
  }

  return best || 'I can answer questions about Unnati’s experience, projects, education, and technical stack. Try asking about her current work or a specific project.';
}
