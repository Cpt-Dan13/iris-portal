export type ProspectiveLevel = 'HIGH' | 'MODERATE' | 'LOW';

export interface PersonalityTag {
  label: string;
  color: string;
}

export interface ConversationMessage {
  role: 'her' | 'you';
  text: string;
  timestamp: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  photo: string;
  allureScore: number;
  prospectiveScore: number;
  prospectiveLevel: ProspectiveLevel;
  tags: PersonalityTag[];
  bio: string;
  about: string;
  vitals: { icon: string; label: string; value: string }[];
  life: { icon: string; label: string; value: string }[];
  relationshipGoals: { icon: string; label: string; value: string }[];
  conversation: ConversationMessage[];
}

export interface ReportDataPoint {
  date: string;
  score: number;
  success: number;
}

export const PERSONALITY_TAGS: Record<string, { label: string; color: string }> = {
  playful:      { label: 'Playful',      color: '#ec4899' },
  adventurous:  { label: 'Adventurous',  color: '#f59e0b' },
  openMinded:   { label: 'Open-Minded',  color: '#3b82f6' },
  sensual:      { label: 'Sensual',      color: '#ef4444' },
  rebellious:   { label: 'Rebellious',   color: '#8b5cf6' },
  authentic:    { label: 'Authentic',    color: '#22c55e' },
};

