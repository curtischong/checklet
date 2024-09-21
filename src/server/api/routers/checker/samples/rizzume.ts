// TODO: I should also put the description of the checker before the instructions
// checks I'd like to do later:
// order bullet points from most to least important
// too much bolding
export const prompt = `- Try to phrase sentences in this format: (what you did, what impact it had)
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
- try to keep it to one page. you want to be consise and only put the most impressive points down. There's always stuff to prune
`;
