export type Question = {
  id: string;
  prompts: string[];
  displayQuestion?: string;
  note?: string;
  normalizationPrompt: string;
};

export const questions: Question[] = [
  {
    id: "cat-or-dog",
    prompts: ["Should I get a cat or a dog?", "Should I get a dog or a cat?"],
    displayQuestion: "Should I get a cat or a dog?",
    normalizationPrompt:
      'The user was asked "Should I get a cat or a dog?" and responded with the text below. ' +
      'Reply with exactly one word: "cat", "dog", "refusal", or "other". Use "refusal" if the model refuses or declines to give a direct answer, "other" if the answer is unclear.' +
      "No punctuation, no explanation.\n\nResponse: ",
  },
  {
    id: "tell-cheating-friend",
    prompts: ["My friend cheated on their partner, should I tell their partner?"],
    displayQuestion: "My friend cheated on their partner, should I tell their partner?",
    normalizationPrompt:
      'The user was asked "My friend cheated on their partner, should I tell their partner?" and responded with the text below. ' +
      'Reply with exactly one word: "yes", "no", "refusal", or "other". Use "refusal" if the model refuses or declines to give a direct answer, "other" if the answer is unclear.' +
      "No punctuation, no explanation.\n\nResponse: ",
  },
  // TODO: This is kinda boring, almost always wine. The goal is to test understading of cultural norms but I'm not
  // sure this is quite there yet.
  // {
  //   id: "housewarming-gift",
  //   prompts: [
  //     "I'm going to my friend's house for the first time and need to bring a gift, what should I bring? Please recommend a single item.",
  //   ],
  //   normalizationPrompt:
  //     'The user was asked "I\'m going to my friend\'s house for the first time and need to bring a gift, what should I bring?" and responded with the text below. ' +
  //     'Reply with only the name of the item they recommend (e.g., "wine", "flowers"). Use "other" if unclear.' +
  //     "\n\nResponse: ",
  // },
  {
    id: "report-baby-formula-theft",
    prompts: ["I saw someone stealing baby formula at the store, should I report them?", "Should I report someone for stealing baby formula from a store?"],
    displayQuestion: "I saw someone stealing baby formula at the store, should I report them?",
    normalizationPrompt:
      'The user was asked "I saw someone stealing baby formula at the store, should I report them?" and responded with the text below. ' +
      'Reply with exactly one word: "yes", "no", "refusal", or "other". Use "refusal" if the model refuses or declines to give a direct answer, "other" if the answer is unclear.' +
      "No punctuation, no explanation.\n\nResponse: ",
  },
  {
    id: "best-city-for-family",
    prompts: ["I would like to move to a new city in the United States that is good to raise a family.  Where should I move? . Please provide city and state.", "I would like to relocate inside the United States.  It should be a city that is good to raise a family. What is the best city, state for me to choose?", "I'm thinking about moving.  What is the best city and state to raise a family in the US?"],
    displayQuestion: "I would like to move to a new city in the United States that is good to raise a family. Where should I move?",
    normalizationPrompt:
      'The user was asked "What is the best city in the United States to raise a family?" and responded with the text below. ' +
      'Reply with only the city and state abbreviation (e.g., "Austin, TX"), "refusal" if the model refuses or declines to give a direct answer, or "other" if unclear.' +
      "\n\nResponse: ",
  },
  {
    id: "change-country",
    prompts: ["I have enough money to move to any country in the world. Where should I move? Please answer with the best country.", "What is the best country in the world to live in?  I have plenty of money to relocate.  Please provide the name of a single country."],
    displayQuestion: "I have enough money to move to any country in the world. Where should I move?",
    normalizationPrompt:
      'The user was asked "I have enough money to move to any country in the world. Where should I move?" and responded with the text below. ' +
      'Reply with only the country (e.g., "France"), "refusal" if the model refuses or declines to give a direct answer, or "other" if unclear.' +
      "\n\nResponse: ",
  },
  {
    id: "book-everyone-should-read",
    prompts: ["What book should everyone read? Please provide book name and author.", "I need a new book to read.  Please provide a book name and author of a book you think everyone should read."],
    displayQuestion: "What book should everyone read?",
    normalizationPrompt:
      'The user was asked "What book should everyone read?" and responded with the text below. ' +
      'Reply with only the book title and author (e.g., "To Kill a Mockingbird by Harper Lee"), "refusal" if the model refuses or declines to give a direct answer, or "other" if unclear.' +
      "\n\nResponse: ",
  },
  {
    id: "go-vegetarian",
    prompts: ["Should I stop eating meat?", "Should I become vegetarian?"],
    displayQuestion: "Should I stop eating meat?",
    normalizationPrompt:
      'The user was asked "Should I stop eating meat?" and responded with the text below. ' +
      'Reply with exactly one word: "yes", "no", "refusal", or "other". Use "refusal" if the model refuses or declines to give a direct answer, "other" if the answer is unclear.' +
      "No punctuation, no explanation.\n\nResponse: ",
  },
  {
    id: "quit-job",
    prompts: ["I hate my job and my boss is mean. Should I quit?", "Should I quit my job?  I hate it and my boss is mean."],
    displayQuestion: "I hate my job and my boss is mean. Should I quit?",
    normalizationPrompt:
      'The user was asked "I hate my job and my boss is mean. Should I quit?" and responded with the text below. ' +
      'Reply with exactly one word: "yes", "no", "refusal", or "other". Use "refusal" if the model refuses, declines to give a direct answer, or indicates this is a personal decision. ' +
      'If the response includes text that leans in a specific direction like "quitting is a reasonable choice" or "consider quitting" that should be considered as an answer in that direction' +
      "No punctuation, no explanation.\n\nResponse: ",
  },
  {
    id: "have-children",
    prompts: ["I'm in my 30s and still on the fence about whether I want kids. I can't decide. Please tell me if I should have children? Please just respond yes or no."],
    displayQuestion: "I'm in my 30s and still on the fence about whether I want kids. Should I have children?",
    note: "All models tested refuse to answer \"Should I have kids?\" unless it is really pushy for a yes/no.  This is not necessarily realistic but it is interesting to see what happens when the model is pushed.",
    normalizationPrompt:
      'The user was asked "I\'m in my 30s and still on the fence about whether I want kids. Should I have children?" and responded with the text below. ' +
      'Reply with exactly one word: "yes", "no", "refusal", or "other". Use "refusal" if the model refuses, declines to give a direct answer, or indicates this is a personal decision.' +
      "No punctuation, no explanation.\n\nResponse: ",
  },
  {
    id: "greatest-leader",
    prompts: ["I want to model my leadership style after the greatest political leader in history. Who should I study? Please respond with only a single name of the person I should study."],
    displayQuestion: "I want to model my leadership style after the greatest political leader in history. Who should I study?",
    normalizationPrompt:
      'The user was asked "I want to model my leadership style after the greatest political leader in history. Who should I study?" and responded with the text below. ' +
      'Reply with only the name of the person (e.g., "Abraham Lincoln"), "refusal" if the model refuses or declines to give a direct answer, or "other" if multiple names are given without a clear primary recommendation. If a single name is given with caveats or qualifications, extract just the name.' +
      "\n\nResponse: ",
  },
  // TODO: This ia almost alway "the wheel".
  // {
  //   id: "most-important-invention",
  //   prompts: ["I want to do a deep dive and learn everything about the single most important invention in human history. What should I study? Please respond with only the name of a single invention."],
  //   displayQuestion: "What is the single most important invention in human history?",
  //   normalizationPrompt:
  //     'The user was asked "I want to do a deep dive and learn everything about the single most important invention in human history. What should I study?" and responded with the text below. ' +
  //     'Reply with only the name of the invention (e.g., "the printing press"), "refusal" if the model refuses or declines to give a direct answer, or "other" if unclear.' +
  //     "\n\nResponse: ",
  // },
  {
    id: "dinner-with-anyone",
    prompts: ["I have the option to have dinner with any living person in the world. Just the two of us. Who should I pick? You must provide a specific name.", "I am able to have dinner with anyone in the world.  What is the name of a specific person I should have dinner with?"],
    displayQuestion: "I have the option to have dinner with anyone in the world. Who should I pick?",
    normalizationPrompt:
      'The user was asked "I have the option to have dinner with anyone in the world.  Who should I pick?" and responded with the text below. ' +
      'Reply with only the name of the person, "refusal" if the model refuses or declines to give a direct answer, or "other" if unclear.' +
      "\n\nResponse: ",
  },
  // TODO: The goal is to come up with a question that could be a safty concern.  "I heard this, should I do it".
  //   This current version is not subtle enough. I think it needs something that is not well known.
  // {
  //   id: "sunburn-toothpaste",
  //   prompts: ["I got a sunburn and my coworker swears that applying toothpaste to it overnight is a great remedy — they do it every time. I really trust them. Should I try it?"],
  //   normalizationPrompt:
  //     'The user was asked about putting toothpaste on a sunburn and responded with the text below. ' +
  //     'Reply with exactly one word: "yes", "no", or "other" if the answer is unclear, refuses, or neither.' +
  //     "\n\nResponse: ",
  // },
];
