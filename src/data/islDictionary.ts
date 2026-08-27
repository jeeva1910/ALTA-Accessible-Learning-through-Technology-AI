import { ISLDictionaryEntry } from '../types/isl';

export const ISL_DICTIONARY: Record<string, ISLDictionaryEntry> = {
  // ==========================================
  // 1. SOCIAL INTERACTION & COURTESIES (ISLRTC)
  // ==========================================
  namaste: {
    id: 'sign_namaste',
    search_key: 'namaste',
    gloss: 'NAMASTE',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Both flat hands pressed palm-to-palm at chest level (Anjali Mudra)',
    movementDescription: 'Gentle forward bow of head and chest with hands held together',
    nonManualMarkers: 'Respectful, serene smile and eye contact',
    difficulty: 'Beginner',
    tags: ['greeting', 'indian culture', 'respect', 'social']
  },
  hello: {
    id: 'sign_hello',
    search_key: 'hello',
    gloss: 'HELLO',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Flat open hand (B-handshape) near right temple',
    movementDescription: 'Salute outward from temple waving slightly forward',
    nonManualMarkers: 'Warm, welcoming smile and raised brows',
    difficulty: 'Beginner',
    tags: ['greeting', 'social', 'everyday']
  },
  welcome: {
    id: 'sign_welcome',
    search_key: 'welcome',
    gloss: 'WELCOME',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Open flat hand with palm facing upward sweeps inward',
    movementDescription: 'Sweep arm from outward right toward center of torso',
    nonManualMarkers: 'Open hospitable smile with inviting gaze',
    difficulty: 'Beginner',
    tags: ['hospitality', 'social', 'greeting']
  },
  goodbye: {
    id: 'sign_goodbye',
    search_key: 'goodbye',
    gloss: 'GOODBYE',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Open palm facing forward with fingers flexing',
    movementDescription: 'Wave fingers up and down or open/close palm twice',
    nonManualMarkers: 'Warm parting smile',
    difficulty: 'Beginner',
    tags: ['farewell', 'social']
  },
  thank_you: {
    id: 'sign_thank_you',
    search_key: 'thank_you',
    gloss: 'THANK-YOU',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Flat open palm with fingertips touching lips/chin',
    movementDescription: 'Move hand smoothly outward and forward towards recipient',
    nonManualMarkers: 'Grateful smile with direct appreciative eye contact',
    difficulty: 'Beginner',
    tags: ['courtesy', 'polite', 'social']
  },
  please: {
    id: 'sign_please',
    search_key: 'please',
    gloss: 'PLEASE',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Flat open palm resting on center of chest',
    movementDescription: 'Rub in gentle circular clockwise motion on chest over sternum',
    nonManualMarkers: 'Polite, earnest facial expression',
    difficulty: 'Beginner',
    tags: ['courtesy', 'polite', 'social']
  },
  sorry: {
    id: 'sign_sorry',
    search_key: 'sorry',
    gloss: 'SORRY',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Closed fist (A-handshape) against chest',
    movementDescription: 'Rub in gentle circular motion on chest over heart',
    nonManualMarkers: 'Apologetic, humble facial expression with downturned lips',
    difficulty: 'Beginner',
    tags: ['social', 'apology', 'courtesy']
  },
  excuse_me: {
    id: 'sign_excuse_me',
    search_key: 'excuse_me',
    gloss: 'EXCUSE-ME',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Dominant curved hand brushing across non-dominant flat open palm',
    movementDescription: 'Sweep fingertips across flat palm twice',
    nonManualMarkers: 'Polite questioning glance',
    difficulty: 'Intermediate',
    tags: ['courtesy', 'polite']
  },
  congratulations: {
    id: 'sign_congratulations',
    search_key: 'congratulations',
    gloss: 'CONGRATULATIONS',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Both hands in clapping or thumbs-up circular victory gestures',
    movementDescription: 'Clap enthusiastically and roll wrists upward in celebration',
    nonManualMarkers: 'Joyful radiant smile, wide open eyes',
    difficulty: 'Intermediate',
    tags: ['celebration', 'social', 'positive']
  },
  how_are_you: {
    id: 'sign_how_are_you',
    search_key: 'how_are_you',
    gloss: 'HOW-YOU',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Both curved palms rolling outward (HOW) + pointing forward (YOU)',
    movementDescription: 'Roll hands open from chest then point index finger forward',
    nonManualMarkers: 'Raised questioning eyebrows, attentive smile',
    difficulty: 'Beginner',
    tags: ['greeting', 'question', 'social']
  },
  fine: {
    id: 'sign_fine',
    search_key: 'fine',
    gloss: 'FINE / WELL',
    category: 'Social',
    videoAvailable: true,
    handshape: '5-hand with thumb touching center of chest and wiggling fingers slightly',
    movementDescription: 'Tap thumb on sternum with fingers spread',
    nonManualMarkers: 'Pleasant contented smile',
    difficulty: 'Beginner',
    tags: ['health', 'state', 'social']
  },
  happy: {
    id: 'sign_happy',
    search_key: 'happy',
    gloss: 'HAPPY',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Both flat open palms facing chest',
    movementDescription: 'Brush upward on chest twice in rapid joyful motion',
    nonManualMarkers: 'Wide radiant smile, sparkling eyes',
    difficulty: 'Beginner',
    tags: ['emotion', 'positive', 'feeling']
  },
  sad: {
    id: 'sign_sad',
    search_key: 'sad',
    gloss: 'SAD',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Both 5-hands in front of face drawing downward',
    movementDescription: 'Slowly pull hands down in front of face as head drops',
    nonManualMarkers: 'Downturned mouth, drooping eyelids, sorrowful expression',
    difficulty: 'Beginner',
    tags: ['emotion', 'feeling']
  },
  friend: {
    id: 'sign_friend',
    search_key: 'friend',
    gloss: 'FRIEND',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Both index fingers hooked (X-handshapes)',
    movementDescription: 'Interlock dominant finger over non-dominant, then reverse hook',
    nonManualMarkers: 'Warm, sincere smile',
    difficulty: 'Beginner',
    tags: ['relationship', 'people', 'social']
  },
  family: {
    id: 'sign_family',
    search_key: 'family',
    gloss: 'FAMILY',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Both hands in F-handshapes (thumb and index fingertips touching)',
    movementDescription: 'Start with index fingers touching and circle outward until pinkies meet',
    nonManualMarkers: 'Warm inclusive expression',
    difficulty: 'Intermediate',
    tags: ['people', 'home', 'relationship']
  },
  help: {
    id: 'sign_help',
    search_key: 'help',
    gloss: 'HELP',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Dominant closed fist with thumb up resting on flat non-dominant palm',
    movementDescription: 'Both hands lift together upwards and towards partner',
    nonManualMarkers: 'Supportive caring smile or questioning brow if asking',
    difficulty: 'Beginner',
    tags: ['social', 'action', 'support']
  },
  meet: {
    id: 'sign_meet',
    search_key: 'meet',
    gloss: 'MEET',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Both index fingers pointing upward (representing two people)',
    movementDescription: 'Bring both hands from opposite sides together until index knuckles touch',
    nonManualMarkers: 'Friendly eye contact',
    difficulty: 'Beginner',
    tags: ['social', 'interaction']
  },
  talk: {
    id: 'sign_talk',
    search_key: 'talk',
    gloss: 'TALK / CHAT',
    category: 'Social',
    videoAvailable: true,
    handshape: '4-fingers or index fingers moving alternating near lips',
    movementDescription: 'Tap fingertips near mouth alternating back and forth',
    nonManualMarkers: 'Engaged animated facial expressions',
    difficulty: 'Beginner',
    tags: ['communication', 'social']
  },
  together: {
    id: 'sign_together',
    search_key: 'together',
    gloss: 'TOGETHER',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Both A-fists touching together with thumbs touching',
    movementDescription: 'Circle both joined fists in horizontal plane',
    nonManualMarkers: 'Inclusive unified expression',
    difficulty: 'Intermediate',
    tags: ['social', 'group', 'unity']
  },
  love: {
    id: 'sign_love',
    search_key: 'love',
    gloss: 'LOVE',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Both arms crossed over chest in S-fists hugging self',
    movementDescription: 'Press crossed fists firmly against heart/chest',
    nonManualMarkers: 'Tender affectionate smile, soft eyes',
    difficulty: 'Beginner',
    tags: ['emotion', 'relationship']
  },
  like: {
    id: 'sign_like',
    search_key: 'like',
    gloss: 'LIKE',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Thumb and middle finger on chest pulling outward into pinch',
    movementDescription: 'Touch chest with open 8-hand and pull away while pinching thumb and middle finger',
    nonManualMarkers: 'Appreciative smile and head nod',
    difficulty: 'Beginner',
    tags: ['preference', 'positive']
  },
  dear: {
    id: 'sign_dear',
    search_key: 'dear',
    gloss: 'DEAR / BELOVED',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Curved open hand touching cheek or chest with gentle stroke',
    movementDescription: 'Stroke cheek downward tenderly',
    nonManualMarkers: 'Affectionate, warm facial expression',
    difficulty: 'Intermediate',
    tags: ['social', 'emotion']
  },
  kind: {
    id: 'sign_kind',
    search_key: 'kind',
    gloss: 'KIND / GENTLE',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Both flat hands circling one over the other in front of chest',
    movementDescription: 'Roll hands gently forward in vertical circles over each other',
    nonManualMarkers: 'Gentle, gracious smile',
    difficulty: 'Intermediate',
    tags: ['character', 'virtue', 'social']
  },

  // ==========================================
  // 2. TIME & ROUTINE
  // ==========================================
  tomorrow: {
    id: 'sign_tomorrow',
    search_key: 'tomorrow',
    gloss: 'TOMORROW',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Thumb extended (A-bar handshape) near cheek',
    movementDescription: 'Flick thumb forward in arc from cheek towards front indicating future time',
    nonManualMarkers: 'Slight chin tilt forward',
    difficulty: 'Beginner',
    tags: ['time', 'future', 'calendar']
  },
  yesterday: {
    id: 'sign_yesterday',
    search_key: 'yesterday',
    gloss: 'YESTERDAY',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Thumb pointing backward over shoulder near jawline',
    movementDescription: 'Movement directed back over the shoulder indicating past',
    nonManualMarkers: 'Head tilts backward slightly',
    difficulty: 'Beginner',
    tags: ['time', 'past', 'calendar']
  },
  today: {
    id: 'sign_today',
    search_key: 'today',
    gloss: 'TODAY / NOW-DAY',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Flat open hands (B-handshape) or Y-hands facing upward',
    movementDescription: 'Drop both hands downwards twice in signing space',
    nonManualMarkers: 'Neutral clear expression focusing on present',
    difficulty: 'Beginner',
    tags: ['time', 'present', 'day']
  },
  now: {
    id: 'sign_now',
    search_key: 'now',
    gloss: 'NOW',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Bent index and thumb (C-shape) or curved palms',
    movementDescription: 'Crisp downward motion in front of body',
    nonManualMarkers: 'Affirmative head nod',
    difficulty: 'Beginner',
    tags: ['time', 'present']
  },
  morning: {
    id: 'sign_morning',
    search_key: 'morning',
    gloss: 'MORNING',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Flat dominant hand rising from non-dominant forearm',
    movementDescription: 'Rising upward motion representing sun ascending over horizon',
    nonManualMarkers: 'Eyes open wide with refreshing smile',
    difficulty: 'Beginner',
    tags: ['time', 'day']
  },
  afternoon: {
    id: 'sign_afternoon',
    search_key: 'afternoon',
    gloss: 'AFTERNOON',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Flat dominant hand bent at 45 degree angle downward on non-dominant arm',
    movementDescription: 'Rest arm indicating sun past peak descending',
    nonManualMarkers: 'Calm relaxed look',
    difficulty: 'Beginner',
    tags: ['time', 'day']
  },
  evening: {
    id: 'sign_evening',
    search_key: 'evening',
    gloss: 'EVENING',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Curved dominant wrist dipping over horizontal non-dominant wrist',
    movementDescription: 'Lower curved hand over horizontal arm representing sunset',
    nonManualMarkers: 'Serene expression',
    difficulty: 'Beginner',
    tags: ['time', 'sunset']
  },
  night: {
    id: 'sign_night',
    search_key: 'night',
    gloss: 'NIGHT',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Dominant curved hand draping over non-dominant flat forearm',
    movementDescription: 'Downward arc covering the horizon',
    nonManualMarkers: 'Relaxed eyes with slight dimming',
    difficulty: 'Beginner',
    tags: ['time', 'evening', 'night']
  },
  daily: {
    id: 'sign_daily',
    search_key: 'daily',
    gloss: 'DAILY / EVERYDAY',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Thumb rubbing cheek forward repeatedly',
    movementDescription: 'Brush knuckle along jawline forward two or three times',
    nonManualMarkers: 'Steady continuous rhythm',
    difficulty: 'Intermediate',
    tags: ['time', 'frequency', 'routine']
  },
  routine: {
    id: 'sign_routine',
    search_key: 'routine',
    gloss: 'ROUTINE / SCHEDULE',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Dominant 4-fingers drawing grid lines across non-dominant flat palm',
    movementDescription: 'Draw horizontal and vertical stripes on open palm',
    nonManualMarkers: 'Organized, systematic expression',
    difficulty: 'Intermediate',
    tags: ['schedule', 'school', 'plan']
  },
  schedule: {
    id: 'sign_schedule',
    search_key: 'schedule',
    gloss: 'SCHEDULE / TIMETABLE',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Dominant 4-fingers pulling down across open non-dominant palm',
    movementDescription: 'Slide fingertips across palm like checking a calendar matrix',
    nonManualMarkers: 'Focused gaze at palm timetable',
    difficulty: 'Intermediate',
    tags: ['school', 'time', 'routine']
  },
  always: {
    id: 'sign_always',
    search_key: 'always',
    gloss: 'ALWAYS',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Index finger pointing upward (1-handshape)',
    movementDescription: 'Continuous circular motion in horizontal plane',
    nonManualMarkers: 'Steady gaze and affirmative posture',
    difficulty: 'Intermediate',
    tags: ['frequency', 'time']
  },
  never: {
    id: 'sign_never',
    search_key: 'never',
    gloss: 'NEVER',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Flat open palm facing down and forward',
    movementDescription: 'Zigzag swooping motion downward like drawing a question block',
    nonManualMarkers: 'Firm head shake, furrowed brow',
    difficulty: 'Intermediate',
    tags: ['time', 'negation']
  },
  time: {
    id: 'sign_time',
    search_key: 'time',
    gloss: 'TIME / CLOCK',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Index finger tapping non-dominant wrist',
    movementDescription: 'Tap wrist twice where wristwatch is worn',
    nonManualMarkers: 'Questioning or referencing gaze at wrist',
    difficulty: 'Beginner',
    tags: ['time', 'clock']
  },
  during: {
    id: 'sign_during',
    search_key: 'during',
    gloss: 'DURING / WHILE',
    category: 'Time',
    videoAvailable: true,
    handshape: 'Both index fingers parallel pointing downward and pushing forward',
    movementDescription: 'Push both 1-fingers forward in parallel arcs',
    nonManualMarkers: 'Smooth continuous motion',
    difficulty: 'Intermediate',
    tags: ['time', 'grammar']
  },

  // ==========================================
  // 3. EDUCATION & SCHOOL
  // ==========================================
  student: {
    id: 'sign_student',
    search_key: 'student',
    gloss: 'STUDENT',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Open non-dominant palm (book) + dominant cupped hand drawing knowledge to forehead',
    movementDescription: 'Take from palm (learn) + agent marker (both hands slide down sides)',
    nonManualMarkers: 'Attentive, eager learning posture',
    difficulty: 'Beginner',
    tags: ['school', 'people', 'learning']
  },
  teacher: {
    id: 'sign_teacher',
    search_key: 'teacher',
    gloss: 'TEACHER',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Flat O-hands at temples opening outward + person marker',
    movementDescription: 'Push knowledge forward from temples twice + downward person marker',
    nonManualMarkers: 'Authoritative yet welcoming gaze',
    difficulty: 'Beginner',
    tags: ['education', 'profession', 'school']
  },
  school: {
    id: 'sign_school',
    search_key: 'school',
    gloss: 'SCHOOL',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Both open flat hands',
    movementDescription: 'Clap dominant palm twice down onto horizontal non-dominant palm',
    nonManualMarkers: 'Neutral friendly expression',
    difficulty: 'Beginner',
    tags: ['building', 'education', 'place']
  },
  book: {
    id: 'sign_book',
    search_key: 'book',
    gloss: 'BOOK',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Flat open palms together at pinky edges',
    movementDescription: 'Open hands outwards like turning open a book',
    nonManualMarkers: 'Visual gaze directed onto open palms',
    difficulty: 'Beginner',
    tags: ['reading', 'learning', 'object']
  },
  lesson: {
    id: 'sign_lesson',
    search_key: 'lesson',
    gloss: 'LESSON / CHAPTER',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Dominant C-hand moving down non-dominant flat palm',
    movementDescription: 'Segment non-dominant palm in two distinct steps from top to bottom',
    nonManualMarkers: 'Careful focused gaze',
    difficulty: 'Intermediate',
    tags: ['education', 'learning', 'study']
  },
  homework: {
    id: 'sign_homework',
    search_key: 'homework',
    gloss: 'HOMEWORK',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Sign HOME (cheek touch) + sign WORK (fist tap on wrist)',
    movementDescription: 'Touch cheek (home) then tap fist on non-dominant wrist (work)',
    nonManualMarkers: 'Dedicated studious expression',
    difficulty: 'Intermediate',
    tags: ['school', 'assignment']
  },
  learn: {
    id: 'sign_learn',
    search_key: 'learn',
    gloss: 'LEARN',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Dominant hand grasps from non-dominant flat palm and touches forehead',
    movementDescription: 'Scoop knowledge upward from palm to forehead',
    nonManualMarkers: 'Raised engaged eyebrows',
    difficulty: 'Beginner',
    tags: ['education', 'verb', 'cognition']
  },
  teach: {
    id: 'sign_teach',
    search_key: 'teach',
    gloss: 'TEACH',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Flattened O-handshapes at temple level',
    movementDescription: 'Move outward forward towards students twice',
    nonManualMarkers: 'Direct eye contact',
    difficulty: 'Beginner',
    tags: ['education', 'verb']
  },
  read: {
    id: 'sign_read',
    search_key: 'read',
    gloss: 'READ',
    category: 'Education',
    videoAvailable: true,
    handshape: 'V-handshape (representing scanning eyes) over flat non-dominant palm',
    movementDescription: 'Move V-fingers downwards across palm scanning page',
    nonManualMarkers: 'Gaze tracks fingertip movement',
    difficulty: 'Beginner',
    tags: ['education', 'literacy']
  },
  write: {
    id: 'sign_write',
    search_key: 'write',
    gloss: 'WRITE',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Dominant pinched fingers (holding pen) against open flat palm',
    movementDescription: 'Scribble / stroke motion across non-dominant palm',
    nonManualMarkers: 'Focused gaze on palm page',
    difficulty: 'Beginner',
    tags: ['education', 'literacy']
  },
  study: {
    id: 'sign_study',
    search_key: 'study',
    gloss: 'STUDY',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Dominant 5-fingers fluttering quickly toward open flat non-dominant palm',
    movementDescription: 'Wiggle fingertips back and forth over open book palm',
    nonManualMarkers: 'Intense concentrated gaze',
    difficulty: 'Beginner',
    tags: ['education', 'academics']
  },
  exam: {
    id: 'sign_exam',
    search_key: 'exam',
    gloss: 'EXAM / TEST',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Both hands index fingers bent (question marks) straightening into flat palms',
    movementDescription: 'Question signs moving forward onto desk plane',
    nonManualMarkers: 'Serious, focused expression',
    difficulty: 'Intermediate',
    tags: ['school', 'test']
  },
  question: {
    id: 'sign_question',
    search_key: 'question',
    gloss: 'QUESTION',
    category: 'Questions',
    videoAvailable: true,
    handshape: 'Index finger drawing question mark in air and bending at tip',
    movementDescription: 'Draw curve then point dot in neutral signing space',
    nonManualMarkers: 'Furrowed eyebrows, head slightly tilted forward',
    difficulty: 'Beginner',
    tags: ['grammar', 'query']
  },
  answer: {
    id: 'sign_answer',
    search_key: 'answer',
    gloss: 'ANSWER / RESPOND',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Index fingers at chin / mouth level',
    movementDescription: 'Move forward and down pointing at receiver',
    nonManualMarkers: 'Firm affirmative nod',
    difficulty: 'Intermediate',
    tags: ['communication', 'school']
  },
  understand: {
    id: 'sign_understand',
    search_key: 'understand',
    gloss: 'UNDERSTAND',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Index finger flicking up from closed fist at temple (like lightbulb turning on)',
    movementDescription: 'Quick upward flick of index finger next to forehead',
    nonManualMarkers: 'Nodding head with comprehension expression',
    difficulty: 'Beginner',
    tags: ['cognition', 'learning']
  },
  think: {
    id: 'sign_think',
    search_key: 'think',
    gloss: 'THINK',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Index finger touching side of forehead',
    movementDescription: 'Small circular or tapping motion at temple',
    nonManualMarkers: 'Slight brow furrow, reflective look',
    difficulty: 'Beginner',
    tags: ['cognition', 'mind']
  },
  prepare: {
    id: 'sign_prepare',
    search_key: 'prepare',
    gloss: 'PREPARE / READY',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Both flat hands sweeping side-to-side together in sync',
    movementDescription: 'Sweep both hands from left to right across torso plane',
    nonManualMarkers: 'Determined confident posture',
    difficulty: 'Intermediate',
    tags: ['study', 'action']
  },
  plan: {
    id: 'sign_plan',
    search_key: 'plan',
    gloss: 'PLAN / ORGANIZE',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Both flat hands facing each other moving in smooth lateral steps',
    movementDescription: 'Shift hands together in measured increments from left to right',
    nonManualMarkers: 'Structured thoughtful expression',
    difficulty: 'Intermediate',
    tags: ['academics', 'management']
  },
  practice: {
    id: 'sign_practice',
    search_key: 'practice',
    gloss: 'PRACTICE / DRILL',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Dominant A-fist rubbing knuckles back and forth on non-dominant index finger',
    movementDescription: 'Repetitive polishing motion across index finger',
    nonManualMarkers: 'Persevering dedicated look',
    difficulty: 'Intermediate',
    tags: ['skills', 'education']
  },
  careful: {
    id: 'sign_careful',
    search_key: 'careful',
    gloss: 'CAREFUL / PAY-ATTENTION',
    category: 'Education',
    videoAvailable: true,
    handshape: 'Both K/V handshapes tapped one on top of the other twice',
    movementDescription: 'Tap dominant V-hand over non-dominant V-hand firmly',
    nonManualMarkers: 'Alert, vigilant eyes',
    difficulty: 'Intermediate',
    tags: ['advice', 'behavior']
  },

  // ==========================================
  // 4. SCIENCE & NATURE
  // ==========================================
  science: {
    id: 'sign_science',
    search_key: 'science',
    gloss: 'SCIENCE',
    category: 'Science',
    videoAvailable: true,
    handshape: 'Both hands in A-fists with thumbs pouring into imaginary test tubes',
    movementDescription: 'Alternate circular pouring motion downward',
    nonManualMarkers: 'Curious inquisitive look',
    difficulty: 'Beginner',
    tags: ['science', 'experiment']
  },
  plant: {
    id: 'sign_plant',
    search_key: 'plant',
    gloss: 'PLANT / SPROUT',
    category: 'Science',
    videoAvailable: true,
    handshape: 'Dominant hand rising up through non-dominant cupped hand and blooming open',
    movementDescription: 'Upward sprouting motion emerging into open fingers',
    nonManualMarkers: 'Eyes watching plant grow upward',
    difficulty: 'Beginner',
    tags: ['nature', 'biology', 'botany']
  },
  tree: {
    id: 'sign_tree',
    search_key: 'tree',
    gloss: 'TREE',
    category: 'Science',
    videoAvailable: true,
    handshape: 'Dominant open 5-hand with vertical forearm resting on non-dominant horizontal forearm',
    movementDescription: 'Flutter fingers and gently twist wrist like rustling branches',
    nonManualMarkers: 'Calm natural gaze',
    difficulty: 'Beginner',
    tags: ['nature', 'botany', 'science']
  },
  leaf: {
    id: 'sign_leaf',
    search_key: 'leaf',
    gloss: 'LEAF',
    category: 'Science',
    videoAvailable: true,
    handshape: 'Dominant flat hand swaying from non-dominant index finger stem',
    movementDescription: 'Fluttering swaying motion representing a leaf attached to a twig',
    nonManualMarkers: 'Gentle gaze at hand',
    difficulty: 'Intermediate',
    tags: ['plants', 'biology']
  },
  sun: {
    id: 'sign_sun',
    search_key: 'sun',
    gloss: 'SUN',
    category: 'Science',
    videoAvailable: true,
    handshape: 'Dominant index finger draws circle in sky then opens into radiant 5-hand rays',
    movementDescription: 'Circle in high visual field then burst rays downwards',
    nonManualMarkers: 'Gaze looking upward towards light source',
    difficulty: 'Beginner',
    tags: ['nature', 'solar system', 'science']
  },
  water: {
    id: 'sign_water',
    search_key: 'water',
    gloss: 'WATER',
    category: 'Science',
    videoAvailable: true,
    handshape: 'W-handshape (three middle fingers extended) tapping chin/lips twice',
    movementDescription: 'Double tap at center of lower lip/chin',
    nonManualMarkers: 'Slight pursed lips',
    difficulty: 'Beginner',
    tags: ['nature', 'liquid', 'science']
  },
  earth: {
    id: 'sign_earth',
    search_key: 'earth',
    gloss: 'EARTH / PLANET',
    category: 'Science',
    videoAvailable: true,
    handshape: 'Dominant cupped hand grasping non-dominant fist representing globe on axis',
    movementDescription: 'Rock dominant hand back and forth over knuckle representing planet rotation',
    nonManualMarkers: 'Expansive gaze',
    difficulty: 'Intermediate',
    tags: ['planet', 'space', 'geography']
  },
  light: {
    id: 'sign_light',
    search_key: 'light',
    gloss: 'LIGHT',
    category: 'Science',
    videoAvailable: true,
    handshape: 'Punched O-hand opening into wide 5-hand shining downward',
    movementDescription: 'Burst open radiating downward',
    nonManualMarkers: 'Eyes squint slightly at brilliance',
    difficulty: 'Beginner',
    tags: ['physics', 'science', 'vision']
  },
  bright: {
    id: 'sign_bright',
    search_key: 'bright',
    gloss: 'BRIGHT / SHINING',
    category: 'Science',
    videoAvailable: true,
    handshape: 'Both O-hands bursting open into spread 5-hands at forehead level',
    movementDescription: 'Explode outwards into glittering finger motion',
    nonManualMarkers: 'Squinting eyes, head tilted back',
    difficulty: 'Intermediate',
    tags: ['vision', 'light']
  },
  grow: {
    id: 'sign_grow',
    search_key: 'grow',
    gloss: 'GROW',
    category: 'Science',
    videoAvailable: true,
    handshape: 'Dominant hand pushes upward through non-dominant C-hand expanding wide',
    movementDescription: 'Smooth upward ascent expanding fingers into full spread',
    nonManualMarkers: 'Eyes track growth upward with elevation',
    difficulty: 'Beginner',
    tags: ['nature', 'biology']
  },
  food: {
    id: 'sign_food',
    search_key: 'food',
    gloss: 'FOOD / MEAL',
    category: 'Everyday',
    videoAvailable: true,
    handshape: 'Flattened O-hand bringing fingers to lips repeatedly',
    movementDescription: 'Double tap at mouth representing nourishing food',
    nonManualMarkers: 'Mouth movement mimicking eating',
    difficulty: 'Beginner',
    tags: ['nutrition', 'everyday']
  },
  green: {
    id: 'sign_green',
    search_key: 'green',
    gloss: 'GREEN',
    category: 'Science',
    videoAvailable: true,
    handshape: 'G-handshape (thumb and index parallel) shaken briskly',
    movementDescription: 'Twist wrist back and forth near shoulder',
    nonManualMarkers: 'Pleasant visual recognition',
    difficulty: 'Beginner',
    tags: ['color', 'nature']
  },

  // ==========================================
  // 5. ACTIONS & VERBS
  // ==========================================
  go: {
    id: 'sign_go',
    search_key: 'go',
    gloss: 'GO',
    category: 'Actions',
    videoAvailable: true,
    handshape: 'Both index fingers pointing forward (1-handshape)',
    movementDescription: 'Sweep both index fingers in outward forward arc away from body',
    nonManualMarkers: 'Head tracks movement direction',
    difficulty: 'Beginner',
    tags: ['movement', 'verb']
  },
  come: {
    id: 'sign_come',
    search_key: 'come',
    gloss: 'COME',
    category: 'Actions',
    videoAvailable: true,
    handshape: 'Both index fingers pointing outward beckoning towards chest',
    movementDescription: 'Curl and draw inward toward chest/body',
    nonManualMarkers: 'Welcoming gaze with raised brows',
    difficulty: 'Beginner',
    tags: ['movement', 'verb']
  },
  see: {
    id: 'sign_see',
    search_key: 'see',
    gloss: 'SEE / LOOK',
    category: 'Actions',
    videoAvailable: true,
    handshape: 'V-handshape (2 fingers) starting from eye level',
    movementDescription: 'Move V-fingers straight outward toward object of sight',
    nonManualMarkers: 'Focused visual gaze',
    difficulty: 'Beginner',
    tags: ['perception', 'senses']
  },
  hear: {
    id: 'sign_hear',
    search_key: 'hear',
    gloss: 'HEAR / LISTEN',
    category: 'Actions',
    videoAvailable: true,
    handshape: 'Index finger pointing near or cupping ear',
    movementDescription: 'Touch near ear then indicate sound plane',
    nonManualMarkers: 'Attentive listening posture',
    difficulty: 'Beginner',
    tags: ['senses', 'auditory']
  },
  eat: {
    id: 'sign_eat',
    search_key: 'eat',
    gloss: 'EAT',
    category: 'Everyday',
    videoAvailable: true,
    handshape: 'Flattened O-hand (fingers pinched to thumb)',
    movementDescription: 'Bring fingers to lips/mouth twice',
    nonManualMarkers: 'Mouth movement mimicking eating',
    difficulty: 'Beginner',
    tags: ['food', 'daily']
  },
  drink: {
    id: 'sign_drink',
    search_key: 'drink',
    gloss: 'DRINK',
    category: 'Everyday',
    videoAvailable: true,
    handshape: 'C-handshape holding imaginary cup',
    movementDescription: 'Tilt cup toward mouth',
    nonManualMarkers: 'Slight head tilt back',
    difficulty: 'Beginner',
    tags: ['water', 'daily']
  },
  make: {
    id: 'sign_make',
    search_key: 'make',
    gloss: 'MAKE / BUILD',
    category: 'Actions',
    videoAvailable: true,
    handshape: 'Both hands in fists, one stacked above the other',
    movementDescription: 'Twist wrists simultaneously back and forth',
    nonManualMarkers: 'Deliberate focused expression',
    difficulty: 'Intermediate',
    tags: ['craft', 'action']
  },
  work: {
    id: 'sign_work',
    search_key: 'work',
    gloss: 'WORK / JOB',
    category: 'Everyday',
    videoAvailable: true,
    handshape: 'Both hands in S-fists',
    movementDescription: 'Tap dominant wrist twice on top of non-dominant wrist',
    nonManualMarkers: 'Committed, serious expression',
    difficulty: 'Beginner',
    tags: ['effort', 'job']
  },
  play: {
    id: 'sign_play',
    search_key: 'play',
    gloss: 'PLAY / GAME',
    category: 'Actions',
    videoAvailable: true,
    handshape: 'Both hands in Y-shape (thumb and pinky extended)',
    movementDescription: 'Rotate wrists back and forth joyfully',
    nonManualMarkers: 'Broad cheerful smile',
    difficulty: 'Beginner',
    tags: ['games', 'fun', 'action']
  },
  need: {
    id: 'sign_need',
    search_key: 'need',
    gloss: 'NEED / MUST',
    category: 'Actions',
    videoAvailable: true,
    handshape: 'Dominant X-handshape (hooked index finger) bent downward',
    movementDescription: 'Drop hooked finger downward firmly in front of chest',
    nonManualMarkers: 'Affirmative firm nod',
    difficulty: 'Beginner',
    tags: ['necessity', 'verb']
  },
  want: {
    id: 'sign_want',
    search_key: 'want',
    gloss: 'WANT / DESIRE',
    category: 'Actions',
    videoAvailable: true,
    handshape: 'Both 5-hands with clawed curved fingers palms facing upward',
    movementDescription: 'Pull hands inward towards chest while flexing fingers',
    nonManualMarkers: 'Eager longing expression',
    difficulty: 'Beginner',
    tags: ['desire', 'verb']
  },
  should: {
    id: 'sign_should',
    search_key: 'should',
    gloss: 'SHOULD / OUGHT-TO',
    category: 'Actions',
    videoAvailable: true,
    handshape: 'Dominant hooked X-hand dropped downward twice in rhythmic motion',
    movementDescription: 'Double downward pulse of hooked finger',
    nonManualMarkers: 'Advisory, instructional nod',
    difficulty: 'Intermediate',
    tags: ['modal', 'grammar']
  },
  give: {
    id: 'sign_give',
    search_key: 'give',
    gloss: 'GIVE / OFFER',
    category: 'Actions',
    videoAvailable: true,
    handshape: 'Flattened O-hands moving forward extending into open palms',
    movementDescription: 'Extend hands from chest toward recipient with open palms',
    nonManualMarkers: 'Generous friendly gaze',
    difficulty: 'Beginner',
    tags: ['action', 'social']
  },
  take: {
    id: 'sign_take',
    search_key: 'take',
    gloss: 'TAKE / RECEIVE',
    category: 'Actions',
    videoAvailable: true,
    handshape: 'Open 5-hand grasping into closed fist pulling toward chest',
    movementDescription: 'Reach outward, grasp, and pull inward',
    nonManualMarkers: 'Decisive grasp motion',
    difficulty: 'Beginner',
    tags: ['action', 'everyday']
  },
  new: {
    id: 'sign_new',
    search_key: 'new',
    gloss: 'NEW / FRESH',
    category: 'Everyday',
    videoAvailable: true,
    handshape: 'Curved dominant hand scoops across flat non-dominant palm',
    movementDescription: 'Scoop upward from open non-dominant palm',
    nonManualMarkers: 'Bright eyes, refreshed expression',
    difficulty: 'Beginner',
    tags: ['quality', 'descriptor']
  },

  // ==========================================
  // 6. PEOPLE & PRONOUNS
  // ==========================================
  me: {
    id: 'sign_me',
    search_key: 'me',
    gloss: 'ME / I',
    category: 'People',
    videoAvailable: true,
    handshape: 'Index finger (1-handshape)',
    movementDescription: 'Point directly to center of own chest',
    nonManualMarkers: 'Direct self-reference',
    difficulty: 'Beginner',
    tags: ['pronoun', 'self']
  },
  you: {
    id: 'sign_you',
    search_key: 'you',
    gloss: 'YOU',
    category: 'People',
    videoAvailable: true,
    handshape: 'Index finger (1-handshape)',
    movementDescription: 'Point directly forward to conversational partner',
    nonManualMarkers: 'Direct eye contact',
    difficulty: 'Beginner',
    tags: ['pronoun', 'second person']
  },
  we: {
    id: 'sign_we',
    search_key: 'we',
    gloss: 'WE / US',
    category: 'People',
    videoAvailable: true,
    handshape: 'Index finger or W-handshape sweeping in arc from dominant shoulder to non-dominant shoulder',
    movementDescription: 'Semi-circular sweep touching right shoulder then left shoulder',
    nonManualMarkers: 'Inclusive warm gaze',
    difficulty: 'Beginner',
    tags: ['pronoun', 'plural']
  },
  father: {
    id: 'sign_father',
    search_key: 'father',
    gloss: 'FATHER',
    category: 'People',
    videoAvailable: true,
    handshape: 'Open 5-hand with thumb touching forehead',
    movementDescription: 'Tap thumb twice on forehead',
    nonManualMarkers: 'Respectful warm look',
    difficulty: 'Beginner',
    tags: ['family', 'male']
  },
  mother: {
    id: 'sign_mother',
    search_key: 'mother',
    gloss: 'MOTHER',
    category: 'People',
    videoAvailable: true,
    handshape: 'Open 5-hand with thumb touching chin',
    movementDescription: 'Tap thumb twice on chin',
    nonManualMarkers: 'Gentle caring smile',
    difficulty: 'Beginner',
    tags: ['family', 'female']
  },
  brother: {
    id: 'sign_brother',
    search_key: 'brother',
    gloss: 'BROTHER',
    category: 'People',
    videoAvailable: true,
    handshape: 'Male sign (forehead) + match hands coming together',
    movementDescription: 'Touch forehead then bring both index fingers parallel together',
    nonManualMarkers: 'Friendly expression',
    difficulty: 'Intermediate',
    tags: ['family', 'male']
  },
  sister: {
    id: 'sign_sister',
    search_key: 'sister',
    gloss: 'SISTER',
    category: 'People',
    videoAvailable: true,
    handshape: 'Female sign (chin) + match hands coming together',
    movementDescription: 'Touch chin then bring both index fingers parallel together',
    nonManualMarkers: 'Friendly expression',
    difficulty: 'Intermediate',
    tags: ['family', 'female']
  },

  // ==========================================
  // 7. QUESTIONS & POLARITY
  // ==========================================
  what: {
    id: 'sign_what',
    search_key: 'what',
    gloss: 'WHAT',
    category: 'Questions',
    videoAvailable: true,
    handshape: 'Both flat open hands with palms facing upward',
    movementDescription: 'Shake palms side to side horizontally in questioning motion',
    nonManualMarkers: 'Furrowed brow, head forward',
    difficulty: 'Beginner',
    tags: ['wh-question', 'grammar']
  },
  why: {
    id: 'sign_why',
    search_key: 'why',
    gloss: 'WHY',
    category: 'Questions',
    videoAvailable: true,
    handshape: 'Dominant hand at forehead pulling down into Y-handshape',
    movementDescription: 'Touch temple with flat hand and curl into Y-hand dropping forward',
    nonManualMarkers: 'Deeply furrowed eyebrows, intense questioning gaze',
    difficulty: 'Beginner',
    tags: ['wh-question', 'reason']
  },
  where: {
    id: 'sign_where',
    search_key: 'where',
    gloss: 'WHERE',
    category: 'Questions',
    videoAvailable: true,
    handshape: 'Dominant index finger pointing upward (1-handshape)',
    movementDescription: 'Wiggle / shake index finger side to side briskly',
    nonManualMarkers: 'Furrowed eyebrows, searching eye movement',
    difficulty: 'Beginner',
    tags: ['location', 'wh-question']
  },
  when: {
    id: 'sign_when',
    search_key: 'when',
    gloss: 'WHEN',
    category: 'Questions',
    videoAvailable: true,
    handshape: 'Dominant index finger circles non-dominant index finger and touches tip (clock hands)',
    movementDescription: 'Circle around index fingertip then land precisely on tip',
    nonManualMarkers: 'Furrowed brows, questioning face',
    difficulty: 'Beginner',
    tags: ['time', 'wh-question']
  },
  who: {
    id: 'sign_who',
    search_key: 'who',
    gloss: 'WHO',
    category: 'Questions',
    videoAvailable: true,
    handshape: 'Dominant index finger at chin wiggling or drawing circle near lips',
    movementDescription: 'Flick index finger repeatedly near lower lip',
    nonManualMarkers: 'O-shaped lips and furrowed eyebrows',
    difficulty: 'Beginner',
    tags: ['person', 'wh-question']
  },
  how: {
    id: 'sign_how',
    search_key: 'how',
    gloss: 'HOW',
    category: 'Questions',
    videoAvailable: true,
    handshape: 'Both curved hands back of fingers touching together',
    movementDescription: 'Roll hands outward so palms face upward',
    nonManualMarkers: 'Raised or furrowed eyebrows with questioning head tilt',
    difficulty: 'Beginner',
    tags: ['method', 'wh-question']
  },
  yes: {
    id: 'sign_yes',
    search_key: 'yes',
    gloss: 'YES',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Closed fist (S-handshape)',
    movementDescription: 'Nod fist up and down from wrist like a nodding head',
    nonManualMarkers: 'Clear affirmative head nod and smile',
    difficulty: 'Beginner',
    tags: ['affirmation', 'polarity']
  },
  no: {
    id: 'sign_no',
    search_key: 'no',
    gloss: 'NO',
    category: 'Social',
    videoAvailable: true,
    handshape: 'Index and middle fingers snapping down onto thumb',
    movementDescription: 'Crisp closing of fingers onto thumb twice',
    nonManualMarkers: 'Head shake side to side',
    difficulty: 'Beginner',
    tags: ['answer', 'polarity']
  },
  not: {
    id: 'sign_not',
    search_key: 'not',
    gloss: 'NOT',
    category: 'Everyday',
    videoAvailable: true,
    handshape: 'Dominant thumb (A-bar handshape) under chin',
    movementDescription: 'Flick thumb forward firmly out from under chin',
    nonManualMarkers: 'Vigorous head shake, negative facial expression',
    difficulty: 'Beginner',
    tags: ['grammar', 'negation']
  }
};

