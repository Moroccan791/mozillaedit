"""Text overlay systems for montages.

Two systems:
1. Subtitle lyrics: small clean line at bottom, changes per phrase, timed to vocal
2. Impact words: huge bold type in center, appears on exact sung word,
   scale pop + glitch/RGB split entry, hard cut/flash exit
"""
from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from .captions import Caption, CaptionStyle, build_ass


@dataclass
class SubtitleConfig:
    font: str = "Arial Black"
    size_frac: float = 0.045
    color: str = "#FFFFFF"
    outline_color: str = "#000000"
    outline_width: float = 2.0
    shadow: float = 1.0
    position: str = "bottom"
    margin_v: int = 40
    fade_in: float = 0.05
    fade_out: float = 0.05


@dataclass
class ImpactConfig:
    font: str = "Arial Black"
    size_frac: float = 0.25
    color: str = "#FFFFFF"
    outline_color: str = "#000000"
    outline_width: float = 4.0
    shadow: float = 2.0
    entry_anim: str = "pop"
    exit_anim: str = "hard_cut"
    hold_frames: int = 3
    rgb_split: bool = True
    glitch_frames: int = 2


DEFAULT_IMPACT_WORDS = {
    "love", "hate", "die", "live", "burn", "fire", "blood", "pain",
    "heart", "soul", "dream", "night", "dark", "light", "fall",
    "rise", "run", "fly", "free", "lost", "found", "alone", "together",
    "forever", "never", "always", "but", "just", "can't", "let", "go",
    "world", "life", "death", "god", "hell", "heaven", "angel", "demon",
    "beautiful", "ugly", "real", "fake", "true", "lie", "truth",
}


def load_config(path: str | Path) -> tuple[SubtitleConfig, ImpactConfig]:
    p = Path(path)
    if not p.exists():
        return SubtitleConfig(), ImpactConfig()
    d = json.loads(p.read_text(encoding="utf-8"))
    return SubtitleConfig(**d.get("subtitle", {})), ImpactConfig(**d.get("impact", {}))


def save_config(path: str | Path, sub: SubtitleConfig, imp: ImpactConfig) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps({"subtitle": sub.__dict__, "impact": imp.__dict__}, indent=2),
                 encoding="utf-8")


def group_phrases(words: list[dict], gap: float = 0.6) -> list[dict]:
    """Group words into phrases based on timing gaps."""
    if not words:
        return []
    phrases = []
    cur = {"start": words[0]["start"], "end": words[0]["end"], "text": words[0]["word"]}
    for w in words[1:]:
        if w["start"] - cur["end"] > gap:
            phrases.append(cur)
            cur = {"start": w["start"], "end": w["end"], "text": w["word"]}
        else:
            cur["end"] = w["end"]
            cur["text"] += " " + w["word"]
    phrases.append(cur)
    return phrases


def pick_impact_words(
    words: list[dict],
    phrases: list[dict],
    emotional_words: set[str],
    max_per_phrase: int = 2,
    min_length: int = 2,
) -> list[int]:
    """Pick impact word indices: emotional, repeated, or long words."""
    indices = []
    for phrase in phrases:
        pw = [(i, w) for i, w in enumerate(words)
              if phrase["start"] <= w["start"] < phrase["end"]]
        if not pw:
            continue
        scored = []
        for i, w in pw:
            score = 0
            wtext = w["word"].lower()
            if wtext in emotional_words:
                score += 3
            count = sum(1 for x in words if x["word"].lower() == wtext)
            if count > 1:
                score += 2
            if len(wtext) >= min_length:
                score += 1
            scored.append((score, i))
        scored.sort(key=lambda x: -x[0])
        for _, i in scored[:max_per_phrase]:
            indices.append(i)
    return sorted(indices)


def make_subtitles(phrases: list[dict], config: SubtitleConfig) -> list[Caption]:
    captions = []
    for phrase in phrases:
        captions.append(Caption(
            text=phrase["text"],
            start=phrase["start"],
            end=phrase["end"],
            style="Subtitle",
            fade_in=config.fade_in,
            fade_out=config.fade_out,
        ))
    return captions


def make_impacts(words: list[dict], indices: list[int], config: ImpactConfig,
                 fps: float) -> list[Caption]:
    captions = []
    for i in indices:
        w = words[i]
        captions.append(Caption(
            text=w["word"].upper(),
            start=w["start"],
            end=w["start"] + config.hold_frames / fps,
            style="Impact",
            fade_in=0.0,
            fade_out=0.0,
            anim=config.entry_anim,
        ))
    return captions


def subtitle_style(config: SubtitleConfig, height: int) -> CaptionStyle:
    size = int(config.size_frac * height)
    alignment = 2 if config.position == "bottom" else (8 if config.position == "top" else 5)
    return CaptionStyle(
        name="Subtitle", font=config.font, size=size, primary=config.color,
        outline_colour=config.outline_color, bold=1, spacing=1.0,
        outline=config.outline_width, shadow=config.shadow,
        alignment=alignment, margin_v=config.margin_v,
    )


def impact_style(config: ImpactConfig, height: int) -> CaptionStyle:
    size = int(config.size_frac * height)
    return CaptionStyle(
        name="Impact", font=config.font, size=size, primary=config.color,
        outline_colour=config.outline_color, bold=1, spacing=2.0,
        outline=config.outline_width, shadow=config.shadow,
        alignment=5, margin_v=0,
    )


def build_text_ass(
    subtitles: list[Caption],
    impacts: list[Caption],
    sub_config: SubtitleConfig,
    imp_config: ImpactConfig,
    width: int,
    height: int,
) -> str:
    styles = [subtitle_style(sub_config, height), impact_style(imp_config, height)]
    return build_ass(subtitles + impacts, styles, width=width, height=height)
