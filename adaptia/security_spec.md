# Firestore Security Specification for adaptIA

## 1. Data Invariants & Zero-Trust Rules
1. **Course Invariant**: A course cannot be created without a valid `teacherId`, `code`, `name`, and `grade`.
2. **Topic Invariant**: A topic must belong to an existing `courseId` and contain all 4 VARK learning style branches.
3. **Student Profile Invariant**: A student profile must have a valid diagnosed dominant learning style (`visual`, `auditivo`, `kinestesico`, or `lectoescritura`).
4. **Progress Record Invariant**: A progress entry must reference a valid `studentId`, `courseId`, and `topicId`, with numeric quiz scores and valid boolean completion status.
5. **Denial-of-Wallet & Anti-Poisoning**: All string lengths are strictly bound (`maxLength`), and ID path parameters are validated via `isValidId()`.

## 2. Dirty Dozen Test Cases (Negative Validation Matrix)
| # | Test Case Payload | Expected Result |
|---|---|---|
| 1 | Unauthenticated user attempts write to `/courses/{courseId}` without valid id | `PERMISSION_DENIED` |
| 2 | Attacker injects 1.5MB junk-character string into `topicTitle` | `PERMISSION_DENIED` |
| 3 | Malicious payload trying to inject arbitrary script/HTML into `learningStyle` enum | `PERMISSION_DENIED` |
| 4 | Attempt to set invalid `quizScore` string instead of numeric in `/progress/{progressId}` | `PERMISSION_DENIED` |
| 5 | Unauthorized deletion of teacher courses by unauthenticated third-party | `PERMISSION_DENIED` |
| 6 | Ghost field injection into `/courses/{courseId}` | `PERMISSION_DENIED` |
| 7 | Path ID poisoning with malformed path variable `../..` or special symbols | `PERMISSION_DENIED` |
| 8 | Updating immutable timestamp fields with mismatched types | `PERMISSION_DENIED` |
| 9 | Student trying to forge non-existent learning style (e.g. `telepathic`) | `PERMISSION_DENIED` |
| 10| Unbounded list injection in `enrolledCourseIds` exceeding maximum array size | `PERMISSION_DENIED` |
| 11| Write operation with negative quiz score values | `PERMISSION_DENIED` |
| 12| Blanket query scraping without course filter or identity reference | `PERMISSION_DENIED` |
