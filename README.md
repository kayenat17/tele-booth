# Studio LDR (Tele-Booth)

A real-time, peer-to-peer web photobooth designed for long-distance partners and friends. Hop on a secure, low-latency video call, pose together, and print out cute, customized digital polaroid strips—just like a real photobooth!

## ✨ Features

- **Peer-to-Peer Video Calls**: Powered by **WebRTC**, video streams go directly from browser to browser. It's fast, free, and secure—your video never touches a central server.
- **Synchronized Snapshots**: A shared 3-second countdown automatically triggers the camera for both users simultaneously.
- **Polaroid Stitching**: Automatically combines you and your partner's photos side-by-side into a beautiful 4-panel photostrip.
- **Customization Engine**: 
  - Pick from beautiful solid colors or aesthetic patterns (Gingham, Checkers, Denim, etc.).
  - Drag, drop, scale, and rotate fun emoji stickers over your polaroid.
  - Add customized text and dates with different aesthetic fonts.
  - Camera filters (Retro, B&W, Cool) to match your vibe.
- **High-Res Export**: Download your finished polaroid directly to your device.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: TailwindCSS
- **Video & Realtime**: WebRTC + [Supabase](https://supabase.com/) Realtime (used exclusively for signaling and syncing state)
- **Image Processing**: `sharp` (for backend stitching) and `html2canvas` (for frontend exporting)
- **Animations**: Framer Motion

## 🛠️ Getting Started

### Prerequisites
You will need a Supabase project set up for signaling.
1. Create a project on [Supabase](https://supabase.com/).
2. Create a bucket in Supabase Storage named `photos`. Make sure it's public so images can be stitched.

### Environment Variables
Create a `.env.local` file in the root directory and add your Supabase keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser. Create a room and share the link with a friend!

## 🔒 Privacy & Security

Tele Booth was built with privacy in mind. Because the video connection uses **WebRTC**, your video and audio streams are end-to-end encrypted and transmitted directly to your partner. We do not (and cannot) view, record, or store your video feeds on any central server.

---

