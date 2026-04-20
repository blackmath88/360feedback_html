// ================================================================
// 360° LEADERSHIP FEEDBACK — DATA LAYER
// Supabase primary · localStorage fallback
// University of Basel
// ================================================================

// ── SUPABASE CONFIG ───────────────────────────────────────────
const SUPABASE_URL  = 'https://vfmkupattxgsvfuldyvh.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbWt1cGF0dHhnc3ZmdWxkeXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTg5NzgsImV4cCI6MjA5MjI3NDk3OH0.Ztg5tXVM-G9epT41wi8CwkM1p5NX7BCrp1enuOv6zHM';
const LOCAL_KEY     = 'cmt360_cases';

// ── LOW-LEVEL SUPABASE FETCH ──────────────────────────────────
async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        options.prefer || 'return=representation',
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase ${options.method||'GET'} ${path}: ${res.status} ${err}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ── SUPABASE API ──────────────────────────────────────────────
const SB = {

  // ── CASES ──────────────────────────────────────────────────
  async getCases() {
    return await sbFetch('cases?select=*&order=created_at.desc');
  },

  async getCase(id) {
    const rows = await sbFetch(`cases?id=eq.${id}&select=*`);
    return rows?.[0] || null;
  },

  async upsertCase(c) {
    return await sbFetch('cases', {
      method: 'POST',
      prefer: 'return=representation,resolution=merge-duplicates',
      headers: { 'Prefer': 'return=representation,resolution=merge-duplicates' },
      body: JSON.stringify({
        id: c.id, name: c.name, role: c.role || null,
        unit: c.unit || null, year: c.year || null,
        cycle: c.cycle || null, owner: c.owner || null,
        notes: c.notes || null, status: c.status || 'draft'
      })
    });
  },

  async deleteCase(id) {
    await sbFetch(`cases?id=eq.${id}`, { method: 'DELETE', prefer: '' });
  },

  // ── RESPONDENTS ────────────────────────────────────────────
  async getRespondents(caseId) {
    return await sbFetch(`respondents?case_id=eq.${caseId}&select=*&order=created_at.asc`);
  },

  async addRespondent(r) {
    return await sbFetch('respondents', {
      method: 'POST',
      body: JSON.stringify({
        id: r.id, case_id: r.caseId, email: r.email,
        token: r.token, submitted: false
      })
    });
  },

  async deleteRespondent(token) {
    await sbFetch(`respondents?token=eq.${token}`, { method: 'DELETE', prefer: '' });
  },

  async markSubmitted(token) {
    return await sbFetch(`respondents?token=eq.${token}`, {
      method: 'PATCH',
      body: JSON.stringify({ submitted: true, submitted_at: new Date().toISOString() })
    });
  },

  async getRespondentByToken(token) {
    const rows = await sbFetch(`respondents?token=eq.${token}&select=*`);
    return rows?.[0] || null;
  },

  // ── SELF ASSESSMENTS ───────────────────────────────────────
  async getSelfAssessment(caseId) {
    const rows = await sbFetch(`self_assessments?case_id=eq.${caseId}&select=*`);
    return rows?.[0] || null;
  },

  async upsertSelfAssessment(caseId, answers, reflection) {
    // Check if exists
    const existing = await this.getSelfAssessment(caseId);
    if (existing) {
      return await sbFetch(`self_assessments?case_id=eq.${caseId}`, {
        method: 'PATCH',
        body: JSON.stringify({ answers, reflection, updated_at: new Date().toISOString() })
      });
    } else {
      return await sbFetch('self_assessments', {
        method: 'POST',
        body: JSON.stringify({
          id: CMT.newId(), case_id: caseId, answers, reflection
        })
      });
    }
  },

  // ── RESPONSE SETS (Fremdbild) ──────────────────────────────
  async getResponseSets(caseId) {
    return await sbFetch(`response_sets?case_id=eq.${caseId}&select=*`);
  },

  async saveResponseSet(caseId, respondentId, answers, openAnswers) {
    return await sbFetch('response_sets', {
      method: 'POST',
      body: JSON.stringify({
        id: CMT.newId(), case_id: caseId,
        respondent_id: respondentId, answers, open_answers: openAnswers
      })
    });
  }
};

// ── CMT — PUBLIC API ──────────────────────────────────────────
// All methods are async. Falls back to localStorage if Supabase fails.

