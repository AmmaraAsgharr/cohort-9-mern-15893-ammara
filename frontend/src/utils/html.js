//  utility for text 
export function extractPlainText(html) {
  if (typeof html !== 'string') return '';
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  } catch {
    return html.replace(/<[^>]*>/g, '');
  }
}