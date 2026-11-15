"""Create the original, seamless horror score shipped with this game (no external audio)."""
import numpy as np, wave
from pathlib import Path
sr=24000; length=40; n=sr*length; t=np.arange(n)/sr; rng=np.random.default_rng(37)
# Integer cycles per loop prevent discontinuities. Slowly evolving minor clusters.
def tone(f, phase=0):
    f=round(f*length)/length
    return np.sin(2*np.pi*f*t+phase+.22*np.sin(2*np.pi*t/length*2))
def swell(center,width):
    d=(t-center+length/2)%length-length/2
    return np.exp(-.5*(d/width)**2)
base=.17*tone(55)+.085*tone(82.4)+.055*tone(110,.3)
# bowed strings and airy dissonant minor seconds, fading across four phrases
for center,notes in [(3,(130.81,155.56,196)),(13,(123.47,146.83,185)),(23,(110,130.81,164.81)),(33,(116.54,138.59,174.61))]:
    env=swell(center,4.0)
    for j,f in enumerate(notes):
        base+=env*(.052*tone(f,j)+.019*tone(f*2+.19,j*.9)+.009*tone(f*3,j))
# Sparse eerie bell motifs with long decays, overlapping the loop boundary.
for start,f in [(2,293.66),(9,277.18),(17,220),(25,261.63),(34,233.08)]:
    d=(t-start)%length; env=(1-np.exp(-d*4))*np.exp(-d*.50)
    base+=env*(.085*np.sin(2*np.pi*f*d)+.023*np.sin(2*np.pi*f*2.01*d))
# Bandlimited atmospheric wind; periodic FFT guarantees the loop wraps cleanly.
noise=rng.normal(size=n); spec=np.fft.rfft(noise); hz=np.fft.rfftfreq(n,1/sr)
spec*=np.exp(-((hz-340)/250)**2); wind=np.fft.irfft(spec,n); wind/=max(np.std(wind),1e-8)
base+=.023*wind*(.6+.4*np.sin(2*np.pi*t/length*3))
left=base+.13*np.roll(base,int(sr*.17))+.055*np.roll(base,int(sr*.47)); right=base+.12*np.roll(base,int(sr*.24))+.06*np.roll(base,int(sr*.63)); audio=np.stack((left,right),axis=1); audio*=.83/np.max(np.abs(audio))
path=Path(__file__).parent/'public/assets/horror-score.wav'
with wave.open(str(path),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((audio*32767).astype('<i2').tobytes())
