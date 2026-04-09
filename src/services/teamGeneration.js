import { getMasteryLabel } from '../utils';

const DEFAULT_HF_KEY = import.meta.env.VITE_HF_KEY || '';
const DEFAULT_GROQ_KEY = import.meta.env.VITE_GROQ_KEY || '';

export { DEFAULT_HF_KEY, DEFAULT_GROQ_KEY };

// ─── Build Prompt ─────────────────────────────────────────────────────────────
export function buildPrompt(participants, teamSize) {
  const numTeams = Math.ceil(participants.length / teamSize);
  const summary = participants.map((p) => ({
    name: p.name,
    skills: p.skills.map((s) => `${s.name}(${getMasteryLabel(s.level)})`),
  }));
  return {
    numTeams,
    systemPrompt: `You are an expert team formation algorithm. You ONLY respond with valid JSON, no markdown, no explanation, no code fences.`,
    userPrompt: `Generate ${numTeams} balanced teams from these ${participants.length} participants (target ~${teamSize} per team).

Participants:
${JSON.stringify(summary, null, 2)}

RULES:
1. Distribute rare skills evenly — never cluster all designers or all frontend devs in one team
2. Mix mastery levels (pair Beginners with Advanced members)
3. Every team should have diverse skill coverage (technical + creative + leadership if possible)
4. Use EVERY participant exactly once

Return ONLY this JSON structure (no markdown, no backticks):
{
  "teams": [
    {
      "id": "team-1",
      "name": "Team 1",
      "members": ["exact participant names"],
      "compatibility": 82,
      "stability": 75,
      "aspects": {"Technical": 80, "Creativity": 70, "Leadership": 65, "Communication": 75, "Innovation": 72},
      "strengths": ["2-3 short strength phrases"]
    }
  ]
}

compatibility and stability are 0-100. aspects values are 0-100. strengths are 2-3 short descriptive phrases.`,
  };
}

// ─── Groq API ─────────────────────────────────────────────────────────────────
export async function callGroq(groqKey, participants, teamSize) {
  const { systemPrompt, userPrompt } = buildPrompt(participants, teamSize);
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Groq error ${res.status}: ${err?.error?.message || res.statusText}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from Groq');
  return JSON.parse(text);
}

// ─── HuggingFace ──────────────────────────────────────────────────────────────
export async function callHFRouter(hfKey, participants, teamSize) {
  const { userPrompt, systemPrompt } = buildPrompt(participants, teamSize);
  const res = await fetch('https://api-inference.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${hfKey}`,
      'Content-Type': 'application/json',
      'x-use-cache': 'false',
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      stream: false,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`HF error ${res.status}: ${err?.error || res.statusText}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty HF response');
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in HF response');
  return JSON.parse(jsonMatch[0]);
}

// ─── Local Fallback ───────────────────────────────────────────────────────────
export function generateTeamsLocally(participants, teamSize) {
  const numTeams = Math.ceil(participants.length / teamSize);
  const skillFreq = {};
  participants.forEach((p) =>
    p.skills.forEach((s) => { skillFreq[s.name] = (skillFreq[s.name] || 0) + 1; })
  );
  const sorted = [...participants].sort((a, b) => {
    const scoreA = a.skills.reduce((s, sk) => s + 1 / (skillFreq[sk.name] || 1), 0);
    const scoreB = b.skills.reduce((s, sk) => s + 1 / (skillFreq[sk.name] || 1), 0);
    return scoreB - scoreA;
  });
  const teamArrays = Array.from({ length: numTeams }, () => []);
  sorted.forEach((p, i) => {
    const round = Math.floor(i / numTeams);
    const pos = round % 2 === 0 ? i % numTeams : numTeams - 1 - (i % numTeams);
    teamArrays[pos].push(p);
  });
  const teams = teamArrays.map((members, i) => {
    const allSkills = members.flatMap((m) => m.skills);
    const skillNames = [...new Set(allSkills.map((s) => s.name))];
    const avgLevel = allSkills.length
      ? allSkills.reduce((s, sk) => s + sk.level, 0) / allSkills.length
      : 50;
    const diversity = Math.min(100, Math.round((skillNames.length * 100) / Math.max(1, allSkills.length) * 1.5));
    const categories = { Technical: 0, Creativity: 0, Leadership: 0, Communication: 0, Innovation: 0 };
    skillNames.forEach((sk) => {
      const lower = sk.toLowerCase();
      if (/frontend|backend|devops|cloud|api|docker|react|node|python|java|data|ml|ai/.test(lower)) categories.Technical += 15;
      if (/design|ux|ui|graphic|visual|creative/.test(lower)) categories.Creativity += 20;
      if (/manage|lead|product|project|scrum/.test(lower)) categories.Leadership += 20;
      if (/content|writing|communication|marketing/.test(lower)) categories.Communication += 20;
      if (/blockchain|ai|ml|research|cyber/.test(lower)) categories.Innovation += 15;
    });
    Object.keys(categories).forEach((k) => {
      categories[k] = Math.min(95, Math.max(30, Math.round(categories[k] + avgLevel * 0.3 + Math.random() * 15)));
    });
    const strengths = [];
    if (skillNames.length >= 3) strengths.push('Cross-functional Diversity');
    const topSkill = [...allSkills].sort((a, b) => b.level - a.level)[0];
    if (topSkill) strengths.push(`${topSkill.name} Excellence`);
    if (members.length >= 3) strengths.push('Balanced Team Size');
    return {
      id: `team-${i + 1}`,
      name: `Team ${i + 1}`,
      members: members.map((m) => m.name),
      compatibility: Math.min(95, Math.round(55 + diversity * 0.3 + Math.random() * 15)),
      stability: Math.min(95, Math.round(50 + avgLevel * 0.25 + Math.random() * 20)),
      aspects: categories,
      strengths,
    };
  });
  return { teams };
}

// ─── Master Dispatcher ────────────────────────────────────────────────────────
export async function generateTeams(participants, teamSize, groqKey, hfKey) {
  if (groqKey && groqKey.trim().startsWith('gsk_')) {
    try {
      console.log('Trying Groq...');
      return await callGroq(groqKey.trim(), participants, teamSize);
    } catch (e) {
      console.warn('Groq failed:', e.message);
    }
  }
  if (hfKey && hfKey.trim().startsWith('hf_')) {
    try {
      console.log('Trying HuggingFace router...');
      return await callHFRouter(hfKey.trim(), participants, teamSize);
    } catch (e) {
      console.warn('HF failed:', e.message);
    }
  }
  console.log('Using local algorithm fallback');
  return generateTeamsLocally(participants, teamSize);
}
