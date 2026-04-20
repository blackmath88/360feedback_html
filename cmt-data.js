// ================================================================
// 360° LEADERSHIP FEEDBACK — SHARED DATA & DESIGN SYSTEM
// University of Basel
// ================================================================

const CMT = {

  // ── DESIGN TOKENS ─────────────────────────────────────────────
  colors: {
    red:     '#d20537',
    teal:    '#a5d7d2',
    trap:    '#5D666D',
    hellrot: '#eb829b',
    competence: ['#d21039','#bebec8','#1EA5A5','#eb829b','#006f6f']
  },

  // ── COMPETENCY SECTIONS ───────────────────────────────────────
  sections: [
    {
      id: 'vorbildfunktion',
      de: 'Führung als Vorbild',
      en: 'Leadership by Example',
      color: '#d21039',
      subsections: [
        {
          id: 'vertrauen',
          de: 'Vertrauen und Zuversicht vermitteln',
          en: 'Conveying Trust and Confidence',
          trap: false,
          questions: [
            { id:'q1',  de:'Ich kann andere von einer Sache überzeugen.',                                                             en:'I can convince others of an issue.',                                                                        trap:false },
            { id:'q2',  de:'Ich stärke meinen Mitarbeitenden den Rücken, so dass sie sich voll und ganz für eine Sache einsetzen können.', en:'I support my employees so that they can fully commit to a cause.',                                           trap:false },
            { id:'q3',  de:'Ich ermutige meine Mitarbeitenden, auch schwierige Aufgaben zu meistern.',                               en:'I encourage my employees to master even difficult tasks.',                                                 trap:false },
          ]
        },
        {
          id: 'glaubwuerdig',
          de: 'Glaubwürdig handeln',
          en: 'Acting credibly',
          trap: false,
          questions: [
            { id:'q4',  de:'Ich kommuniziere meine eigenen Werte und Überzeugungen.',                                                 en:'I communicate my own values and beliefs.',                                                                  trap:false },
            { id:'q5',  de:'Ich setze das, was ich sage, auch konsequent um.',                                                        en:'I consistently put into practice what I say.',                                                             trap:false },
            { id:'q6',  de:'Ich übernehme Verantwortung für die eigenen Entscheidungen und Handlungen.',                              en:'I take responsibility for my own decisions and actions.',                                                   trap:false },
            { id:'q7',  de:'Ich zeige mich offen für Feedback zu meinem Führungsverhalten.',                                          en:'I am open to feedback on my leadership behavior.',                                                         trap:false },
          ]
        },
        {
          id: 'ambivalenz',
          de: 'Mit Ambivalenzen umgehen',
          en: 'Dealing with ambivalence',
          trap: false,
          questions: [
            { id:'q8',  de:'Im Spannungsfeld unterschiedlicher fachlicher Anforderungen und institutioneller Rahmenbedingungen treffe ich tragfähige Entscheidungen.', en:'I make sound decisions when faced with conflicting technical requirements and institutional constraints.', trap:false },
            { id:'q9',  de:'Ich bleibe in kontroversen Gesprächen ruhig und sachlich.',                                               en:'I remain calm and objective in controversial conversations.',                                              trap:false },
            { id:'q10', de:'Ich beziehe Position und bleibe in unklaren Situationen handlungsfähig.',                                 en:'I take a stand and remain capable of acting in unclear situations.',                                        trap:false },
          ]
        },
        {
          id: 'fallen1',
          de: 'Check: Führungsfallen',
          en: 'Check: Leadership Pitfalls',
          trap: true,
          questions: [
            { id:'q11', de:'Ich setze mitunter Standards, die ich selbst nicht unbedingt erfüllen kann.',                             en:'I sometimes set standards that I myself cannot necessarily meet.',                                          trap:true },
            { id:'q12', de:'Es gelingt mir nicht immer, meine Absichten konsequent in Handlungen zu überführen.',                     en:"I don't always manage to consistently translate my intentions into actions.",                              trap:true },
            { id:'q13', de:'Ich könnte mir noch mehr Zeit nehmen, um mich aktiv für die Anliegen meines Teams oder einzelner Teammitglieder einzusetzen.', en:'I could take more time to actively support the concerns of my team or individual team members.',          trap:true },
            { id:'q14', de:'In kontroversen oder komplexen Gesprächs- und Entscheidungssituationen erlebe ich mich teilweise nicht souverän genug.', en:'In controversial or complex discussions and decision-making situations, I sometimes feel not confident enough.', trap:true },
            { id:'q15', de:'Ich sollte meine Meinung und Prioritäten weniger häufig wechseln, damit sich andere besser an mir orientieren können.', en:'I should change my opinion and priorities less frequently to be more of a reference point for others.',  trap:true },
          ]
        }
      ]
    },
    {
      id: 'orientierung',
      de: 'Orientierung schaffen',
      en: 'Providing Guidance',
      color: '#bebec8',
      subsections: [
        {
          id: 'ausrichtung',
          de: 'Ausrichtung entwickeln',
          en: 'Developing Alignment',
          trap: false,
          questions: [
            { id:'q16', de:'Ich informiere mich über wesentliche Entwicklungen in meinem Fachgebiet und antizipiere zukunftsrelevante Themen.',          en:'I keep myself informed about important developments in my field and anticipate future-relevant topics.',       trap:false },
            { id:'q17', de:'Ich erkenne frühzeitig relevante Entwicklungen und richte Forschung, Lehre bzw. die eigene Einheit vorausschauend darauf aus.', en:'I recognize relevant developments early and proactively align my research, teaching, and unit with them.',     trap:false },
            { id:'q18', de:'Ich gestalte Strategieumsetzung als dialogischen Prozess unter Einbezug der Mitarbeitenden.',                                en:'I design strategy implementation as a dialogical process involving employees.',                               trap:false },
            { id:'q19', de:'Ich nutze diverse Austauschformate, um die Strategie kontinuierlich anzupassen und weiterzuentwickeln.',                      en:'I use various exchange formats to continuously adapt and further develop the strategy.',                      trap:false },
          ]
        },
        {
          id: 'zukunft',
          de: 'Zukunftsperspektiven formulieren',
          en: 'Formulating Future Prospects',
          trap: false,
          questions: [
            { id:'q20', de:'Ich erläutere dem Team meine Zukunftsvorstellungen und welchen Beitrag das Team dazu leisten kann.',                          en:'I set out my vision for the future comprehensively, and guide the team to contribute to it.',                   trap:false },
            { id:'q21', de:'Ich entwickle im Austausch mit Partner*innen, Entscheider*innen, Gremien und relevanten Stakeholdern strategische Schwerpunkte und zeige auf, wie wir dorthin gelangen können.', en:'I develop strategic priorities in consultation with partners, decision-makers, and stakeholders.',              trap:false },
            { id:'q22', de:'Ich schaffe Transparenz über Ziele, Gestaltungsspielräume und individuelle Verantwortungsbereiche und kommuniziere diese adressatengerecht.', en:'I ensure transparency about goals, scope of action, and individual responsibilities.',                          trap:false },
          ]
        },
        {
          id: 'innovation',
          de: 'Innovation vorantreiben',
          en: 'Driving Innovation',
          trap: false,
          questions: [
            { id:'q23', de:'Ich hinterfrage bestehende Handlungsweisen, Prozesse und Abläufe, um Verbesserungen anzustossen.',                            en:'I challenge existing practices and processes to initiate improvements.',                                       trap:false },
            { id:'q24', de:'Ich treibe Innovationen und Neuerungen aktiv voran.',                                                                        en:'I actively drive innovation and change.',                                                                    trap:false },
            { id:'q25', de:'Ich fördere eine innovationsoffene Diskussionskultur und fordere Mitarbeitende auf, selbst Ideen einzubringen.',              en:'I promote a culture open to innovation and encourage employees to contribute ideas.',                         trap:false },
          ]
        },
        {
          id: 'fallen2',
          de: 'Check: Führungsfallen',
          en: 'Check: Leadership Pitfalls',
          trap: true,
          questions: [
            { id:'q26', de:'Ich bin oft so stark im Tagesgeschäft eingebunden, dass mir zu wenig Zeit für strategische Weiterentwicklung bleibt.',       en:'I am often heavily involved in daily operations, leaving limited time for strategic development.',             trap:true },
            { id:'q27', de:'Ich habe viele Ideen, setze jedoch wesentlich weniger um, als ich mir vorgenommen habe.',                                    en:'Although I generate many ideas, I am implementing considerably fewer than I had planned.',                   trap:true },
            { id:'q28', de:'Manchmal habe ich den Eindruck, dass ich die Umsetzung von Neuerungen durch unrealistische Planung und/oder mangelnde Beteiligung relevanter Personen erschwere.', en:'Sometimes I feel I make it difficult to implement innovations due to unrealistic planning or insufficient stakeholder involvement.', trap:true },
          ]
        }
      ]
    },
    {
      id: 'steuern',
      de: 'Wirksam steuern',
      en: 'Managing Effectively',
      color: '#006f6f',
      subsections: [
        {
          id: 'verantwortung',
          de: 'Verantwortlichkeit stärken',
          en: 'Strengthening Accountability',
          trap: false,
          questions: [
            { id:'q29', de:'Ich delegiere Aufgaben und die dazugehörigen Kompetenzen klar und ergebnisorientiert.',                   en:'I delegate tasks clearly and in a result-oriented manner.',                                                trap:false },
            { id:'q30', de:'Ich unterstütze meine Mitarbeitenden darin, Probleme und Hindernisse selbständig zu bewältigen.',         en:'I support my employees in independently dealing with problems and obstacles.',                             trap:false },
            { id:'q31', de:'Ich treffe fundierte Entscheidungen hinsichtlich alltäglicher Sachfragen und Probleme.',                  en:'I make informed decisions regarding everyday issues and problems.',                                        trap:false },
          ]
        },
        {
          id: 'ziele',
          de: 'Ziele und Aufgaben vereinbaren',
          en: 'Agreeing on Goals and Tasks',
          trap: false,
          questions: [
            { id:'q32', de:'Ich kläre eindeutig, wer für welche Aufgaben verantwortlich ist.',                                        en:'I clearly define who is responsible for each task.',                                                        trap:false },
            { id:'q33', de:'Ich vereinbare Ziele und Qualitätsstandards, die zwar herausfordernd, jedoch realistisch erreichbar sind.', en:'I agree on goals and quality standards that are challenging but realistically achievable.',                  trap:false },
            { id:'q34', de:'Ich fördere ein Klima, in dem Eigeninitiative geschätzt und (Team-)Leistungen anerkannt werden.',         en:'I promote a culture that values and recognizes team achievements.',                                        trap:false },
          ]
        },
        {
          id: 'ergebnisse',
          de: 'Ergebnisse bewerten',
          en: 'Evaluating Results',
          trap: false,
          questions: [
            { id:'q35', de:'Ich bespreche die Leistungen, Beiträge und Ergebnisse von Teammitgliedern individuell und gebe wertschätzendes und unterstützendes Feedback.', en:'I discuss each team member\'s performance individually and provide appreciative feedback.',                   trap:false },
            { id:'q36', de:'Ich mache Mitarbeitende auf Verbesserungspotenziale aufmerksam, damit Anforderungen erfüllt werden können.', en:'I draw employees\' attention to areas for improvement to ensure requirements are met.',                        trap:false },
            { id:'q37', de:'Ich nutze individuelle und Gruppengespräche, um Fortschritte regelmässig zu reflektieren und sichtbar zu machen.', en:'I use individual and group discussions to regularly reflect on and make progress visible.',                    trap:false },
          ]
        },
        {
          id: 'fallen3',
          de: 'Check: Führungsfallen',
          en: 'Check: Leadership Pitfalls',
          trap: true,
          questions: [
            { id:'q38', de:'Ich könnte bei der Beurteilung von Leistung neben den Ergebnissen die Kontextfaktoren noch besser berücksichtigen.', en:'When assessing performance, I could more adequately account for contextual factors.',                         trap:true },
            { id:'q39', de:'Ich könnte noch konsequenter konkretes Feedback zu Zielen, Fortschritten und zur Qualität der Arbeit geben.',        en:'I could be even more consistent in giving specific feedback on goals, progress, and work quality.',             trap:true },
            { id:'q40', de:'Ich könnte Rollen, Zuständigkeiten und Abläufe im Team klarer definieren und abstimmen.',                           en:'I could define and coordinate roles, responsibilities, and processes within the team more clearly.',            trap:true },
            { id:'q41', de:'Teilweise passiert es mir, dass ich wichtige Entscheidungen verzögere und damit Vorhaben blockiere.',                en:'Sometimes I accidentally delay important decisions, thereby blocking projects.',                               trap:true },
            { id:'q42', de:'Teilweise neige ich zu Mikromanagement.',                                                                           en:'I sometimes tend to micromanage.',                                                                           trap:true },
          ]
        }
      ]
    },
    {
      id: 'entwickeln',
      de: 'Mitarbeitende und Teams entwickeln',
      en: 'Developing Employees and Teams',
      color: '#eb829b',
      subsections: [
        {
          id: 'empowerment',
          de: 'Empowerment stärken',
          en: 'Promoting Empowerment',
          trap: false,
          questions: [
            { id:'q43', de:'Ich fördere eigenverantwortliches Arbeiten meiner Mitarbeitenden.',                                        en:'I encourage independent work among my team.',                                                              trap:false },
            { id:'q44', de:'Ich übertrage neue Aufgaben und Verantwortung gemäss bestehender oder weiterzuentwickelnder Kompetenzen.', en:'I assign new tasks and responsibilities in line with existing or developing skills.',                       trap:false },
            { id:'q45', de:'Ich gewähre meinen Mitarbeitenden Handlungsspielräume, damit sie eigene Entscheidungen treffen können.',   en:'I give my employees license to make their own decisions.',                                                 trap:false },
          ]
        },
        {
          id: 'coaching',
          de: 'Mitarbeitende coachen',
          en: 'Coaching Employees',
          trap: false,
          questions: [
            { id:'q46', de:'Ich rege meine Mitarbeitenden dazu an, Neues zu lernen und Wissen zu teilen.',                            en:'I encourage my employees to learn new skills and share their knowledge.',                                   trap:false },
            { id:'q47', de:'Ich unterstütze meine Mitarbeitenden dabei, eigene Entwicklungsfelder zu erkennen und sich weiterzubilden.', en:'I support my employees in identifying areas for personal development.',                                       trap:false },
            { id:'q48', de:'Ich führe regelmässig Gespräche mit meinen Mitarbeitenden, in denen ich Entwicklung und Lernen thematisiere.', en:'I hold regular meetings with my employees to discuss development and learning.',                             trap:false },
          ]
        },
        {
          id: 'foerderung',
          de: 'Entwicklungen fördern',
          en: 'Promoting Development',
          trap: false,
          questions: [
            { id:'q49', de:'Ich gebe konstruktives Feedback zu Stärken und Entwicklungsfeldern.',                                     en:'I provide constructive feedback on strengths and areas for development.',                                   trap:false },
            { id:'q50', de:'Ich ermögliche Formate für gemeinsames Lernen und Austausch im Team.',                                    en:'I facilitate formats for joint learning and exchange within the team.',                                    trap:false },
            { id:'q51', de:'Ich unterstütze Mitarbeitende gezielt hinsichtlich ihrer beruflichen Entscheidungen.',                    en:'I provide targeted support to employees regarding their career decisions.',                                 trap:false },
          ]
        },
        {
          id: 'empathie',
          de: 'Empathie zeigen',
          en: 'Showing Empathy',
          trap: false,
          questions: [
            { id:'q52', de:'Ich kann mich in die Sichtweise verschiedener Personen gut hineinversetzen.',                             en:'I can easily put myself in other people\'s shoes.',                                                        trap:false },
            { id:'q53', de:'Ich interessiere mich für die Bedürfnisse und Ziele meiner Mitarbeitenden.',                              en:'I am interested in the needs and goals of my employees.',                                                  trap:false },
            { id:'q54', de:'Ich berücksichtige die Individualität meiner Mitarbeitenden bei Entscheidungen.',                         en:'I take the individuality of my employees into account when making decisions.',                               trap:false },
          ]
        },
        {
          id: 'fallen4',
          de: 'Check: Führungsfallen',
          en: 'Check: Leadership Pitfalls',
          trap: true,
          questions: [
            { id:'q55', de:'Ich könnte anfallende Zusatzaufgaben noch fairer im Team verteilen.',                                     en:'I could assign additional tasks more fairly among the team members.',                                      trap:true },
            { id:'q56', de:'Ich könnte noch mehr Zeit auf die Entwicklung meines Teams verwenden.',                                   en:'I could spend more time on the development of my team.',                                                  trap:true },
            { id:'q57', de:'Ich könnte dysfunktionale Teamdynamiken (z.B. Konflikte, Verantwortungsdiffusion) schneller angehen.',    en:'I could address dysfunctional team dynamics more quickly.',                                                trap:true },
            { id:'q58', de:'Ich könnte insgesamt für mein Team präsenter sein.',                                                      en:'Overall, I could be more present for my team.',                                                           trap:true },
          ]
        }
      ]
    },
    {
      id: 'arbeitsumfeld',
      de: 'Arbeitsumfeld gestalten',
      en: 'Shaping the Work Environment',
      color: '#1EA5A5',
      subsections: [
        {
          id: 'kommunikation',
          de: 'Effektiv kommunizieren',
          en: 'Communicating Effectively',
          trap: false,
          questions: [
            { id:'q59', de:'Ich vermittle zeitnah die Informationen an Mitarbeitende, die diese zur Erledigung ihrer Aufgaben benötigen.', en:'I promptly pass on information to employees so they can deliver their tasks.',                               trap:false },
            { id:'q60', de:'Ich nutze adäquate Kommunikationskanäle, um Austausch und fundierte Entscheidungen zu fördern.',           en:'I use appropriate communication channels to promote exchange and informed decisions.',                      trap:false },
            { id:'q61', de:'Ich bin in der Lage, Kommunikationsprozesse (wie z.B. Besprechungen, Workshops) effektiv zu gestalten.',  en:'I am able to design communication processes (meetings, workshops, etc.) effectively.',                       trap:false },
          ]
        },
        {
          id: 'ressourcen',
          de: 'Ressourcen managen',
          en: 'Managing Resources',
          trap: false,
          questions: [
            { id:'q62', de:'Ich stelle die notwendigen Ressourcen (z.B. Personal, IT-Systeme, Finanzierung etc.) bereit.',            en:'I provide the resources necessary for my team\'s success.',                                                trap:false },
            { id:'q63', de:'Ich schaffe klare Strukturen und Rahmenbedingungen für Projekte und Vorhaben.',                           en:'I create clear structures and framework conditions for projects and initiatives.',                          trap:false },
            { id:'q64', de:'Ich erkenne Engpässe und Überbelastungen frühzeitig und sorge rechtzeitig für Entlastung.',               en:'I identify bottlenecks and constraints early and provide timely relief.',                                    trap:false },
          ]
        },
        {
          id: 'konflikte',
          de: 'Konflikte handhaben',
          en: 'Managing Conflicts',
          trap: false,
          questions: [
            { id:'q65', de:'Ich erkenne Konflikte und Spannungen frühzeitig und greife diese aktiv auf.',                             en:'I spot conflicts and tensions early on and actively address them.',                                        trap:false },
            { id:'q66', de:'Ich höre in Konfliktsituationen alle Beteiligten und unterstütze bei der Klärung.',                       en:'In conflict situations, I listen to all parties involved and help to resolve issues.',                     trap:false },
            { id:'q67', de:'Ich bin in der Lage, bei Eskalationen einzugreifen und inakzeptables Verhalten angemessen zu adressieren.', en:'I can intervene in escalations and address unacceptable behavior swiftly.',                                  trap:false },
          ]
        },
        {
          id: 'veraenderung',
          de: 'Veränderungen umsetzen',
          en: 'Implementing Change',
          trap: false,
          questions: [
            { id:'q68', de:'Ich beziehe Betroffene aktiv in die Umsetzung von Veränderungsprozessen mit ein.',                        en:'I actively involve stakeholders in the implementation of change processes.',                                trap:false },
            { id:'q69', de:'Ich verdeutliche die Hintergründe und Notwendigkeiten von Veränderungen.',                               en:'I provide background information and show the necessity of changes.',                                       trap:false },
            { id:'q70', de:'Ich sorge bei einem Veränderungsprozess für eine nachvollziehbare Umsetzungsplanung.',                    en:'I plan implementation clearly and manage projects effectively during change processes.',                     trap:false },
          ]
        },
        {
          id: 'beziehungen',
          de: 'Arbeitsbeziehungen gestalten',
          en: 'Shaping Working Relationships',
          trap: false,
          questions: [
            { id:'q71', de:'Ich verstehe es, mit unterschiedlichen Personen und Einheiten effektiv zusammenzuarbeiten.',              en:'I know how to collaborate effectively with different people and units.',                                    trap:false },
            { id:'q72', de:'Ich fördere aktiv die vertrauensvolle Zusammenarbeit mit und zwischen den Teammitgliedern.',              en:'I actively promote trusting collaboration with and among team members.',                                   trap:false },
            { id:'q73', de:'Ich kümmere mich um die Pflege und den kontinuierlichen Ausbau meiner fachlichen und institutionellen Kontakte.', en:'I maintain and continuously expand my professional and institutional contacts.',                            trap:false },
          ]
        },
        {
          id: 'fallen5',
          de: 'Check: Führungsfallen',
          en: 'Check: Leadership Pitfalls',
          trap: true,
          questions: [
            { id:'q74', de:'Ich kommuniziere nicht immer klar oder früh genug.',                                                      en:'I do not always communicate clearly or early enough.',                                                    trap:true },
            { id:'q75', de:'Ich sollte nicht erst eingreifen, wenn Probleme ein kritisches Ausmass erreicht haben.',                  en:'I should not wait until problems have reached a critical level before intervening.',                       trap:true },
            { id:'q76', de:'Ich könnte mich noch mehr für unsere finanzielle und/oder personelle Ausstattung einsetzen.',             en:'I could advocate more strongly for our financial and/or personnel resources.',                             trap:true },
            { id:'q77', de:'Ich könnte Veränderungsprozesse noch proaktiver steuern.',                                                en:'I could manage change processes more proactively.',                                                        trap:true },
          ]
        }
      ]
    }
  ],

  // ── OPEN REFLECTION QUESTIONS ─────────────────────────────────
  selfReflection: [
    { id:'sr1', de:'Was sind meine grössten Führungsstärken?',              en:'What are my greatest leadership strengths?' },
    { id:'sr2', de:'Wo sehe ich für mich persönlich Entwicklungsbedarf?',   en:'Where do I personally see a need for development?' },
    { id:'sr3', de:'Was möchte ich in meiner Führungsrolle mehr tun?',      en:'What would I like to do more of in my leadership role?' },
    { id:'sr4', de:'Was möchte ich weniger tun oder ganz darauf verzichten?', en:'What would I like to do less or stop doing entirely?' },
  ],

  fremdReflection: [
    { id:'fr1', de:'Was schätzen Sie am Führungsstil dieser Person?',        en:'What do you appreciate about this person\'s leadership style?' },
    { id:'fr2', de:'In welchen Bereichen sehen Sie Entwicklungsbedarf?',     en:'In which areas do you see a need for development?' },
    { id:'fr3', de:'Was sollte diese Führungskraft mehr tun?',               en:'What should this leader do more of?' },
    { id:'fr4', de:'Was sollte diese Führungskraft weniger tun?',            en:'What should this leader do less of?' },
  ],

  // ── HELPER: convert question text to Fremdbild (3rd person) ──
  toFremd(text) {
    return text
      .replace(/^Ich kann /,    'Diese Führungsperson kann ')
      .replace(/^Ich stärke /,  'Diese Führungsperson stärkt ')
      .replace(/^Ich ermutige /,'Diese Führungsperson ermutigt ')
      .replace(/^Ich kommuniziere /, 'Diese Führungsperson kommuniziert ')
      .replace(/^Ich setze /,   'Diese Führungsperson setzt ')
      .replace(/^Ich übernehme /, 'Diese Führungsperson übernimmt ')
      .replace(/^Ich zeige /,   'Diese Führungsperson zeigt ')
      .replace(/^Im Spannungsfeld/, 'Im Spannungsfeld')
      .replace(/^Ich bleibe /,  'Diese Führungsperson bleibt ')
      .replace(/^Ich beziehe /,'Diese Führungsperson bezieht ')
      .replace(/^Ich informiere mich /, 'Diese Führungsperson informiert sich ')
      .replace(/^Ich erkenne /, 'Diese Führungsperson erkennt ')
      .replace(/^Ich gestalte /, 'Diese Führungsperson gestaltet ')
      .replace(/^Ich nutze /,   'Diese Führungsperson nutzt ')
      .replace(/^Ich erläutere /, 'Diese Führungsperson erläutert ')
      .replace(/^Ich entwickle /, 'Diese Führungsperson entwickelt ')
      .replace(/^Ich schaffe /,'Diese Führungsperson schafft ')
      .replace(/^Ich hinterfrage /, 'Diese Führungsperson hinterfragt ')
      .replace(/^Ich treibe /,  'Diese Führungsperson treibt ')
      .replace(/^Ich fördere /,'Diese Führungsperson fördert ')
      .replace(/^Ich delegiere /, 'Diese Führungsperson delegiert ')
      .replace(/^Ich unterstütze /, 'Diese Führungsperson unterstützt ')
      .replace(/^Ich treffe /,  'Diese Führungsperson trifft ')
      .replace(/^Ich kläre /,  'Diese Führungsperson klärt ')
      .replace(/^Ich vereinbare /, 'Diese Führungsperson vereinbart ')
      .replace(/^Ich bespreche /, 'Diese Führungsperson bespricht ')
      .replace(/^Ich mache /,  'Diese Führungsperson macht ')
      .replace(/^Ich rege /,   'Diese Führungsperson regt ')
      .replace(/^Ich führe /,  'Diese Führungsperson führt ')
      .replace(/^Ich gebe /,   'Diese Führungsperson gibt ')
      .replace(/^Ich ermögliche /, 'Diese Führungsperson ermöglicht ')
      .replace(/^Ich vermittle /, 'Diese Führungsperson vermittelt ')
      .replace(/^Ich bin /,    'Diese Führungsperson ist ')
      .replace(/^Ich stelle /,'Diese Führungsperson stellt ')
      .replace(/^Ich höre /,   'Diese Führungsperson hört ')
      .replace(/^Ich verstehe /, 'Diese Führungsperson versteht ')
      .replace(/^Ich kümmere /, 'Diese Führungsperson kümmert ')
      .replace(/\bmeinen Mitarbeitenden\b/g, 'ihren Mitarbeitenden')
      .replace(/\bmeine Mitarbeitenden\b/g, 'ihre Mitarbeitenden')
      .replace(/\bmeinem Team\b/g, 'ihrem Team')
      .replace(/\bmein Team\b/g, 'ihr Team')
      .replace(/\bmeiner Führungsrolle\b/g, 'ihrer Führungsrolle')
      .replace(/\bmeines Teams\b/g, 'ihres Teams')
      .replace(/\bmeinem Fachgebiet\b/g, 'ihrem Fachgebiet')
      .replace(/\bich selbst\b/g, 'sie selbst')
      .replace(/\bich\b/g, 'sie');
  },

  // ── SCORING ────────────────────────────────────────────────────
  calcSubsectionAvg(answers, subsection) {
    const vals = subsection.questions
      .map(q => answers[q.id])
      .filter(v => v !== null && v !== undefined);
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  },

  calcSectionAvg(answers, section) {
    const avgs = section.subsections
      .filter(ss => !ss.trap)
      .map(ss => this.calcSubsectionAvg(answers, ss))
      .filter(v => v !== null);
    if (!avgs.length) return null;
    return avgs.reduce((a, b) => a + b, 0) / avgs.length;
  },

  // ── STORAGE ────────────────────────────────────────────────────
  STORE_KEY: 'cmt360_cases',

  getCases() {
    try { return JSON.parse(localStorage.getItem(this.STORE_KEY) || '[]'); }
    catch { return []; }
  },

  saveCases(cases) {
    localStorage.setItem(this.STORE_KEY, JSON.stringify(cases));
  },

  getCase(id) {
    return this.getCases().find(c => c.id === id) || null;
  },

  saveCase(caseData) {
    const cases = this.getCases();
    const idx = cases.findIndex(c => c.id === caseData.id);
    if (idx >= 0) cases[idx] = caseData;
    else cases.push(caseData);
    this.saveCases(cases);
  },

  newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  },

  newToken() {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
  }
};
