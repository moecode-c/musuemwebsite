const buildPagination = (page, totalPages, baseUrl) => {
  let html = "<div class='pagination'>";
  for (let i = 1; i <= totalPages; i += 1) {
    const active = i === page ? "active" : "";
    html += `<a class='page-link ${active}' href='${baseUrl}?page=${i}'>${i}</a>`;
  }
  html += "</div>";
  return html;
};

module.exports = { buildPagination };
