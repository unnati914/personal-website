const x=id=>`https://x.com/Unnati_twts/status/${id}`;

// ── Build log ──────────────────────────────────────────────
// Add one line at the TOP each week. date: YYYY-MM-DD, url is optional.
export const buildLog=[
 {date:'2026-11-10',text:'Revamped this site: GTM & community, writing & talks, per-company pitch pages and /play',url:'/'},
 {date:'2026-11-05',text:'Opened Imlea for testing: memory, adaptive paths and curriculum-grounded answers',url:x('2118330495675380202')},
 {date:'2026-10-30',text:'Call Guard demo for Prodigal: 0/12 → 12/12 safe collection calls',url:'/for/prodigal'},
 {date:'2026-10-29',text:'Saved-evals demo for Agnost: 12 chats in English, Hindi and Hinglish',url:'/for/agnost'},
 {date:'2026-10-24',text:'Agent Watch demo for Emergent: 12 credits → 8, 12/12 tests passed',url:'/for/emergent'},
 {date:'2026-10-23',text:'Matchmaker demo for Wavelength: 12 checks, 1 bug caught, 1 product idea',url:'/for/wavelength'},
 {date:'2026-10-21',text:'Launched AI Failure Files, case #001',url:x('2112909905044881639')},
 {date:'2026-10-16',text:'Put up the X Dating waitlist',url:x('2111041520782716964')},
 {date:'2026-09-28',text:'Shipped this website',url:x('2104650572909662518')}
];

// ── Per-company pitch pages: /for/<slug> ───────────────────
// Copy a block to add a new company. These pages are unlisted (not linked from the site).
export const companies={
 wavelength:{name:'Wavelength',role:'AI engineer / product engineer',
  demo:{title:'Wave · a matchmaker that explains itself',img:'/work/demo-wavelength.jpg',live:'https://wave-demo-two.vercel.app',video:x('2113642488779198956')},
  built:['A working matchmaker where every match says why: shared interests, same goals, photo locked until both say yes','12 eval checks run on every release: 12 checks, 1 bug caught, 1 product idea','Simulate a month of use to see how matches, intros and dates change over time'],
  fit:['I built X Dating, a no-swipe dating idea, and tested it with a waitlist (8.3K views on launch)','I built the GenAI bot evaluation framework at Zomato, shipped to 100% of app users','I can launch it: 60K people follow what I build on X'],
  projects:['X Dating','Demo-first pitches','Resume Roaster']},
 emergent:{name:'Emergent',role:'AI engineer / DevRel',
  demo:{title:'Agent Watch · pay for progress, not for loops',img:'/work/demo-emergent.jpg',live:'https://emergent-demo-gray.vercel.app',video:x('2113926854398926933')},
  built:['A guard that watches an AI build agent while it works','Stops endless retry loops and rolls back fixes that break features that already worked','Checks “done” against the real app before charging. Sample run: 12 credits → 8, 12/12 tests passed'],
  fit:['I built production GenAI agents for VISA at Grid Dynamics, used by 200 to 300 people','I built an internal developer tool there that saves about 40 engineering hours a week','I was a DevRel for dev-tool startups (Keploy, Zenduty, AssetMantle) and can explain agents to builders'],
  projects:['GenAI agents for VISA','Demo-first pitches','Hirvana']},
 agnost:{name:'Agnost',role:'AI engineer / DevRel',
  demo:{title:'Evals that remember · every chat becomes a test',img:'/work/demo-agnost.jpg',live:'https://agnost-demo.vercel.app',video:x('2115771736889462983')},
  built:['A support agent tested on 12 chats in English, Hindi and Hinglish','Every failed chat becomes a saved test automatically','A fix that breaks a saved test is blocked before merge'],
  fit:['I built the GenAI bot evaluation framework at Zomato, shipped to 100% of app users','I added regional language support to the Zomato app (a 1–2% lift in daily orders)','I built RAG pipelines on pgvector with 80% retrieval accuracy'],
  projects:['GenAI agents for VISA','Demo-first pitches','Resume Roaster']},
 prodigal:{name:'Prodigal',role:'AI engineer',
  demo:{title:'Call Guard · guardrails for a collections agent',img:'/work/demo-prodigal.jpg',live:'https://prodigal-demo-sand.vercel.app',video:x('2116139096498450584')},
  built:['5 things I’d want Prodigal agents to do beyond talking: payments during calls, document understanding, lender rulebooks, faster workflow launches and a call guard','A thin rules layer on top of the agent that catches compliance mistakes mid-call','In 12 sample test calls: agent alone 0/12, with Call Guard 12/12'],
  fit:['I built payment integrations at Paysecure: a Shopify gateway plugin for 40 merchants, plus BigCommerce and WooCommerce','I built production GenAI agents for VISA at Grid Dynamics','I understand Indian calls: Hindi, English and Hinglish in one sentence'],
  projects:['GenAI agents for VISA','Demo-first pitches','Hirvana']}
};

