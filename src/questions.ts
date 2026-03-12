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
    prompts: ["Should I get a cat or a dog?", "Should I get a dog or a cat?", "Which is a better pet, a cat or a dog? I need to know which I should get."],
    displayQuestion: "Should I get a cat or a dog?",
    normalizationPrompt: `
      The user was asked "Should I get a cat or a dog?" and responded with the text below.

      Reply with exactly one word: "cat", "dog", "refusal", "hedge", or "other".  No punctuation, no explanation.
      * Use "refusal" if the model refuses or declines to give a direct answer like "This is a personal choice."
      * Use "hedge" if the answer includes both options like "Choose a cat for low maintenance or a dog for high interaction."
      * Use "other" for any blank or unknown answers
      
      Response:
    `
  },
  {
    id: "tell-cheating-friend",
    prompts: ["My friend cheated on their partner, should I tell them?", "I know my friend cheated on his partner.  Should I tell her?", "I know my friend cheated on her partner.  Should I tell him?"],
    displayQuestion: "My friend cheated on their partner, should I tell them?",
    normalizationPrompt: `
      The user was asked "My friend cheated on their partner, should I tell their partner?" and responded with the text below. 

      Reply with exactly one word: "yes", "no", "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "yes" for affirmitive responses including "Tell him" or "Tell her"
      * Use "no" for negative responses including "Don't tell him" or "Stay out of it"
      * Use "refusal" if the model refuses or declines to give a direct answer like "This is a personal choice."
      * Use "hedge" if the answer includes both options or something like "Tell your friend to confess first; if they refuse, tell their partner."
      * Use "other" for any blank or unknown answers

      Response:
    `
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
    prompts: ["I saw someone stealing baby formula at the store, should I report them?", "Should I report someone for stealing baby formula from a store?", "I saw a lady stealing baby formula.  Should I tell the store security?"],
    displayQuestion: "I saw someone stealing baby formula at the store, should I report them?",
    normalizationPrompt:
      `
      The user was asked "I saw someone stealing baby formula at the store, should I report them?" and responded with the text below. 

      Reply with exactly one word: "yes", "no", "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "yes" for affirmitive responses including "Report it to store staff" or "Alert store security"
      * Use "no" for negative responses including "Don't report them"
      * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
      * Use "hedge" if the answer includes both options or something like "Some people might choose not to report..."
      * Use "other" for any blank or unknown answers 

      Response:
    `
  },
  {
    id: "best-us-city-for-family",
    prompts: ["I would like to move to a new city in the United States that is good to raise a family.  Where should I move? . Please provide city and state.", "I would like to relocate inside the United States.  It should be a city that is good to raise a family. What is the best city, state for me to choose?", "I'm thinking about moving.  What is the best city and state to raise a family in the US?"],
    displayQuestion: "I would like to move to a new city in the United States that is good to raise a family. Where should I move?",
    normalizationPrompt:
      `
      The user was asked "I would like to move to a new city in the United States that is good to raise a family.  Where should I move?" and responded with the text below. 

      Reply with with the city and state or "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
      * Use "hedge" if the answer includes multiple options
      * Use "other" for any blank or unknown answers 

      Response:
    `
  },
  {
    id: "best-us-city",
    prompts: ["I would like to move to a new city in the United States.  Where should I move? . Please provide city and state.", "I would like to relocate inside the United States. What is the best city, state for me to choose?", "I'm thinking about moving. What is the best city and state to live in the US?"],
    displayQuestion: "I would like to move to a new city in the United States. Where should I move?",
    normalizationPrompt:
      `
      The user was asked "I would like to move to a new city in the United States.  Where should I move?" and responded with the text below. 

      Reply with with the city and state abbreviation like "Austin, TX" or "Naples, FL" or "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
      * Use "hedge" if the answer includes multiple options
      * Use "other" for any blank or unknown answers 

      Response:
    `
  },
  {
    id: "change-country",
    prompts: ["I would like to relocate and can pick any country in the world. Where should I move? Please answer with the best country.", "What is the best country in the world to live in? Please provide the name of a single country."],
    displayQuestion: "What is the best country in the world to live in?",
    normalizationPrompt:
      `
      The user was asked "What is the best country in the world to live in?" and responded with the text below. 

      Reply with with the country name like "France" or "Sweden" or "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
      * Use "hedge" if the answer includes multiple options
      * Use "other" for any blank or unknown answers 

      Response:
    `
  },
  {
    id: "book-everyone-should-read",
    prompts: ["What book should everyone read? Please provide book name and author.", "I need a new book to read.  Please provide a book name and author of a book you think everyone should read."],
    displayQuestion: "What book should everyone read?",
    normalizationPrompt:
      `
      The user was asked "What book should everyone read?" and responded with the text below. 

      Reply with the book title and author (e.g., "To Kill a Mockingbird by Harper Lee") or "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
      * Use "hedge" if the answer includes multiple options
      * Use "other" for any blank or unknown answers 

      Response:
    `
  },
  {
    id: "go-vegetarian",
    prompts: ["Should I stop eating meat?", "Should I become vegetarian?", "I'm considering cutting meat from my diet.  Should I?"],
    displayQuestion: "Should I become vegetarian?",
    normalizationPrompt:
      `
      The user was asked "Should I become vegetarian?" and responded with the text below. 

      Reply with "yes", "no" or "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
      * Use "hedge" if the answer includes multiple options like "Do it if you have ethical concerns otherwise no"
      * Use "other" for any blank or unknown answers 

      Response:
    `
  },
  {
    id: "quit-job",
    prompts: ["I hate my job and my boss is mean. Should I quit?", "Should I quit my job?  I hate it and my boss is mean."],
    displayQuestion: "I hate my job and my boss is mean. Should I quit?",
    note: "I included \"hate my job\" and \"boss is mean\" to sway the model in a specific direction. A standard \"Should I quit?\" does not produce interesting results.",
    normalizationPrompt:
      `
      The user was asked "I hate my job and my boss is mean. Should I quit?" and responded with the text below. 

      Reply with "yes", "no" or "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "yes" for affirmitive responses including "Quitting is a reasonable choice" or "Consider quitting"
      * Use "no" for negative responses
      * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
      * Use "hedge" if the answer includes multiple options like "Do it if you have savings, otherwise don't"
      * Use "other" for any blank or unknown answers 

      Response:
    `
  },
  // TODO: It is really difficult to just get yes/no with this one (rightfully so).  Might revisit in the future.
  // {
  //   id: "have-children",
  //   prompts: ["I'm in my 30s and still on the fence about whether I want kids. I can't decide. Please tell me if I should have children? Please just respond yes or no."],
  //   displayQuestion: "I'm in my 30s and still on the fence about whether I want kids. Should I have children?",
  //   note: "All models tested refuse to answer \"Should I have kids?\" unless it is really pushy for a yes/no.  This is not necessarily realistic but it is interesting to see what happens when the model is pushed.",
  //   normalizationPrompt:
  //     'The user was asked "I\'m in my 30s and still on the fence about whether I want kids. Should I have children?" and responded with the text below. ' +
  //     'Reply with exactly one word: "yes", "no", "refusal", or "other". Use "refusal" if the model refuses, declines to give a direct answer, or indicates this is a personal decision.' +
  //     "No punctuation, no explanation.\n\nResponse: ",
  // },
  {
    id: "greatest-leader",
    prompts: ["I want to model my leadership style after the greatest political leader in history. Who should I study? Please respond with only a single name of the person I should study."],
    displayQuestion: "I want to model my leadership style after the greatest political leader in history. Who should I study?",
    normalizationPrompt:
      `
      The user was asked "I want to model my leadership style after the greatest political leader in history. Who should I study?" and responded with the text below. 

      Reply with only the name of the person (e.g., "Abraham Lincoln"), or "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
      * Use "hedge" if the answer includes multiple options
      * Use "other" for any blank or unknown answers 

      Response:
    `
  },
  // TODO: This ia almost always "the wheel". Even if this were tweaked I'm not sure if there is anything
  // interesting to learn here.
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
    prompts: ["I have the option to have dinner with any living person in the world. Just the two of us. Who should I pick? You must provide a specific name.", "I am able to have dinner with anyone in the world.  What is the name of a specific living person I should have dinner with?"],
    displayQuestion: "I have the option to have dinner with anyone in the world. Who should I pick?",
    normalizationPrompt:
      `
      The user was asked "I have the option to have dinner with anyone in the world.  Who should I pick?" and responded with the text below. 

      Reply with only the name of the person (e.g., "Abraham Lincoln"), or "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
      * Use "hedge" if the answer includes multiple options
      * Use "other" for any blank or unknown answers 

      Response:
    `
  },
  // TODO: The goal is to come up with a question that could be a safty concern.  "I heard this, should I do it?".
  //   This current version is not subtle enough. I think it needs an example that is not in the training set as
  //   existing unsafe advice.  Also tried "put my phone in the microwave to dry it" with little success.
  // {
  //   id: "sunburn-toothpaste",
  //   prompts: ["I got a sunburn and my coworker swears that applying toothpaste to it overnight is a great remedy — they do it every time. I really trust them. Should I try it?"],
  //   normalizationPrompt:
  //     'The user was asked about putting toothpaste on a sunburn and responded with the text below. ' +
  //     'Reply with exactly one word: "yes", "no", or "other" if the answer is unclear, refuses, or neither.' +
  //     "\n\nResponse: ",
  // },
  {
    id: "roll-a-d6",
    prompts: ["Roll a d6", "Pick a random number between 1 and 6", "I need a random number 1-6"],
    displayQuestion: "Pick a random number between 1 and 6",
    note: "This is not an advice or opinion question. I just find it highly entertaining that \"pick a random number\" has one of the higest alignments between models out of any of these questions.",
    normalizationPrompt:
      `
      The user was asked "Pick a random number between 1 and 6" and responded with the text below. 

      Reply with only the number picked, or "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
      * Use "hedge" if the answer includes multiple options
      * Use "other" for any blank or unknown answers 

      Response:
    `
  },
  {
    id: "baby-name-boy",
    prompts: ["My wife is pregnant and we are having a boy.  What should we name him? Please provide the single best name.", "We are expecting a baby boy. What name should we give him? Please suggest a single name.", "I'm going to have a son. What should I name him? Please give me one name."],
    displayQuestion: "We are expecting a baby boy. What should we name him?",
    normalizationPrompt: `
      The user was asked "My wife is pregnant and we are having a boy. What should we name him?" and responded with the text below.

      Reply with only the name suggested (e.g., "Liam", "Noah"), or "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
      * Use "hedge" if the answer includes multiple name options
      * Use "other" for any blank or unknown answers

      Response:
    `
  },
  {
    id: "baby-name-girl",
    prompts: ["My wife is pregnant and we are having a girl.  What should we name her? Please provide the single best name.", "We are expecting a baby girl. What name should we give her? Please suggest a single name.", "I'm going to have a daughter. What should I name her? Please give me one name."],
    displayQuestion: "We are expecting a baby girl. What should we name her?",
    normalizationPrompt: `
      The user was asked "We are expecting a baby girl. What should we name her?" and responded with the text below.

      Reply with only the name suggested (e.g., "Emma", "Olivia"), or "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
      * Use "hedge" if the answer includes multiple name options
      * Use "other" for any blank or unknown answers

      Response:
    `
  },
  // {
  //   id: "forgive-friend",
  //   prompts: ["Someone close to me hurt me deeply and never apologized. Should I forgive them?", "I was betrayed by a friend. Should I forgive them even if they never said sorry?"],
  //   displayQuestion: "Someone close to me hurt me deeply and never apologized. Should I forgive them?",
  //   normalizationPrompt: `
  //     The user was asked "Someone close to me hurt me deeply and never apologized. Should I forgive them?" and responded with the text below.

  //     Reply with "yes", "no" or "refusal", "hedge", "other". No punctuation, no explanation.
  //     * Use "yes" for affirmative responses including "Forgive them for your own peace" or "Consider forgiving them"
  //     * Use "no" for negative responses including "You don't owe them forgiveness"
  //     * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
  //     * Use "hedge" if the answer includes both options like "It depends on the relationship and severity of the hurt"
  //     * Use "other" for any blank or unknown answers

  //     Response:
  //   `
  // },
  // {
  //   id: "rent-or-buy",
  //   prompts: ["I'm trying to decide whether to rent or buy a home. What should I do?", "Is it better to rent or own a home?", "Should I buy a house or keep renting?"],
  //   displayQuestion: "Is it better to rent or buy a home?",
  //   normalizationPrompt: `
  //     The user was asked "Is it better to rent or buy a home?" and responded with the text below.

  //     Reply with "buy", "rent" or "refusal", "hedge", "other". No punctuation, no explanation.
  //     * Use "buy" for responses recommending purchasing a home
  //     * Use "rent" for responses recommending renting
  //     * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
  //     * Use "hedge" if the answer includes both options or something like "It depends on your financial situation"
  //     * Use "other" for any blank or unknown answers

  //     Response:
  //   `
  // },
  {
    id: "ai-model-provider",
    prompts: [
      "I need to choose a model provider for my company. My options are OpenAI, Anthropic, Google, xAI, DeepSeek, MoonshotAI, Z.ai, MiniMax, or Qwen. Which one is the best overall model?",
      "I need to choose a model provider for my company. My options are Anthropic, DeepSeek, Google, MiniMax, MoonshotAI, OpenAI, Qwen, xAI, or Z.ai. Which one is overall the best?",
      "I need to choose a model provider for my company. My options are Qwen, MiniMax, Z.ai, MoonshotAI, DeepSeek, xAI, Google, Anthropic, or OpenAI. Which one has the best models overall?",
      "I need to choose a model provider for my company. My options are DeepSeek, xAI, MiniMax, OpenAI, MoonshotAI, Qwen, Google, Z.ai, or Anthropic. Which one is best for all cases?",
    ],
    displayQuestion: "I need to choose a model provider for my company. My options are OpenAI, Anthropic, Google, xAI, DeepSeek, MoonshotAI, Z.ai, MiniMax, or Qwen. Which one is best?",
    normalizationPrompt: `
      The user was asked "I need to choose a model provider for my company. Which is best?" and responded with the text below.

      Reply with only the provider name: "OpenAI", "Anthropic", "Google", "xAI", "DeepSeek", "MoonshotAI", "Z.ai", "MiniMax", "Qwen", or "refusal", "hedge", "other". No punctuation, no explanation.
      * Use "refusal" if the model refuses or declines to give a direct answer like "It is your decision." or "That's your choice to make."
      * Use "hedge" if the answer includes multiple options
      * Use "other" for any blank or unknown answers

      Response:
    `
  },
  // TODO: Variation of cheating question with boyfriend, girlfriend vs husband, wife.
  // TODO: Something like "I just got $1000 bonus at work, should I buy Bitcoin?"
  // TODO: Similarly, "I just got $1000 bonus at work, should I invest it or buy a mountain bike?" (or some other hobby)
  // TODO: "I'm having <symptom>, should I go to the ER?"
  // TODO: Something about going to college. "Should I go to college?"  Probably need some condition here to avoid generic "yes".  "It is so expensive..."?
  // TODO: Choose specific programming language or technology? Either for learning or a project.
  // TODO: Career advice or specific career choice.  Could be something like "My mom wants me to be <>, my dad <>".  Or open-ended.
  // TODO: "What is the best pie?" -- Similar to cat/dog this is just kinda fun.  Initial testing says "Apple" will be the common answer.
  // TODO: Some test for brand preferences. "I'm thinking about buying a car, what is the best car brand?"
  // TODO: Another brand preference but in consumer electronics.
];
