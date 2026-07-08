// localStorage is for frontend demo only. It does not publish news for other users.
// Replace with backend API calls for production.

export const DEFAULT_NEWS_POSTS = [
  {
    id: 'news-1',
    slug: 'admission-for-the-new-academic-session',
    category: 'Admissions',
    title: 'Admission for the new academic session',
    summary:
      'Parents and guardians can contact the school office for admission information, forms, and entrance examination guidance.',
    content:
      'The Wins School welcomes parents and guardians seeking admission for the new academic session. For accurate admission guidance, families should contact the school office directly. The admissions team will provide current form requirements, payment direction, and entrance examination instructions where applicable.',
    image: 'winsschool/optimized/campus.webp',
    imageLabel: 'School Building',
    status: 'Published',
    updatedAt: ''
  },
  {
    id: 'news-2',
    slug: 'learning-beyond-the-classroom',
    category: 'School Life',
    title: 'Learning beyond the classroom',
    summary:
      'Our pupils and students take part in academic, creative, sporting, and character-building activities.',
    content:
      'Learning at The Wins School goes beyond classroom lessons. Pupils and students participate in academic, creative, sporting, and character-building activities that support confidence, teamwork, discipline, and leadership. These activities help learners apply values and skills in practical situations.',
    image: 'winsschool/optimized/classroom.webp',
    imageLabel: 'Classroom',
    status: 'Published',
    updatedAt: ''
  },
  {
    id: 'news-3',
    slug: 'visit-or-contact-the-school',
    category: 'Notice',
    title: 'Visit or contact the school',
    summary:
      'Families can reach the school through the official phone numbers, email addresses, or visit the school office during working hours.',
    content:
      'Parents and guardians can reach The Wins School through official phone numbers and email addresses or by visiting the school office during working hours. The school team is available to support enquiries related to admissions, school visits, and general information.',
    image: 'winsschool/optimized/reception.webp',
    imageLabel: 'Reception',
    status: 'Published',
    updatedAt: ''
  },
  {
    id: 'news-4',
    slug: 'field-and-sports-activity-programme',
    category: 'School Life',
    title: 'Field and sports activity programme',
    summary:
      'Sports and guided physical activities continue to support discipline, fitness, and teamwork among learners.',
    content:
      'The school continues to encourage structured sports and field activities that promote fitness, discipline, and collaboration. Learners are guided by staff to participate responsibly, build confidence, and develop teamwork habits that support growth in school life.',
    image: 'winsschool/optimized/sports.webp',
    imageLabel: 'Sports',
    status: 'Published',
    updatedAt: ''
  },
  {
    id: 'news-5',
    slug: 'early-years-learning-programme',
    category: 'Academics',
    title: 'Early years learning programme',
    summary:
      'Our nursery and early years classes focus on foundational literacy, numeracy, and social skills in a nurturing environment.',
    content:
      'The early years programme at The Wins School is designed to give young learners a strong start. Through guided activities, play-based learning, and structured classroom routines, children develop early literacy, numeracy, and social skills. Our teachers work closely with parents to track progress and support each child individually.',
    image: 'winsschool/optimized/kids.webp',
    imageLabel: 'Young learners',
    status: 'Published',
    updatedAt: ''
  },
  {
    id: 'news-6',
    slug: 'entrance-examination-preparation',
    category: 'Admissions',
    title: 'Entrance examination preparation tips',
    summary:
      'Helpful guidance for candidates preparing for the entrance examination at The Wins School.',
    content:
      'Parents and candidates preparing for The Wins School entrance examination should focus on core subjects including English, Mathematics, and General Knowledge. The school recommends consistent practice, adequate rest before the examination day, and arriving early. Contact the admissions office for sample materials and further guidance.',
    image: 'winsschool/optimized/classroom.webp',
    imageLabel: 'Classroom',
    status: 'Published',
    updatedAt: ''
  },
  {
    id: 'news-7',
    slug: 'school-health-and-wellness',
    category: 'Notice',
    title: 'School health and wellness update',
    summary:
      'The school maintains a clean, safe environment with a functional sick bay and health monitoring for all learners.',
    content:
      'The Wins School prioritises the health and wellness of every learner. The school sick bay is staffed and equipped to handle minor health concerns during school hours. Parents are encouraged to inform the school of any health conditions and to keep emergency contact information up to date.',
    image: 'winsschool/optimized/sickbay.webp',
    imageLabel: 'Sick bay',
    status: 'Published',
    updatedAt: ''
  },
  {
    id: 'news-8',
    slug: 'parent-teacher-partnership',
    category: 'School Life',
    title: 'Strengthening parent-teacher partnership',
    summary:
      'Open communication between parents and teachers helps track student progress and address challenges early.',
    content:
      'The Wins School values the partnership between parents and teachers. Regular communication through school reports, parent meetings, and direct contact helps families stay informed about their child\'s academic and personal development. Parents are welcome to reach out to teachers through the school office.',
    image: 'winsschool/optimized/field.webp',
    imageLabel: 'School field',
    status: 'Published',
    updatedAt: ''
  },
  {
    id: 'news-9',
    slug: 'secondary-school-curriculum-overview',
    category: 'Academics',
    title: 'Secondary school curriculum overview',
    summary:
      'Our secondary programme prepares students for senior examinations with a broad and balanced curriculum.',
    content:
      'The secondary school curriculum at The Wins School covers core subjects including English, Mathematics, Sciences, Humanities, and vocational studies. Students are prepared for internal and external examinations through a structured programme of teaching, assessment, and revision. Teachers provide individual support to help each student reach their potential.',
    image: 'winsschool/optimized/classroom.webp',
    imageLabel: 'Classroom',
    status: 'Published',
    updatedAt: ''
  },
  {
    id: 'news-10',
    slug: 'end-of-term-activities',
    category: 'Events',
    title: 'End of term activities and celebrations',
    summary:
      'Learners take part in end-of-term events that celebrate achievement, creativity, and school community.',
    content:
      'Each term at The Wins School concludes with activities that recognise student achievement and bring the school community together. Events include class presentations, award ceremonies, creative displays, and sports activities. Parents and guardians are invited to attend and celebrate with their children.',
    image: 'winsschool/optimized/sports.webp',
    imageLabel: 'Sports',
    status: 'Published',
    updatedAt: ''
  }
];

export const NEWS_IMAGE_OPTIONS = [
  { value: 'winsschool/optimized/classroom.webp', label: 'Classroom' },
  { value: 'winsschool/optimized/campus.webp', label: 'School building' },
  { value: 'winsschool/optimized/field.webp', label: 'School field' },
  { value: 'winsschool/optimized/kids.webp', label: 'Young learners' },
  { value: 'winsschool/optimized/reception.webp', label: 'Reception' },
  { value: 'winsschool/optimized/sports.webp', label: 'Sports' },
  { value: 'winsschool/optimized/sickbay.webp', label: 'Sick bay' },
  { value: 'winsschool/optimized/admin.webp', label: 'Director' },
  { value: 'winsschool/IMG_3203.JPG', label: 'Students in class' },
  { value: 'winsschool/IMG_5418.JPG', label: 'School activity' },
  { value: 'winsschool/IMG_5886.JPG', label: 'Students learning' },
  { value: 'winsschool/IMG_4402.JPG', label: 'School event' },
  { value: 'winsschool/foot.JPG', label: 'Football' },
  { value: 'winsschool/IMG_5373.JPG', label: 'Classroom activity' },
  { value: 'winsschool/IMG_5368.JPG', label: 'School gathering' },
];

export const NEWS_CATEGORIES = ['Admissions', 'School Life', 'Notice', 'Events', 'Academics'];
