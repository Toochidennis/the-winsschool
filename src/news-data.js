// localStorage fallback starts empty so the public site can show "News coming soon".
// Add project-specific seed posts only when the user explicitly requests them.
export const DEFAULT_NEWS_POSTS = [];

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
