const FAL_BASE = "https://queue.fal.run";
const IMAGE_MODEL = "fal-ai/flux/dev";
const VIDEO_MODEL = "fal-ai/wan/v2.1/text-to-video";

function falHeaders(): HeadersInit {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY is not configured");
  return { "Authorization": `Key ${key}`, "Content-Type": "application/json" };
}

function buildFalPrompt(prompt: string, params: Record<string, unknown>): string {
  const parts: string[] = [];

  const styleMap: Record<string, string> = {
    CLASSIC: "classic, timeless", ELEGANT: "elegant, sophisticated",
    GLAMOUR: "glamorous, high-fashion", BOUDOIR: "boudoir, intimate",
    EDITORIAL: "editorial fashion",
  };
  const contentMap: Record<string, string> = {
    REALISTIC: "photorealistic, professional photography",
    ARTISTIC: "artistic, stylized photography",
  };
  if (params.contentType) parts.push(contentMap[params.contentType as string] ?? "photorealistic");
  if (params.style && styleMap[params.style as string]) parts.push(styleMap[params.style as string]);

  const ethMap: Record<string, string> = {
    white: "caucasian", black: "black", asian: "asian", latina: "latina",
    south_asian: "south asian", middle_eastern: "middle eastern", mixed: "mixed race",
  };
  const subject = params.subject === "MALE" ? "man" : "woman";
  const eth = params.ethnicity !== "auto" ? (ethMap[params.ethnicity as string] ?? "") + " " : "";
  const age = params.age !== "auto" ? `${params.age} ` : "";
  parts.push(`${eth}${age}${subject}`);
  if (params.skinTone && params.skinTone !== "auto") parts.push(`${params.skinTone} skin tone`);

  const hairParts: string[] = [];
  if (params.hairColor && params.hairColor !== "auto") hairParts.push(params.hairColor as string);
  if (params.hairType && params.hairType !== "auto") hairParts.push(params.hairType as string);
  if (hairParts.length) parts.push(hairParts.join(" ") + " hair");

  const attireMap: Record<string, string> = {
    casual: "casual clothing", elegant: "elegant dress", lingerie: "lingerie",
    business: "business attire", sportswear: "activewear", swimwear: "swimwear",
    bare: "minimal clothing",
  };
  if (params.attire && params.attire !== "auto") {
    const a = attireMap[params.attire as string];
    if (a) parts.push(a);
  }

  const locMap: Record<string, string> = {
    studio: "in a photography studio", bedroom: "in a bedroom",
    living_room: "in a living room", outdoors: "outdoors, natural light",
    pool: "by a pool", bathroom: "in a marble bathroom", luxury: "in a luxury interior",
  };
  if (params.location && params.location !== "auto") {
    const l = locMap[params.location as string];
    if (l) parts.push(l);
  }

  // Core focus — this is what the site is about
  parts.push("close-up of beautiful feet and legs, detailed foot photography, pedicure");

  const hosieryMap: Record<string, string> = {
    sheer_nude: "sheer nude stockings", sheer_black: "sheer black stockings",
    sheer_white: "sheer white stockings", opaque_black: "opaque black tights",
    fishnet: "fishnet stockings", patterned: "patterned stockings",
    white_socks: "white socks", ankle_socks: "ankle socks",
  };
  if (params.hosiery && params.hosiery !== "bare" && hosieryMap[params.hosiery as string]) {
    parts.push(hosieryMap[params.hosiery as string]);
  }

  const footwearMap: Record<string, string> = {
    stiletto: "stiletto heels", platform: "platform heels", kitten: "kitten heels",
    mules: "mules", sandals: "open-toe sandals", flats: "ballet flats",
    sneakers: "sneakers", boots: "ankle boots", strappy: "strappy heels",
  };
  if (params.footwear && params.footwear !== "bare") {
    let fw = footwearMap[params.footwear as string] ?? (params.footwear as string);
    const heelMap: Record<string, string> = { low: "low", medium: "medium", high: "high", extreme: "very high" };
    if (params.heelHeight && params.heelHeight !== "auto" && heelMap[params.heelHeight as string]) {
      fw = heelMap[params.heelHeight as string] + " " + fw;
    }
    parts.push("wearing " + fw);
  }

  if (params.nailColor && params.nailColor !== "auto") {
    const nailShapeMap: Record<string, string> = {
      natural: "natural", oval: "oval", square: "square", round: "round",
      coffin: "coffin", stiletto: "stiletto", almond: "almond",
    };
    const shape = params.nailShape && params.nailShape !== "auto"
      ? nailShapeMap[params.nailShape as string] + " shaped "
      : "";
    parts.push(`${params.nailColor} nail polish, ${shape}toenails`);
  }

  const accessories = (params.accessories as string[]) ?? [];
  if (accessories.includes("toerings")) parts.push("decorative toe rings");
  if (accessories.includes("anklet")) parts.push("delicate anklet bracelet");
  if (accessories.includes("scrunch")) parts.push("scrunched toes, flexed foot arch");

  parts.push("sharp focus, high detail, 4K, beautiful, professional lighting");
  if (prompt && prompt !== "(auto)") parts.push(prompt);

  return parts.join(", ");
}

