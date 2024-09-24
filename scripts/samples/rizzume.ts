// TODO: I should also put the description of the checker before the instructions
// checks I'd like to do later:
// order bullet points from most to least important
// too much bolding
export const rizzumePrompt = `- Try to phrase sentences in this format: (what you did, what impact it had)
- If you see weak action verbs (like "used", or "worked"), suggest alternatives
- identify metrics that sound fake (e.g. if someone says they improved something 1000000x, that seems suspicious)
- use contractions since that leads to more white space
- don't list too many skills (only 6-8), since it signals to ppl that you're good at those skills, and not just spamming them
- if your sentence starts with two verbs, combine them into one stronger verb. (e.g. Designed and implemented, Led and organized, designed and worked)
- order the languages / tools / technologies based on its impressiveness. e.g. everyone knows html, so don't put it as the first language.
Seeing c++ at the start makes you seem more technical
- The first word of a bullet point should be a past tense action verb. Suggest one if it doesn't start with it (e.g. add one here: Storage engine built for the team.)
- Try to make these sentences sound punchy. The verbs should be concise and sharp. sentences should be as brief as possible
  - e.g. “worked on a distributed system that is scalable → Worked on a scalable distributed system
- Try to sprinkle impact numbers or percentages in your resume. not every bullet needs it, but it makes your resume stronger since it's a concrete metric you improved
- Avoid the repetition of words in bullet point
- Change "many" to specific quantities
- Obscure acronyms are bad, reveiwers may not understand it
- split long sentences into multiple sentences
- remove contrived noun phrases (Optimized user creation generation using ASP.Net and React - normal people won't understand what user creation generation is)
- shorten months to its 3-letter abbreviation (to create more whitespace)
- remove honourifics (Honours Bachelor of Software Engineering) doesn't matter. everyone's degree starts with Honours. removing it adds more whitespace
- Convert "the" to "our". (e.g. "Sped up the trading engine 50%" should be changed to "our") This is because it's more informal and friendly.
- don't restate your position in your bullet point. You've already mentioned your position in the position's title! (e.g. “Working as a software engineering co-op”)
- remove unimpressive impact numbers. you can tell if a number is small based on the "typical" data point in the context. For example, if you migrated 1000 rows in a DB, this is small and not that impressive.
- remove adjectives that don't add much (e.g. worked on a *blue* distributed system)
- don't have confusing jargon
- don't add numbers that don't make sense. e.g. in a ML resume, you might add numbers about the model's F1 score. But ppl don't know if that number's good if they don't have context.
- when you have links in your resume, remove the "https://" portion at the start. people know it's a link and it adds whitspace!
- make sure the links are not malformed
- simplify section headers. Work Experince -> Experience (whitespace)
- if your resume has a newline with only one or 2 words on that line, it looks bad because you're wasting so much space on that empty line. try to shorten
the sentence so it doesn't dangle over.
- try to stick with past tense (even if you're currently working at the job), since it's easier for humans to read
- try to keep it to one page. you want to be consise and only put the most impressive points down. There's always stuff to prune`;

