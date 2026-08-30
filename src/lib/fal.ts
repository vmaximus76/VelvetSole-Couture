import { createFalClient } from "@fal-ai/client";

const IMAGE_MODEL = "fal-ai/flux/dev";
// HunyuanVideo has a two-segment model ID (fal-ai/hunyuan-video) so queue result URLs
// resolve correctly. WAN v2.1 (fal-ai/wan/v2.1/text-to-video) dispatches via webhook
// and its result URL 404s when polled — not compatible with our polling flow.
const VIDEO_MODEL = "fal-ai/hunyuan-video";

function getFalClient() {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY is not configured");
  return createFalClient({ credentials: key });
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
): Promise<{ falRequestId: string; falModelId: string; falStatusUrl?: string }> {
  const client = getFalClient();
  const fullPrompt = buildFalPrompt(prompt, params);
  const modelId = outputType === "VIDEO" ? VIDEO_MODEL : IMAGE_MODEL;

  // HunyuanVideo uses a "widthxheight" video_size string, not aspect_ratio.
  const hunyuanSizeMap: Record<string, string> = {
    portrait: "720x1280", tall: "720x1280", square: "720x720", landscape: "1280x720",
  };

  const input: Record<string, unknown> = outputType === "VIDEO"
    ? {
        prompt: fullPrompt,
        video_size: hunyuanSizeMap[(params.aspectRatio as string) ?? "tall"] ?? "720x1280",
        num_inference_steps: 30,
      }
    : {
        prompt: fullPrompt,
        image_size: getImageSize((params.aspectRatio as string) ?? "portrait"),
        num_inference_steps: 28,
        guidance_scale: getGuidanceScale((params.promptPower as string) ?? "HIGH"),
        num_images: 1,
        enable_safety_checker: false,
      };

  const result = await client.queue.submit(modelId, { input });
  console.log("[fal] submit response:", JSON.stringify(result));
  return {
    falRequestId: result.request_id,
    falModelId: modelId,
    falStatusUrl: result.status_url,
  };
}

export type FalStatus = "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export async function checkFalJob(
  falModelId: string,
  falRequestId: string,
  falStatusUrl?: string | null,
): Promise<{ status: FalStatus; resultUrl?: string }> {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY is not configured");
  const headers: HeadersInit = {
    Authorization: `Key ${key}`,
    Accept: "application/json",
  };

  const statusUrl = falStatusUrl
    ?? `https://queue.fal.run/${falModelId}/requests/${falRequestId}/status`;

  const statusRes = await fetch(statusUrl, { headers });
  if (!statusRes.ok) {
    const errText = await statusRes.text().catch(() => "");
    throw new Error(`FAL status check failed: ${statusRes.status} ${errText}`);
  }
  const body = await statusRes.json() as {
    status: string;
    response_url?: string;
    output?: { images?: { url: string }[]; video?: { url: string } };
    images?: { url: string }[];
    video?: { url: string };
  };
  console.log("[fal] status body:", JSON.stringify(body));

  if (body.status === "COMPLETED") {
    // First: try to extract the result directly from the status body.
    // FAL embeds output in the status response for some models (e.g. WAN).
    const inlineOut = body.output ?? body;
    const inlineUrl = inlineOut.images?.[0]?.url ?? inlineOut.video?.url;
    if (inlineUrl) {
      console.log("[fal] got URL from status body:", inlineUrl);
      return { status: "COMPLETED", resultUrl: inlineUrl };
    }

    // Fallback: fetch from result endpoint. Try the normalized URL first
    // (falStatusUrl with /status stripped), then the full-path URL.
    // FAL normalises model IDs in queue URLs (e.g. fal-ai/wan/v2.1/text-to-video → fal-ai/wan),
    // but the result endpoint may need the full model path.
    const candidateUrls = [
      ...(falStatusUrl ? [falStatusUrl.replace(/\/status$/, "")] : []),
      body.response_url,
      `https://queue.fal.run/${falModelId}/requests/${falRequestId}`,
    ].filter((u): u is string => Boolean(u));
    const uniqueUrls = [...new Set(candidateUrls)];

    let lastErr = "";
    for (const resultUrl of uniqueUrls) {
      console.log("[fal] trying result URL:", resultUrl);
      const resultRes = await fetch(resultUrl, { headers });
      if (!resultRes.ok) {
        const errText = await resultRes.text().catch(() => "");
        console.log("[fal] result URL failed:", resultRes.status, errText);
        lastErr = `${resultRes.status} ${errText}`;
        continue;
      }
      const result = await resultRes.json() as {
        images?: { url: string }[];
        video?: { url: string };
        output?: { images?: { url: string }[]; video?: { url: string } };
      };
      console.log("[fal] result json:", JSON.stringify(result));
      const out = result.output ?? result;
      const url = out.images?.[0]?.url ?? out.video?.url;
      if (!url) {
        console.log("[fal] result had no URL, keys:", Object.keys(result).join(", "));
        continue;
      }
      return { status: "COMPLETED", resultUrl: url };
    }
    throw new Error(`FAL result fetch failed for all URLs. Last error: ${lastErr}`);
  }

  if (body.status === "FAILED") return { status: "FAILED" };
  if (body.status === "IN_PROGRESS") return { status: "IN_PROGRESS" };
  return { status: "IN_QUEUE" };
}
