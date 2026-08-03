// ---------------------------------------------------------------------------
// SITE CONFIG — edit everything about "who you are" here. Nothing else in
// the codebase should need touching to update your name, bio, or links.
// ---------------------------------------------------------------------------

import type { Tool, Achievement } from "./types";

export const site = {
  name: "Kishor Kumar",
  handle: "blink0x",
  brand: "CASEFILE",
  tagline: "Cyber Security Professional (in training) — TCS",
  workplace: "TCS (Tata Consultancy Services)",
  // Path to a photo in /public, e.g. "/profile.jpg" — drop the file in
  // public/ and set this. Leave blank for a monogram placeholder instead.
  avatar: "/profile.jpg",
  domain: "casefile.example.com", // TODO: replace with your real domain once deployed
  summary:
    "I break things in controlled environments and write down exactly how. This is my running case log of CTF writeups — web exploitation, injection, crypto, reversing — plus the background that got me here.",
  email: "kishorkumar83076@gmail.com",
  socials: {
    github: "https://github.com/atkishork",
    linkedin: "https://linkedin.com/in/kishork22",
    medium: "https://medium.com/@atkishork",
    twitter: "https://x.com/atkishork",
  },
  resumePdf: "/resume.pdf",
};

export const about = {
  bio: [
    "Currently in the onboarding / pre-joining phase at TCS, preparing for the internal assessments required before joining, and working toward the CSP (Cyber Security Professional) designation.",
    "My interest sits on both sides of the fence — defensive fundamentals (CIA triad, network security, secure architecture) and offensive security (CTFs, injection attacks, exploitation). I'd rather understand an attack by reproducing it than by reading about it.",
    "Outside of coursework, I build small security-oriented tools — most recently an AI-assisted penetration testing assistant that chains recon, CVE correlation, and LLM-based vulnerability triage into a single workflow.",
  ],
  // "Skills" — languages and general skills, shown as a simple list.
  skills: [
    "CTF exploitation",
    "Injection attacks (XXE, SQLi)",
    "Web application security",
    "Recon & enumeration",
    "CIA Triad",
    "Network security basics",
    "Threat modeling",
    "Java (OOP)",
    "Python",
    "MITRE ATT&CK mapping",
  ],
  // "Tools" — icon + 5-star proficiency rating each. `icon` is optional:
  // drop a logo image in /public/tools/ and point to it (e.g.
  // "/tools/burpsuite.png"), or leave it "" for an auto-generated monogram
  // box instead.
  // TODO: the ratings below are a neutral 3/5 default — adjust each to your
  // actual proficiency, this wasn't something I could know or guess.
  tools: [
    { name: "Nmap", icon: "", rating: 3 },
    { name: "Wireshark", icon: "", rating: 3 },
    { name: "Burp Suite", icon: "", rating: 3 },
    { name: "Caido", icon: "", rating: 3 },
    { name: "John the Ripper", icon: "", rating: 3 },
    { name: "Ghidra", icon: "", rating: 3 },
    { name: "Gobuster", icon: "", rating: 3 },
    { name: "Linux", icon: "", rating: 3 },
  ] as Tool[],
  // certificateUrl is optional — link to a PDF in /public, an image, or a
  // verification page (e.g. Credly) — leave "" to hide the link.
  achievements: [
    {
      title: "Top 25 Finalist of TCS HackQuest Season 10",
      description: "TCS HackQuest Season 10, a national-level hackathon by Tata Consultancy Services, and was offered a job profile in CSP Unit.",
      date: "April 2026",
      certificateUrl: "",
    },
    {
      title: "Winner – Advent of Cyber 2025 (TryHackMe)",
      description: "Awarded a 3-Month TryHackMe Premium Subscription as the reward for Advent of Cyber 2025.",
      date: "Jan 2026",
      certificateUrl: "",
    },
    {
      title: "1st Runner-Up – Hack With Jolu CTF, JGEC",
      description: "CTF organised by Cyber Security Club \"Z3r0_L0g0n\" of Jalpaiguri Govt. Engg. College.",
      date: "June 2024",
      certificateUrl: "",
    },
  ] as Achievement[],
  certifications: [
    {
      name: "Cybersecurity 101: Foundations for Absolute Beginners: Udemy",
      status: "Completed",
      note: "",
    },
    {
      name: "Cyber Threat Intelligence: Udemy",
      status: "Completed",
      note: "",
    },
  ],
  education: [
    {
      institution: "Jalpaiguri Government Engineering College",
      credential: "B.Tech in Computer Science and Engineering",
      duration: "Sept. 2023 – June 2026",
      note: "DGPA: 8.45",
    },
    {
      institution: "Asansol Institute of Engineering and Management - Polytechnic",
      credential: "Diploma in Computer Science and Technology",
      duration: "Aug. 2019 – July 2022",
      note: "DGPA: 8.90",
    },
  ],
  // A few things you're building or have shipped — separate from CTF writeups.
  projects: [
    {
      name: "CryptX – Cryptography & CTF CLI Tool",
      description:
        "Developed a Python-based CLI tool to perform encryption and decryption techniques commonly encountered in CTF challenges. Implemented Caesar cipher and multiple encoding/decoding utilities to assist in cryptanalysis during security assessments.",
      link: "https://github.com/atkishork/cryptx",
    },
  ],
};
