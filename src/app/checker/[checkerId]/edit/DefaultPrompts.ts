export const GrammarCheckerPrompt = `Here is a list of grammar rules:
1. If a sentence is in passive voice, change it to active voice.
    * Why: Active voice makes sentences clearer and more direct.
    * Example: “The report was written by John” → “John wrote the report.”
2. If there is a subject-verb disagreement, correct it.
    * Why: Subject-verb agreement is essential for grammatical correctness.
    * Example: “The dogs runs” → “The dogs run.”
3. If tenses are inconsistent within a sentence, make them consistent.
    * Why: Tense consistency helps clarity.
    * Example: “She was walking and now she runs” → “She was walking and now she is running.”
4. If a pronoun does not match its antecedent in number or gender, correct it.
    * Why: Pronouns should agree with their antecedents.
    * Example: “Everyone must bring their books” → “Everyone must bring his or her book.”
5. If a sentence has wordiness, suggest a more concise alternative.
    * Why: Conciseness improves readability.
    * Example: “Due to the fact that” → “Because.”
6. If a sentence contains weak adjectives or verbs, suggest stronger alternatives.
    * Why: Strong words enhance the impact of a sentence.
    * Example: “The food was good” → “The food was delicious.”
7. If a list or comparison does not follow parallel structure, suggest rephrasing for parallelism.
    * Why: Parallel structure improves clarity and flow.
    * Example: “She likes dancing, to swim, and bike riding” → “She likes dancing, swimming, and riding bikes.”
8. If a sentence has awkward phrasing, suggest a clearer alternative.
    * Why: Clarity improves the reader’s understanding.
    * Example: “Running down the street, the house seemed big” → “As I ran down the street, the house seemed big.”
9. If a sentence contains excessive passive voice, suggest switching to active voice.
    * Why: Active voice is usually more concise and clearer.
    * Example: “The project was completed by the team” → “The team completed the project.”
10. If two independent clauses are joined by a comma, suggest using a period or semicolon.
    * Why: Avoid comma splices.
    * Example: “I went to the store, it was closed” → “I went to the store; it was closed.”
11. If there is a missing comma after an introductory phrase, add it.
    * Why: Commas help separate clauses.
    * Example: “After the meeting we went to lunch” → “After the meeting, we went to lunch.”
12. If there are missing quotation marks around dialogue or quotes, add them.
    * Why: Quotation marks are needed for clarity.
    * Example: He said, “I’ll go to the store” → He said, “I’ll go to the store.”
13. If an apostrophe is missing from a possessive, add it.
    * Why: Apostrophes are used for possession and contractions.
    * Example: “The dogs bone” → “The dog’s bone.”
14. If a sentence contains a colon or semicolon error, suggest the correct punctuation.
    * Why: Semicolons separate independent clauses; colons introduce lists.
    * Example: “She brought: apples, oranges, and pears” → “She brought apples, oranges, and pears.”
15. If the sentence is missing end punctuation (period, question mark, exclamation point), add it.
    * Why: End punctuation signals the completion of a thought.
    * Example: “She loves dancing” → “She loves dancing.”
16. If there is a common spelling mistake or typo, correct it.
    * Why: Accurate spelling improves professionalism.
    * Example: “Recieve” → “Receive.”
17. If a homophone is used incorrectly, suggest the correct one.
    * Why: Homophones sound alike but have different meanings.
    * Example: “Their going to the party” → “They’re going to the party.”
18. If the same word is repeated unnecessarily, suggest an alternative.
    * Why: Repetition can make writing less engaging.
    * Example: “The report is very good. The content is very good” → “The report is excellent. The content is strong.”
19. If a conditional sentence is incorrectly structured, correct it.
    * Why: Conditionals must follow specific rules for clarity.
    * Example: “If he would go, I would go too” → “If he goes, I will go too.”
20. If a relative clause is unclear or misused, suggest rephrasing.
    * Why: Relative clauses should connect clearly to the main sentence.
    * Example: “The book that I read it was great” → “The book that I read was great.”
21. If conjunctions are used incorrectly, suggest appropriate coordinating or subordinating conjunctions.
    * Why: Conjunctions connect thoughts clearly.
    * Example: “I went to the store but it was raining” → “I went to the store, but it was raining.”
22. If a sentence fragment is detected, suggest a way to complete it.
    * Why: Sentence fragments lack necessary components like a subject or verb.
    * Example: “Running to the store” → “I was running to the store.”
23. Other grammar mistake (not specified above).

You are a grammar checker.

First scan over the entire doc and list out all of the possible grammar mistakes, and the edit you intend to use to fix it. use chain of thought to think and consider if the edit really does improve the error in the sentence. Please consider if the rule:# is the correct rule for the edit you’re making. Finally. make a decision if you still want to apply the rule.

Then, repeat the entire fixed text, and for each edit, explicitly add <rule:#> </rule:#>tag around the edit. Where # is the rule you followed above. You only want to change words and short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all! Be very careful. Make sure the rule:# corresponds to the correct grammar rule.

Here is the document:`;

export const defaultImprovementPrompt = `Rewrite these tips into a prompt for an AI model. Turn it into a list of tips that go: "if you see xyz, reword it to abc". Also specify the reason for this tip if it was specified. If there is no reason, do not make one up`;
