/**
 * Prestigia Internationalization: Google Reviews Localization & Translation Dictionary
 * Allows real-time seamless English rendering of customer reviews and official replies.
 */

export const REVIEW_TRANSLATIONS_EN: Record<string, { text: string; replyText?: string }> = {
  'grev-2': {
    text: 'The ambiance is lovely and the music was good, but we had to wait 25 minutes for our table despite having a reservation.',
  },
  'grev-1': {
    text: 'The Truffle burger was incredible, meat cooked to perfection and the rustic fries were crispy. Great service from Valentina.',
    replyText: 'Thank you so much for your review, Sebastián Restrepo! We are delighted to hear that your experience was so positive and that you enjoyed every single detail. We work passionately every day to deliver memorable moments. It will be an immense honor to welcome you back to La Burguesía Artesanal!',
  },
  'grev-usaquen-today': {
    text: 'Spectacular pulled rib burger and the mezcal cocktail was outstanding. Will definitely return this weekend.',
    replyText: 'Thank you so much Nicolás! We love hearing that you enjoyed the pulled rib burger and mezcal. We look forward to seeing you this weekend with open doors!',
  },
  'grev-3': {
    text: 'The best gastrobar in Usaquén. Signature cocktails are on another level.',
    replyText: 'Thank you so much Daniel! We are thrilled that you enjoyed our signature craft cocktails. It will be a true pleasure welcoming you back to Usaquén soon.',
  },
  'grev-chap-week1': {
    text: 'Excellent service from Camilo in the dining room. The Jack Daniels burger with caramelized onions is a gem.',
    replyText: 'Thank you Carolina! We will pass your compliments along to Camilo. We are glad to hear that you loved the Jack Daniels burger.',
  },
  'grev-chap-week2': {
    text: 'Top spot to celebrate birthdays. Highly recommend the breaded brie appetizers.',
    replyText: 'Happy birthday and thank you Jorge for choosing us to celebrate your special date!',
  },
  'grev-usaquen-week1': {
    text: 'Food 10/10, desserts were delicious. Only suggestion would be to turn down the volume slightly on the second floor.',
    replyText: 'We appreciate your kind words and valuable suggestion Mariana! We will adjust the acoustics on the second floor.',
  },
};

export function getLocalizedReviewText(id: string, originalText: string, lang: 'es' | 'en'): string {
  if (lang === 'en' && REVIEW_TRANSLATIONS_EN[id]?.text) {
    return REVIEW_TRANSLATIONS_EN[id].text;
  }
  return originalText;
}

export function getLocalizedReplyText(id: string, originalReplyText: string | undefined, lang: 'es' | 'en'): string | undefined {
  if (!originalReplyText) return undefined;
  if (lang === 'en' && REVIEW_TRANSLATIONS_EN[id]?.replyText) {
    return REVIEW_TRANSLATIONS_EN[id].replyText;
  }
  return originalReplyText;
}

export function formatBranchName(branchName: string, lang: 'es' | 'en'): string {
  if (lang === 'en') {
    return branchName.replace(/^Sede\s+/i, '') + ' Location';
  }
  return branchName;
}

export function formatRepliedByName(repliedBy: string | undefined, lang: 'es' | 'en'): string {
  if (!repliedBy) return lang === 'en' ? 'Prestigia Team' : 'Equipo Prestigia';
  if (lang === 'en') {
    return repliedBy
      .replace(/\(Encargad[oa]\s+Sede\s+.*?\)/i, '(Branch Manager)')
      .replace(/\(Dueño General\)/i, '(General Owner)')
      .replace(/Gerencia/i, 'Management');
  }
  return repliedBy;
}

export const COMPLAINT_TRANSLATIONS_EN: Record<string, string> = {
  'Pedí la carne tres cuartos y llegó muy asada.': 'I asked for medium-well meat and it arrived well-done.',
  'Mala atencion en la mesa 4 por parte del mesero.': 'Poor service at table 4 from the server.',
  'La salsa estaba fria.': 'The sauce was cold.',
  'La hamburguesa llegó tibia y las papas estaban un poco secas.': 'The burger arrived lukewarm and the fries were a bit dry.',
  'La limonada de coco tardó demasiado en llegar.': 'The coconut lemonade took too long to arrive.',
  'Música demasiado alta, no se podía conversar en la cena familiar.': 'Music was too loud; we could not converse during our family dinner.',
  'Se equivocaron de término en una hamburguesa de la mesa.': 'They got the cooking temperature wrong on a burger at our table.',
  'La hamburguesa llegó tibia y las papas sin sal.': 'The burger arrived lukewarm and the fries had no salt.',
};

export function getLocalizedComplaintText(text: string, lang: 'es' | 'en'): string {
  if (lang === 'en') {
    if (COMPLAINT_TRANSLATIONS_EN[text.trim()]) return COMPLAINT_TRANSLATIONS_EN[text.trim()];
    // Common keyword replacements if partial match
    if (text.includes('hamburguesa') && text.includes('tibia')) {
      return 'The burger arrived lukewarm and the fries were dry.';
    }
    if (text.includes('carne') && text.includes('asada')) {
      return 'The meat doneness did not match my order.';
    }
  }
  return text;
}
