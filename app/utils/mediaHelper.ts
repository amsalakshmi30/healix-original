/**
 * Requests actual camera and microphone access. If permissions are denied,
 * hardware is missing, or the app is running in an insecure context (HTTP),
 * it returns a simulated MediaStream containing an animated canvas video track
 * and a silent audio track.
 */
export async function getMediaStreamWithFallback(constraints: MediaStreamConstraints): Promise<{ stream: MediaStream; isMock: boolean }> {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot request media stream on server side");
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Media devices or getUserMedia not supported in this browser context");
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return { stream, isMock: false };
  } catch (err) {
    console.warn("Actual camera/mic access failed, falling back to simulated stream:", err);

    // Create a 640x480 canvas for the mock video
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");

    let angle = 0;
    const drawMockFrame = () => {
      if (!ctx) return;
      
      // Slate background
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, 640, 480);
      
      // Animated pulsing grid
      ctx.strokeStyle = "rgba(56, 189, 248, 0.1)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < 640; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 480);
        ctx.stroke();
      }
      for (let y = 0; y < 480; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(640, y);
        ctx.stroke();
      }

      // Pulsing outer blue ring
      ctx.strokeStyle = "rgba(15, 98, 254, 0.4)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(320, 240, 70 + Math.sin(angle) * 15, 0, Math.PI * 2);
      ctx.stroke();

      // Pulsing inner teal circle
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(320, 240, 40 + Math.cos(angle) * 10, 0, Math.PI * 2);
      ctx.fill();

      // Camera icon overlay in the center
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(305, 228, 30, 24);
      ctx.beginPath();
      ctx.moveTo(335, 235);
      ctx.lineTo(345, 228);
      ctx.lineTo(345, 252);
      ctx.lineTo(335, 245);
      ctx.closePath();
      ctx.fill();
      
      // Text indicators
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Simulated Camera Stream", 320, 335);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 13px monospace";
      ctx.fillText("STATUS: ACTIVE (MOCKED)", 320, 365);
      
      angle += 0.08;
    };

    // Draw first frame
    drawMockFrame();

    // Trigger canvas draw loop at ~30 FPS
    const intervalId = setInterval(drawMockFrame, 33);

    // Capture canvas stream
    // @ts-ignore
    const stream = canvas.captureStream ? canvas.captureStream(30) : (canvas as any).captureStream(30);

    // Create a mock audio track using Web Audio API
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const dst = audioCtx.createMediaStreamDestination();
        
        oscillator.connect(gainNode);
        gainNode.connect(dst);
        // Set gain to 0 to keep it silent
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        
        oscillator.start();
        
        const audioTrack = dst.stream.getAudioTracks()[0];
        if (audioTrack) {
          stream.addTrack(audioTrack);
        }
      }
    } catch (audioErr) {
      console.warn("Could not create simulated audio track:", audioErr);
    }

    // Intercept track stop calls to clean up the drawing interval
    stream.getTracks().forEach((track: any) => {
      const origStop = track.stop;
      track.stop = function() {
        if (origStop) origStop.call(this);
        clearInterval(intervalId);
      };
    });

    return { stream, isMock: true };
  }
}
