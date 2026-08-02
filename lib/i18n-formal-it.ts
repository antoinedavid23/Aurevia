const phrases: Array<[RegExp, string]> = [
  [/\bTu decidi\. Noi coordiniamo\./gi, "Lei decide. Noi coordiniamo."],
  [/\bTu parti\b/gi, "Lei parte"],
  [/\bDecidi tu\b/gi, "Decide Lei"],
  [/\bper te\b/gi, "per Lei"],
  [/\bda te\b/gi, "da Lei"],
  [/\bcon te\b/gi, "con Lei"],
  [/\bverso di te\b/gi, "nei Suoi confronti"],
  [/\bAffidaci\b/gi, "Ci affidi"],
  [/\bRaccontaci\b/gi, "Ci racconti"],
  [/\bPresentaci\b/gi, "Ci presenti"],
  [/^Prova il simulatore$/i, "Provi il simulatore"],
  [/^Continua$/i, "Continui"],
  [/\bgoderti la tua proprietà\b/gi, "godersi la Sua proprietà"],
  [/\bNon sei più obbligato a rimanere disponibile\b/gi, "Non deve più restare disponibile"],
  [/\bSei capito senza dover spiegare tutto di nuovo\b/gi, "Le Sue esigenze vengono comprese senza dover spiegare tutto di nuovo"],
  [/\bSei tornato a casa\b/gi, "È di nuovo a casa"],
];

const words: Array<[RegExp, string]> = [
  [/\bi tuoi\b/gi, "i Suoi"], [/\ble tue\b/gi, "le Sue"],
  [/\bil tuo\b/gi, "il Suo"], [/\bla tua\b/gi, "la Sua"],
  [/\btuoi\b/gi, "Suoi"], [/\btue\b/gi, "Sue"], [/\btuo\b/gi, "Suo"], [/\btua\b/gi, "Sua"],
  [/\bTu\b/g, "Lei"], [/\btu\b/g, "Lei"], [/\bti\b/gi, "Le"], [/\bte\b/gi, "Lei"],
  [/\bSei\b/g, "È"], [/\bsei\b/g, "è"], [/\bHai\b/g, "Ha"], [/\bhai\b/g, "ha"],
  [/\bSai\b/g, "Sa"], [/\bsai\b/g, "sa"], [/\bPuoi\b/g, "Può"], [/\bpuoi\b/g, "può"],
  [/\bDevi\b/g, "Deve"], [/\bdevi\b/g, "deve"], [/\bVuoi\b/g, "Desidera"], [/\bvuoi\b/g, "desidera"],
  [/\bScopri\b/g, "Scopra"], [/\bscopri\b/g, "scopra"], [/\bScegli\b/g, "Scelga"], [/\bscegli\b/g, "scelga"],
  [/\bValuta\b/g, "Valuti"], [/\bvaluta\b/g, "valuti"], [/\bRichiedi\b/g, "Richieda"], [/\brichiedi\b/g, "richieda"],
  [/\bEsplora\b/g, "Esplori"], [/\besplora\b/g, "esplori"], [/\bOttieni\b/g, "Ottenga"], [/\bottieni\b/g, "ottenga"],
  [/\bDescrivi\b/g, "Descriva"], [/\bdescrivi\b/g, "descriva"],
  [/\bInvia\b/g, "Invii"], [/\binvia\b/g, "invii"],
  [/\bConsulta\b/g, "Consulti"], [/\bconsulta\b/g, "consulti"], [/\bRicevi\b/g, "Riceva"], [/\bricevi\b/g, "riceva"],
  [/\bTrova\b/g, "Trovi"], [/\btrova\b/g, "trovi"], [/\bMantieni\b/g, "Mantiene"], [/\bmantieni\b/g, "mantiene"],
  [/\bChiudi\b/g, "Chiude"], [/\bchiudi\b/g, "chiude"], [/\bfossi\b/gi, "fosse"],
  [/\bTroverai\b/g, "Troverà"], [/\btroverai\b/g, "troverà"], [/\bDovrai\b/g, "Dovrà"], [/\bdovrai\b/g, "dovrà"],
];

export function formalizeItalian(value: string) {
  return [...phrases, ...words].reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}
