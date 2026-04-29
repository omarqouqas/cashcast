export type SignatureTemplate = 'minimal' | 'professional' | 'with-photo' | 'modern-card';

export interface SignatureData {
  fullName: string;
  jobTitle: string;
  email: string;
  company?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  photoUrl?: string;
  address?: string;
}

const COLORS = {
  text: '#1a1a1a',
  muted: '#666666',
  link: '#0d9488',
  border: '#e5e5e5',
  cardBg: '#f9fafb',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
}

function formatLinkedIn(value: string): string {
  if (!value) return '';
  if (value.startsWith('http')) return value;
  if (value.startsWith('linkedin.com')) return `https://${value}`;
  if (value.startsWith('/in/')) return `https://linkedin.com${value}`;
  return `https://linkedin.com/in/${value.replace('@', '')}`;
}

function formatTwitter(value: string): string {
  if (!value) return '';
  const handle = value.replace('@', '').replace('https://twitter.com/', '').replace('https://x.com/', '');
  return `https://x.com/${handle}`;
}

function getDisplayDomain(url: string): string {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

// Minimal template - clean and simple
function generateMinimalHTML(data: SignatureData): string {
  const contactParts: string[] = [];
  if (data.email) {
    contactParts.push(`<a href="mailto:${escapeHtml(data.email)}" style="color: ${COLORS.link}; text-decoration: none;">${escapeHtml(data.email)}</a>`);
  }
  if (data.phone) {
    contactParts.push(`<a href="tel:${escapeHtml(data.phone.replace(/\s/g, ''))}" style="color: ${COLORS.text}; text-decoration: none;">${escapeHtml(data.phone)}</a>`);
  }

  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4;">
  <tr>
    <td style="padding-bottom: 4px;">
      <strong style="font-size: 16px; color: ${COLORS.text};">${escapeHtml(data.fullName)}</strong>
    </td>
  </tr>
  <tr>
    <td style="color: ${COLORS.muted}; padding-bottom: 8px;">
      ${escapeHtml(data.jobTitle)}${data.company ? ` | ${escapeHtml(data.company)}` : ''}
    </td>
  </tr>
  ${contactParts.length > 0 ? `
  <tr>
    <td style="color: ${COLORS.text};">
      ${contactParts.join(' | ')}
    </td>
  </tr>
  ` : ''}
  ${data.website ? `
  <tr>
    <td style="padding-top: 4px;">
      <a href="${formatUrl(data.website)}" style="color: ${COLORS.link}; text-decoration: none;">${getDisplayDomain(data.website)}</a>
    </td>
  </tr>
  ` : ''}
</table>
`.trim();
}

// Professional template - with separators and icons
function generateProfessionalHTML(data: SignatureData): string {
  const contactRows: string[] = [];

  if (data.email) {
    contactRows.push(`
      <tr>
        <td style="padding: 2px 0; color: ${COLORS.text}; font-size: 13px;">
          <span style="color: ${COLORS.muted};">Email:</span> <a href="mailto:${escapeHtml(data.email)}" style="color: ${COLORS.link}; text-decoration: none;">${escapeHtml(data.email)}</a>
        </td>
      </tr>
    `);
  }

  if (data.phone) {
    contactRows.push(`
      <tr>
        <td style="padding: 2px 0; color: ${COLORS.text}; font-size: 13px;">
          <span style="color: ${COLORS.muted};">Phone:</span> <a href="tel:${escapeHtml(data.phone.replace(/\s/g, ''))}" style="color: ${COLORS.text}; text-decoration: none;">${escapeHtml(data.phone)}</a>
        </td>
      </tr>
    `);
  }

  if (data.website) {
    contactRows.push(`
      <tr>
        <td style="padding: 2px 0; color: ${COLORS.text}; font-size: 13px;">
          <span style="color: ${COLORS.muted};">Web:</span> <a href="${formatUrl(data.website)}" style="color: ${COLORS.link}; text-decoration: none;">${getDisplayDomain(data.website)}</a>
        </td>
      </tr>
    `);
  }

  const socialLinks: string[] = [];
  if (data.linkedin) {
    socialLinks.push(`<a href="${formatLinkedIn(data.linkedin)}" style="color: ${COLORS.link}; text-decoration: none;">LinkedIn</a>`);
  }
  if (data.twitter) {
    socialLinks.push(`<a href="${formatTwitter(data.twitter)}" style="color: ${COLORS.link}; text-decoration: none;">X/Twitter</a>`);
  }

  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
  <tr>
    <td style="border-bottom: 2px solid ${COLORS.link}; padding-bottom: 8px;">
      <strong style="font-size: 18px; color: ${COLORS.text};">${escapeHtml(data.fullName)}</strong>
    </td>
  </tr>
  <tr>
    <td style="padding-top: 8px; padding-bottom: 8px; color: ${COLORS.muted}; font-size: 14px;">
      ${escapeHtml(data.jobTitle)}${data.company ? ` <span style="color: ${COLORS.border};">|</span> ${escapeHtml(data.company)}` : ''}
    </td>
  </tr>
  ${contactRows.length > 0 ? `
  <tr>
    <td style="padding-top: 4px;">
      <table cellpadding="0" cellspacing="0" border="0">
        ${contactRows.join('')}
      </table>
    </td>
  </tr>
  ` : ''}
  ${socialLinks.length > 0 ? `
  <tr>
    <td style="padding-top: 8px; font-size: 13px;">
      ${socialLinks.join(' <span style="color: ${COLORS.border};">•</span> ')}
    </td>
  </tr>
  ` : ''}
  ${data.address ? `
  <tr>
    <td style="padding-top: 8px; color: ${COLORS.muted}; font-size: 12px;">
      ${escapeHtml(data.address)}
    </td>
  </tr>
  ` : ''}
</table>
`.trim();
}

// With Photo template - photo on left, details on right
function generateWithPhotoHTML(data: SignatureData): string {
  const contactLines: string[] = [];

  if (data.email) {
    contactLines.push(`<a href="mailto:${escapeHtml(data.email)}" style="color: ${COLORS.link}; text-decoration: none; font-size: 13px;">${escapeHtml(data.email)}</a>`);
  }
  if (data.phone) {
    contactLines.push(`<a href="tel:${escapeHtml(data.phone.replace(/\s/g, ''))}" style="color: ${COLORS.text}; text-decoration: none; font-size: 13px;">${escapeHtml(data.phone)}</a>`);
  }
  if (data.website) {
    contactLines.push(`<a href="${formatUrl(data.website)}" style="color: ${COLORS.link}; text-decoration: none; font-size: 13px;">${getDisplayDomain(data.website)}</a>`);
  }

  const socialLinks: string[] = [];
  if (data.linkedin) {
    socialLinks.push(`<a href="${formatLinkedIn(data.linkedin)}" style="color: ${COLORS.link}; text-decoration: none; font-size: 12px;">LinkedIn</a>`);
  }
  if (data.twitter) {
    socialLinks.push(`<a href="${formatTwitter(data.twitter)}" style="color: ${COLORS.link}; text-decoration: none; font-size: 12px;">X/Twitter</a>`);
  }

  const photoCell = data.photoUrl
    ? `<td style="vertical-align: top; padding-right: 16px;">
        <img src="${escapeHtml(data.photoUrl)}" alt="${escapeHtml(data.fullName)}" width="80" height="80" style="border-radius: 50%; display: block;" />
      </td>`
    : `<td style="vertical-align: top; padding-right: 16px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background-color: ${COLORS.link}; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 28px; font-weight: bold;">${escapeHtml(data.fullName.charAt(0).toUpperCase())}</span>
        </div>
      </td>`;

  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
  <tr>
    ${photoCell}
    <td style="vertical-align: top;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-bottom: 2px;">
            <strong style="font-size: 16px; color: ${COLORS.text};">${escapeHtml(data.fullName)}</strong>
          </td>
        </tr>
        <tr>
          <td style="color: ${COLORS.muted}; padding-bottom: 8px; font-size: 14px;">
            ${escapeHtml(data.jobTitle)}${data.company ? `<br />${escapeHtml(data.company)}` : ''}
          </td>
        </tr>
        ${contactLines.map(line => `
        <tr>
          <td style="padding: 1px 0;">${line}</td>
        </tr>
        `).join('')}
        ${socialLinks.length > 0 ? `
        <tr>
          <td style="padding-top: 6px;">
            ${socialLinks.join(' <span style="color: ${COLORS.border};">•</span> ')}
          </td>
        </tr>
        ` : ''}
      </table>
    </td>
  </tr>
</table>
`.trim();
}

// Modern Card template - box style with background
function generateModernCardHTML(data: SignatureData): string {
  const contactLines: string[] = [];

  if (data.email) {
    contactLines.push(`<span style="color: ${COLORS.muted};">✉</span> <a href="mailto:${escapeHtml(data.email)}" style="color: ${COLORS.link}; text-decoration: none;">${escapeHtml(data.email)}</a>`);
  }
  if (data.phone) {
    contactLines.push(`<span style="color: ${COLORS.muted};">☎</span> <a href="tel:${escapeHtml(data.phone.replace(/\s/g, ''))}" style="color: ${COLORS.text}; text-decoration: none;">${escapeHtml(data.phone)}</a>`);
  }
  if (data.website) {
    contactLines.push(`<span style="color: ${COLORS.muted};">🔗</span> <a href="${formatUrl(data.website)}" style="color: ${COLORS.link}; text-decoration: none;">${getDisplayDomain(data.website)}</a>`);
  }
  if (data.linkedin) {
    contactLines.push(`<span style="color: ${COLORS.muted};">💼</span> <a href="${formatLinkedIn(data.linkedin)}" style="color: ${COLORS.link}; text-decoration: none;">LinkedIn</a>`);
  }
  if (data.twitter) {
    contactLines.push(`<span style="color: ${COLORS.muted};">𝕏</span> <a href="${formatTwitter(data.twitter)}" style="color: ${COLORS.link}; text-decoration: none;">@${escapeHtml(data.twitter.replace('@', ''))}</a>`);
  }

  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
  <tr>
    <td style="background-color: ${COLORS.cardBg}; border: 1px solid ${COLORS.border}; border-radius: 8px; padding: 16px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-bottom: 4px;">
            <strong style="font-size: 17px; color: ${COLORS.text};">${escapeHtml(data.fullName)}</strong>
          </td>
        </tr>
        <tr>
          <td style="color: ${COLORS.muted}; padding-bottom: 12px; font-size: 14px;">
            ${escapeHtml(data.jobTitle)}${data.company ? ` • ${escapeHtml(data.company)}` : ''}
          </td>
        </tr>
        ${contactLines.map(line => `
        <tr>
          <td style="padding: 3px 0; font-size: 13px;">${line}</td>
        </tr>
        `).join('')}
        ${data.address ? `
        <tr>
          <td style="padding-top: 10px; color: ${COLORS.muted}; font-size: 12px;">
            📍 ${escapeHtml(data.address)}
          </td>
        </tr>
        ` : ''}
      </table>
    </td>
  </tr>
</table>
`.trim();
}

export function generateSignatureHTML(data: SignatureData, template: SignatureTemplate): string {
  switch (template) {
    case 'minimal':
      return generateMinimalHTML(data);
    case 'professional':
      return generateProfessionalHTML(data);
    case 'with-photo':
      return generateWithPhotoHTML(data);
    case 'modern-card':
      return generateModernCardHTML(data);
    default:
      return generateMinimalHTML(data);
  }
}

export function generatePlainText(data: SignatureData, _template: SignatureTemplate): string {
  const lines: string[] = [];

  lines.push(data.fullName);
  lines.push(`${data.jobTitle}${data.company ? ` | ${data.company}` : ''}`);
  lines.push('');

  if (data.email) lines.push(`Email: ${data.email}`);
  if (data.phone) lines.push(`Phone: ${data.phone}`);
  if (data.website) lines.push(`Web: ${getDisplayDomain(data.website)}`);
  if (data.linkedin) lines.push(`LinkedIn: ${formatLinkedIn(data.linkedin)}`);
  if (data.twitter) lines.push(`X/Twitter: ${formatTwitter(data.twitter)}`);
  if (data.address) {
    lines.push('');
    lines.push(data.address);
  }

  return lines.join('\n');
}
