export interface GeneratorSettings {
  outputType: "IMAGE" | "VIDEO";
  digitalModelId: string | null;
  // Appearance
  ethnicity: string;
  ageRange: string;
  outfit: string;
  location: string;
  // Foot & leg
  nailColor: string;
  nailStyle: string;
  nailLength: string;
  footwear: string;
  heelHeight: string;
  hosiery: string;
  toeRings: boolean;
  anklet: boolean;
  scrunch: boolean;
  // Pose
  poseReferenceKey: string | null;
  poseStrength: number;
  // Prompt
  customPrompt: string;
  negativePrompt: string;
  // Advanced
  aspectRatio: string;
  promptPower: string;
  seed: number | null;
  numToGenerate: number;
  // Video-specific
  duration: number;
  motionIntensity: string;
}

export const DEFAULT_SETTINGS: GeneratorSettings = {
  outputType: "IMAGE",
  digitalModelId: null,
  ethnicity: "auto",
  ageRange: "auto",
  outfit: "auto",
  location: "auto",
  nailColor: "auto",
  nailStyle: "glossy",
  nailLength: "medium length",
  footwear: "bare",
  heelHeight: "auto",
  hosiery: "bare",
  toeRings: false,
  anklet: false,
  scrunch: false,
  poseReferenceKey: null,
  poseStrength: 0.4,
  customPrompt: "",
  negativePrompt: "",
  aspectRatio: "9:16",
  promptPower: "7.5",
  seed: null,
  numToGenerate: 1,
  duration: 5,
  motionIntensity: "natural",
};

export function buildPrompt(s: GeneratorSettings): string {
  const parts: string[] = [];

  // Who
  const who: string[] = [];
  if (s.ethnicity !== "auto") who.push(s.ethnicity);
  if (s.ageRange !== "auto") who.push(s.ageRange);
  who.push("woman");
  parts.push(who.join(" "));

  // Outfit
  if (s.outfit !== "auto") parts.push("wearing " + s.outfit);

  // Setting
  if (s.location !== "auto") parts.push(s.location);

  // Hosiery
  if (s.hosiery !== "bare") parts.push(s.hosiery);

  // Footwear + heel height
  if (s.footwear !== "bare") {
    const fw = s.footwear;
    const hh = s.heelHeight !== "auto" ? ", " + s.heelHeight : "";
    parts.push("wearing " + fw + hh);
  }

  // Nails
  if (s.nailColor !== "auto") {
    parts.push(
      [s.nailStyle, s.nailColor, s.nailLength, "toenails"].filter(Boolean).join(" ")
    );
  }

  // Accessories
  if (s.toeRings) parts.push("wearing decorative toe rings");
  if (s.anklet) parts.push("wearing delicate anklet bracelet");

  // Pose modifiers
  if (s.scrunch) parts.push("scrunching toes, flexed foot arch");

  // Quality baseline
  parts.push("professional photography, sharp focus, studio lighting, high detail, 4k");

  // User's custom prompt last
  if (s.customPrompt.trim()) parts.push(s.customPrompt.trim());

  return parts.join(", ");
}

export function buildParameters(s: GeneratorSettings): Record<string, unknown> {
  const params: Record<string, unknown> = {
    cfg: parseFloat(s.promptPower),
    denoiseStrength: s.poseStrength,
    aspectRatio: s.aspectRatio,
    motionIntensity: s.motionIntensity,
  };

  if (s.outputType === "VIDEO") {
    // 24fps × duration seconds, rounded to nearest odd frame for ComfyUI
    const frames = Math.ceil(s.duration * 24 / 2) * 2 + 1;
    params.numFrames = Math.min(frames, 241);
    params.duration = s.duration;
  }

  if (s.seed !== null) params.seed = s.seed;

  return params;
}
