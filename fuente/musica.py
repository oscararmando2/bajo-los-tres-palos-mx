# -*- coding: utf-8 -*-
"""
BTP · cue heroico original, sintetizado desde cero (sin samples de terceros).
Re menor, 84 BPM, 16 compases (~45.7 s), pensado para repetirse en bucle.

Capas: sub-bajo, pad de cuerdas, ostinato de octavos, metales (melodía),
taikos y risers. Se escribe a WAV estéreo y luego se pasa a AAC.
"""
import math, wave, struct, random

SR    = 44100
BPM   = 84.0
BEAT  = 60.0 / BPM
BAR   = 4 * BEAT
BARS  = 16
DUR   = BARS * BAR
N     = int(DUR * SR)

random.seed(7)

# ---------------------------------------------------------------- notas ----
def nota(n):                       # n = semitonos respecto a A4 = 440
    return 440.0 * (2.0 ** (n / 12.0))

D2,F2,A2,Bb2,C3,D3,E3,F3,G3,A3,Bb3,C4,D4,E4,F4,G4 = (
    nota(-19), nota(-16), nota(-12), nota(-11), nota(-9), nota(-7), nota(-5),
    nota(-4), nota(-2), nota(0), nota(1), nota(3), nota(5), nota(7), nota(8), nota(10))
D1,F1,Bb1,C2 = D2/2, F2/2, Bb2/2, C3/2

# progresión: dos vueltas de Dm - Bb - F - C, dos compases cada acorde
PROG = [('Dm', D2, [D3, F3, A3, D4]),
        ('Bb', Bb1, [Bb2, D3, F3, Bb3]),
        ('F',  F1,  [F2, A2, C3, F3]),
        ('C',  C2,  [C3, E3, G3, C4])]

