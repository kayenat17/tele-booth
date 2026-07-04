import { createRoomAction } from './actions';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDF6E3] flex flex-col items-center justify-center p-6 selection:bg-rose-200 relative overflow-hidden font-sans">
      
      <div className="relative w-full max-w-3xl flex flex-col items-center">
        
        {/* Top Sign */}
        <div className="relative w-11/12 max-w-sm mb-[-4px] z-10 flex flex-col items-center">
          <div className="bg-white border-4 border-slate-900 rounded-xl px-4 md:px-8 py-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transform -rotate-1 w-full flex justify-center">
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-widest text-center whitespace-nowrap" style={{ fontFamily: 'var(--font-kalam)' }}>
              PHOTOBOOTH
            </h1>
          </div>
          {/* Sign posts */}
          <div className="flex justify-between w-[40%] mt-[-4px] z-[-1]">
            <div className="w-2 h-6 bg-slate-900"></div>
            <div className="w-2 h-6 bg-slate-900"></div>
          </div>
        </div>

        {/* Main Booth Body */}
        <div className="relative w-full max-w-sm md:max-w-full bg-white border-4 border-slate-900 rounded-xl shadow-[8px_12px_0px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row overflow-hidden min-h-[450px]">
          
          {/* Left Panel - Details & Coin Slot */}
          <div className="w-full md:w-1/2 border-b-4 md:border-b-0 md:border-r-4 border-slate-900 bg-[#FDF6E3] p-6 md:p-8 flex flex-col items-center justify-between">
            <div className="w-full flex flex-col items-center mt-2">
              <div className="border-4 border-slate-900 rounded-lg p-3 bg-white w-full max-w-[240px] flex gap-3 justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transform -rotate-2">
                 {/* Fake film strips */}
                 <div className="w-8 h-24 bg-slate-900 rounded-sm flex flex-col justify-around p-1">
                    <div className="w-full h-4 bg-[#FDF6E3] rounded-[1px]"></div>
                    <div className="w-full h-4 bg-[#FDF6E3] rounded-[1px]"></div>
                    <div className="w-full h-4 bg-[#FDF6E3] rounded-[1px]"></div>
                    <div className="w-full h-4 bg-[#FDF6E3] rounded-[1px]"></div>
                 </div>
                 <div className="w-8 h-24 bg-slate-900 rounded-sm flex flex-col justify-around p-1 transform translate-y-2">
                    <div className="w-full h-4 bg-[#F7BAC9] rounded-[1px]"></div>
                    <div className="w-full h-4 bg-[#F7BAC9] rounded-[1px]"></div>
                    <div className="w-full h-4 bg-[#F7BAC9] rounded-[1px]"></div>
                    <div className="w-full h-4 bg-[#F7BAC9] rounded-[1px]"></div>
                 </div>
                 <div className="w-8 h-24 bg-slate-900 rounded-sm flex flex-col justify-around p-1">
                    <div className="w-full h-4 bg-[#B5CDE3] rounded-[1px]"></div>
                    <div className="w-full h-4 bg-[#B5CDE3] rounded-[1px]"></div>
                    <div className="w-full h-4 bg-[#B5CDE3] rounded-[1px]"></div>
                    <div className="w-full h-4 bg-[#B5CDE3] rounded-[1px]"></div>
                 </div>
              </div>
              <div className="w-full max-w-[240px] flex justify-end">
                <p className="mt-4 text-slate-900 font-bold transform rotate-2 text-sm" style={{ fontFamily: 'var(--font-kalam)' }}>
                  ⤴ featured strips
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center">
              {/* Coin Slot */}
              <div className="w-12 h-20 border-4 border-slate-900 rounded-md bg-white flex flex-col items-center py-2 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <div className="w-2 h-8 bg-slate-900 rounded-full mb-2"></div>
                <div className="w-6 h-4 border-2 border-slate-900 rounded-sm bg-slate-200"></div>
              </div>
              <p className="mt-6 text-slate-900 font-bold text-xs text-center" style={{ fontFamily: 'var(--font-kalam)' }}>
                capture memories <br/> across the distance ♡
              </p>
            </div>
          </div>

          {/* Right Panel - Curtain & Enter Button */}
          <div className="w-full md:w-1/2 bg-white relative flex flex-col items-center justify-center overflow-hidden min-h-[300px]">
            {/* Colored Curtain Base */}
            <div className="absolute inset-0 bg-[#F7BAC9]"></div>
            
            {/* Curtain Wavy Lines (SVG overlay) */}
            <svg className="absolute inset-0 w-full h-full text-slate-900 opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M10,0 Q20,10 10,20 T10,40 T10,60 T10,80 T10,100" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M25,0 Q35,10 25,20 T25,40 T25,60 T25,80 T25,100" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M40,0 Q50,10 40,20 T40,40 T40,60 T40,80 T40,100" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M55,0 Q65,10 55,20 T55,40 T55,60 T55,80 T55,100" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M70,0 Q80,10 70,20 T70,40 T70,60 T70,80 T70,100" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M85,0 Q95,10 85,20 T85,40 T85,60 T85,80 T85,100" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>

            {/* Mirror / Frame on the side */}
            <div className="absolute top-8 right-6 w-16 h-32 border-4 border-slate-900 bg-white rounded-sm shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] opacity-80 flex flex-col items-center justify-around py-4">
               <div className="w-8 h-[2px] bg-slate-900 transform -rotate-45"></div>
               <div className="w-8 h-[2px] bg-slate-900 transform -rotate-45"></div>
            </div>

            {/* Stool */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-0">
              <div className="w-24 h-6 border-4 border-slate-900 rounded-full bg-[#B5CDE3]"></div>
              <div className="w-4 h-24 border-x-4 border-slate-900 bg-white"></div>
              <div className="w-20 h-4 border-4 border-slate-900 rounded-full bg-white"></div>
            </div>

            {/* Enter Button (Floating over curtain) */}
            <form action={createRoomAction} className="relative z-20 w-3/4 max-w-[200px] mb-12 md:mb-0 md:mt-[-40px]">
              <button 
                type="submit"
                className="w-full group px-6 py-4 bg-white border-4 border-slate-900 rounded-lg shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_rgba(15,23,42,1)] transition-all duration-200 flex items-center justify-center gap-2 transform rotate-2 hover:rotate-0"
              >
                <span className="text-slate-900 font-bold tracking-widest text-xl lowercase" style={{ fontFamily: 'var(--font-kalam)' }}>
                  enter ➔]
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="flex gap-6 mt-6 text-slate-600 text-[10px] tracking-widest font-bold" style={{ fontFamily: 'var(--font-kalam)' }}>
          <a href="#" className="hover:text-slate-900 transition-colors underline decoration-slate-400">Privacy Policy</a>
          <a href="#" className="hover:text-slate-900 transition-colors underline decoration-slate-400">FAQ</a>
          <a href="#" className="hover:text-slate-900 transition-colors underline decoration-slate-400">About Me</a>
          <a href="#" className="hover:text-slate-900 transition-colors underline decoration-slate-400">Contact Me</a>
        </div>
        
      </div>
    </div>
  );
}
