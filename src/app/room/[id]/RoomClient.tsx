'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Download, Trash2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface RoomClientProps {
  roomId: string;
}

const SOLID_THEMES = [
  { id: 'black', name: 'Black', color: '#1E1E1E', type: 'solid', rgb: { r: 30, g: 30, b: 30, alpha: 1 } },
  { id: 'white', name: 'White', color: '#FFFFFF', type: 'solid', rgb: { r: 255, g: 255, b: 255, alpha: 1 } },
  { id: 'cream', name: 'Cream', color: '#FDF6E3', type: 'solid', rgb: { r: 253, g: 246, b: 227, alpha: 1 } },
  { id: 'pink', name: 'Pink', color: '#F7BAC9', type: 'solid', rgb: { r: 247, g: 186, b: 201, alpha: 1 } },
  { id: 'blue', name: 'Blue', color: '#B5CDE3', type: 'solid', rgb: { r: 181, g: 205, b: 227, alpha: 1 } },
  { id: 'mint', name: 'Mint', color: '#C6E3D4', type: 'solid', rgb: { r: 198, g: 227, b: 212, alpha: 1 } },
  { id: 'lavender', name: 'Lavender', color: '#E0D4F5', type: 'solid', rgb: { r: 224, g: 212, b: 245, alpha: 1 } }
];

const PATTERN_THEMES = [
  { id: 'checker-pink', name: 'Checkers', color: '#F7BAC9', type: 'pattern', patternId: 'checkerboard', rgb: { r: 253, g: 246, b: 227, alpha: 1 }, secondaryRgb: { r: 247, g: 186, b: 201, alpha: 1 } },
  { id: 'dots-blue', name: 'Polka', color: '#B5CDE3', type: 'pattern', patternId: 'dots', rgb: { r: 255, g: 255, b: 255, alpha: 1 }, secondaryRgb: { r: 181, g: 205, b: 227, alpha: 1 } },
  { id: 'grid-mint', name: 'Grid', color: '#C6E3D4', type: 'pattern', patternId: 'grid', rgb: { r: 255, g: 255, b: 255, alpha: 1 }, secondaryRgb: { r: 198, g: 227, b: 212, alpha: 1 } },
  { id: 'gingham-green', name: 'Gingham', color: '#A3B899', type: 'pattern', patternId: 'gingham', rgb: { r: 255, g: 255, b: 255, alpha: 1 }, secondaryRgb: { r: 163, g: 184, b: 153, alpha: 1 } },
  { id: 'stripes-peach', name: 'Stripes', color: '#FFD1B3', type: 'pattern', patternId: 'stripes', rgb: { r: 253, g: 246, b: 227, alpha: 1 }, secondaryRgb: { r: 255, g: 209, b: 179, alpha: 1 } },
  { id: 'denim-blue', name: 'Denim', color: '#4A6583', type: 'pattern', patternId: 'denim', rgb: { r: 74, g: 101, b: 131, alpha: 1 }, secondaryRgb: { r: 255, g: 255, b: 255, alpha: 1 } }
];

const CAMERA_FILTERS = [
  { id: 'normal', name: 'Normal', css: 'contrast(1.1) brightness(1.1) saturate(1.2)' },
  { id: 'bw', name: 'B&W', css: 'contrast(1.2) brightness(1.1) grayscale(1)' },
  { id: 'retro', name: 'Retro', css: 'contrast(1.1) brightness(1.1) saturate(1.2) sepia(0.6)' },
  { id: 'cool', name: 'Cool', css: 'contrast(1.1) brightness(1.1) saturate(1.2) hue-rotate(180deg)' }
];

const STICKERS_PALETTE = ['🎀', '✩𓏲๋࣭🪼', '🧺', '✨', '🧸', '🌸', '🍒', '𓆉', '🪸', '🐚', '🫧𓇼', '🌟', '🌷', '🦋', '🍓', '😎', '✌️', '🍰', '𓆝 𓆟 𓆞 '];

const STRIP_FONTS = [
  { id: 'sans', name: 'Clean', value: 'var(--font-outfit)' },
  { id: 'serif', name: 'Elegant', value: 'var(--font-playfair)' },
  { id: 'handwriting', name: 'Cute', value: 'var(--font-caveat)' }
];