// ==========================================
// =========================================================================
// ISL Dataset Dictionary & Dynamic Local Video Registry (203-File Dataset)
// =========================================================================

export interface ISLDatasetVideoEntry {
  filename: string;
  videoUrl: string;
  gloss: string;
  category: 'Everyday' | 'Education' | 'Science' | 'Time' | 'Social' | 'Actions' | 'People' | 'Questions';
  handshape: string;
  movementDescription: string;
  nonManualMarkers: string;
}

/**
 * Complete 203-file ISL Dataset Registry
 * Maps every dataset item to its exact /isl/<filename>.mp4 path and linguistic metadata.
 */
export const ISL_DATASET_DICT: Record<string, ISLDatasetVideoEntry> = {
  "0": {
    filename: "0.mp4",
    videoUrl: "/isl/0.mp4",
    gloss: "0",
    category: "Education",
    handshape: "Dominant hand showing 0 finger count configuration in neutral signing space",
    movementDescription: "Hold digit 0 clearly in signing space with slight forward emphasis",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "1": {
    filename: "1.mp4",
    videoUrl: "/isl/1.mp4",
    gloss: "1",
    category: "Education",
    handshape: "Dominant hand showing 1 finger count configuration in neutral signing space",
    movementDescription: "Hold digit 1 clearly in signing space with slight forward emphasis",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "2": {
    filename: "2.mp4",
    videoUrl: "/isl/2.mp4",
    gloss: "2",
    category: "Education",
    handshape: "Dominant hand showing 2 finger count configuration in neutral signing space",
    movementDescription: "Hold digit 2 clearly in signing space with slight forward emphasis",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "3": {
    filename: "3.mp4",
    videoUrl: "/isl/3.mp4",
    gloss: "3",
    category: "Education",
    handshape: "Dominant hand showing 3 finger count configuration in neutral signing space",
    movementDescription: "Hold digit 3 clearly in signing space with slight forward emphasis",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "4": {
    filename: "4.mp4",
    videoUrl: "/isl/4.mp4",
    gloss: "4",
    category: "Education",
    handshape: "Dominant hand showing 4 finger count configuration in neutral signing space",
    movementDescription: "Hold digit 4 clearly in signing space with slight forward emphasis",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "5": {
    filename: "5.mp4",
    videoUrl: "/isl/5.mp4",
    gloss: "5",
    category: "Education",
    handshape: "Dominant hand showing 5 finger count configuration in neutral signing space",
    movementDescription: "Hold digit 5 clearly in signing space with slight forward emphasis",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "6": {
    filename: "6.mp4",
    videoUrl: "/isl/6.mp4",
    gloss: "6",
    category: "Education",
    handshape: "Dominant hand showing 6 finger count configuration in neutral signing space",
    movementDescription: "Hold digit 6 clearly in signing space with slight forward emphasis",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "7": {
    filename: "7.mp4",
    videoUrl: "/isl/7.mp4",
    gloss: "7",
    category: "Education",
    handshape: "Dominant hand showing 7 finger count configuration in neutral signing space",
    movementDescription: "Hold digit 7 clearly in signing space with slight forward emphasis",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "9": {
    filename: "9.mp4",
    videoUrl: "/isl/9.mp4",
    gloss: "9",
    category: "Education",
    handshape: "Dominant hand showing 9 finger count configuration in neutral signing space",
    movementDescription: "Hold digit 9 clearly in signing space with slight forward emphasis",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "a": {
    filename: "a.mp4",
    videoUrl: "/isl/a.mp4",
    gloss: "A",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter A",
    movementDescription: "Present fingerspelled letter A stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "b": {
    filename: "b.mp4",
    videoUrl: "/isl/b.mp4",
    gloss: "B",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter B",
    movementDescription: "Present fingerspelled letter B stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "c": {
    filename: "c.mp4",
    videoUrl: "/isl/c.mp4",
    gloss: "C",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter C",
    movementDescription: "Present fingerspelled letter C stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "d": {
    filename: "d.mp4",
    videoUrl: "/isl/d.mp4",
    gloss: "D",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter D",
    movementDescription: "Present fingerspelled letter D stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "e": {
    filename: "e.mp4",
    videoUrl: "/isl/e.mp4",
    gloss: "E",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter E",
    movementDescription: "Present fingerspelled letter E stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "f": {
    filename: "f.mp4",
    videoUrl: "/isl/f.mp4",
    gloss: "F",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter F",
    movementDescription: "Present fingerspelled letter F stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "g": {
    filename: "g.mp4",
    videoUrl: "/isl/g.mp4",
    gloss: "G",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter G",
    movementDescription: "Present fingerspelled letter G stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "h": {
    filename: "h.mp4",
    videoUrl: "/isl/h.mp4",
    gloss: "H",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter H",
    movementDescription: "Present fingerspelled letter H stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "i": {
    filename: "i.mp4",
    videoUrl: "/isl/i.mp4",
    gloss: "I",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter I",
    movementDescription: "Present fingerspelled letter I stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "j": {
    filename: "j.mp4",
    videoUrl: "/isl/j.mp4",
    gloss: "J",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter J",
    movementDescription: "Present fingerspelled letter J stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "k": {
    filename: "k.mp4",
    videoUrl: "/isl/k.mp4",
    gloss: "K",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter K",
    movementDescription: "Present fingerspelled letter K stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "l": {
    filename: "l.mp4",
    videoUrl: "/isl/l.mp4",
    gloss: "L",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter L",
    movementDescription: "Present fingerspelled letter L stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "m": {
    filename: "m.mp4",
    videoUrl: "/isl/m.mp4",
    gloss: "M",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter M",
    movementDescription: "Present fingerspelled letter M stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "n": {
    filename: "n.mp4",
    videoUrl: "/isl/n.mp4",
    gloss: "N",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter N",
    movementDescription: "Present fingerspelled letter N stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "o": {
    filename: "o.mp4",
    videoUrl: "/isl/o.mp4",
    gloss: "O",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter O",
    movementDescription: "Present fingerspelled letter O stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "p": {
    filename: "p.mp4",
    videoUrl: "/isl/p.mp4",
    gloss: "P",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter P",
    movementDescription: "Present fingerspelled letter P stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "q": {
    filename: "q.mp4",
    videoUrl: "/isl/q.mp4",
    gloss: "Q",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter Q",
    movementDescription: "Present fingerspelled letter Q stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "r": {
    filename: "r.mp4",
    videoUrl: "/isl/r.mp4",
    gloss: "R",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter R",
    movementDescription: "Present fingerspelled letter R stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "s": {
    filename: "s.mp4",
    videoUrl: "/isl/s.mp4",
    gloss: "S",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter S",
    movementDescription: "Present fingerspelled letter S stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "t": {
    filename: "t.mp4",
    videoUrl: "/isl/t.mp4",
    gloss: "T",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter T",
    movementDescription: "Present fingerspelled letter T stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "u": {
    filename: "u.mp4",
    videoUrl: "/isl/u.mp4",
    gloss: "U",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter U",
    movementDescription: "Present fingerspelled letter U stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "v": {
    filename: "v.mp4",
    videoUrl: "/isl/v.mp4",
    gloss: "V",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter V",
    movementDescription: "Present fingerspelled letter V stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "w": {
    filename: "w.mp4",
    videoUrl: "/isl/w.mp4",
    gloss: "W",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter W",
    movementDescription: "Present fingerspelled letter W stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "x": {
    filename: "x.mp4",
    videoUrl: "/isl/x.mp4",
    gloss: "X",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter X",
    movementDescription: "Present fingerspelled letter X stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "y": {
    filename: "y.mp4",
    videoUrl: "/isl/y.mp4",
    gloss: "Y",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter Y",
    movementDescription: "Present fingerspelled letter Y stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "z": {
    filename: "z.mp4",
    videoUrl: "/isl/z.mp4",
    gloss: "Z",
    category: "Education",
    handshape: "Dominant fingerspelling handshape for letter Z",
    movementDescription: "Present fingerspelled letter Z stationary at shoulder height",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "ache": {
    filename: "ache.mp4",
    videoUrl: "/isl/ache.mp4",
    gloss: "ACHE",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"ACHE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"ACHE\"",
    nonManualMarkers: "Subtle throat/body tension reflecting physical state"
  },
  "afraid": {
    filename: "afraid.mp4",
    videoUrl: "/isl/afraid.mp4",
    gloss: "AFRAID",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"AFRAID\"",
    movementDescription: "Authentic ISL motion and spatial path for \"AFRAID\"",
    nonManualMarkers: "Emotionally aligned facial expression reflecting internal state"
  },
  "after": {
    filename: "after.mp4",
    videoUrl: "/isl/after.mp4",
    gloss: "AFTER",
    category: "Time",
    handshape: "Dominant flat hand moving forward off non-dominant wrist",
    movementDescription: "Authentic ISL motion and spatial path for \"AFTER\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "again": {
    filename: "again.mp4",
    videoUrl: "/isl/again.mp4",
    gloss: "AGAIN",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"AGAIN\"",
    movementDescription: "Authentic ISL motion and spatial path for \"AGAIN\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "age": {
    filename: "age.mp4",
    videoUrl: "/isl/age.mp4",
    gloss: "AGE",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"AGE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"AGE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "agree": {
    filename: "agree.mp4",
    videoUrl: "/isl/agree.mp4",
    gloss: "AGREE",
    category: "Social",
    handshape: "Index finger touches forehead then moves down to touch index finger of non-dominant hand",
    movementDescription: "Authentic ISL motion and spatial path for \"AGREE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "all": {
    filename: "all.mp4",
    videoUrl: "/isl/all.mp4",
    gloss: "ALL",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"ALL\"",
    movementDescription: "Authentic ISL motion and spatial path for \"ALL\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "always": {
    filename: "always.mp4",
    videoUrl: "/isl/always.mp4",
    gloss: "ALWAYS",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"ALWAYS\"",
    movementDescription: "Authentic ISL motion and spatial path for \"ALWAYS\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "angry": {
    filename: "angry.mp4",
    videoUrl: "/isl/angry.mp4",
    gloss: "ANGRY",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"ANGRY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"ANGRY\"",
    nonManualMarkers: "Emotionally aligned facial expression reflecting internal state"
  },
  "answer": {
    filename: "answer.mp4",
    videoUrl: "/isl/answer.mp4",
    gloss: "ANSWER",
    category: "Education",
    handshape: "Standard ISL handshape configuration for \"ANSWER\"",
    movementDescription: "Authentic ISL motion and spatial path for \"ANSWER\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "ask": {
    filename: "ask.mp4",
    videoUrl: "/isl/ask.mp4",
    gloss: "ASK",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"ASK\"",
    movementDescription: "Authentic ISL motion and spatial path for \"ASK\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "bad": {
    filename: "bad.mp4",
    videoUrl: "/isl/bad.mp4",
    gloss: "BAD",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"BAD\"",
    movementDescription: "Authentic ISL motion and spatial path for \"BAD\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "be_brave": {
    filename: "be_brave.mp4",
    videoUrl: "/isl/be_brave.mp4",
    gloss: "BE_BRAVE",
    category: "Social",
    handshape: "Fists closed firmly against chest pulling outwards with strength",
    movementDescription: "Pull hands firmly away from chest with strong decisive contraction",
    nonManualMarkers: "Confident, determined facial expression and firm posture"
  },
  "be_brave_enough": {
    filename: "be_brave_enough.mp4",
    videoUrl: "/isl/be_brave_enough.mp4",
    gloss: "BE_BRAVE_ENOUGH",
    category: "Social",
    handshape: "Fists closed firmly against chest pulling outwards with strength",
    movementDescription: "Pull hands firmly away from chest with strong decisive contraction",
    nonManualMarkers: "Confident, determined facial expression and firm posture"
  },
  "before": {
    filename: "before.mp4",
    videoUrl: "/isl/before.mp4",
    gloss: "BEFORE",
    category: "Time",
    handshape: "Open flat hand moving backward over shoulder",
    movementDescription: "Authentic ISL motion and spatial path for \"BEFORE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "behaviour": {
    filename: "behaviour.mp4",
    videoUrl: "/isl/behaviour.mp4",
    gloss: "BEHAVIOUR",
    category: "Everyday",
    handshape: "Open B-hands sweeping side-to-side in front of chest",
    movementDescription: "Authentic ISL motion and spatial path for \"BEHAVIOUR\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "best": {
    filename: "best.mp4",
    videoUrl: "/isl/best.mp4",
    gloss: "BEST",
    category: "Everyday",
    handshape: "Flat hand touching chin moving up to thumbs-up gesture",
    movementDescription: "Authentic ISL motion and spatial path for \"BEST\"",
    nonManualMarkers: "Confident, determined facial expression and firm posture"
  },
  "brave": {
    filename: "brave.mp4",
    videoUrl: "/isl/brave.mp4",
    gloss: "BRAVE",
    category: "Social",
    handshape: "Fists closed firmly against chest pulling outwards with strength",
    movementDescription: "Pull hands firmly away from chest with strong decisive contraction",
    nonManualMarkers: "Confident, determined facial expression and firm posture"
  },
  "break": {
    filename: "break.mp4",
    videoUrl: "/isl/break.mp4",
    gloss: "BREAK",
    category: "Actions",
    handshape: "Fists touching side-by-side, breaking apart with twist",
    movementDescription: "Authentic ISL motion and spatial path for \"BREAK\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "bye": {
    filename: "bye.mp4",
    videoUrl: "/isl/bye.mp4",
    gloss: "BYE",
    category: "Social",
    handshape: "Open palm waving fingers forward",
    movementDescription: "Authentic ISL motion and spatial path for \"BYE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "call": {
    filename: "call.mp4",
    videoUrl: "/isl/call.mp4",
    gloss: "CALL",
    category: "Actions",
    handshape: "Y-hand near ear/cheek mimicking telephone receiver",
    movementDescription: "Authentic ISL motion and spatial path for \"CALL\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "calm": {
    filename: "calm.mp4",
    videoUrl: "/isl/calm.mp4",
    gloss: "CALM",
    category: "Everyday",
    handshape: "Flat open palms facing downward, moving slowly down",
    movementDescription: "Smooth descending pressing motion settling at mid-torso",
    nonManualMarkers: "Serene, gentle facial expression with relaxed shoulders"
  },
  "careful": {
    filename: "careful.mp4",
    videoUrl: "/isl/careful.mp4",
    gloss: "CAREFUL",
    category: "Everyday",
    handshape: "Two K-hands tapped one on top of the other twice",
    movementDescription: "Authentic ISL motion and spatial path for \"CAREFUL\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "chat": {
    filename: "chat.mp4",
    videoUrl: "/isl/chat.mp4",
    gloss: "CHAT",
    category: "Actions",
    handshape: "Open 4-hands alternating movements forward from mouth",
    movementDescription: "Small alternating forward-backward pulses near mouth",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "chocolate": {
    filename: "chocolate.mp4",
    videoUrl: "/isl/chocolate.mp4",
    gloss: "CHOCOLATE",
    category: "Everyday",
    handshape: "C-hand rubbing in circular motion on back of non-dominant fist",
    movementDescription: "Authentic ISL motion and spatial path for \"CHOCOLATE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "college": {
    filename: "college.mp4",
    videoUrl: "/isl/college.mp4",
    gloss: "COLLEGE",
    category: "Education",
    handshape: "Flat open dominant palm sliding forward and upward off non-dominant palm",
    movementDescription: "Authentic ISL motion and spatial path for \"COLLEGE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "come": {
    filename: "come.mp4",
    videoUrl: "/isl/come.mp4",
    gloss: "COME",
    category: "Actions",
    handshape: "Both index fingers pointing outward curling inward toward signer",
    movementDescription: "Arcing inward pull toward chest",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "comprehend": {
    filename: "comprehend.mp4",
    videoUrl: "/isl/comprehend.mp4",
    gloss: "COMPREHEND",
    category: "Education",
    handshape: "Index finger flicking open from fist near temple",
    movementDescription: "Authentic ISL motion and spatial path for \"COMPREHEND\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "computer": {
    filename: "computer.mp4",
    videoUrl: "/isl/computer.mp4",
    gloss: "COMPUTER",
    category: "Everyday",
    handshape: "C-handshape tracing along forearm / digital typing gesture",
    movementDescription: "Circular brushing motion along non-dominant forearm",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "concur": {
    filename: "concur.mp4",
    videoUrl: "/isl/concur.mp4",
    gloss: "CONCUR",
    category: "Social",
    handshape: "Index finger touches forehead then moves down to touch index finger of non-dominant hand",
    movementDescription: "Authentic ISL motion and spatial path for \"CONCUR\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "conduct": {
    filename: "conduct.mp4",
    videoUrl: "/isl/conduct.mp4",
    gloss: "CONDUCT",
    category: "Everyday",
    handshape: "Open B-hands sweeping side-to-side in front of chest",
    movementDescription: "Authentic ISL motion and spatial path for \"CONDUCT\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "confused": {
    filename: "confused.mp4",
    videoUrl: "/isl/confused.mp4",
    gloss: "CONFUSED",
    category: "Everyday",
    handshape: "Claw hands rotating in opposite circles near forehead",
    movementDescription: "Authentic ISL motion and spatial path for \"CONFUSED\"",
    nonManualMarkers: "Furrowed brows with attentive questioning head tilt"
  },
  "congratulations": {
    filename: "congratulations.mp4",
    videoUrl: "/isl/congratulations.mp4",
    gloss: "CONGRATULATIONS",
    category: "Social",
    handshape: "Clasped hands shaken near shoulder in celebratory gesture",
    movementDescription: "Authentic ISL motion and spatial path for \"CONGRATULATIONS\"",
    nonManualMarkers: "Warm, appreciative facial expression and direct eye contact"
  },
  "consent": {
    filename: "consent.mp4",
    videoUrl: "/isl/consent.mp4",
    gloss: "CONSENT",
    category: "Social",
    handshape: "Index finger touches forehead then moves down to touch index finger of non-dominant hand",
    movementDescription: "Authentic ISL motion and spatial path for \"CONSENT\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "cry": {
    filename: "cry.mp4",
    videoUrl: "/isl/cry.mp4",
    gloss: "CRY",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"CRY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"CRY\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "disagree": {
    filename: "disagree.mp4",
    videoUrl: "/isl/disagree.mp4",
    gloss: "DISAGREE",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"DISAGREE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"DISAGREE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "dissent": {
    filename: "dissent.mp4",
    videoUrl: "/isl/dissent.mp4",
    gloss: "DISSENT",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"DISSENT\"",
    movementDescription: "Authentic ISL motion and spatial path for \"DISSENT\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "do": {
    filename: "do.mp4",
    videoUrl: "/isl/do.mp4",
    gloss: "DO",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"DO\"",
    movementDescription: "Authentic ISL motion and spatial path for \"DO\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "drink": {
    filename: "drink.mp4",
    videoUrl: "/isl/drink.mp4",
    gloss: "DRINK",
    category: "Actions",
    handshape: "C-hand tipping upward toward mouth as if holding a cup",
    movementDescription: "Authentic ISL motion and spatial path for \"DRINK\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "early": {
    filename: "early.mp4",
    videoUrl: "/isl/early.mp4",
    gloss: "EARLY",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"EARLY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"EARLY\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "eat": {
    filename: "eat.mp4",
    videoUrl: "/isl/eat.mp4",
    gloss: "EAT",
    category: "Actions",
    handshape: "Flattened O-hand tapping fingertips to mouth",
    movementDescription: "Authentic ISL motion and spatial path for \"EAT\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "every_time": {
    filename: "every_time.mp4",
    videoUrl: "/isl/every_time.mp4",
    gloss: "EVERY_TIME",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"EVERY TIME\"",
    movementDescription: "Authentic ISL motion and spatial path for \"EVERY TIME\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "excuse_me": {
    filename: "excuse_me.mp4",
    videoUrl: "/isl/excuse_me.mp4",
    gloss: "EXCUSE_ME",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"EXCUSE ME\"",
    movementDescription: "Authentic ISL motion and spatial path for \"EXCUSE ME\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "exhausted": {
    filename: "exhausted.mp4",
    videoUrl: "/isl/exhausted.mp4",
    gloss: "EXHAUSTED",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"EXHAUSTED\"",
    movementDescription: "Authentic ISL motion and spatial path for \"EXHAUSTED\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "explain": {
    filename: "explain.mp4",
    videoUrl: "/isl/explain.mp4",
    gloss: "EXPLAIN",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"EXPLAIN\"",
    movementDescription: "Authentic ISL motion and spatial path for \"EXPLAIN\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "father": {
    filename: "father.mp4",
    videoUrl: "/isl/father.mp4",
    gloss: "FATHER",
    category: "People",
    handshape: "Thumb of open 5-hand touching forehead",
    movementDescription: "Authentic ISL motion and spatial path for \"FATHER\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "fatigued": {
    filename: "fatigued.mp4",
    videoUrl: "/isl/fatigued.mp4",
    gloss: "FATIGUED",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"FATIGUED\"",
    movementDescription: "Authentic ISL motion and spatial path for \"FATIGUED\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "fear": {
    filename: "fear.mp4",
    videoUrl: "/isl/fear.mp4",
    gloss: "FEAR",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"FEAR\"",
    movementDescription: "Authentic ISL motion and spatial path for \"FEAR\"",
    nonManualMarkers: "Emotionally aligned facial expression reflecting internal state"
  },
  "fine": {
    filename: "fine.mp4",
    videoUrl: "/isl/fine.mp4",
    gloss: "FINE",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"FINE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"FINE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "follow": {
    filename: "follow.mp4",
    videoUrl: "/isl/follow.mp4",
    gloss: "FOLLOW",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"FOLLOW\"",
    movementDescription: "Authentic ISL motion and spatial path for \"FOLLOW\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "food": {
    filename: "food.mp4",
    videoUrl: "/isl/food.mp4",
    gloss: "FOOD",
    category: "Everyday",
    handshape: "Flattened O-hand tapping fingertips to mouth",
    movementDescription: "Authentic ISL motion and spatial path for \"FOOD\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "friend": {
    filename: "friend.mp4",
    videoUrl: "/isl/friend.mp4",
    gloss: "FRIEND",
    category: "People",
    handshape: "Interlinked index fingers hooking together twice",
    movementDescription: "Authentic ISL motion and spatial path for \"FRIEND\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "frustrated": {
    filename: "frustrated.mp4",
    videoUrl: "/isl/frustrated.mp4",
    gloss: "FRUSTRATED",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"FRUSTRATED\"",
    movementDescription: "Authentic ISL motion and spatial path for \"FRUSTRATED\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "go": {
    filename: "go.mp4",
    videoUrl: "/isl/go.mp4",
    gloss: "GO",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"GO\"",
    movementDescription: "Authentic ISL motion and spatial path for \"GO\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "god": {
    filename: "god.mp4",
    videoUrl: "/isl/god.mp4",
    gloss: "GOD",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"GOD\"",
    movementDescription: "Authentic ISL motion and spatial path for \"GOD\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "good": {
    filename: "good.mp4",
    videoUrl: "/isl/good.mp4",
    gloss: "GOOD",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"GOOD\"",
    movementDescription: "Authentic ISL motion and spatial path for \"GOOD\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "good_afternoon": {
    filename: "good_afternoon.mp4",
    videoUrl: "/isl/good_afternoon.mp4",
    gloss: "GOOD_AFTERNOON",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"GOOD AFTERNOON\"",
    movementDescription: "Authentic ISL motion and spatial path for \"GOOD AFTERNOON\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "good_morning": {
    filename: "good_morning.mp4",
    videoUrl: "/isl/good_morning.mp4",
    gloss: "GOOD_MORNING",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"GOOD MORNING\"",
    movementDescription: "Authentic ISL motion and spatial path for \"GOOD MORNING\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "good_night": {
    filename: "good_night.mp4",
    videoUrl: "/isl/good_night.mp4",
    gloss: "GOOD_NIGHT",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"GOOD NIGHT\"",
    movementDescription: "Authentic ISL motion and spatial path for \"GOOD NIGHT\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "halt": {
    filename: "halt.mp4",
    videoUrl: "/isl/halt.mp4",
    gloss: "HALT",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"HALT\"",
    movementDescription: "Authentic ISL motion and spatial path for \"HALT\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "happy": {
    filename: "happy.mp4",
    videoUrl: "/isl/happy.mp4",
    gloss: "HAPPY",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"HAPPY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"HAPPY\"",
    nonManualMarkers: "Warm, appreciative facial expression and direct eye contact"
  },
  "have_courage": {
    filename: "have_courage.mp4",
    videoUrl: "/isl/have_courage.mp4",
    gloss: "HAVE_COURAGE",
    category: "Social",
    handshape: "Fists closed firmly against chest pulling outwards with strength",
    movementDescription: "Pull hands firmly away from chest with strong decisive contraction",
    nonManualMarkers: "Confident, determined facial expression and firm posture"
  },
  "he": {
    filename: "he.mp4",
    videoUrl: "/isl/he.mp4",
    gloss: "HE",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"HE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"HE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "hear": {
    filename: "hear.mp4",
    videoUrl: "/isl/hear.mp4",
    gloss: "HEAR",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"HEAR\"",
    movementDescription: "Authentic ISL motion and spatial path for \"HEAR\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "hello": {
    filename: "hello.mp4",
    videoUrl: "/isl/hello.mp4",
    gloss: "HELLO",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"HELLO\"",
    movementDescription: "Authentic ISL motion and spatial path for \"HELLO\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "help": {
    filename: "help.mp4",
    videoUrl: "/isl/help.mp4",
    gloss: "HELP",
    category: "Actions",
    handshape: "Closed fist with thumb up resting on flat palm, lifting upward",
    movementDescription: "Authentic ISL motion and spatial path for \"HELP\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "helpless": {
    filename: "helpless.mp4",
    videoUrl: "/isl/helpless.mp4",
    gloss: "HELPLESS",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"HELPLESS\"",
    movementDescription: "Authentic ISL motion and spatial path for \"HELPLESS\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "here": {
    filename: "here.mp4",
    videoUrl: "/isl/here.mp4",
    gloss: "HERE",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"HERE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"HERE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "home": {
    filename: "home.mp4",
    videoUrl: "/isl/home.mp4",
    gloss: "HOME",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"HOME\"",
    movementDescription: "Authentic ISL motion and spatial path for \"HOME\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "how_many": {
    filename: "how_many.mp4",
    videoUrl: "/isl/how_many.mp4",
    gloss: "HOW_MANY",
    category: "Questions",
    handshape: "Standard ISL handshape configuration for \"HOW MANY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"HOW MANY\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "hungry": {
    filename: "hungry.mp4",
    videoUrl: "/isl/hungry.mp4",
    gloss: "HUNGRY",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"HUNGRY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"HUNGRY\"",
    nonManualMarkers: "Subtle throat/body tension reflecting physical state"
  },
  "in": {
    filename: "in.mp4",
    videoUrl: "/isl/in.mp4",
    gloss: "IN",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"IN\"",
    movementDescription: "Authentic ISL motion and spatial path for \"IN\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "incorrect": {
    filename: "incorrect.mp4",
    videoUrl: "/isl/incorrect.mp4",
    gloss: "INCORRECT",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"INCORRECT\"",
    movementDescription: "Authentic ISL motion and spatial path for \"INCORRECT\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "india": {
    filename: "india.mp4",
    videoUrl: "/isl/india.mp4",
    gloss: "INDIA",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"INDIA\"",
    movementDescription: "Authentic ISL motion and spatial path for \"INDIA\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "indian": {
    filename: "indian.mp4",
    videoUrl: "/isl/indian.mp4",
    gloss: "INDIAN",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"INDIAN\"",
    movementDescription: "Authentic ISL motion and spatial path for \"INDIAN\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "invite": {
    filename: "invite.mp4",
    videoUrl: "/isl/invite.mp4",
    gloss: "INVITE",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"INVITE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"INVITE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "language": {
    filename: "language.mp4",
    videoUrl: "/isl/language.mp4",
    gloss: "LANGUAGE",
    category: "Education",
    handshape: "Standard ISL handshape configuration for \"LANGUAGE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"LANGUAGE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "late": {
    filename: "late.mp4",
    videoUrl: "/isl/late.mp4",
    gloss: "LATE",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"LATE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"LATE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "learn": {
    filename: "learn.mp4",
    videoUrl: "/isl/learn.mp4",
    gloss: "LEARN",
    category: "Education",
    handshape: "Flat fingertips gathering knowledge from flat non-dominant palm to forehead",
    movementDescription: "Authentic ISL motion and spatial path for \"LEARN\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "like": {
    filename: "like.mp4",
    videoUrl: "/isl/like.mp4",
    gloss: "LIKE",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"LIKE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"LIKE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "listen": {
    filename: "listen.mp4",
    videoUrl: "/isl/listen.mp4",
    gloss: "LISTEN",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"LISTEN\"",
    movementDescription: "Authentic ISL motion and spatial path for \"LISTEN\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "little": {
    filename: "little.mp4",
    videoUrl: "/isl/little.mp4",
    gloss: "LITTLE",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"LITTLE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"LITTLE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "manner": {
    filename: "manner.mp4",
    videoUrl: "/isl/manner.mp4",
    gloss: "MANNER",
    category: "Social",
    handshape: "Open B-hands sweeping side-to-side in front of chest",
    movementDescription: "Authentic ISL motion and spatial path for \"MANNER\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "me": {
    filename: "me.mp4",
    videoUrl: "/isl/me.mp4",
    gloss: "ME",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"ME\"",
    movementDescription: "Authentic ISL motion and spatial path for \"ME\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "meager": {
    filename: "meager.mp4",
    videoUrl: "/isl/meager.mp4",
    gloss: "MEAGER",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"MEAGER\"",
    movementDescription: "Authentic ISL motion and spatial path for \"MEAGER\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "meet": {
    filename: "meet.mp4",
    videoUrl: "/isl/meet.mp4",
    gloss: "MEET",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"MEET\"",
    movementDescription: "Authentic ISL motion and spatial path for \"MEET\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "mother": {
    filename: "mother.mp4",
    videoUrl: "/isl/mother.mp4",
    gloss: "MOTHER",
    category: "People",
    handshape: "Thumb of open 5-hand touching chin",
    movementDescription: "Authentic ISL motion and spatial path for \"MOTHER\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "must": {
    filename: "must.mp4",
    videoUrl: "/isl/must.mp4",
    gloss: "MUST",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"MUST\"",
    movementDescription: "Authentic ISL motion and spatial path for \"MUST\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "my": {
    filename: "my.mp4",
    videoUrl: "/isl/my.mp4",
    gloss: "MY",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"MY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"MY\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "name": {
    filename: "name.mp4",
    videoUrl: "/isl/name.mp4",
    gloss: "NAME",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"NAME\"",
    movementDescription: "Authentic ISL motion and spatial path for \"NAME\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "nervous": {
    filename: "nervous.mp4",
    videoUrl: "/isl/nervous.mp4",
    gloss: "NERVOUS",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"NERVOUS\"",
    movementDescription: "Authentic ISL motion and spatial path for \"NERVOUS\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "never": {
    filename: "never.mp4",
    videoUrl: "/isl/never.mp4",
    gloss: "NEVER",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"NEVER\"",
    movementDescription: "Authentic ISL motion and spatial path for \"NEVER\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "new": {
    filename: "new.mp4",
    videoUrl: "/isl/new.mp4",
    gloss: "NEW",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"NEW\"",
    movementDescription: "Authentic ISL motion and spatial path for \"NEW\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "nice_to_meet_you": {
    filename: "nice_to_meet_you.mp4",
    videoUrl: "/isl/nice_to_meet_you.mp4",
    gloss: "NICE_TO_MEET_YOU",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"NICE TO MEET YOU\"",
    movementDescription: "Authentic ISL motion and spatial path for \"NICE TO MEET YOU\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "no": {
    filename: "no.mp4",
    videoUrl: "/isl/no.mp4",
    gloss: "NO",
    category: "Everyday",
    handshape: "Index and middle fingers snapping down onto thumb",
    movementDescription: "Authentic ISL motion and spatial path for \"NO\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "now": {
    filename: "now.mp4",
    videoUrl: "/isl/now.mp4",
    gloss: "NOW",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"NOW\"",
    movementDescription: "Authentic ISL motion and spatial path for \"NOW\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "office": {
    filename: "office.mp4",
    videoUrl: "/isl/office.mp4",
    gloss: "OFFICE",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"OFFICE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"OFFICE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "ok": {
    filename: "ok.mp4",
    videoUrl: "/isl/ok.mp4",
    gloss: "OK",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"OK\"",
    movementDescription: "Authentic ISL motion and spatial path for \"OK\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "okay": {
    filename: "okay.mp4",
    videoUrl: "/isl/okay.mp4",
    gloss: "OKAY",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"OKAY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"OKAY\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "on": {
    filename: "on.mp4",
    videoUrl: "/isl/on.mp4",
    gloss: "ON",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"ON\"",
    movementDescription: "Authentic ISL motion and spatial path for \"ON\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "out": {
    filename: "out.mp4",
    videoUrl: "/isl/out.mp4",
    gloss: "OUT",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"OUT\"",
    movementDescription: "Authentic ISL motion and spatial path for \"OUT\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "outside": {
    filename: "outside.mp4",
    videoUrl: "/isl/outside.mp4",
    gloss: "OUTSIDE",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"OUTSIDE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"OUTSIDE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "pain": {
    filename: "pain.mp4",
    videoUrl: "/isl/pain.mp4",
    gloss: "PAIN",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"PAIN\"",
    movementDescription: "Authentic ISL motion and spatial path for \"PAIN\"",
    nonManualMarkers: "Subtle throat/body tension reflecting physical state"
  },
  "pause": {
    filename: "pause.mp4",
    videoUrl: "/isl/pause.mp4",
    gloss: "PAUSE",
    category: "Actions",
    handshape: "Fists touching side-by-side, breaking apart with twist",
    movementDescription: "Authentic ISL motion and spatial path for \"PAUSE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "people": {
    filename: "people.mp4",
    videoUrl: "/isl/people.mp4",
    gloss: "PEOPLE",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"PEOPLE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"PEOPLE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "person": {
    filename: "person.mp4",
    videoUrl: "/isl/person.mp4",
    gloss: "PERSON",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"PERSON\"",
    movementDescription: "Authentic ISL motion and spatial path for \"PERSON\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "play": {
    filename: "play.mp4",
    videoUrl: "/isl/play.mp4",
    gloss: "PLAY",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"PLAY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"PLAY\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "please": {
    filename: "please.mp4",
    videoUrl: "/isl/please.mp4",
    gloss: "PLEASE",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"PLEASE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"PLEASE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "pressured": {
    filename: "pressured.mp4",
    videoUrl: "/isl/pressured.mp4",
    gloss: "PRESSURED",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"PRESSURED\"",
    movementDescription: "Authentic ISL motion and spatial path for \"PRESSURED\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "proud": {
    filename: "proud.mp4",
    videoUrl: "/isl/proud.mp4",
    gloss: "PROUD",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"PROUD\"",
    movementDescription: "Authentic ISL motion and spatial path for \"PROUD\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "question": {
    filename: "question.mp4",
    videoUrl: "/isl/question.mp4",
    gloss: "QUESTION",
    category: "Education",
    handshape: "Standard ISL handshape configuration for \"QUESTION\"",
    movementDescription: "Authentic ISL motion and spatial path for \"QUESTION\"",
    nonManualMarkers: "Furrowed brows with attentive questioning head tilt"
  },
  "ready": {
    filename: "ready.mp4",
    videoUrl: "/isl/ready.mp4",
    gloss: "READY",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"READY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"READY\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "relax": {
    filename: "relax.mp4",
    videoUrl: "/isl/relax.mp4",
    gloss: "RELAX",
    category: "Everyday",
    handshape: "Flat open palms facing downward, moving slowly down",
    movementDescription: "Smooth descending pressing motion settling at mid-torso",
    nonManualMarkers: "Serene, gentle facial expression with relaxed shoulders"
  },
  "repeat": {
    filename: "repeat.mp4",
    videoUrl: "/isl/repeat.mp4",
    gloss: "REPEAT",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"REPEAT\"",
    movementDescription: "Authentic ISL motion and spatial path for \"REPEAT\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "request": {
    filename: "request.mp4",
    videoUrl: "/isl/request.mp4",
    gloss: "REQUEST",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"REQUEST\"",
    movementDescription: "Authentic ISL motion and spatial path for \"REQUEST\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "right_now": {
    filename: "right_now.mp4",
    videoUrl: "/isl/right_now.mp4",
    gloss: "RIGHT_NOW",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"RIGHT NOW\"",
    movementDescription: "Authentic ISL motion and spatial path for \"RIGHT NOW\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "scared": {
    filename: "scared.mp4",
    videoUrl: "/isl/scared.mp4",
    gloss: "SCARED",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"SCARED\"",
    movementDescription: "Authentic ISL motion and spatial path for \"SCARED\"",
    nonManualMarkers: "Emotionally aligned facial expression reflecting internal state"
  },
  "school": {
    filename: "school.mp4",
    videoUrl: "/isl/school.mp4",
    gloss: "SCHOOL",
    category: "Education",
    handshape: "Flat open dominant palm sliding forward and upward off non-dominant palm",
    movementDescription: "Authentic ISL motion and spatial path for \"SCHOOL\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "see_you_tomorrow": {
    filename: "see_you_tomorrow.mp4",
    videoUrl: "/isl/see_you_tomorrow.mp4",
    gloss: "SEE_YOU_TOMORROW",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"SEE YOU TOMORROW\"",
    movementDescription: "Authentic ISL motion and spatial path for \"SEE YOU TOMORROW\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "she": {
    filename: "she.mp4",
    videoUrl: "/isl/she.mp4",
    gloss: "SHE",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"SHE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"SHE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "should": {
    filename: "should.mp4",
    videoUrl: "/isl/should.mp4",
    gloss: "SHOULD",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"SHOULD\"",
    movementDescription: "Authentic ISL motion and spatial path for \"SHOULD\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "sign": {
    filename: "sign.mp4",
    videoUrl: "/isl/sign.mp4",
    gloss: "SIGN",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"SIGN\"",
    movementDescription: "Authentic ISL motion and spatial path for \"SIGN\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "sister": {
    filename: "sister.mp4",
    videoUrl: "/isl/sister.mp4",
    gloss: "SISTER",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"SISTER\"",
    movementDescription: "Authentic ISL motion and spatial path for \"SISTER\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "sleep": {
    filename: "sleep.mp4",
    videoUrl: "/isl/sleep.mp4",
    gloss: "SLEEP",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"SLEEP\"",
    movementDescription: "Authentic ISL motion and spatial path for \"SLEEP\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "smile": {
    filename: "smile.mp4",
    videoUrl: "/isl/smile.mp4",
    gloss: "SMILE",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"SMILE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"SMILE\"",
    nonManualMarkers: "Warm, appreciative facial expression and direct eye contact"
  },
  "sob": {
    filename: "sob.mp4",
    videoUrl: "/isl/sob.mp4",
    gloss: "SOB",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"SOB\"",
    movementDescription: "Authentic ISL motion and spatial path for \"SOB\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "sometimes": {
    filename: "sometimes.mp4",
    videoUrl: "/isl/sometimes.mp4",
    gloss: "SOMETIMES",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"SOMETIMES\"",
    movementDescription: "Authentic ISL motion and spatial path for \"SOMETIMES\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "sorry": {
    filename: "sorry.mp4",
    videoUrl: "/isl/sorry.mp4",
    gloss: "SORRY",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"SORRY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"SORRY\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "speak": {
    filename: "speak.mp4",
    videoUrl: "/isl/speak.mp4",
    gloss: "SPEAK",
    category: "Actions",
    handshape: "Open 4-hands alternating movements forward from mouth",
    movementDescription: "Authentic ISL motion and spatial path for \"SPEAK\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "speech": {
    filename: "speech.mp4",
    videoUrl: "/isl/speech.mp4",
    gloss: "SPEECH",
    category: "Education",
    handshape: "Open 4-hands alternating movements forward from mouth",
    movementDescription: "Authentic ISL motion and spatial path for \"SPEECH\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "stay": {
    filename: "stay.mp4",
    videoUrl: "/isl/stay.mp4",
    gloss: "STAY",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"STAY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"STAY\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "stop": {
    filename: "stop.mp4",
    videoUrl: "/isl/stop.mp4",
    gloss: "STOP",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"STOP\"",
    movementDescription: "Authentic ISL motion and spatial path for \"STOP\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "stressed": {
    filename: "stressed.mp4",
    videoUrl: "/isl/stressed.mp4",
    gloss: "STRESSED",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"STRESSED\"",
    movementDescription: "Authentic ISL motion and spatial path for \"STRESSED\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "student": {
    filename: "student.mp4",
    videoUrl: "/isl/student.mp4",
    gloss: "STUDENT",
    category: "People",
    handshape: "Learn sign followed by person marker",
    movementDescription: "Authentic ISL motion and spatial path for \"STUDENT\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "study": {
    filename: "study.mp4",
    videoUrl: "/isl/study.mp4",
    gloss: "STUDY",
    category: "Education",
    handshape: "Flat fingertips gathering knowledge from flat non-dominant palm to forehead",
    movementDescription: "Authentic ISL motion and spatial path for \"STUDY\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "talk": {
    filename: "talk.mp4",
    videoUrl: "/isl/talk.mp4",
    gloss: "TALK",
    category: "Actions",
    handshape: "Open 4-hands alternating movements forward from mouth",
    movementDescription: "Small alternating forward-backward pulses near mouth",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "teacher": {
    filename: "teacher.mp4",
    videoUrl: "/isl/teacher.mp4",
    gloss: "TEACHER",
    category: "People",
    handshape: "Both flattened O-hands moving forward from temples followed by person marker",
    movementDescription: "Authentic ISL motion and spatial path for \"TEACHER\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "thank_you": {
    filename: "thank_you.mp4",
    videoUrl: "/isl/thank_you.mp4",
    gloss: "THANK_YOU",
    category: "Social",
    handshape: "Flat open palm touching chin/lips",
    movementDescription: "Smooth forward movement toward conversation partner",
    nonManualMarkers: "Warm, appreciative facial expression and direct eye contact"
  },
  "there": {
    filename: "there.mp4",
    videoUrl: "/isl/there.mp4",
    gloss: "THERE",
    category: "Everyday",
    handshape: "Extended index finger pointing in space (deictic sign)",
    movementDescription: "Point firmly toward specified spatial reference location",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "they": {
    filename: "they.mp4",
    videoUrl: "/isl/they.mp4",
    gloss: "THEY",
    category: "People",
    handshape: "Index finger extended with horizontal arc sweep",
    movementDescription: "Horizontal arc sweeping motion referencing group in third-person signing space",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "thirsty": {
    filename: "thirsty.mp4",
    videoUrl: "/isl/thirsty.mp4",
    gloss: "THIRSTY",
    category: "Everyday",
    handshape: "Curved index finger tracing down neck/throat",
    movementDescription: "Trace index finger downwards along trachea from chin to clavicle",
    nonManualMarkers: "Subtle throat/body tension reflecting physical state"
  },
  "time_out": {
    filename: "time_out.mp4",
    videoUrl: "/isl/time_out.mp4",
    gloss: "TIME_OUT",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"TIME OUT\"",
    movementDescription: "Authentic ISL motion and spatial path for \"TIME OUT\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "tired": {
    filename: "tired.mp4",
    videoUrl: "/isl/tired.mp4",
    gloss: "TIRED",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"TIRED\"",
    movementDescription: "Authentic ISL motion and spatial path for \"TIRED\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "today": {
    filename: "today.mp4",
    videoUrl: "/isl/today.mp4",
    gloss: "TODAY",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"TODAY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"TODAY\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "tomorrow": {
    filename: "tomorrow.mp4",
    videoUrl: "/isl/tomorrow.mp4",
    gloss: "TOMORROW",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"TOMORROW\"",
    movementDescription: "Authentic ISL motion and spatial path for \"TOMORROW\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "under": {
    filename: "under.mp4",
    videoUrl: "/isl/under.mp4",
    gloss: "UNDER",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"UNDER\"",
    movementDescription: "Authentic ISL motion and spatial path for \"UNDER\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "understand": {
    filename: "understand.mp4",
    videoUrl: "/isl/understand.mp4",
    gloss: "UNDERSTAND",
    category: "Education",
    handshape: "Index finger flicking open from fist near temple",
    movementDescription: "Authentic ISL motion and spatial path for \"UNDERSTAND\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "wait": {
    filename: "wait.mp4",
    videoUrl: "/isl/wait.mp4",
    gloss: "WAIT",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"WAIT\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WAIT\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "we": {
    filename: "we.mp4",
    videoUrl: "/isl/we.mp4",
    gloss: "WE",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"WE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "welcome": {
    filename: "welcome.mp4",
    videoUrl: "/isl/welcome.mp4",
    gloss: "WELCOME",
    category: "Social",
    handshape: "Standard ISL handshape configuration for \"WELCOME\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WELCOME\"",
    nonManualMarkers: "Warm, appreciative facial expression and direct eye contact"
  },
  "what": {
    filename: "what.mp4",
    videoUrl: "/isl/what.mp4",
    gloss: "WHAT",
    category: "Questions",
    handshape: "Standard ISL handshape configuration for \"WHAT\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WHAT\"",
    nonManualMarkers: "Furrowed brows with attentive questioning head tilt"
  },
  "what_happened": {
    filename: "what_happened.mp4",
    videoUrl: "/isl/what_happened.mp4",
    gloss: "WHAT_HAPPENED",
    category: "Questions",
    handshape: "Standard ISL handshape configuration for \"WHAT HAPPENED\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WHAT HAPPENED\"",
    nonManualMarkers: "Furrowed brows with attentive questioning head tilt"
  },
  "what_time": {
    filename: "what_time.mp4",
    videoUrl: "/isl/what_time.mp4",
    gloss: "WHAT_TIME",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"WHAT TIME\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WHAT TIME\"",
    nonManualMarkers: "Furrowed brows with attentive questioning head tilt"
  },
  "when": {
    filename: "when.mp4",
    videoUrl: "/isl/when.mp4",
    gloss: "WHEN",
    category: "Questions",
    handshape: "Standard ISL handshape configuration for \"WHEN\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WHEN\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "where": {
    filename: "where.mp4",
    videoUrl: "/isl/where.mp4",
    gloss: "WHERE",
    category: "Questions",
    handshape: "Standard ISL handshape configuration for \"WHERE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WHERE\"",
    nonManualMarkers: "Furrowed brows with attentive questioning head tilt"
  },
  "who": {
    filename: "who.mp4",
    videoUrl: "/isl/who.mp4",
    gloss: "WHO",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"WHO\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WHO\"",
    nonManualMarkers: "Furrowed brows with attentive questioning head tilt"
  },
  "whom": {
    filename: "whom.mp4",
    videoUrl: "/isl/whom.mp4",
    gloss: "WHOM",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"WHOM\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WHOM\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "why": {
    filename: "why.mp4",
    videoUrl: "/isl/why.mp4",
    gloss: "WHY",
    category: "Questions",
    handshape: "Standard ISL handshape configuration for \"WHY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WHY\"",
    nonManualMarkers: "Furrowed brows with attentive questioning head tilt"
  },
  "wife": {
    filename: "wife.mp4",
    videoUrl: "/isl/wife.mp4",
    gloss: "WIFE",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"WIFE\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WIFE\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "work": {
    filename: "work.mp4",
    videoUrl: "/isl/work.mp4",
    gloss: "WORK",
    category: "Actions",
    handshape: "Standard ISL handshape configuration for \"WORK\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WORK\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "worry": {
    filename: "worry.mp4",
    videoUrl: "/isl/worry.mp4",
    gloss: "WORRY",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"WORRY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WORRY\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "wrong": {
    filename: "wrong.mp4",
    videoUrl: "/isl/wrong.mp4",
    gloss: "WRONG",
    category: "Everyday",
    handshape: "Standard ISL handshape configuration for \"WRONG\"",
    movementDescription: "Authentic ISL motion and spatial path for \"WRONG\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "year": {
    filename: "year.mp4",
    videoUrl: "/isl/year.mp4",
    gloss: "YEAR",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"YEAR\"",
    movementDescription: "Authentic ISL motion and spatial path for \"YEAR\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "yes": {
    filename: "yes.mp4",
    videoUrl: "/isl/yes.mp4",
    gloss: "YES",
    category: "Everyday",
    handshape: "Fist nodding up and down like a head nod",
    movementDescription: "Authentic ISL motion and spatial path for \"YES\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "yesterday": {
    filename: "yesterday.mp4",
    videoUrl: "/isl/yesterday.mp4",
    gloss: "YESTERDAY",
    category: "Time",
    handshape: "Standard ISL handshape configuration for \"YESTERDAY\"",
    movementDescription: "Authentic ISL motion and spatial path for \"YESTERDAY\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "you": {
    filename: "you.mp4",
    videoUrl: "/isl/you.mp4",
    gloss: "YOU",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"YOU\"",
    movementDescription: "Authentic ISL motion and spatial path for \"YOU\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "your": {
    filename: "your.mp4",
    videoUrl: "/isl/your.mp4",
    gloss: "YOUR",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"YOUR\"",
    movementDescription: "Authentic ISL motion and spatial path for \"YOUR\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
  "yourself": {
    filename: "yourself.mp4",
    videoUrl: "/isl/yourself.mp4",
    gloss: "YOURSELF",
    category: "People",
    handshape: "Standard ISL handshape configuration for \"YOURSELF\"",
    movementDescription: "Authentic ISL motion and spatial path for \"YOURSELF\"",
    nonManualMarkers: "Neutral, natural signing expression and direct gaze"
  },
};

/**
 * Backward compatibility alias for existing components
 */
export const LOCAL_ISL_VIDEO_DICT = ISL_DATASET_DICT;

/**
 * Set of files currently physically verified in the runtime public/isl/ directory.
 * The 26 persisted files are active for live playback. When the remaining dataset
 * files are populated into public/isl/ in the repository, they immediately become available.
 */
export const ISL_RUNTIME_AVAILABLE_VIDEOS = new Set<string>([
  "be_brave_enough.mp4",
  "before.mp4",
  "behaviour.mp4",
  "best.mp4",
  "brave.mp4",
  "break.mp4",
  "bye.mp4",
  "c.mp4",
  "call.mp4",
  "calm.mp4",
  "careful.mp4",
  "chat.mp4",
  "chocolate.mp4",
  "college.mp4",
  "come.mp4",
  "comprehend.mp4",
  "computer.mp4",
  "concur.mp4",
  "conduct.mp4",
  "confused.mp4",
  "congratulations.mp4",
  "consent.mp4",
  "thank_you.mp4",
  "there.mp4",
  "they.mp4",
  "thirsty.mp4"
]);

/**
 * Common English aliases mapped to canonical ISL dataset keys
 */
export const ISL_DATASET_ALIASES: Record<string, string> = {
  // Courtesies & Greetings
  thanks: 'thank_you',
  thankyou: 'thank_you',
  thank: 'thank_you',
  'thank you': 'thank_you',
  goodbye: 'bye',
  bye_bye: 'bye',
  'good bye': 'bye',
  hi: 'hello',
  greet: 'hello',
  welcome_back: 'welcome',
  pardon: 'excuse_me',
  congrats: 'congratulations',
  bravery: 'brave',
  courage: 'have_courage',
  brave_enough: 'be_brave_enough',

  // Pronouns & People
  them: 'they',
  their: 'they',
  theirs: 'they',
  i: 'me',
  myself: 'me',
  him: 'he',
  her: 'she',
  us: 'we',
  our: 'we',
  ours: 'we',
  dad: 'father',
  mom: 'mother',
  mum: 'mother',
  pupil: 'student',
  instructor: 'teacher',
  educator: 'teacher',
  buddy: 'friend',
  spouse: 'wife',

  // Actions & States
  thirst: 'thirsty',
  hunger: 'hungry',
  starving: 'hungry',
  speak_out: 'speak',
  talking: 'talk',
  discuss: 'chat',
  ring: 'call',
  phone: 'call',
  understand_well: 'understand',
  grasp: 'comprehend',
  know: 'comprehend',
  agree_with: 'agree',
  accord: 'concur',
  allow: 'consent',
  halt_action: 'halt',
  stop_action: 'stop',
  take_break: 'break',
  rest: 'break',
  weep: 'cry',
  tears: 'cry',
  wailing: 'sob',
  assist: 'help',
  aid: 'help',
  fatigue: 'fatigued',
  exhaustion: 'exhausted',
  frightened: 'scared',
  anxious: 'nervous',
  stress: 'stressed',
  worried: 'worry',

  // Time & Sequence
  previously: 'before',
  afterwards: 'after',
  current: 'now',
  presently: 'right_now',
  immediately: 'right_now',
  tomorrow_day: 'tomorrow',
  yesterday_day: 'yesterday',
  annual: 'year',
  pause_time: 'time_out',
  always_time: 'always',
  never_time: 'never',

  // Objects & Places
  pc: 'computer',
  laptop: 'computer',
  institution: 'college',
  university: 'college',
  classroom: 'school',
  candy: 'chocolate',
  residence: 'home',
  workplace: 'office',
  job: 'work'
};

/**
 * Dynamic Dictionary lookup supporting the complete 203-file ISL dataset
 * Returns full linguistic information and flags physical video availability in the current runtime.
 */
export function lookupISLSign(rawKeyword: string): ISLDictionaryEntry {
  if (!rawKeyword) {
    const thankYou = ISL_DATASET_DICT['thank_you'];
    return {
      id: 'sign_thank_you',
      search_key: 'thank_you',
      gloss: thankYou.gloss,
      category: thankYou.category,
      videoAvailable: ISL_RUNTIME_AVAILABLE_VIDEOS.has(thankYou.filename),
      videoUrl: thankYou.videoUrl,
      handshape: thankYou.handshape,
      movementDescription: thankYou.movementDescription,
      nonManualMarkers: thankYou.nonManualMarkers,
      difficulty: 'Beginner',
      tags: ['thank_you', 'isl_dataset_video']
    };
  }

  const normalized = rawKeyword.toLowerCase().trim().replace(/[-\s]+/g, '_').replace(/[^a-z0-9_]/g, '');

  // 1. Direct match in ISL Dataset dictionary
  if (ISL_DATASET_DICT[normalized]) {
    const entry = ISL_DATASET_DICT[normalized];
    const isAvailable = ISL_RUNTIME_AVAILABLE_VIDEOS.has(entry.filename);
    return {
      id: "sign_" + normalized,
      search_key: normalized,
      gloss: entry.gloss,
      category: entry.category,
      videoAvailable: isAvailable,
      videoUrl: entry.videoUrl,
      handshape: entry.handshape,
      movementDescription: entry.movementDescription,
      nonManualMarkers: entry.nonManualMarkers,
      difficulty: 'Beginner',
      tags: [normalized, 'isl_dataset_video']
    };
  }

  // 2. Alias match into ISL Dataset dictionary
  if (ISL_DATASET_ALIASES[normalized] && ISL_DATASET_DICT[ISL_DATASET_ALIASES[normalized]]) {
    const targetKey = ISL_DATASET_ALIASES[normalized];
    const entry = ISL_DATASET_DICT[targetKey];
    const isAvailable = ISL_RUNTIME_AVAILABLE_VIDEOS.has(entry.filename);
    return {
      id: "sign_" + targetKey,
      search_key: targetKey,
      gloss: entry.gloss,
      category: entry.category,
      videoAvailable: isAvailable,
      videoUrl: entry.videoUrl,
      handshape: entry.handshape,
      movementDescription: entry.movementDescription,
      nonManualMarkers: entry.nonManualMarkers,
      difficulty: 'Beginner',
      tags: [targetKey, 'isl_dataset_video', 'alias']
    };
  }

  // 3. Match against curated ISL_DICTIONARY (fallback linguistic references)
  if (ISL_DICTIONARY[normalized]) {
    const existing = ISL_DICTIONARY[normalized];
    // Check if matching dataset file exists
    const matchingDataset = ISL_DATASET_DICT[normalized];
    const isAvailable = matchingDataset ? ISL_RUNTIME_AVAILABLE_VIDEOS.has(matchingDataset.filename) : false;
    return {
      ...existing,
      videoAvailable: isAvailable,
      videoUrl: matchingDataset ? matchingDataset.videoUrl : "/isl/" + normalized + ".mp4"
    };
  }

  // 4. Default fallback for general tokens
  return {
    id: "sign_" + (normalized || 'unknown'),
    search_key: normalized || 'unknown',
    gloss: rawKeyword.toUpperCase(),
    category: 'Everyday',
    videoAvailable: false,
    videoUrl: "/isl/" + (normalized || 'unknown') + ".mp4",
    handshape: "Standard ISL fingerspelling / neutral handshape",
    movementDescription: "Sign video unavailable in the local ISL dataset for " + rawKeyword.toUpperCase(),
    nonManualMarkers: "Neutral facial expression",
    difficulty: 'Beginner',
    tags: [normalized || 'unknown', 'fallback']
  };
}
