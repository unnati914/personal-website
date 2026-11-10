// Featured work. Each card has a picture (img) or a big number (big + small), a one-line result, and a link.
const x=id=>`https://x.com/Unnati_twts/status/${id}`;

export const featured=[
 {name:'Imlea',tag:'building now',img:'/work/imlea.jpg',
  desc:'A learning app for school kids. Not a chatbot wrapper: it remembers context, adapts the learning path, answers from the curriculum and has guardrails.',
  result:'Open for testing · built with Muskan Chhabra',url:x('2118330495675380202'),cta:'see the launch post'},
 {name:'Demo-first pitches',tag:'GTM · AI',img:'/work/demos.jpg',
  desc:'Instead of a cover letter, I build a working demo of what I would ship for a team. So far: Wavelength, Emergent, Agnost and Prodigal.',
  result:'12.9K views on the Wavelength demo',url:x('2113642488779198956'),cta:'watch a demo'},
 {name:'GenAI agents for VISA',tag:'Grid Dynamics',big:'200–300',small:'people using the agent',
  desc:'Production generative AI agents for VISA, plus RAG pipelines on pgvector with 80% retrieval accuracy and a dev tool that saves about 40 hours a week.',
  result:'80% retrieval accuracy · 40 hours saved weekly',caseStudy:'Grid Dynamics',cta:'read the case study'},
 {name:'Hirvana',tag:'founder',big:'3',small:'paid cohorts run',
  desc:'My AI career platform: resume tailoring, an AI job-hunting agent and paid mentorship cohorts. I built it and ran the launch on X.',
  result:'Launched end to end: teaser, pricing, giveaway, product',url:x('1919088356442656787'),cta:'see the launch'},
 {name:'Resume Roaster',tag:'AI product',big:'14.9K',small:'views on a quiet launch',
  desc:'An AI tool that reviews your resume with brutal honesty and tells you exactly what to fix.',
  result:'Inbound DMs from people at PhonePe and others',url:'https://github.com/unnati914/Resume-Roaster',cta:'view on github'},
 {name:'X Dating',tag:'experiment',img:'/work/xdating.jpg',
  desc:'A no-swipe dating idea: match on shared interests and start with a real conversation. Tested with a waitlist before building the app.',
  result:'8.3K views on the waitlist launch',url:'https://x-dating-waitlist.vercel.app',cta:'see the waitlist'}
];

export const talks=[
 {name:'KCD Bengaluru 2025',what:'Talk on AI agents',url:x('1921827941106713062')},
 {name:'DevFest Noida 2022',what:'Speaker, GDG Noida',url:'https://www.commudle.com/users/unnati'},
 {name:'DevFest New Delhi 2022',what:'Speaker, GDG New Delhi',url:'https://www.commudle.com/users/unnati'},
 {name:'Winterlude',what:'Speaker, GDSC IIIT Delhi',url:'https://www.commudle.com/users/unnati'},
 {name:'HERizon',what:'Everything in and around opportunities',url:'https://www.commudle.com/users/unnati'}
];

export const writing=[
 {name:'AI Failure Files',what:'Video series on real AI failures and what builders should learn',kind:'video',url:x('2112909905044881639')},
 {name:'How I prepared for my Cred interviews',what:'Thread · 36K views',kind:'thread',url:x('1859240990655295607')},
 {name:'Images with GPT-4o in 15 lines',what:'phidata tutorial · 7.3K views',kind:'tutorial',url:x('1866149397513589181')},
 {name:'Keploy: calling all open source contributors',what:'Blog on dev.to',kind:'blog',url:'https://dev.to/unnati914/keploy-calling-all-open-source-contributors-1d49'},
 {name:'CodXCrypt on YouTube',what:'Community sessions on open source and careers',kind:'video',url:'https://www.youtube.com/c/CodXCryptCommunity'}
];

// Add real quotes here (name, role, quote, optional url). The section stays hidden while this is empty.
export const testimonials=[];