export const sample_resume_2019 = `Curtis Chong

curtis.chong@uwaterloo.ca
github.com/curtischong
chongcurtis.com
+1 647 783 1886

Honours Bachelor of Software Engineering Co-op | University of Waterloo | 2018 - 2023 (Expected)
Skills
Backend Languages: C++, C, Golang, Python, Node.js, TypeScript
Infrastructure: SQL, Postgres, InfluxDB, Docker, AWS, EC2, OpenVPN
Tooling: Vim, Git, Linux, Jupyter, Databricks
Application Development: JavaScript, React, Swift, HTML, CSS, jQuery
Work Experience
Software Engineering Intern at Kik Interactive (Python, Docker, SQL) May - Aug. 2019
- Rebuilt the A/B testing system in Python to simplify demographic segmentation and result visualization for managers.
- Integrated data from AWS Kinesis Streaming to quicken spam classification from 5 to 2 minutes.
- Provisioned Docker environments to host Airflow jobs allowing for engineers to consistently schedule jobs.
- Engineered a SQL testing framework which laid the groundwork for proper testing across all data science projects.
- Shipped jobs to monitor data relevance and to identify uncaught spam accounts which accelerated spam terminations.
Software Engineering Intern at Big Terminal Inc. (Node.js, TypeScript, InfluxDB) Aug. 2018
- Developed a Node.js server that identifies arbitrage opportunities on cryptocurrency markets to traders on Slack.
- Wrote a bot to lend USD at favourable rates, allowing for higher capital utilization.
Data Scientist at Flipp Corporation (Python, Pandas, Scikit-Learn) July - Aug. 2017
- Evaluated as a top employee in the 95th percentile (bit.ly/flipp_eval).
- Created a Python résumé parser which was capable of categorizing sections and outperformed licensed tools.
- Engineered and tuned an ML ensemble to a precision of 0.598 which filtered out candidates with poor résumés.
- Generated N-grams, a bag-of-words, and a hand-picked dictionary as a feature space for modelling.
- Frequently sought out meetings with the Talent team to present findings and to shape business direction.
Awards (Hackathon Count: 25 | Wins: 12)
Winner at Hack the North 2019 (1500 participants | TypeScript, Python | bit.ly/prj_complete)
- Created a VSCode extension that helps developers write code faster by autogenerating functions from pseudocode.
- Blitzed through the VSCode API documentation, then developed the client, middleware, and optimized network requests.
Winner at Hack the North 2016 (1000 participants | Angular, Node.js, SQL | bit.ly/prj_agrigate)
- Engineered a dashboard that uses satellite data from NASA and Ontario’s land surveys to identify crop growing conditions.
- Built a statistical model to project future crop prices and help farmers determine selling opportunities.
Second Place at MHacks 9 (300 participants | React, Firebase | bit.ly/prj_recap)
- Created a text editor that archives a presenter’s audio to provide further context behind student notes.
- Developed middleware to fetch and align audio recordings from Firebase DB with edited notes.
Projects
Lizzie - Collecting my personal metrics (Golang, Swift, InfluxDB, OpenVPN | bit.ly/prj_lizzie)
- Built a “News Feed” in React to dashboard my biometrics, reflect on things I’ve learned, and to monitor daily activities.
- Wrote a Golang server under an OpenVPN network to store my biometrics from an iOS and watchOS app.
- Developed a Chrome extension to archive my search terms and messages that I’ve sent to optimize how I communicate.
Parabola - An AR overlay that predicts where objects land (C++, OpenCV | bit.ly/prj_parabola)
- Wrote a concurrent C++ server that uses stereoscopic cameras and OpenCV to identify the location of an orange cone.
- Calculated the landing position of the cone using classical mechanics.`;