interface Sticker {
  id: string;
  emoji: string;
  scale: number;
  rotation: number;
}

export default function RoomClient({ roomId }: RoomClientProps) {
  const [status, setStatus] = useState<string>('Waiting for camera...');
  const [partnerJoined, setPartnerJoined] = useState(false);
  const [flash, setFlash] = useState(false);

  // Camera Filters
  const [activeFilter, setActiveFilter] = useState(CAMERA_FILTERS[0]);
  const activeFilterRef = useRef(CAMERA_FILTERS[0]);
  useEffect(() => { activeFilterRef.current = activeFilter; }, [activeFilter]);

  // Film strip state
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isStitching, setIsStitching] = useState(false);
  const [stitchedPhoto, setStitchedPhoto] = useState<string | null>(null);
  const [localPhotos, setLocalPhotos] = useState<string[]>([]);
  const [partnerPhotos, setPartnerPhotos] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState(SOLID_THEMES[3]); // Pink

  // Deco State
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);
  const [stripTitle, setStripTitle] = useState('LDR PHOTOBOOTH');
  const [stripDate, setStripDate] = useState(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }));
  const [stripFont, setStripFont] = useState('var(--font-outfit)');
  const exportRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<any>(null);

  const clientId = useRef(Math.random().toString(36).substring(7)).current;
  const isInitiator = useRef(false);

  const initWebRTC = useCallback(async () => {
    try {
      setStatus('Accessing camera...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: true
      });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setStatus('Connecting to room...');

      const existingChannel = supabase.getChannels().find(c => c.topic === `realtime:room:${roomId}`);
      if (existingChannel) {
        await supabase.removeChannel(existingChannel);
      }

      const channel = supabase.channel(`room:${roomId}`, {
        config: {
          broadcast: { self: false },
          presence: { key: clientId }
        }
      });
      channelRef.current = channel;

      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.keys(state);

        if (users.length >= 2) {
          setPartnerJoined(true);
          setStatus('Partner connected!');

          const sortedUsers = users.sort();
          if (sortedUsers[0] === clientId && !peerConnectionRef.current) {
            isInitiator.current = true;
            startCall();
          }
        } else {
          setPartnerJoined(false);
          setStatus('Waiting for partner to join...');
        }
      });

      channel.on('broadcast', { event: 'signal' }, async ({ payload }) => {
        if (payload.clientId === clientId) return;
        if (payload.type === 'offer') await handleOffer(payload.data);
        else if (payload.type === 'answer') await handleAnswer(payload.data);
        else if (payload.type === 'candidate') await handleCandidate(payload.data);
      });

      channel.on('broadcast', { event: 'action' }, ({ payload }) => {
        if (payload.action === 'shutter') {
          captureLocalFrame(payload.shotIndex, payload.sessionId);
        } else if (payload.action === 'countdown') {
          setCountdown(payload.count);
        } else if (payload.action === 'photo_ready') {
          setPartnerPhotos(prev => {
            const newArr = [...prev];
            newArr[payload.shotIndex] = payload.url;
            return newArr;
          });
        }
      });

      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ joined_at: new Date().toISOString() });
        }
      });

    } catch (err) {
      console.error('Error starting WebRTC:', err);
      setStatus('Could not access camera/microphone.');
    }
  }, [roomId, clientId]);

  const captureLocalFrame = (shotIndex: number, sessionId: string) => {
    setFlash(true);
    setCountdown(null);
    setTimeout(() => setFlash(false), 300);

    const video = localVideoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply current camera filter to the captured photo
    ctx.filter = activeFilterRef.current.css;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const fileName = `${roomId}/${sessionId}-shot${shotIndex}-${clientId}.png`;
      // Use a standard insert. Do not use upsert: true as that requires SELECT/UPDATE policies which we removed for security.
      const { data, error } = await supabase.storage.from('photos').upload(fileName, blob);
      if (error) {
        console.error("Upload error", error);
      } else {
        const { data: publicData } = supabase.storage.from('photos').getPublicUrl(fileName);
        const myUrl = publicData.publicUrl;

        setLocalPhotos(prev => {
          const newArr = [...prev];
          newArr[shotIndex] = myUrl;
          return newArr;
        });

        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'action',
            payload: { action: 'photo_ready', url: myUrl, shotIndex }
          });
        }
      }
    }, 'image/png', 1.0);
  };

  const executeSequence = async () => {
    const sessionId = Date.now().toString();
    setLocalPhotos([]);
    setPartnerPhotos([]);
    setStitchedPhoto(null);
    setStickers([]);

    const runShot = async (shotIndex: number) => {
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'action',
            payload: { action: 'countdown', count: i }
          });
        }
        await new Promise(r => setTimeout(r, 1000));
      }

      captureLocalFrame(shotIndex, sessionId);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'action',
          payload: { action: 'shutter', shotIndex, sessionId }
        });
      }

      if (shotIndex < 3) {
        await new Promise(r => setTimeout(r, 2000));
        await runShot(shotIndex + 1);
      }
    };

    runShot(0);
  };

  const handleShutterClick = () => {
    executeSequence();
  };

  useEffect(() => {
    if (localPhotos.filter(Boolean).length === 4 && partnerPhotos.filter(Boolean).length === 4) {
      setIsStitching(true);

      const imagePairs = localPhotos.map((localUrl, i) => ({
        left: isInitiator.current ? localUrl : partnerPhotos[i],
        right: isInitiator.current ? partnerPhotos[i] : localUrl
      }));

      fetch('/api/stitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePairs, theme: selectedTheme })
      })
        .then(res => res.json())
        .then(data => {
          if (data.stitchedImage) {
            setStitchedPhoto(data.stitchedImage);
          }
        })
        .catch(console.error)
        .finally(() => {
          setIsStitching(false);
        });
    }
  }, [localPhotos, partnerPhotos, selectedTheme]);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current!));
    }

    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'signal',
          payload: { type: 'candidate', data: event.candidate, clientId }
        });
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [clientId]);

  const startCall = async () => {
    const pc = createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    channelRef.current.send({ type: 'broadcast', event: 'signal', payload: { type: 'offer', data: offer, clientId } });
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    const pc = createPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    channelRef.current.send({ type: 'broadcast', event: 'signal', payload: { type: 'answer', data: answer, clientId } });
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (peerConnectionRef.current && peerConnectionRef.current.signalingState === 'have-local-offer') {
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (err) {
        console.warn('Could not set remote answer:', err);
      }
    }
  };

  const handleCandidate = async (candidate: RTCIceCandidateInit) => {
    if (peerConnectionRef.current) {
      try { await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate)); } catch (err) { }
    }
  };

  useEffect(() => {
    initWebRTC();
    return () => {
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
      if (peerConnectionRef.current) peerConnectionRef.current.close();
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [initWebRTC]);

  const handleDownload = async () => {
    if (!exportRef.current) return;

    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: null,
        scale: 2, // High res
        useCORS: true // Required for Supabase images
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ldr-photobooth-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to bake stickers', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col p-4 md:p-8 selection:bg-rose-200 relative overflow-hidden font-sans">

      {/* Soft gradient background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-200/40 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[100px] pointer-events-none" />

      <header className="mb-6 z-10 flex flex-col md:flex-row justify-between items-center bg-white/60 backdrop-blur-2xl px-8 py-4 rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-xl font-light text-slate-800 tracking-[0.2em] uppercase">
            Studio LDR
          </h1>
          <p className="text-xs font-medium text-slate-500 tracking-wider mt-1">Share this link to invite your partner & friends ʚ🍓ɞ🍡</p>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="text-xs uppercase tracking-wider bg-rose-400 hover:bg-rose-500 text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-rose-400/20 hover:shadow-rose-400/40 hover:-translate-y-0.5 transition-all"
        >
          Copy Link
        </button>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col relative z-10">
        {/* Main Booth Frame */}
        <div className="w-full h-full flex-1 relative bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">

          {/* CAMERA FILTERS (Left Side UI) */}
          {partnerJoined && !isStitching && !stitchedPhoto && countdown === null && (
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 p-3 bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] shadow-lg">
              <p className="text-slate-500 font-medium text-[10px] tracking-widest uppercase text-center mb-1">
                Filter
              </p>
              {CAMERA_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-[10px] tracking-wide transition-all ${activeFilter.id === f.id ? 'bg-rose-400 text-white shadow-md shadow-rose-400/30' : 'bg-white/80 text-slate-600 hover:bg-white'}`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          )}

          {/* Camera Feeds */}
          <div className="w-full flex justify-center items-center flex-1 px-4 mb-24 mt-8 md:mt-12">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-5xl transition-all duration-700 ${countdown !== null ? 'scale-[1.02] drop-shadow-2xl' : 'scale-100'} ${isStitching ? 'opacity-0 scale-95 blur-md' : 'opacity-100'}`}>

              {/* Remote Feed Cell */}
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-white/50 backdrop-blur-sm border border-white/50">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{ filter: activeFilter.css }}
                  className={`w-full h-full object-cover transition-opacity duration-700 ${partnerJoined ? 'opacity-100' : 'opacity-0'}`}
                />
                {!partnerJoined && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 font-medium z-10 p-4 text-center">
                    <div className="w-10 h-10 border-2 border-rose-200 border-t-rose-400 rounded-full animate-spin mb-4" />
                    <span className="text-xs tracking-widest uppercase">{status}</span>
                  </div>
                )}
              </div>

              {/* Local Feed Cell */}
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-white/50">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{
                    transform: 'scaleX(-1)',
                    filter: activeFilter.css
                  }}
                />
              </div>

            </div>
          </div>

          {/* Flash Effect */}
          {flash && <div className="absolute inset-0 bg-white z-50 animate-pulse pointer-events-none opacity-80" />}

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
              <span
                className="text-[12rem] font-light text-white drop-shadow-[0_0_40px_rgba(0,0,0,0.3)] animate-pulse"
              >
                {countdown}
              </span>
            </div>
          )}

          {/* Shutter Button */}
          {partnerJoined && !isStitching && !stitchedPhoto && countdown === null && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={handleShutterClick}
                className="w-20 h-20 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl border border-white hover:scale-105 active:scale-95 transition-all group"
              >
                <div className="w-16 h-16 bg-gradient-to-tr from-rose-400 to-rose-300 rounded-full flex items-center justify-center shadow-inner group-hover:from-rose-500 group-hover:to-rose-400 transition-colors">
                  <Camera className="text-white" size={28} strokeWidth={1.5} />
                </div>
              </button>
            </div>
          )}

          {/* Stitching Loading State */}
          {isStitching && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-40 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-2 border-rose-200 border-t-rose-400 rounded-full animate-spin mb-6" />
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-slate-600">Developing film...</p>
            </div>
          )}

          {/* Final Stitched Photo Modal - DECO PHASE */}
          {stitchedPhoto && (
            /* Deco Mode UI Wrapper */
            <div className="absolute inset-0 z-40 flex flex-col lg:flex-row bg-[#FAFAFA] overflow-hidden">

              {/* Sticker Palette Sidebar (Horizontal on mobile, vertical on desktop) */}
              <div className="w-full lg:w-32 h-24 lg:h-full bg-white/60 border-b lg:border-b-0 lg:border-r border-white shadow-sm lg:shadow-xl flex flex-row lg:flex-col items-center p-4 lg:p-6 overflow-x-auto lg:overflow-x-hidden overflow-y-hidden lg:overflow-y-auto shrink-0 relative z-50">
                <p className="hidden lg:block font-medium text-[10px] text-slate-500 tracking-[0.2em] uppercase mb-8 pb-2 border-b border-slate-200 text-center w-full">Deco</p>
                <div className="flex flex-row lg:flex-col gap-4 justify-start lg:justify-center items-center h-full lg:h-auto min-w-max lg:min-w-0">
                  {STICKERS_PALETTE.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const newId = Math.random().toString();
                        setStickers(s => [...s, { id: newId, emoji, scale: 1, rotation: 0 }]);
                        setActiveStickerId(newId);
                      }}
                      className="text-4xl hover:scale-110 transition-transform drop-shadow-sm"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {/* Trash Zone Tip (Hidden on mobile for space) */}
                <div className="hidden lg:flex mt-auto pt-8 flex-col items-center text-slate-400">
                  <Trash2 size={20} strokeWidth={1.5} />
                  <span className="text-[9px] text-center mt-2 tracking-widest uppercase">Drag to Delete</span>
                </div>
              </div>

              {/* Main Deco Area */}
              <div className="flex-1 h-full relative flex flex-col items-center justify-start p-8 overflow-y-auto">

                {/* Constraints box for framer motion drag */}
                <div ref={constraintsRef} className="w-full flex justify-center pb-32">

                  {/* The actual export wrapper that html2canvas will target */}
                  <div ref={exportRef} className="relative w-full max-w-[320px] shadow-2xl shadow-slate-300/50 rounded-lg overflow-hidden">
                    <img src={stitchedPhoto} alt="Our Photobooth" className="w-full pointer-events-none" />

                    {/* Render active stickers */}
                    {stickers.map(sticker => (
                      <motion.div
                        key={sticker.id}
                        drag
                        dragConstraints={constraintsRef}
                        dragElastic={0}
                        dragMomentum={false}
                        whileTap={{ scale: sticker.scale }} // Fallback animation during drag
                        onTap={() => {
                          const sizes = [0.7, 1.0, 1.5, 2.0];
                          const currentIndex = sizes.indexOf(sticker.scale);
                          const nextSize = sizes[(currentIndex + 1) % sizes.length];

                          setStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, scale: nextSize } : s));
                        }}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          setActiveStickerId(sticker.id);
                        }}
                        className="absolute text-5xl cursor-pointer drop-shadow-md origin-center select-none"
                        style={{
                          top: '30%', left: '40%',
                          rotate: `${sticker.rotation}deg`
                        }}
                        animate={{ scale: sticker.scale }} // Framer motion declarative scaling
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        {sticker.emoji}
                      </motion.div>
                    ))}

                    {/* Text overlay at the bottom */}
                    {(stripTitle || stripDate) && (
                      <div className="absolute bottom-[4%] left-0 w-full flex items-center justify-center gap-3 text-center pointer-events-none z-20 px-4">
                        {stripTitle && (
                          <span className="text-slate-800 opacity-90 drop-shadow-sm leading-none tracking-widest text-[10px] sm:text-xs" style={{ fontFamily: stripFont }}>
                            {stripTitle}
                          </span>
                        )}
                        {stripTitle && stripDate && (
                          <span className="text-slate-400 text-[8px]">•</span>
                        )}
                        {stripDate && (
                          <span className="text-slate-800 font-bold opacity-90 drop-shadow-sm leading-none tracking-widest text-[10px] sm:text-xs" style={{ fontFamily: stripFont }}>
                            {stripDate}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sticker Editor Controls */}
                {activeStickerId && (
                  <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white z-[100] flex flex-wrap gap-4 md:gap-6 items-center justify-center w-[90%] max-w-sm md:w-auto md:max-w-none">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-medium tracking-widest text-slate-500 uppercase">Size</label>
                      <input
                        type="range" min="0.5" max="3" step="0.1"
                        value={stickers.find(s => s.id === activeStickerId)?.scale || 1}
                        onChange={e => setStickers(prev => prev.map(s => s.id === activeStickerId ? { ...s, scale: parseFloat(e.target.value) } : s))}
                        className="w-24 accent-rose-400"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-medium tracking-widest text-slate-500 uppercase">Tilt</label>
                      <input
                        type="range" min="-180" max="180" step="5"
                        value={stickers.find(s => s.id === activeStickerId)?.rotation || 0}
                        onChange={e => setStickers(prev => prev.map(s => s.id === activeStickerId ? { ...s, rotation: parseFloat(e.target.value) } : s))}
                        className="w-24 accent-rose-400"
                      />
                    </div>
                    <button
                      onClick={() => setStickers(prev => prev.filter(s => s.id !== activeStickerId))}
                      className="p-2.5 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => setActiveStickerId(null)}
                      className="px-4 py-2 bg-slate-800 text-white font-medium rounded-full text-xs tracking-wider"
                    >
                      Done
                    </button>
                  </div>
                )}

                {/* Text Editor UI */}
                <div className="w-full max-w-2xl mx-auto mt-8 z-10 flex flex-col items-center">
                  <p className="text-slate-400 text-xs font-medium tracking-[0.2em] uppercase mb-6">Write a Message</p>
                  <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col w-full gap-4 px-4 max-w-sm">

                    <input
                      type="text"
                      value={stripTitle}
                      onChange={e => setStripTitle(e.target.value)}
                      maxLength={30}
                      className="bg-white/50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:border-rose-400 transition-colors shadow-inner"
                      placeholder="e.g. LDR PHOTOBOOTH"
                    />

                    <input
                      type="text"
                      value={stripDate}
                      onChange={e => setStripDate(e.target.value)}
                      maxLength={30}
                      className="bg-white/50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:border-rose-400 transition-colors shadow-inner"
                      placeholder="Date or Location"
                    />

                    <div className="flex gap-2 justify-center mt-2">
                      {STRIP_FONTS.map(f => (
                        <button
                          key={f.id}
                          onClick={() => setStripFont(f.value)}
                          className={`flex-1 py-2 rounded-lg text-xs transition-all border ${stripFont === f.value ? 'bg-rose-400 text-white border-rose-400 shadow-md shadow-rose-200/50' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                          style={{ fontFamily: f.value }}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Theme Selector UI */}
                <div className="w-full max-w-4xl mx-auto mt-4 md:mt-12 mb-32 z-10 flex flex-col items-center px-4">
                  <p className="text-slate-400 text-xs font-medium tracking-[0.2em] uppercase mb-6">Pick a Theme Pack</p>

                  {/* Packs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-3xl">
                    {/* Pack 1: Simple */}
                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex flex-col items-center md:items-start shrink-0">
                        <h3 className="text-lg font-semibold text-slate-800">Simple</h3>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-mono mt-1">Solid Colors • {SOLID_THEMES.length}</p>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2 w-full justify-center md:justify-end no-scrollbar">
                        {SOLID_THEMES.map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => setSelectedTheme(theme)}
                            className={`w-10 h-16 shrink-0 rounded-lg transition-all border-2 flex items-center justify-center ${selectedTheme.id === theme.id ? 'border-rose-400 scale-110 shadow-lg shadow-rose-200/50' : 'border-transparent shadow-sm hover:scale-105'}`}
                            style={{ backgroundColor: theme.color }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Pack 2: Patterns */}
                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex flex-col items-center md:items-start shrink-0">
                        <h3 className="text-lg font-semibold text-slate-800">Patterns</h3>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-mono mt-1">Prints & Shapes • {PATTERN_THEMES.length}</p>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2 w-full justify-center md:justify-end no-scrollbar">
                        {PATTERN_THEMES.map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => setSelectedTheme(theme)}
                            className={`w-10 h-16 shrink-0 rounded-lg transition-all border-2 relative overflow-hidden flex items-center justify-center ${selectedTheme.id === theme.id ? 'border-rose-400 scale-110 shadow-lg shadow-rose-200/50' : 'border-transparent shadow-sm hover:scale-105'}`}
                            style={{ backgroundColor: `rgba(${theme.rgb.r}, ${theme.rgb.g}, ${theme.rgb.b}, 1)` }}
                          >
                            <div className="absolute inset-0 opacity-50" style={{ backgroundColor: theme.color }} />
                            <span className="relative z-10 text-[8px] font-bold text-slate-800 bg-white/80 px-1 py-0.5 rounded shadow-sm">{theme.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Sticky bottom bar for buttons */}
              <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent flex justify-center gap-4 z-50 pointer-events-none lg:ml-32">
                <button
                  onClick={handleDownload}
                  className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/10 pointer-events-auto flex items-center gap-2 text-sm tracking-wider"
                >
                  <Download size={18} strokeWidth={2} />
                  Download
                </button>
                <button
                  onClick={() => {
                    setStitchedPhoto(null);
                    setLocalPhotos([]);
                    setPartnerPhotos([]);
                    setStickers([]);
                  }}
                  className="bg-white text-rose-500 px-8 py-3.5 rounded-full font-medium hover:bg-rose-50 transition-colors shadow-lg border border-rose-100 pointer-events-auto text-sm tracking-wider"
                >
                  Retake
                </button>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