function getImageSize(aspectRatio: string): string {
  switch (aspectRatio) {
    case "tall":      return "portrait_16_9";
    case "square":    return "square_hd";
    case "landscape": return "landscape_16_9";
    default:          return "portrait_4_3";
  }
}

function getGuidanceScale(promptPower: string): number {
  switch (promptPower) {
    case "LOW":    return 2.5;
    case "MEDIUM": return 3.5;
    case "MAX":    return 7.0;
    default:       return 5.0;
  }
}

export async function submitToFal(
  prompt: string,
  outputType: string,
  params: Record<string, unknown>,
): Promise<{ falRequestId: string; falModelId: string }> {
  const fullPrompt = buildFalPrompt(prompt, params);
  const modelId = outputType === "VIDEO" ? VIDEO_MODEL : IMAGE_MODEL;

  const aspectMap: Record<string, string> = {
    portrait: "3:4", tall: "9:16", square: "1:1", landscape: "16:9",
  };

  const input: Record<string, unknown> = outputType === "VIDEO"
    ? {
        prompt: fullPrompt,
        aspect_ratio: aspectMap[(params.aspectRatio as string) ?? "tall"] ?? "9:16",
        num_frames: 81,
      }
    : {
        prompt: fullPrompt,
        image_size: getImageSize((params.aspectRatio as string) ?? "portrait"),
        num_inference_steps: 28,
        guidance_scale: getGuidanceScale((params.promptPower as string) ?? "HIGH"),
        num_images: 1,
        enable_safety_checker: false,
      };

  const res = await fetch(`${FAL_BASE}/${modelId}`, {
    method: "POST",
    headers: falHeaders(),
    body: JSON.stringify({ input }),
  });

  if (!res.ok) throw new Error(`FAL.ai submit failed: ${res.status} ${await res.text()}`);
  const data = await res.json() as { request_id: string };
  return { falRequestId: data.request_id, falModelId: modelId };
}

export type FalStatus = "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export async function checkFalJob(
  falModelId: string,
  falRequestId: string,
): Promise<{ status: FalStatus; resultUrl?: string }> {
  const statusRes = await fetch(
    `${FAL_BASE}/${falModelId}/requests/${falRequestId}/status`,
    { headers: falHeaders() },
  );
  if (!statusRes.ok) throw new Error(`FAL status check failed: ${statusRes.status}`);
  const { status } = await statusRes.json() as { status: string };

  if (status === "COMPLETED") {
    const resultRes = await fetch(
      `${FAL_BASE}/${falModelId}/requests/${falRequestId}`,
      { headers: falHeaders() },
    );
    if (!resultRes.ok) throw new Error(`FAL result fetch failed: ${resultRes.status}`);
    const result = await resultRes.json() as {
      images?: { url: string }[];
      video?: { url: string };
    };
    const resultUrl = result.images?.[0]?.url ?? result.video?.url;
    return { status: "COMPLETED", resultUrl };
  }

  if (status === "FAILED")      return { status: "FAILED" };
  if (status === "IN_PROGRESS") return { status: "IN_PROGRESS" };
  return { status: "IN_QUEUE" };
}