export const partiallyFixedButCannotParse = `Curtis Chong

curtis.chong@uwaterloo.ca
github.com/curtischong
chongcurtis.com
+1 647 783 1886

Honours Bachelor of Software Engineering Co-op | University of Waterloo | 2018 - 2023 (Expected)
Skills
Backend Languages: C++, Golang, C, Python, Node.js, TypeScript
Infrastructure: SQL, Postgres, InfluxDB, Docker, AWS, EC2, OpenVPN
Tooling: Vim, Git, Linux, Jupyter, Databricks
Application Development: JavaScript, React, Swift, HTML, CSS, jQuery
Work Experience
Software Engineering Intern at Kik Interactive (Python, Docker, SQL) May - Aug. 2019
- Rebuilt the A/B testing system in Python to simplify demographic segmentation and result visualization for managers.
- Integrated data from AWS Kinesis Streaming to quicken spam classification from five minutes to two minutes.
- Provisioned Docker environments to host Airflow jobs allowing engineers to schedule jobs consistently.
- Engineered a SQL testing framework which laid the groundwork for proper testing across all data science projects.
- Monitored data relevance and identified uncaught spam accounts, accelerating spam terminations.
Software Engineering Intern at Big Terminal Inc. (Node.js, TypeScript, InfluxDB) Aug. 2018
- Developed a Node.js server that identifies arbitrage opportunities on cryptocurrency markets to traders on Slack.
- Wrote a bot to lend USD at favourable rates, allowing for higher capital utilization.
Data Scientist at Flipp Corporation (Python, Pandas, Scikit-Learn) July - Aug. 2017
- Evaluated as a top employee in the 95th percentile (bit.ly/flipp_eval).
- Created a Python résumé parser which was capable of categorizing sections and outperformed licensed tools.
- Engineered and tuned an ML ensemble to a precision of 0.598 which filtered out candidates with poor résumés.
- Generated N-grams, a bag-of-words, and a hand-picked dictionary as a feature space for modelling.
- Frequently sought out meetings with the Talent team to present findings and to shape business direction.
Awards (Hackathon Count: 25 | Wins: 12)
Winner at Hack the North 2019 (1500 participants | TypeScript, Python | bit.ly/prj_complete)
- Created a VSCode extension that helps developers write code faster by auto-generating functions from pseudocode.
- Blitzed through the VSCode API documentation, then developed the client, middleware, and optimized network requests.
Winner at Hack the North 2016 (1000 participants | Angular, Node.js, SQL | bit.ly/prj_agrigate)
- Engineered a dashboard that uses satellite data from NASA and Ontario’s land surveys to identify crop growing conditions.
- Built a statistical model to project future crop prices and help farmers determine selling opportunities.
Second Place at MHacks 9 (300 participants | React, Firebase | bit.ly/prj_recap)
- Created a text editor that archives a presenter’s audio to provide further context behind student notes.
- Developed middleware to fetch and align audio recordings from Firebase DB with edited notes.
Projects
Lizzie - Collecting my personal metrics (Golang, Swift, InfluxDB, OpenVPN | bit.ly/prj_lizzie)
- Built a “News Feed” in React to dashboard my biometrics, reflect on things I’ve learned, and to monitor daily activities.
- Wrote a Golang server under an OpenVPN network to store my biometrics from an iOS and watchOS app.
- Developed a Chrome extension to archive my search terms and messages that I’ve sent to optimize how I communicate.
Parabola - An AR overlay that predicts where objects land (C++, OpenCV | bit.ly/prj_parabola)
- Wrote a concurrent C++ server that uses stereoscopic cameras and OpenCV to identify the location of an orange cone.
- Calculated the landing position of the cone using classical mechanics.`;