// ── Case studies: /case/<slug> ─────────────────────────────
// "What I'd do differently" lines are drafts written from my posts. Edit them in your own words.
export const caseStudies={
 hirvana:{name:'Hirvana',kicker:'founder · product · GTM',years:'2025 to 2026',
  oneLiner:'I turned two years of free mentoring into a paid AI career platform, and ran every launch myself on X.',
  stats:[{n:'41K',l:'views on the first ₹500 cohort offer'},{n:'25',l:'registrations in the first 4 days'},{n:'3',l:'cohorts, plus a 7-day bootcamp'},{n:'₹300–1K',l:'price points tested'}],
  problem:'Job hunting in tech is noisy. People doom-scroll job boards, send the same resume everywhere and rarely hear back. I had been mentoring people for free through CodXCrypt and D2D for almost two years and kept seeing the same gaps: no roadmap, no mock interviews, no feedback.',
  did:[
   {h:'Tested demand before building',p:'One tweet offering a ₹500 cohort with mock interviews, an AI resume fixer and weekend prep. It got 41K views and about 25 registrations in four days.',url:x('1905227425916882983')},
   {h:'Named it and built a waitlist',p:'Rebranded the cohort as Hirvana, then ran a teaser, a positioning post and a founder story over two weeks.',url:x('1919088356442656787')},
   {h:'Priced it in public',p:'Tested ₹300 for a resume, ₹1000 for mentorship and ₹500 for AI tools, then a ₹1000 bundle with an early-bird discount. Explained why it is paid: people commit more when they pay.',url:x('1918648535932633246')},
   {h:'Shipped the product',p:'An AI job-hunting assistant built on OpenAI and Firecrawl, plus a resume optimiser. Gave 5 people free access, then charged ₹599 for the next 15.',url:x('1919252068000313676')},
   {h:'Kept it running',p:'Recruited mentors and interns, ran three cohorts, a 7-day cohort and a system design bootcamp in 2026.',url:x('2059964127196672244')}
  ],
  differently:['Lead with the offer. The plain “₹500, here is what you get” post did 41K views; the polished brand posts did 2K to 7K.','Charge from day one. Paid cohorts kept people showing up; free prep groups fade fast.','Track the funnel, not just views: post → DM → paid → finished cohort, from the first week.']},
 codxcrypt:{name:'CodXCrypt',kicker:'community · DevRel · events',years:'2021 to 2023',
  oneLiner:'I started an open-source community in my second year of college because nobody was teaching open source there.',
  stats:[{n:'500',l:'registrations for our first offline dev conference'},{n:'7',l:'speakers and 3 sponsors at that conference'},{n:'24 hr',l:'hackathon co-run with DTU'},{n:'10K+',l:'students reached through talks and mentoring'}],
  problem:'My college had no guidance on open source: how to find a project, make a first pull request or get into programs like GSoC and LFX. Students who wanted in had nobody to ask.',
  did:[
   {h:'Started with workshops and mentoring',p:'Online sessions on open source, project ideas and programs, plus a YouTube channel for the recordings.',url:'https://www.youtube.com/c/CodXCryptCommunity'},
   {h:'Went offline',p:'Hosted our first in-person meetup in March 2022, then meetups with partners like RoundTable DTU and Wasserstoff.',url:'https://www.linkedin.com/posts/unnati-chhabra-_community-internship-activity-6914807471966494720-WtDn'},
   {h:'Ran a developer conference',p:'About 500 registrations in Delhi NCR, 7 speakers, sponsors Rooba.Finance, Spheron and Wasserstoff, partners AssetMantle and Kubesimplify, and a 7-person organising team.',url:'https://www.linkedin.com/posts/unnati-chhabra-_hey-everyone-codxcrypt-community-kicking-activity-6971525929038696448-Jivd'},
   {h:'Co-ran a 24-hour hackathon',p:'With Delhi Technological University: workshops, resume and career sessions, 4 speakers and 4 mentors, sponsored by Lumos Labs, Frienducation and AssetMantle.',url:'https://www.linkedin.com/posts/unnati-chhabra-_hey-connections-im-very-glad-to-announce-activity-7045651126427213824-uRtq'},
   {h:'Turned it into a product',p:'Two years of mentoring through CodXCrypt and D2D became the first paid Hirvana cohort.',url:'/case/hirvana'}
  ],
  differently:['Partner with other communities early. They brought the people, and that made sponsors easier to sign.','Run one event on a fixed schedule instead of many one-offs, so people know when to come back.','Write down the playbook (speakers, sponsors, venue, comms) so the team can run events without me.']}
};