def acorde_en(bar):
    return PROG[(bar // 2) % 4]

# ------------------------------------------------------------ envolventes ---
def adsr(t, dur, a, d, s, r):
    if t < 0 or t > dur: return 0.0
    if t < a:            return t / a
    if t < a + d:        return 1.0 - (1.0 - s) * (t - a) / d
    if t < dur - r:      return s
    return s * max(0.0, (dur - t) / r)

def perc(t, decay):
    return math.exp(-t / decay) if t >= 0 else 0.0

# ------------------------------------------------------------ osciladores ---
def saw(ph):                       # diente de sierra suavizado
    x = ph - math.floor(ph)
    return 2.0 * x - 1.0 - 0.22 * math.sin(2 * math.pi * x)

def tri(ph):
    x = ph - math.floor(ph)
    return 4.0 * abs(x - 0.5) - 1.0

# --------------------------------------------------------------- melodía ---
# (compás, beat, duración en beats, frecuencia) — entra en el compás 9
MEL = [
    (8, 0, 2, A3), (8, 2, 2, D4),
    (9, 0, 1, F4), (9, 1, 1, E4), (9, 2, 2, D4),
    (10, 0, 2, D4), (10, 2, 2, F4),
    (11, 0, 1, G4), (11, 1, 1, F4), (11, 2, 2, D4),
    (12, 0, 2, C4), (12, 2, 2, F4),
    (13, 0, 1, E4), (13, 1, 1, F4), (13, 2, 2, G4),
    (14, 0, 2, G4), (14, 2, 2, E4),
    (15, 0, 4, D4),
]
MEL = [(b * BAR + be * BEAT, d * BEAT, f) for (b, be, d, f) in MEL]

# ------------------------------------------------------------- percusión ---
GOLPES = []                                   # (tiempo, fuerza)
for b in range(BARS):
    if b >= 4:
        GOLPES += [(b * BAR, 1.0), (b * BAR + 2 * BEAT, 0.72)]
    elif b % 2 == 0:
        GOLPES += [(b * BAR, 0.45)]
    if b >= 8:
        GOLPES += [(b * BAR + 1.5 * BEAT, 0.4), (b * BAR + 3.5 * BEAT, 0.5)]
    if b in (7, 11, 15):                      # remate de compás
        GOLPES += [(b * BAR + 3 * BEAT + i * BEAT / 4, 0.34 + 0.18 * i) for i in range(4)]

RISERS = [(8 * BAR - 1.8, 1.8), (12 * BAR - 1.4, 1.4)]

# ---------------------------------------------------------------- niveles ---
def nivel_seccion(t):
    """Cuánto suena cada capa según el compás: intro, construcción, clímax.
    Devuelve (pad, ostinato, metales, bajo). El bajo también sube por sección:
    si suena parejo desde el compás 1, el clímax no se siente como clímax."""
    b = t / BAR
    if b < 4:   return 0.34, 0.0,  0.0, 0.50
    if b < 8:   return 0.58, 0.85, 0.0, 0.74
    if b < 12:  return 0.82, 1.0,  1.0, 0.96
    if b < 15:  return 0.90, 1.0,  1.0, 1.00
    return 0.55, 0.45, 1.0, 0.72             # último compás: se abre para el bucle

# ------------------------------------------------------------------ mezcla --
L = [0.0] * N
R = [0.0] * N
TAU = 2 * math.pi
ruido_prev = 0.0

for i in range(N):
    t = i / SR
    bar = int(t / BAR)
    _, raiz, tonos = acorde_en(bar)
    npad, nost, nmet, nbaj = nivel_seccion(t)
    tb = t - bar * BAR                       # tiempo dentro del compás

    # --- sub-bajo: raíz con un armónico y respiración lenta ----------------
    swell = 0.72 + 0.28 * math.sin(TAU * t / (2 * BAR) - math.pi / 2)
    bass = (math.sin(TAU * raiz * t) * 0.85 +
            math.sin(TAU * raiz * 2 * t) * 0.22) * swell * nbaj * 0.55

    # --- pad de cuerdas: saw apilado, detune distinto por canal -----------
    pl = pr = 0.0
    if npad > 0:
        env = min(1.0, tb / 0.35) * (0.85 + 0.15 * math.sin(TAU * t * 0.7))
        for k, f in enumerate(tonos):
            g = (0.30, 0.26, 0.24, 0.20)[k]
            pl += saw(f * 0.9985 * t + k * 0.13) * g
            pr += saw(f * 1.0015 * t + k * 0.37) * g
        pl *= env * npad * 0.30
        pr *= env * npad * 0.30

    # --- ostinato: octavos alternando raíz y quinta -----------------------
    ost = 0.0
    if nost > 0:
        idx = int(tb / (BEAT / 2))
        t0 = idx * (BEAT / 2)
        f = raiz * 4 if idx % 2 == 0 else raiz * 6
        e = perc(tb - t0, 0.085)
        ost = (saw(f * t) * 0.6 + tri(f * 2 * t) * 0.25) * e * nost * 0.16

    # --- metales: melodía con vibrato y ataque marcado --------------------
    met = 0.0
    if nmet > 0:
        for (ts, dn, f) in MEL:
            if ts <= t < ts + dn:
                lt = t - ts
                e = adsr(lt, dn, 0.045, 0.10, 0.80, 0.13)
                vib = 1.0 + 0.004 * math.sin(TAU * 5.2 * lt) * min(1.0, lt / 0.25)
                fr = f * vib
                met = (saw(fr * t) * 0.55 +
                       saw(fr * 0.501 * t) * 0.30 +
                       math.sin(TAU * fr * 2 * t) * 0.14) * e * nmet * 0.26
                break

    # --- taikos: golpe con barrido de tono + transitorio de ruido ---------
    dr = 0.0
    for (ts, g) in GOLPES:
        lt = t - ts
        if 0 <= lt < 0.55:
            f = 96.0 * math.exp(-lt * 11.0) + 47.0
            dr += (math.sin(TAU * f * lt) * perc(lt, 0.115) * 0.95 +
                   (random.random() * 2 - 1) * perc(lt, 0.012) * 0.30) * g * 0.60

    # --- risers: ruido filtrado subiendo antes de cada clímax -------------
    ris = 0.0
    for (ts, dn) in RISERS:
        lt = t - ts
        if 0 <= lt < dn:
            x = lt / dn
            ruido_prev = ruido_prev * (1 - (0.04 + 0.55 * x)) + \
                         (random.random() * 2 - 1) * (0.04 + 0.55 * x)
            ris += ruido_prev * (x ** 2.2) * 0.34

    seco = bass + ost + met + dr + ris
    l = seco + pl
    r = seco + pr

    # entrada y salida suaves para que el bucle respire en vez de cortar
    if t < 0.9:            g = t / 0.9
    elif t > DUR - 1.8:    g = max(0.0, (DUR - t) / 1.8)
    else:                  g = 1.0
    L[i] = l * g
    R[i] = r * g

# ---------------------------------------------------- limitador suave ------
pico = max(max(abs(v) for v in L), max(abs(v) for v in R))
norm = 0.92 / pico if pico > 0 else 1.0
with wave.open('btp-tema.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(b''.join(
        struct.pack('<hh',
                    int(max(-1, min(1, math.tanh(L[i] * norm * 1.12))) * 32000),
                    int(max(-1, min(1, math.tanh(R[i] * norm * 1.12))) * 32000))
        for i in range(N)))
print('wav listo: %.1f s, pico %.2f' % (DUR, pico))
