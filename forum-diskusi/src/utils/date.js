function postedAt(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) {
    return 'baru saja';
  }
  if (diffMin < 60) {
    return `${diffMin} menit lalu`;
  }
  if (diffHour < 24) {
    return `${diffHour} jam lalu`;
  }
  if (diffDay < 7) {
    return `${diffDay} hari lalu`;
  }
  if (diffWeek < 5) {
    return `${diffWeek} minggu lalu`;
  }
  if (diffMonth < 12) {
    return `${diffMonth} bulan lalu`;
  }
  return `${diffYear} tahun lalu`;
}

function stripHtml(html = '') {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function truncate(text = '', maxLength = 180) {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}…`;
}

export { postedAt, stripHtml, truncate };