// ── Media kit: /collab ────────────────────────────────────
export const mediaKit={
 audience:[{n:'60K',l:'followers on X',url:'https://x.com/Unnati_twts'},{n:'21K',l:'followers on LinkedIn',url:'https://www.linkedin.com/in/unnati-chhabra-/'},{n:'14.5K',l:'posts on X since 2020'},{n:'10K+',l:'students reached in person and online'}],
 who:'I write for developers, students and early-career engineers in India: AI agents, building in public, careers and the tools I actually use.',
 formats:[
  {h:'Launch post or thread',p:'Your product explained in plain words, with what it does and who it is for.'},
  {h:'Hands-on walkthrough',p:'I use the product for real and show the steps, like my Vidu AI and Quartz Studio posts.'},
  {h:'Demo video',p:'A short screen recording or a working demo built on your API, like my company demos.'},
  {h:'Event promotion',p:'Campaigns for conferences and summits, like Bengaluru Tech Summit 2025 and 2026.'},
  {h:'Personal take',p:'A quote-post or story from my own experience, like my HackerRank interview post.'},
  {h:'Community and IRL',p:'Buildathons, meetups and workshops with my community in Delhi and Bengaluru.'}
 ],
 brands:['Bengaluru Tech Summit','HackerRank','Gnani.ai','Vidu AI','Confluentis','Quartz Studio','PandaPaws','phidata'],
 top:[
  {name:'Bengaluru Tech Summit 2025',metric:'61K views',url:x('1988660771069534302')},
  {name:'Bengaluru Tech Summit 2026',metric:'34.6K views',url:x('2118353841720881586')},
  {name:'phidata on GitHub Trending',metric:'12.9K views',url:x('1857784696853422456')},
  {name:'HackerRank Chakra launch',metric:'5.1K views',url:x('2112183248654856193')},
  {name:'Vidu AI how-to thread',metric:'4K views',url:x('1931995849610977613')}
 ],
 rates:[
  {h:'Post on X',price:'$200',p:'A dedicated post about your product, written in my voice for my audience.'},
  {h:'Quote post on X',price:'$100',p:'I quote your launch or announcement and add my own take.'},
  {h:'Threads, videos, events, bundles',price:'Custom',p:'Send the brief and I’ll quote it.'}
 ],
 email:'chhabraunnati234@gmail.com'
};