const CMT = {

  // ── CONNECTION STATE ───────────────────────────────────────
  _online: null, // null = unknown, true = supabase, false = localStorage

  async checkOnline() {
    if (this._online !== null) return this._online;
    try {
      await sbFetch('cases?limit=1', { prefer: '' });
      this._online = true;
    } catch {
      this._online = false;
      console.warn('[CMT] Supabase unreachable — using localStorage fallback');
    }
    return this._online;
  },

  // ── CASES ──────────────────────────────────────────────────
  async getCases() {
    if (await this.checkOnline()) {
      try {
        const cases = await SB.getCases();
        // Hydrate with respondents + self assessment status
        const hydrated = await Promise.all(cases.map(c => this._hydrateCase(c)));
        return hydrated;
      } catch(e) {
        console.warn('[CMT] getCases fallback:', e.message);
      }
    }
    return this._localGetCases();
  },

  async getCase(id) {
    if (await this.checkOnline()) {
      try {
        const c = await SB.getCase(id);
        if (!c) return null;
        return await this._hydrateCase(c);
      } catch(e) {
        console.warn('[CMT] getCase fallback:', e.message);
      }
    }
    return this._localGetCases().find(c => c.id === id) || null;
  },

  async saveCase(c) {
    if (await this.checkOnline()) {
      try {
        await SB.upsertCase(c);
        // Save respondents
        if (c.respondents?.length) {
          for (const r of c.respondents) {
            if (!r._saved) {
              try {
                await SB.addRespondent({ ...r, caseId: c.id });
                r._saved = true;
              } catch { /* already exists */ }
            }
          }
        }
        // Save self answers if present
        if (c.selfAnswers && Object.keys(c.selfAnswers).length > 0) {
          try {
            await SB.upsertSelfAssessment(c.id, c.selfAnswers, c.selfReflection || {});
          } catch(e) {
            console.warn('[CMT] self assessment save error:', e.message);
          }
        }
        return;
      } catch(e) {
        console.warn('[CMT] saveCase fallback:', e.message);
      }
    }
    this._localSaveCase(c);
  },

  async deleteCase(id) {
    if (await this.checkOnline()) {
      try { await SB.deleteCase(id); return; } catch(e) { console.warn('[CMT] deleteCase fallback:', e.message); }
    }
    this._localSaveCases(this._localGetCases().filter(c => c.id !== id));
  },

  // ── RESPONDENTS ────────────────────────────────────────────
  async addRespondent(caseId, email) {
    const r = { id: this.newId(), caseId, email, token: this.newToken(), submitted: false, submittedAt: null };
    if (await this.checkOnline()) {
      try {
        await SB.addRespondent(r);
        return r;
      } catch(e) { console.warn('[CMT] addRespondent fallback:', e.message); }
    }
    const c = this._localGetCases().find(c => c.id === caseId);
    if (c) { c.respondents.push(r); this._localSaveCase(c); }
    return r;
  },

  async removeRespondent(caseId, token) {
    if (await this.checkOnline()) {
      try { await SB.deleteRespondent(token); return; } catch(e) { console.warn('[CMT] removeRespondent fallback:', e.message); }
    }
    const c = this._localGetCases().find(c => c.id === caseId);
    if (c) { c.respondents = c.respondents.filter(r => r.token !== token); this._localSaveCase(c); }
  },

  async getRespondentByToken(token) {
    if (await this.checkOnline()) {
      try { return await SB.getRespondentByToken(token); } catch(e) { console.warn('[CMT] getRespondentByToken fallback:', e.message); }
    }
    for (const c of this._localGetCases()) {
      const r = c.respondents?.find(r => r.token === token);
      if (r) return { ...r, case_id: c.id };
    }
    return null;
  },

  // ── SELF ASSESSMENT ────────────────────────────────────────
  async saveSelfAssessment(caseId, answers, reflection) {
    if (await this.checkOnline()) {
      try {
        await SB.upsertSelfAssessment(caseId, answers, reflection);
        return;
      } catch(e) { console.warn('[CMT] saveSelf fallback:', e.message); }
    }
    const c = this._localGetCases().find(c => c.id === caseId);
    if (c) { c.selfAnswers = answers; c.selfReflection = reflection; this._localSaveCase(c); }
  },

  async getSelfAssessment(caseId) {
    if (await this.checkOnline()) {
      try { return await SB.getSelfAssessment(caseId); } catch(e) { console.warn('[CMT] getSelf fallback:', e.message); }
    }
    const c = this._localGetCases().find(c => c.id === caseId);
    return c ? { answers: c.selfAnswers || {}, reflection: c.selfReflection || {} } : null;
  },

  // ── FREMDBILD SUBMIT ───────────────────────────────────────
  async submitFremdbild(token, caseId, answers, openAnswers) {
    if (await this.checkOnline()) {
      try {
        const respondent = await SB.getRespondentByToken(token);
        if (!respondent) throw new Error('Respondent not found');
        await SB.saveResponseSet(caseId, respondent.id, answers, openAnswers);
        await SB.markSubmitted(token);
        return { ok: true };
      } catch(e) { console.warn('[CMT] submitFremdbild fallback:', e.message); }
    }
    // localStorage fallback
    const cases = this._localGetCases();
    const c = cases.find(c => c.id === caseId);
    if (c) {
      const r = c.respondents?.find(r => r.token === token);
      if (r) {
        r.submitted    = true;
        r.submittedAt  = new Date().toISOString();
        r.answers      = answers;
        r.openAnswers  = openAnswers;
        this._localSaveCase(c);
      }
    }
    return { ok: true };
  },

  // ── REPORT DATA ────────────────────────────────────────────
  async getReportData(caseId) {
    if (await this.checkOnline()) {
      try {
        const [c, selfData, responseSets, respondents] = await Promise.all([
          SB.getCase(caseId),
          SB.getSelfAssessment(caseId),
          SB.getResponseSets(caseId),
          SB.getRespondents(caseId)
        ]);
        if (!c) return null;
        return {
          ...c,
          selfAnswers:    selfData?.answers     || {},
          selfReflection: selfData?.reflection  || {},
          respondents: respondents.map(r => ({
            ...r,
            submitted:   r.submitted,
            answers:     responseSets.find(rs => rs.respondent_id === r.id)?.answers      || null,
            openAnswers: responseSets.find(rs => rs.respondent_id === r.id)?.open_answers || null,
          }))
        };
      } catch(e) { console.warn('[CMT] getReportData fallback:', e.message); }
    }
    return this._localGetCases().find(c => c.id === caseId) || null;
  },

  // ── HYDRATE (attach respondents + self to case row) ────────
  async _hydrateCase(c) {
    const [respondents, selfData] = await Promise.all([
      SB.getRespondents(c.id).catch(() => []),
      SB.getSelfAssessment(c.id).catch(() => null)
    ]);
    return {
      ...c,
      respondents:    respondents.map(r => ({ ...r, caseId: r.case_id })),
      selfAnswers:    selfData?.answers    || {},
      selfReflection: selfData?.reflection || {}
    };
  },

  // ── LOCAL STORAGE FALLBACK ─────────────────────────────────
  _localGetCases() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; }
  },
  _localSaveCases(cases) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cases));
  },
  _localSaveCase(c) {
    const cases = this._localGetCases();
    const idx = cases.findIndex(x => x.id === c.id);
    if (idx >= 0) cases[idx] = c; else cases.push(c);
    this._localSaveCases(cases);
  },

  // ── SYNC: push localStorage cases to Supabase ──────────────
  async syncLocalToSupabase() {
    const local = this._localGetCases();
    if (!local.length) return { synced: 0 };
    let synced = 0;
    for (const c of local) {
      try {
        await this.saveCase(c);
        synced++;
      } catch(e) { console.warn('[CMT] sync error for', c.name, e.message); }
    }
    return { synced, total: local.length };
  },

  // ── UTILS ──────────────────────────────────────────────────
  newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  },

  newToken() {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
  },

  // ── SCORING ────────────────────────────────────────────────
  calcSubsectionAvg(answers, subsection) {
    if (!answers) return null;
    const vals = subsection.questions
      .map(q => answers[q.id])
      .filter(v => v !== null && v !== undefined);
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  },

  calcSectionAvg(answers, section) {
    if (!answers) return null;
    const avgs = section.subsections
      .filter(ss => !ss.trap)
      .map(ss => this.calcSubsectionAvg(answers, ss))
      .filter(v => v !== null);
    if (!avgs.length) return null;
    return avgs.reduce((a, b) => a + b, 0) / avgs.length;
  },

  // ── QUESTIONNAIRE DATA ─────────────────────────────────────
  toFremd(text) {
    return text
      .replace(/^Ich kann /,         'Diese Führungsperson kann ')
      .replace(/^Ich stärke /,       'Diese Führungsperson stärkt ')
      .replace(/^Ich ermutige /,     'Diese Führungsperson ermutigt ')
      .replace(/^Ich kommuniziere /, 'Diese Führungsperson kommuniziert ')
      .replace(/^Ich setze /,        'Diese Führungsperson setzt ')
      .replace(/^Ich übernehme /,    'Diese Führungsperson übernimmt ')
      .replace(/^Ich zeige /,        'Diese Führungsperson zeigt ')
      .replace(/^Ich bleibe /,       'Diese Führungsperson bleibt ')
      .replace(/^Ich beziehe /,      'Diese Führungsperson bezieht ')
      .replace(/^Ich informiere mich /, 'Diese Führungsperson informiert sich ')
      .replace(/^Ich erkenne /,      'Diese Führungsperson erkennt ')
      .replace(/^Ich gestalte /,     'Diese Führungsperson gestaltet ')
      .replace(/^Ich nutze /,        'Diese Führungsperson nutzt ')
      .replace(/^Ich erläutere /,    'Diese Führungsperson erläutert ')
      .replace(/^Ich entwickle /,    'Diese Führungsperson entwickelt ')
      .replace(/^Ich schaffe /,      'Diese Führungsperson schafft ')
      .replace(/^Ich hinterfrage /,  'Diese Führungsperson hinterfragt ')
      .replace(/^Ich treibe /,       'Diese Führungsperson treibt ')
      .replace(/^Ich fördere /,      'Diese Führungsperson fördert ')
      .replace(/^Ich delegiere /,    'Diese Führungsperson delegiert ')
      .replace(/^Ich unterstütze /,  'Diese Führungsperson unterstützt ')
      .replace(/^Ich treffe /,       'Diese Führungsperson trifft ')
      .replace(/^Ich kläre /,        'Diese Führungsperson klärt ')
      .replace(/^Ich vereinbare /,   'Diese Führungsperson vereinbart ')
      .replace(/^Ich bespreche /,    'Diese Führungsperson bespricht ')
      .replace(/^Ich mache /,        'Diese Führungsperson macht ')
      .replace(/^Ich rege /,         'Diese Führungsperson regt ')
      .replace(/^Ich führe /,        'Diese Führungsperson führt ')
      .replace(/^Ich gebe /,         'Diese Führungsperson gibt ')
      .replace(/^Ich ermögliche /,   'Diese Führungsperson ermöglicht ')
      .replace(/^Ich vermittle /,    'Diese Führungsperson vermittelt ')
      .replace(/^Ich bin /,          'Diese Führungsperson ist ')
      .replace(/^Ich stelle /,       'Diese Führungsperson stellt ')
      .replace(/^Ich höre /,         'Diese Führungsperson hört ')
      .replace(/^Ich verstehe /,     'Diese Führungsperson versteht ')
      .replace(/^Ich kümmere /,      'Diese Führungsperson kümmert ')
      .replace(/\bmeinen Mitarbeitenden\b/g, 'ihren Mitarbeitenden')
      .replace(/\bmeine Mitarbeitenden\b/g,  'ihre Mitarbeitenden')
      .replace(/\bmeinem Team\b/g,           'ihrem Team')
      .replace(/\bmein Team\b/g,             'ihr Team')
      .replace(/\bmeines Teams\b/g,          'ihres Teams')
      .replace(/\bmeinem Fachgebiet\b/g,     'ihrem Fachgebiet')
      .replace(/\bich selbst\b/g,            'sie selbst')
      .replace(/\bich\b/g,                   'sie');
  },

  sections: [
    {
      id: 'vorbildfunktion', de: 'Führung als Vorbild', en: 'Leadership by Example', color: '#d21039',
      subsections: [
        { id:'vertrauen', de:'Vertrauen und Zuversicht vermitteln', en:'Conveying Trust and Confidence', trap:false, questions:[
          {id:'q1',  de:'Ich kann andere von einer Sache überzeugen.',                                                              en:'I can convince others of an issue.',                               trap:false},
          {id:'q2',  de:'Ich stärke meinen Mitarbeitenden den Rücken, so dass sie sich voll und ganz für eine Sache einsetzen können.', en:'I support my employees so that they can fully commit to a cause.', trap:false},
          {id:'q3',  de:'Ich ermutige meine Mitarbeitenden, auch schwierige Aufgaben zu meistern.',                                en:'I encourage my employees to master even difficult tasks.',          trap:false},
        ]},
        { id:'glaubwuerdig', de:'Glaubwürdig handeln', en:'Acting credibly', trap:false, questions:[
          {id:'q4',  de:'Ich kommuniziere meine eigenen Werte und Überzeugungen.',  en:'I communicate my own values and beliefs.',                  trap:false},
          {id:'q5',  de:'Ich setze das, was ich sage, auch konsequent um.',          en:'I consistently put into practice what I say.',             trap:false},
          {id:'q6',  de:'Ich übernehme Verantwortung für die eigenen Entscheidungen und Handlungen.', en:'I take responsibility for my own decisions and actions.', trap:false},
          {id:'q7',  de:'Ich zeige mich offen für Feedback zu meinem Führungsverhalten.', en:'I am open to feedback on my leadership behavior.',    trap:false},
        ]},
        { id:'ambivalenz', de:'Mit Ambivalenzen umgehen', en:'Dealing with ambivalence', trap:false, questions:[
          {id:'q8',  de:'Im Spannungsfeld unterschiedlicher fachlicher Anforderungen und institutioneller Rahmenbedingungen treffe ich tragfähige Entscheidungen.', en:'I make sound decisions when faced with conflicting requirements.', trap:false},
          {id:'q9',  de:'Ich bleibe in kontroversen Gesprächen ruhig und sachlich.',  en:'I remain calm and objective in controversial conversations.', trap:false},
          {id:'q10', de:'Ich beziehe Position und bleibe in unklaren Situationen handlungsfähig.', en:'I take a stand and remain capable of acting in unclear situations.', trap:false},
        ]},
        { id:'fallen1', de:'Check: Führungsfallen', en:'Check: Leadership Pitfalls', trap:true, questions:[
          {id:'q11', de:'Ich setze mitunter Standards, die ich selbst nicht unbedingt erfüllen kann.',                            en:'I sometimes set standards that I myself cannot necessarily meet.', trap:true},
          {id:'q12', de:'Es gelingt mir nicht immer, meine Absichten konsequent in Handlungen zu überführen.',                    en:"I don't always manage to consistently translate my intentions into actions.", trap:true},
          {id:'q13', de:'Ich könnte mir noch mehr Zeit nehmen, um mich aktiv für die Anliegen meines Teams einzusetzen.',         en:'I could take more time to actively support my team.',             trap:true},
          {id:'q14', de:'In kontroversen oder komplexen Entscheidungssituationen erlebe ich mich teilweise nicht souverän genug.', en:'In controversial situations, I sometimes feel not confident enough.', trap:true},
          {id:'q15', de:'Ich sollte meine Meinung und Prioritäten weniger häufig wechseln.',                                      en:'I should change my opinion and priorities less frequently.',      trap:true},
        ]}
      ]
    },
    {
      id: 'orientierung', de: 'Orientierung schaffen', en: 'Providing Guidance', color: '#bebec8',
      subsections: [
        { id:'ausrichtung', de:'Ausrichtung entwickeln', en:'Developing Alignment', trap:false, questions:[
          {id:'q16', de:'Ich informiere mich über wesentliche Entwicklungen in meinem Fachgebiet und antizipiere zukunftsrelevante Themen.', en:'I keep myself informed about developments in my field.', trap:false},
          {id:'q17', de:'Ich erkenne frühzeitig relevante Entwicklungen und richte meine Einheit vorausschauend darauf aus.',              en:'I recognize relevant developments early and align my unit proactively.', trap:false},
          {id:'q18', de:'Ich gestalte Strategieumsetzung als dialogischen Prozess unter Einbezug der Mitarbeitenden.',                    en:'I design strategy implementation as a dialogical process.', trap:false},
          {id:'q19', de:'Ich nutze diverse Austauschformate, um die Strategie kontinuierlich anzupassen.',                                en:'I use various formats to continuously adapt strategy.', trap:false},
        ]},
        { id:'zukunft', de:'Zukunftsperspektiven formulieren', en:'Formulating Future Prospects', trap:false, questions:[
          {id:'q20', de:'Ich erläutere dem Team meine Zukunftsvorstellungen und welchen Beitrag das Team dazu leisten kann.', en:'I explain my vision and how the team can contribute.', trap:false},
          {id:'q21', de:'Ich entwickle im Austausch mit relevanten Stakeholdern strategische Schwerpunkte.',                  en:'I develop strategic priorities with relevant stakeholders.', trap:false},
          {id:'q22', de:'Ich schaffe Transparenz über Ziele, Gestaltungsspielräume und individuelle Verantwortungsbereiche.', en:'I ensure transparency about goals and responsibilities.', trap:false},
        ]},
        { id:'innovation', de:'Innovation vorantreiben', en:'Driving Innovation', trap:false, questions:[
          {id:'q23', de:'Ich hinterfrage bestehende Handlungsweisen, Prozesse und Abläufe, um Verbesserungen anzustossen.', en:'I challenge existing practices to initiate improvements.', trap:false},
          {id:'q24', de:'Ich treibe Innovationen und Neuerungen aktiv voran.',                                              en:'I actively drive innovation and change.', trap:false},
          {id:'q25', de:'Ich fördere eine innovationsoffene Diskussionskultur.',                                            en:'I promote a culture open to innovation.', trap:false},
        ]},
        { id:'fallen2', de:'Check: Führungsfallen', en:'Check: Leadership Pitfalls', trap:true, questions:[
          {id:'q26', de:'Ich bin oft so stark im Tagesgeschäft eingebunden, dass mir zu wenig Zeit für strategische Weiterentwicklung bleibt.', en:'I am often too involved in daily operations.', trap:true},
          {id:'q27', de:'Ich habe viele Ideen, setze jedoch wesentlich weniger um, als ich mir vorgenommen habe.',                            en:'I generate many ideas but implement considerably fewer.', trap:true},
          {id:'q28', de:'Manchmal erschwere ich die Umsetzung von Neuerungen durch unrealistische Planung.',                                  en:'I sometimes make implementation difficult through unrealistic planning.', trap:true},
        ]}
      ]
    },
    {
      id: 'steuern', de: 'Wirksam steuern', en: 'Managing Effectively', color: '#006f6f',
      subsections: [
        { id:'verantwortung', de:'Verantwortlichkeit stärken', en:'Strengthening Accountability', trap:false, questions:[
          {id:'q29', de:'Ich delegiere Aufgaben und die dazugehörigen Kompetenzen klar und ergebnisorientiert.', en:'I delegate tasks clearly and result-oriented.', trap:false},
          {id:'q30', de:'Ich unterstütze meine Mitarbeitenden darin, Probleme selbständig zu bewältigen.',       en:'I support my employees in solving problems independently.', trap:false},
          {id:'q31', de:'Ich treffe fundierte Entscheidungen hinsichtlich alltäglicher Sachfragen.',             en:'I make informed decisions regarding everyday issues.', trap:false},
        ]},
        { id:'ziele', de:'Ziele und Aufgaben vereinbaren', en:'Agreeing on Goals', trap:false, questions:[
          {id:'q32', de:'Ich kläre eindeutig, wer für welche Aufgaben verantwortlich ist.',                           en:'I clearly define who is responsible for each task.', trap:false},
          {id:'q33', de:'Ich vereinbare Ziele und Qualitätsstandards, die herausfordernd, jedoch realistisch sind.',  en:'I agree on goals that are challenging but achievable.', trap:false},
          {id:'q34', de:'Ich fördere ein Klima, in dem Eigeninitiative geschätzt und Leistungen anerkannt werden.',   en:'I promote a culture that values initiative and recognizes performance.', trap:false},
        ]},
        { id:'ergebnisse', de:'Ergebnisse bewerten', en:'Evaluating Results', trap:false, questions:[
          {id:'q35', de:'Ich bespreche die Leistungen von Teammitgliedern individuell und gebe unterstützendes Feedback.', en:'I discuss each team member\'s performance individually.', trap:false},
          {id:'q36', de:'Ich mache Mitarbeitende auf Verbesserungspotenziale aufmerksam.',                                en:'I draw attention to areas for improvement.', trap:false},
          {id:'q37', de:'Ich nutze Gespräche, um Fortschritte regelmässig zu reflektieren und sichtbar zu machen.',       en:'I use discussions to regularly reflect on progress.', trap:false},
        ]},
        { id:'fallen3', de:'Check: Führungsfallen', en:'Check: Leadership Pitfalls', trap:true, questions:[
          {id:'q38', de:'Ich könnte Kontextfaktoren bei der Beurteilung von Leistung noch besser berücksichtigen.', en:'I could better account for contextual factors when assessing performance.', trap:true},
          {id:'q39', de:'Ich könnte noch konsequenter konkretes Feedback geben.',                                    en:'I could be more consistent in giving specific feedback.', trap:true},
          {id:'q40', de:'Ich könnte Rollen und Zuständigkeiten im Team klarer definieren.',                          en:'I could define roles and responsibilities more clearly.', trap:true},
          {id:'q41', de:'Teilweise verzögere ich wichtige Entscheidungen und blockiere damit Vorhaben.',             en:'I sometimes delay important decisions.', trap:true},
          {id:'q42', de:'Teilweise neige ich zu Mikromanagement.',                                                   en:'I sometimes tend to micromanage.', trap:true},
        ]}
      ]
    },
    {
      id: 'entwickeln', de: 'Mitarbeitende und Teams entwickeln', en: 'Developing Employees', color: '#eb829b',
      subsections: [
        { id:'empowerment', de:'Empowerment stärken', en:'Promoting Empowerment', trap:false, questions:[
          {id:'q43', de:'Ich fördere eigenverantwortliches Arbeiten meiner Mitarbeitenden.',                            en:'I encourage independent work among my team.', trap:false},
          {id:'q44', de:'Ich übertrage neue Aufgaben und Verantwortung gemäss bestehender Kompetenzen.',               en:'I assign tasks in line with existing or developing skills.', trap:false},
          {id:'q45', de:'Ich gewähre meinen Mitarbeitenden Handlungsspielräume für eigene Entscheidungen.',            en:'I give my employees license to make their own decisions.', trap:false},
        ]},
        { id:'coaching', de:'Mitarbeitende coachen', en:'Coaching Employees', trap:false, questions:[
          {id:'q46', de:'Ich rege meine Mitarbeitenden dazu an, Neues zu lernen und Wissen zu teilen.',                en:'I encourage my employees to learn and share knowledge.', trap:false},
          {id:'q47', de:'Ich unterstütze meine Mitarbeitenden dabei, eigene Entwicklungsfelder zu erkennen.',          en:'I support employees in identifying areas for development.', trap:false},
          {id:'q48', de:'Ich führe regelmässig Gespräche, in denen ich Entwicklung und Lernen thematisiere.',          en:'I hold regular meetings to discuss development and learning.', trap:false},
        ]},
        { id:'foerderung', de:'Entwicklungen fördern', en:'Promoting Development', trap:false, questions:[
          {id:'q49', de:'Ich gebe konstruktives Feedback zu Stärken und Entwicklungsfeldern.',                         en:'I provide constructive feedback on strengths and development.', trap:false},
          {id:'q50', de:'Ich ermögliche Formate für gemeinsames Lernen und Austausch im Team.',                        en:'I facilitate formats for joint learning and exchange.', trap:false},
          {id:'q51', de:'Ich unterstütze Mitarbeitende gezielt hinsichtlich ihrer beruflichen Entscheidungen.',        en:'I provide targeted support for career decisions.', trap:false},
        ]},
        { id:'empathie', de:'Empathie zeigen', en:'Showing Empathy', trap:false, questions:[
          {id:'q52', de:'Ich kann mich in die Sichtweise verschiedener Personen gut hineinversetzen.',                 en:'I can easily put myself in other people\'s shoes.', trap:false},
          {id:'q53', de:'Ich interessiere mich für die Bedürfnisse und Ziele meiner Mitarbeitenden.',                  en:'I am interested in the needs and goals of my employees.', trap:false},
          {id:'q54', de:'Ich berücksichtige die Individualität meiner Mitarbeitenden bei Entscheidungen.',             en:'I take individuality into account when making decisions.', trap:false},
        ]},
        { id:'fallen4', de:'Check: Führungsfallen', en:'Check: Leadership Pitfalls', trap:true, questions:[
          {id:'q55', de:'Ich könnte Zusatzaufgaben noch fairer im Team verteilen.',                                    en:'I could assign additional tasks more fairly.', trap:true},
          {id:'q56', de:'Ich könnte noch mehr Zeit auf die Entwicklung meines Teams verwenden.',                       en:'I could spend more time on team development.', trap:true},
          {id:'q57', de:'Ich könnte dysfunktionale Teamdynamiken schneller angehen.',                                  en:'I could address dysfunctional team dynamics more quickly.', trap:true},
          {id:'q58', de:'Ich könnte insgesamt für mein Team präsenter sein.',                                          en:'Overall, I could be more present for my team.', trap:true},
        ]}
      ]
    },
    {
      id: 'arbeitsumfeld', de: 'Arbeitsumfeld gestalten', en: 'Shaping the Work Environment', color: '#1EA5A5',
      subsections: [
        { id:'kommunikation', de:'Effektiv kommunizieren', en:'Communicating Effectively', trap:false, questions:[
          {id:'q59', de:'Ich vermittle zeitnah die Informationen, die meine Mitarbeitenden zur Aufgabenerfüllung benötigen.', en:'I promptly pass on information employees need.', trap:false},
          {id:'q60', de:'Ich nutze adäquate Kommunikationskanäle, um Austausch und fundierte Entscheidungen zu fördern.',    en:'I use appropriate communication channels.', trap:false},
          {id:'q61', de:'Ich bin in der Lage, Kommunikationsprozesse effektiv zu gestalten.',                               en:'I design communication processes effectively.', trap:false},
        ]},
        { id:'ressourcen', de:'Ressourcen managen', en:'Managing Resources', trap:false, questions:[
          {id:'q62', de:'Ich stelle die notwendigen Ressourcen (Personal, IT, Finanzierung) bereit.',                       en:'I provide the resources necessary for success.', trap:false},
          {id:'q63', de:'Ich schaffe klare Strukturen und Rahmenbedingungen für Projekte.',                                 en:'I create clear structures for projects.', trap:false},
          {id:'q64', de:'Ich erkenne Engpässe frühzeitig und sorge rechtzeitig für Entlastung.',                            en:'I identify bottlenecks early and provide relief.', trap:false},
        ]},
        { id:'konflikte', de:'Konflikte handhaben', en:'Managing Conflicts', trap:false, questions:[
          {id:'q65', de:'Ich erkenne Konflikte frühzeitig und greife diese aktiv auf.',                                     en:'I spot conflicts early and actively address them.', trap:false},
          {id:'q66', de:'Ich höre in Konfliktsituationen alle Beteiligten und unterstütze bei der Klärung.',               en:'I listen to all parties in conflict situations.', trap:false},
          {id:'q67', de:'Ich bin in der Lage, bei Eskalationen einzugreifen und inakzeptables Verhalten zu adressieren.',  en:'I can intervene in escalations and address unacceptable behavior.', trap:false},
        ]},
        { id:'veraenderung', de:'Veränderungen umsetzen', en:'Implementing Change', trap:false, questions:[
          {id:'q68', de:'Ich beziehe Betroffene aktiv in die Umsetzung von Veränderungsprozessen mit ein.',               en:'I actively involve stakeholders in change processes.', trap:false},
          {id:'q69', de:'Ich verdeutliche die Hintergründe und Notwendigkeiten von Veränderungen.',                       en:'I explain the background and necessity of changes.', trap:false},
          {id:'q70', de:'Ich sorge für eine nachvollziehbare Umsetzungsplanung.',                                         en:'I plan implementation clearly.', trap:false},
        ]},
        { id:'beziehungen', de:'Arbeitsbeziehungen gestalten', en:'Shaping Working Relationships', trap:false, questions:[
          {id:'q71', de:'Ich verstehe es, mit unterschiedlichen Personen und Einheiten effektiv zusammenzuarbeiten.',      en:'I collaborate effectively with different people and units.', trap:false},
          {id:'q72', de:'Ich fördere aktiv die vertrauensvolle Zusammenarbeit im Team.',                                  en:'I actively promote trusting collaboration.', trap:false},
          {id:'q73', de:'Ich pflege und baue meine fachlichen und institutionellen Kontakte kontinuierlich aus.',         en:'I maintain and expand my professional contacts.', trap:false},
        ]},
        { id:'fallen5', de:'Check: Führungsfallen', en:'Check: Leadership Pitfalls', trap:true, questions:[
          {id:'q74', de:'Ich kommuniziere nicht immer klar oder früh genug.',                                             en:'I do not always communicate clearly or early enough.', trap:true},
          {id:'q75', de:'Ich sollte nicht erst eingreifen, wenn Probleme ein kritisches Ausmass erreicht haben.',         en:'I should not wait until problems reach a critical level.', trap:true},
          {id:'q76', de:'Ich könnte mich noch mehr für unsere Ressourcen einsetzen.',                                     en:'I could advocate more strongly for our resources.', trap:true},
          {id:'q77', de:'Ich könnte Veränderungsprozesse noch proaktiver steuern.',                                       en:'I could manage change processes more proactively.', trap:true},
        ]}
      ]
    }
  ],

  selfReflection: [
    {id:'sr1', de:'Was sind meine grössten Führungsstärken?',               en:'What are my greatest leadership strengths?'},
    {id:'sr2', de:'Wo sehe ich für mich persönlich Entwicklungsbedarf?',    en:'Where do I see a need for development?'},
    {id:'sr3', de:'Was möchte ich in meiner Führungsrolle mehr tun?',       en:'What would I like to do more of?'},
    {id:'sr4', de:'Was möchte ich weniger tun oder ganz darauf verzichten?', en:'What would I like to do less of?'},
  ],

  fremdReflection: [
    {id:'fr1', de:'Was schätzen Sie am Führungsstil dieser Person?',        en:'What do you appreciate about this person\'s leadership style?'},
    {id:'fr2', de:'In welchen Bereichen sehen Sie Entwicklungsbedarf?',     en:'In which areas do you see a need for development?'},
    {id:'fr3', de:'Was sollte diese Führungskraft mehr tun?',               en:'What should this leader do more of?'},
    {id:'fr4', de:'Was sollte diese Führungskraft weniger tun?',            en:'What should this leader do less of?'},
  ],
};
