<?php
/**
 * The Wins School — API Helpers
 */

require_once __DIR__ . '/config.php';

// -------------------------------------------------------
// JSON response
// -------------------------------------------------------
function json_response($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

// -------------------------------------------------------
// Auth guards
// -------------------------------------------------------
function require_admin(): void {
    if (empty($_SESSION['admin_logged_in'])) {
        json_response(['success' => false, 'message' => 'Unauthorized.'], 401);
    }
}

function verify_csrf(): void {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        json_response(['success' => false, 'message' => 'Invalid or missing CSRF token.'], 403);
    }
}

// -------------------------------------------------------
// News file read / write (with locking)
// -------------------------------------------------------
function read_news(): array {
    if (!file_exists(NEWS_FILE)) {
        write_news(get_default_posts());
        return get_default_posts();
    }

    $raw = @file_get_contents(NEWS_FILE);
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        return [];
    }

    return $data;
}

function write_news(array $posts): bool {
    if (!is_dir(DATA_DIR)) {
        @mkdir(DATA_DIR, 0755, true);
    }

    $json = json_encode(array_values($posts), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        return false;
    }

    $fp = @fopen(NEWS_FILE, 'c');
    if (!$fp) {
        return false;
    }

    if (flock($fp, LOCK_EX)) {
        ftruncate($fp, 0);
        fwrite($fp, $json);
        fflush($fp);
        flock($fp, LOCK_UN);
    }
    fclose($fp);

    return true;
}

// -------------------------------------------------------
// Slug helpers
// -------------------------------------------------------
function slugify(string $value): string {
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9\s-]/', '', $value);
    $value = preg_replace('/[\s]+/', '-', $value);
    return preg_replace('/-+/', '-', $value);
}

function unique_slug(string $slug, array $posts, ?string $ignoreId = null): string {
    $base = $slug;
    $counter = 1;
    while (true) {
        $collision = false;
        foreach ($posts as $post) {
            if (($post['slug'] ?? '') === $slug && ($ignoreId === null || ($post['id'] ?? '') !== $ignoreId)) {
                $collision = true;
                break;
            }
        }
        if (!$collision) {
            return $slug;
        }
        $slug = $base . '-' . $counter;
        $counter++;
    }
}

// -------------------------------------------------------
// Image path helper
// -------------------------------------------------------
function normalize_image_path(string $image): string {
    // Store relative paths so the site works both at domain root and in a subfolder like /wins.
    return ltrim(trim($image), '/');
}

// -------------------------------------------------------
// Sanitize post input
// -------------------------------------------------------
function sanitize_post(array $input): array {
    return [
        'title'   => trim(strip_tags($input['title'] ?? '')),
        'slug'    => trim(strip_tags($input['slug'] ?? '')),
        'category'=> trim(strip_tags($input['category'] ?? 'Notice')),
        'summary' => trim(strip_tags($input['summary'] ?? '')),
        'content' => trim($input['content'] ?? ''),
        'image'   => normalize_image_path(strip_tags($input['image'] ?? '')),
        'status'  => trim(strip_tags($input['status'] ?? 'draft')),
    ];
}

// -------------------------------------------------------
// Image allowlist
// -------------------------------------------------------
function is_allowed_image(string $image): bool {
    $image = normalize_image_path($image);
    $allowed = [
        'winsschool/IMG_3203.JPG',
        'winsschool/IMG_5418.JPG',
        'winsschool/IMG_5886.JPG',
        'winsschool/IMG_4402.JPG',
        'winsschool/foot.JPG',
        'winsschool/IMG_5373.JPG',
        'winsschool/IMG_5368.JPG',
        'winsschool/optimized/classroom.webp',
        'winsschool/optimized/campus.webp',
        'winsschool/optimized/field.webp',
        'winsschool/optimized/kids.webp',
        'winsschool/optimized/reception.webp',
        'winsschool/optimized/sports.webp',
        'winsschool/optimized/sickbay.webp',
        'winsschool/optimized/admin.webp',
    ];
    return in_array($image, $allowed, true);
}

// -------------------------------------------------------
// Validate post fields
// -------------------------------------------------------
function validate_post(array $post): array {
    $errors = [];
    if (empty($post['title']))   $errors[] = 'Title is required.';
    if (empty($post['slug']))    $errors[] = 'Slug is required.';
    if (empty($post['category'])) $errors[] = 'Category is required.';
    if (empty($post['summary'])) $errors[] = 'Summary is required.';
    if (empty($post['content'])) $errors[] = 'Content is required.';
    if (!is_allowed_image($post['image'])) {
        $errors[] = 'Image must be selected from the allowed list.';
    }
    return $errors;
}

// -------------------------------------------------------
// Generate unique ID
// -------------------------------------------------------
function new_news_id(): string {
    return 'news_' . strval(intval(microtime(true) * 1000));
}

// -------------------------------------------------------
// Default sample posts (seeded when news.json is missing)
// -------------------------------------------------------
function get_default_posts(): array {
    return [
        [
            'id'        => 'news_1720450000001',
            'title'     => 'Admission for the new academic session',
            'slug'      => 'admission-for-the-new-academic-session',
            'category'  => 'Admissions',
            'summary'   => 'Parents and guardians can contact the school office for admission information, forms, and entrance examination guidance.',
            'content'   => "The Wins School welcomes parents and guardians seeking admission for the new academic session. For accurate admission guidance, families should contact the school office directly.\n\nThe admissions team will provide current form requirements, payment direction, and entrance examination instructions where applicable.",
            'image'     => 'winsschool/optimized/campus.webp',
            'status'    => 'published',
            'createdAt' => '2026-07-08T10:00:00+01:00',
            'updatedAt' => '2026-07-08T10:00:00+01:00',
        ],
        [
            'id'        => 'news_1720450000002',
            'title'     => 'Learning beyond the classroom',
            'slug'      => 'learning-beyond-the-classroom',
            'category'  => 'School Life',
            'summary'   => 'Our pupils and students take part in academic, creative, sporting, and character-building activities.',
            'content'   => "Learning at The Wins School goes beyond classroom lessons. Pupils and students participate in academic, creative, sporting, and character-building activities that support confidence, teamwork, discipline, and leadership.\n\nThese activities help learners apply values and skills in practical situations.",
            'image'     => 'winsschool/optimized/classroom.webp',
            'status'    => 'published',
            'createdAt' => '2026-07-08T10:00:00+01:00',
            'updatedAt' => '2026-07-08T10:00:00+01:00',
        ],
        [
            'id'        => 'news_1720450000003',
            'title'     => 'Visit or contact the school',
            'slug'      => 'visit-or-contact-the-school',
            'category'  => 'Notice',
            'summary'   => 'Families can reach the school through the official phone numbers, email addresses, or visit the school office during working hours.',
            'content'   => "Parents and guardians can reach The Wins School through official phone numbers and email addresses or by visiting the school office during working hours.\n\nThe school team is available to support enquiries related to admissions, school visits, and general information.",
            'image'     => 'winsschool/optimized/reception.webp',
            'status'    => 'published',
            'createdAt' => '2026-07-08T10:00:00+01:00',
            'updatedAt' => '2026-07-08T10:00:00+01:00',
        ],
    ];
}