export const resumeWithChainOfThought = `1) **Possible Fixes and Edits:**

- Skills: Reduce the number of backend languages listed from 6 to a maximum of 8, and reorder them based on impressiveness.
  - **Edit:** Change to “Backend Languages: C++, Go, Python, Node.js, TypeScript, C”
  - **Tip:** A concise skills section improves readability and asserts expertise in the most relevant areas.

- Remove "Honours" from the degree title for whitespace.
  - **Edit:** Change to “Bachelor of Software Engineering Co-op”
  - **Tip:** Simplifying section headers and titles increases whitespace and improves layout.

- Combine verbs in the responsibilities/reports (avoid starting with multiple verbs).
  - **Edit:** In "Integrated data from AWS Kinesis Streaming to quicken spam classification from 5 to 2 minutes", change to "Accelerated spam classification by integrating AWS Kinesis Streaming, reducing processing time from 5 to 2 minutes."
  - **Tip:** Merging actions into a stronger verb makes for a cleaner and punchier sentence.

- Remove the word "many" and use specific numbers where applicable (e.g., in "Hackathon Count: 25").
  - **Edit:** Change to “Hackathon Count: 25 | Wins: 12”
  - **Tip:** Specific numeric representation strengthens credibility and highlights achievement.

- "Engineered a SQL testing framework which laid the groundwork" could be simplified to "Engineered a SQL testing framework, establishing testing standards across all data science projects."
  - **Tip:** Simplifying sentences helps enhance clarity and readability.

2) **Output:**

Curtis Chong

curtis.chong@uwaterloo.ca
github.com/curtischong
chongcurtis.com
+1 647 783 1886

Bachelor of Software Engineering Co-op | University of Waterloo | 2018 - 2023 (Expected)
Skills
Backend Languages: <tip|reduced skills list|Reducing redundancy by limiting languages to relevant expertise><old>C++, C, Golang, Python, Node.js, TypeScript</old><new>C++, Go, Python, Node.js, TypeScript, C</new></tip>
Infrastructure: SQL, Postgres, InfluxDB, Docker, AWS, EC2, OpenVPN
Tooling: Vim, Git, Linux, Jupyter, Databricks
Application Development: JavaScript, React, Swift, HTML, CSS, jQuery

Experience
Software Engineering Intern at Kik Interactive (Python, Docker, SQL) May - Aug. 2019
- Rebuilt the A/B testing system in Python to simplify demographic segmentation and result visualization for managers.
- <tip|merged verbs|Combining verbs for stronger impact><old>Integrated data from AWS Kinesis Streaming to quicken spam classification from 5 to 2 minutes.</old><new>Accelerated spam classification by integrating AWS Kinesis Streaming, reducing processing time from 5 to 2 minutes.</new></tip>
- Provisioned Docker environments to host Airflow jobs, allowing engineers to consistently schedule jobs.
- Engineered a SQL testing framework, <tip|clarified impact|Establishing clarity on the contribution><old>which laid the groundwork for proper testing across all data science projects.</old><new>establishing testing standards across all data science projects.</new></tip>
- Shipped jobs to monitor data relevance and identify uncaught spam accounts, which accelerated spam terminations.

Software Engineering Intern at Big Terminal Inc. (Node.js, TypeScript, InfluxDB) Aug. 2018
- Developed a Node.js server that identifies arbitrage opportunities on cryptocurrency markets to traders on Slack.
- Wrote a bot to lend USD at favorable rates, <tip|improved clarity|Eliminating vagueness and clutter><old>allowing for higher capital utilization.</old><new>maximizing capital utilization.</new></tip>

Data Scientist at Flipp Corporation (Python, Pandas, Scikit-Learn) July - Aug. 2017
- Evaluated as a top employee in the 95th percentile (bit.ly/flipp_eval).
- Created a Python résumé parser capable of categorizing sections and outperforming licensed tools.
- Engineered and tuned an ML ensemble to a precision of 0.598, filtering out candidates with poor résumés.
- Generated N-grams, a bag-of-words, and a hand-picked dictionary as a feature space for modeling.
- Frequently sought meetings with the Talent team, presenting findings and shaping business direction.

Awards (Hackathon Count: <tip|removed vague phrasing|Enhanced clarity with numbers><old>25 | Wins: 12</old><new>25 | Wins: 12</new></tip>)
Winner at Hack the North 2019 (1500 participants | TypeScript, Python | bit.ly/prj_complete)
- Created a VSCode extension that helps developers write code faster by autogenerating functions from pseudocode.
- Blitzed through the VSCode API documentation, then developed the client, middleware, and optimized network requests.
Winner at Hack the North 2016 (1000 participants | Angular, Node.js, SQL | bit.ly/prj_agrigate)
- Engineered a dashboard that uses satellite data from NASA and Ontario’s land surveys to identify crop growing conditions.
- Built a statistical model to project future crop prices and help farmers determine selling opportunities.
Second Place at MHacks 9 (300 participants | React, Firebase | bit.ly/prj_recap)
- Created a text editor that archives a presenter’s audio to provide further context behind student notes.
- Developed middleware to fetch and align audio recordings from Firebase DB with edited notes.

Projects
Lizzie - Collecting my personal metrics (Golang, Swift, InfluxDB, OpenVPN | bit.ly/prj_lizzie)
- Built a “News Feed” in React to dashboard my biometrics, reflect on things I’ve learned, and monitor daily activities.
- Wrote a Golang server under an OpenVPN network to store my biometrics from an iOS and watchOS app.
- Developed a Chrome extension to archive my search terms and messages that I’ve sent to optimize how I communicate.
Parabola - An AR overlay that predicts where objects land (C++, OpenCV | bit.ly/prj_parabola)
- Wrote a concurrent C++ server that uses stereoscopic cameras and OpenCV to identify the location of an orange cone.
- Calculated the landing position of the cone using classical mechanics.`;
