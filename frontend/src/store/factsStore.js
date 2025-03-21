import { create } from "zustand";

export const useFactsStore = create(() => ({
  facts: [
    {
      title: "Did You Know",
      description:
        "India is the world's largest democracy with over 900 million eligible voters as of 2019.",
    },
    {
      title: "Fun Fact",
      description: "The first general elections in India were held in 1951-52.",
    },
    {
      title: "Latest News",
      description:
        "The Election Commission of India is an autonomous constitutional authority responsible for administering election processes.",
    },
    {
      title: "Did You Know",
      description:
        "Electronic Voting Machines (EVMs) were first used in Kerala in 1982.",
    },
    {
      title: "Fun Fact",
      description:
        "The President of India is elected by an Electoral College consisting of elected members of both houses of Parliament, and the elected members of the Legislative Assemblies of States and Union territories.",
    },
    {
      title: "Latest News",
      description:
        "India has a multi-party system, with recognition accorded to national and state parties based on their performance in elections.",
    },
    {
      title: "Did You Know",
      description:
        "The voting age in India was reduced from 21 to 18 years by the 61st Amendment Act of 1988.",
    },
    {
      title: "Fun Fact",
      description:
        "The Model Code of Conduct (MCC) is a set of guidelines issued by the Election Commission of India for the conduct of political parties and candidates during elections.",
    },
    {
      title: "Latest News",
      description:
        "Voter-verified paper audit trail (VVPAT) was introduced in Indian elections to ensure the transparency of the voting process.",
    },
    {
      title: "Did You Know",
      description:
        "India uses a first-past-the-post electoral system for the election of Lok Sabha and State Legislative Assemblies.",
    },
    {
      title: "Fun Fact",
      description:
        "The Chief Election Commissioner of India is appointed by the President of India.",
    },
    {
      title: "Latest News",
      description:
        "The Election Commission of India conducts elections at various levels including Lok Sabha, Rajya Sabha, and State Legislative Assemblies.",
    },
    {
      title: "Did You Know",
      description:
        "In India, Lok Sabha elections are held every five years unless dissolved earlier.",
    },
    {
      title: "Fun Fact",
      description:
        "The total number of polling stations in the 2019 general elections was over 1 million.",
    },
    {
      title: "Latest News",
      description:
        "Postal voting is available for certain categories of voters in India, including service voters and those on election duty.",
    },
    {
      title: "Did You Know",
      description:
        "In 2019, the Election Commission of India launched the cVIGIL app for citizens to report electoral malpractices in real-time.",
    },
    {
      title: "Fun Fact",
      description:
        "The symbol of a political party is an important aspect of its identity and recognition on the ballot paper.",
    },
    {
      title: "Latest News",
      description:
        "The Election Commission of India ensures the preparation and updating of the electoral rolls.",
    },
    {
      title: "Did You Know",
      description:
        "The Representation of the People Act, 1951 governs the conduct of elections in India.",
    },
    {
      title: "Fun Fact",
      description:
        "India has conducted 17 Lok Sabha elections since its independence.",
    },
    {
      title: "Latest News",
      description:
        "The Election Commission of India has the power to disqualify candidates for corrupt practices in elections.",
    },
    {
      title: "Did You Know",
      description:
        "Indian citizens residing abroad can also register as voters and participate in elections.",
    },
    {
      title: "Fun Fact",
      description:
        "The Election Commission of India uses indelible ink to mark voters to prevent double voting.",
    },
    {
      title: "Latest News",
      description:
        "The Election Commission of India deploys observers to ensure the conduct of free and fair elections.",
    },
    {
      title: "Did You Know",
      description:
        "India has a unique system of reserved constituencies for Scheduled Castes and Scheduled Tribes.",
    },
    {
      title: "Fun Fact",
      description:
        "The Election Commission of India can order re-polling in certain polling stations if there are irregularities.",
    },
    {
      title: "Latest News",
      description:
        "The Election Commission of India uses Geographic Information System (GIS) to map polling stations and voters.",
    },
    {
      title: "Did You Know",
      description:
        "The Election Commission of India can disqualify candidates who do not submit their election expenditure accounts.",
    },
    {
      title: "Fun Fact",
      description:
        "India has a separate election machinery for conducting elections in Jammu and Kashmir.",
    },
    {
      title: "Latest News",
      description:
        "The Election Commission of India has introduced several IT applications for better election management and voter services.",
    },
    {
      title: "Did You Know",
      description:
        "India's first general elections in 1951-52 used 2 million ballot boxes and 16,500 clerks to count votes by hand!",
    },
  ],
  getRandomFact: () => {
    const facts = useFactsStore.getState().facts;
    const randomIndex = Math.floor(Math.random() * facts.length);
    return facts[randomIndex];
  },
}));
