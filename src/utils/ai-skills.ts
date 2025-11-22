export async function getAISkillSuggestions(prompt: string, resumeSkills: string[]) {
  try {
    const openaiResponse = await fetch('/api/ai/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to get AI skill suggestions');
    }

    const { completion } = await openaiResponse.json();
    if (!completion) {
      throw new Error('No skills were generated');
    }

    const skillsArray = completion
      .split(',')
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length > 0 && !resumeSkills.includes(skill));

    return skillsArray;
  } catch (error) {
    console.error('Error getting AI skill suggestions:', error);
    throw error;
  }
}