export const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Sophia',
    age: 26,
    location: 'New York, NY',
    photo: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=800',
    allureScore: 94,
    prospectiveScore: 88,
    prospectiveLevel: 'HIGH',
    tags: [PERSONALITY_TAGS.playful, PERSONALITY_TAGS.adventurous, PERSONALITY_TAGS.authentic],
    bio: 'Coffee enthusiast & weekend hiker. I love discovering hidden gems in the city and cooking elaborate Sunday dinners.',
    about: 'I\'m a UX designer who believes good design changes lives. When I\'m not prototyping, you\'ll find me rock climbing or at a farmers market.',
    vitals: [
      { icon: 'ruler', label: 'Height', value: '5\'7"' },
      { icon: 'star', label: 'Zodiac', value: 'Scorpio' },
      { icon: 'graduation-cap', label: 'Education', value: 'Cornell University' },
      { icon: 'briefcase', label: 'Job', value: 'UX Designer at Figma' },
    ],
    life: [
      { icon: 'wine', label: 'Drinking', value: 'Socially' },
      { icon: 'cigarette-off', label: 'Smoking', value: 'Never' },
      { icon: 'dumbbell', label: 'Exercise', value: 'Often' },
      { icon: 'dog', label: 'Pets', value: 'Dog lover' },
    ],
    relationshipGoals: [
      { icon: 'heart', label: 'Looking for', value: 'Long-term relationship' },
      { icon: 'baby', label: 'Kids', value: 'Open to kids' },
      { icon: 'home', label: 'Living', value: 'Manhattan' },
    ],
    conversation: [
      { role: 'her', text: 'Hey! I saw you also love hiking — have you done the Adirondacks?', timestamp: '2:14 PM' },
      { role: 'you', text: 'Yes! Cascade Mountain last fall was incredible. You been?', timestamp: '2:17 PM' },
      { role: 'her', text: 'Twice actually! The views from the summit are unreal. What\'s next on your list?', timestamp: '2:19 PM' },
      { role: 'you', text: 'Honestly I\'ve been eyeing some trails in Patagonia. Maybe too ambitious haha', timestamp: '2:22 PM' },
      { role: 'her', text: 'No such thing as too ambitious! I went to Patagonia in 2022 — Torres del Paine is life-changing', timestamp: '2:24 PM' },
      { role: 'you', text: 'Okay now I\'m jealous. How long were you there?', timestamp: '2:25 PM' },
      { role: 'her', text: 'Two weeks. I went with a friend but honestly it would be fun to go back with the right person...', timestamp: '2:28 PM' },
    ],
  },
  {
    id: '2',
    name: 'Aria',
    age: 24,
    location: 'Brooklyn, NY',
    photo: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=800',
    allureScore: 87,
    prospectiveScore: 74,
    prospectiveLevel: 'HIGH',
    tags: [PERSONALITY_TAGS.openMinded, PERSONALITY_TAGS.rebellious, PERSONALITY_TAGS.playful],
    bio: 'Photographer & analog film collector. My cat Miso thinks she runs the apartment (she does).',
    about: 'Art director by day, DJ on weekends. I believe in long dinners, good wine, and even better conversation.',
    vitals: [
      { icon: 'ruler', label: 'Height', value: '5\'5"' },
      { icon: 'star', label: 'Zodiac', value: 'Gemini' },
      { icon: 'graduation-cap', label: 'Education', value: 'Pratt Institute' },
      { icon: 'briefcase', label: 'Job', value: 'Art Director' },
    ],
    life: [
      { icon: 'wine', label: 'Drinking', value: 'Often' },
      { icon: 'cigarette-off', label: 'Smoking', value: 'Sometimes' },
      { icon: 'dumbbell', label: 'Exercise', value: 'Sometimes' },
      { icon: 'cat', label: 'Pets', value: 'Has cats' },
    ],
    relationshipGoals: [
      { icon: 'heart', label: 'Looking for', value: 'Something casual' },
      { icon: 'baby', label: 'Kids', value: 'Doesn\'t want kids' },
      { icon: 'home', label: 'Living', value: 'Williamsburg' },
    ],
    conversation: [
      { role: 'her', text: 'Your photos on your profile are amazing. What camera do you shoot with?', timestamp: '7:30 PM' },
      { role: 'you', text: 'Thanks! I mix it up — Canon R5 for digital, Contax T2 for film. You shoot?', timestamp: '7:33 PM' },
      { role: 'her', text: 'YES. Contax gang. I have the G2 and I\'m obsessed', timestamp: '7:35 PM' },
      { role: 'you', text: 'Okay you have good taste. What do you usually shoot?', timestamp: '7:36 PM' },
      { role: 'her', text: 'Mostly urban portraiture. I love finding interesting light in weird parts of the city', timestamp: '7:39 PM' },
    ],
  },
  {
    id: '3',
    name: 'Maya',
    age: 28,
    location: 'Manhattan, NY',
    photo: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=800',
    allureScore: 82,
    prospectiveScore: 71,
    prospectiveLevel: 'HIGH',
    tags: [PERSONALITY_TAGS.sensual, PERSONALITY_TAGS.authentic],
    bio: 'Wine sommelier & amateur chef. Currently working through Julia Child\'s complete cookbook.',
    about: 'I work in hospitality and love everything about the art of hosting. Nothing makes me happier than a great dinner party.',
    vitals: [
      { icon: 'ruler', label: 'Height', value: '5\'6"' },
      { icon: 'star', label: 'Zodiac', value: 'Taurus' },
      { icon: 'graduation-cap', label: 'Education', value: 'NYU' },
      { icon: 'briefcase', label: 'Job', value: 'Sommelier' },
    ],
    life: [
      { icon: 'wine', label: 'Drinking', value: 'Often' },
      { icon: 'cigarette-off', label: 'Smoking', value: 'Never' },
      { icon: 'dumbbell', label: 'Exercise', value: 'Often' },
      { icon: 'dog', label: 'Pets', value: 'No pets' },
    ],
    relationshipGoals: [
      { icon: 'heart', label: 'Looking for', value: 'Long-term relationship' },
      { icon: 'baby', label: 'Kids', value: 'Wants kids someday' },
      { icon: 'home', label: 'Living', value: 'Upper West Side' },
    ],
    conversation: [
      { role: 'her', text: 'I\'m curious — what\'s the best meal you\'ve ever cooked?', timestamp: '8:00 PM' },
      { role: 'you', text: 'Hmm. Probably a duck confit with cherry gastrique that I made on a whim', timestamp: '8:03 PM' },
      { role: 'her', text: 'Okay I\'m impressed. That\'s a serious dish. Where did you learn?', timestamp: '8:05 PM' },
      { role: 'you', text: 'Lots of YouTube and a stubborn refusal to fail. You\'re a sommelier — what wine pairs with that?', timestamp: '8:08 PM' },
      { role: 'her', text: 'Classic choice would be a Burgundy Pinot Noir. But honestly? I\'d go Côtes du Rhône for the depth with cherry notes', timestamp: '8:10 PM' },
    ],
  },
  {
    id: '4',
    name: 'Zoe',
    age: 25,
    location: 'Jersey City, NJ',
    photo: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=800',
    allureScore: 76,
    prospectiveScore: 58,
    prospectiveLevel: 'MODERATE',
    tags: [PERSONALITY_TAGS.adventurous, PERSONALITY_TAGS.openMinded],
    bio: 'Environmental lawyer and weekend paddleboarder. I care about the planet and good espresso.',
    about: 'Fighting for climate policy by day, making sourdough by night. I\'m a homebody who occasionally runs half marathons.',
    vitals: [
      { icon: 'ruler', label: 'Height', value: '5\'8"' },
      { icon: 'star', label: 'Zodiac', value: 'Virgo' },
      { icon: 'graduation-cap', label: 'Education', value: 'Columbia Law' },
      { icon: 'briefcase', label: 'Job', value: 'Environmental Attorney' },
    ],
    life: [
      { icon: 'wine', label: 'Drinking', value: 'Socially' },
      { icon: 'cigarette-off', label: 'Smoking', value: 'Never' },
      { icon: 'dumbbell', label: 'Exercise', value: 'Often' },
      { icon: 'dog', label: 'Pets', value: 'Dog mom' },
    ],
    relationshipGoals: [
      { icon: 'heart', label: 'Looking for', value: 'Long-term relationship' },
      { icon: 'baby', label: 'Kids', value: 'Wants kids' },
      { icon: 'home', label: 'Living', value: 'Jersey City' },
    ],
    conversation: [
      { role: 'her', text: 'So are you also obsessed with reading or is that just me?', timestamp: '11:00 AM' },
      { role: 'you', text: 'Definitely yes. What\'s on your current reading list?', timestamp: '11:04 AM' },
      { role: 'her', text: 'Just finished Bewilderment by Richard Powers — emotionally destroyed me', timestamp: '11:06 AM' },
      { role: 'you', text: 'Oh wow. The Overstory is still in my top 5 ever. He\'s incredible', timestamp: '11:09 AM' },
    ],
  },
  {
    id: '5',
    name: 'Luna',
    age: 23,
    location: 'Astoria, NY',
    photo: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=800',
    allureScore: 71,
    prospectiveScore: 53,
    prospectiveLevel: 'MODERATE',
    tags: [PERSONALITY_TAGS.playful, PERSONALITY_TAGS.rebellious],
    bio: 'Bartender turned mixologist. I can make any cocktail better.',
    about: 'Creative spirits (pun intended). I draw, I mix, I host.',
    vitals: [
      { icon: 'ruler', label: 'Height', value: '5\'4"' },
      { icon: 'star', label: 'Zodiac', value: 'Sagittarius' },
      { icon: 'graduation-cap', label: 'Education', value: 'Some college' },
      { icon: 'briefcase', label: 'Job', value: 'Head Bartender' },
    ],
    life: [
      { icon: 'wine', label: 'Drinking', value: 'Often' },
      { icon: 'cigarette-off', label: 'Smoking', value: 'Socially' },
      { icon: 'dumbbell', label: 'Exercise', value: 'Rarely' },
      { icon: 'dog', label: 'Pets', value: 'No pets' },
    ],
    relationshipGoals: [
      { icon: 'heart', label: 'Looking for', value: 'Something casual' },
      { icon: 'baby', label: 'Kids', value: 'Open to kids' },
      { icon: 'home', label: 'Living', value: 'Astoria' },
    ],
    conversation: [
      { role: 'her', text: 'Okay I have to ask — bourbon or rye in an Old Fashioned?', timestamp: '10:00 PM' },
      { role: 'you', text: 'Rye. Bourbon is too sweet for me there', timestamp: '10:02 PM' },
      { role: 'her', text: 'CORRECT ANSWER. Most people say bourbon and they\'re wrong', timestamp: '10:03 PM' },
    ],
  },
  {
    id: '6',
    name: 'Ivy',
    age: 27,
    location: 'Hoboken, NJ',
    photo: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=800',
    allureScore: 68,
    prospectiveScore: 61,
    prospectiveLevel: 'MODERATE',
    tags: [PERSONALITY_TAGS.authentic, PERSONALITY_TAGS.adventurous],
    bio: 'Pediatric nurse with a travel obsession. 31 countries and counting.',
    about: 'Healing people by day, exploring the world on weekends. I speak passable Spanish and terrible Italian.',
    vitals: [
      { icon: 'ruler', label: 'Height', value: '5\'6"' },
      { icon: 'star', label: 'Zodiac', value: 'Leo' },
      { icon: 'graduation-cap', label: 'Education', value: 'Hunter College' },
      { icon: 'briefcase', label: 'Job', value: 'Pediatric Nurse' },
    ],
    life: [
      { icon: 'wine', label: 'Drinking', value: 'Socially' },
      { icon: 'cigarette-off', label: 'Smoking', value: 'Never' },
      { icon: 'dumbbell', label: 'Exercise', value: 'Often' },
      { icon: 'dog', label: 'Pets', value: 'Dog lover' },
    ],
    relationshipGoals: [
      { icon: 'heart', label: 'Looking for', value: 'Long-term relationship' },
      { icon: 'baby', label: 'Kids', value: 'Wants kids' },
      { icon: 'home', label: 'Living', value: 'Hoboken' },
    ],
    conversation: [
      { role: 'her', text: 'Where would you go if you could travel anywhere tomorrow?', timestamp: '3:00 PM' },
      { role: 'you', text: 'Japan in spring. Cherry blossoms and ramen every day', timestamp: '3:04 PM' },
      { role: 'her', text: 'Excellent choice. I went last spring — Kyoto especially is surreal', timestamp: '3:06 PM' },
    ],
  },
  {
    id: '7',
    name: 'Nadia',
    age: 29,
    location: 'Flushing, NY',
    photo: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=800',
    allureScore: 63,
    prospectiveScore: 42,
    prospectiveLevel: 'LOW',
    tags: [PERSONALITY_TAGS.sensual, PERSONALITY_TAGS.openMinded],
    bio: 'Data scientist who paints on weekends. I analyze patterns everywhere.',
    about: 'I find meaning in both numbers and color. PhD dropout turned startup analyst.',
    vitals: [
      { icon: 'ruler', label: 'Height', value: '5\'5"' },
      { icon: 'star', label: 'Zodiac', value: 'Capricorn' },
      { icon: 'graduation-cap', label: 'Education', value: 'MIT (PhD candidate)' },
      { icon: 'briefcase', label: 'Job', value: 'Senior Data Scientist' },
    ],
    life: [
      { icon: 'wine', label: 'Drinking', value: 'Rarely' },
      { icon: 'cigarette-off', label: 'Smoking', value: 'Never' },
      { icon: 'dumbbell', label: 'Exercise', value: 'Sometimes' },
      { icon: 'dog', label: 'Pets', value: 'No pets' },
    ],
    relationshipGoals: [
      { icon: 'heart', label: 'Looking for', value: 'Not sure yet' },
      { icon: 'baby', label: 'Kids', value: 'Doesn\'t want kids' },
      { icon: 'home', label: 'Living', value: 'Flushing' },
    ],
    conversation: [
      { role: 'her', text: 'Hi', timestamp: '6:00 PM' },
      { role: 'you', text: 'Hey! How\'s your day going?', timestamp: '6:10 PM' },
      { role: 'her', text: 'Fine. You?', timestamp: '8:00 PM' },
    ],
  },
  {
    id: '8',
    name: 'Priya',
    age: 26,
    location: 'Long Island City, NY',
    photo: 'https://images.pexels.com/photos/1820919/pexels-photo-1820919.jpeg?auto=compress&cs=tinysrgb&w=800',
    allureScore: 59,
    prospectiveScore: 38,
    prospectiveLevel: 'LOW',
    tags: [PERSONALITY_TAGS.playful, PERSONALITY_TAGS.authentic],
    bio: 'Startup founder and reluctant early riser. My startup might be my longest relationship.',
    about: 'Building a sustainability app. Fueled by chai and optimism.',
    vitals: [
      { icon: 'ruler', label: 'Height', value: '5\'3"' },
      { icon: 'star', label: 'Zodiac', value: 'Aries' },
      { icon: 'graduation-cap', label: 'Education', value: 'Wharton' },
      { icon: 'briefcase', label: 'Job', value: 'Founder & CEO' },
    ],
    life: [
      { icon: 'wine', label: 'Drinking', value: 'Socially' },
      { icon: 'cigarette-off', label: 'Smoking', value: 'Never' },
      { icon: 'dumbbell', label: 'Exercise', value: 'Rarely' },
      { icon: 'dog', label: 'Pets', value: 'No pets' },
    ],
    relationshipGoals: [
      { icon: 'heart', label: 'Looking for', value: 'Long-term relationship' },
      { icon: 'baby', label: 'Kids', value: 'Wants kids someday' },
      { icon: 'home', label: 'Living', value: 'Long Island City' },
    ],
    conversation: [
      { role: 'her', text: 'Hey! What do you do for work?', timestamp: '9:00 AM' },
      { role: 'you', text: 'Product management at a fintech. What about you?', timestamp: '9:15 AM' },
    ],
  },
];

export const REPORT_DATA: ReportDataPoint[] = [
  { date: 'May 27', score: 68, success: 20 },
  { date: 'May 28', score: 72, success: 25 },
  { date: 'May 29', score: 75, success: 28 },
  { date: 'May 30', score: 71, success: 22 },
  { date: 'May 31', score: 78, success: 35 },
  { date: 'Jun 1',  score: 82, success: 40 },
  { date: 'Jun 2',  score: 86, success: 52 },
  { date: 'Jun 3',  score: 89, success: 58 },
];

export const levelColor: Record<ProspectiveLevel, string> = {
  HIGH:     '#22c55e',
  MODERATE: '#3b82f6',
  LOW:      '#eab308',
};
