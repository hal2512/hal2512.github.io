<!--
  HTML comments like this one are not shown on the site.
  Worth adding: screenshots (put them in public/projects/ and use ![Screen](/projects/cashsplit-1.png)),
  and how many friends use it once that grows.
-->

## What it does

CashSplit is a Flutter app for friend groups. You record shared expenses for each gathering (a "session"), and the app works out the **smallest set of who-pays-whom transfers** to settle up.

**Status:** in progress. The core features work, and my own friend group uses it as a sideloaded Android app.

---

## My role

Solo. I designed the features and the data model, built the full app with an AI-assisted workflow (Claude), and debugged and ran it on device myself.

---

## Highlights

- **Settlement algorithm:** never needs more than **n − 1 transfers** for n people, with **exact cent accuracy**. Verified with **20,000+ randomised tests**.
- **Integer-cent arithmetic** avoids floating-point rounding errors.
- **Greedy matching** of people who are owed money with people who owe it.
- **Late joiners:** each expense is shared only by the members present at the time.
- **Guest members** who don't have an account.
- **Friend codes:** unique codes, so duplicate usernames are allowed.

---

## Data design

- **Firebase Auth** and **Cloud Firestore** with real-time streams
- **Denormalised documents:** member names and avatars are copied onto each session, avoiding a separate read per member
- **Firestore security rules** to protect each group's data
- **Material 3** custom theming and a hand-drawn avatar set made with `CustomPaint`

---

## Stack

`Flutter` · `Dart` · `Firebase Auth` · `Cloud Firestore` · `flutter_test`
