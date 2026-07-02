export function normalizeUser(row) {
  return {
    id:                row.user_document_number,
    name:              row.user_name              || "",
    email:             row.user_email             || "",
    emailInstitutional: row.user_email_institutional || "",
    phone:             row.user_phone             || "",
    secondaryPhone:    row.user_secondary_phone   || "",
    documentType:      row.user_document_type     || "",
    document:          row.user_document_number   || "",
    address:           row.user_address           || "",
    group:             row.user_group             || "",
    image:             row.user_image             || null,
    enabled:           row.enabled               ?? true,
    startDate:         row.start_date
      ? new Date(row.start_date).toISOString().split("T")[0]
      : null,
    endDate:           row.end_date
      ? new Date(row.end_date).toISOString().split("T")[0]
      : null,
  };
}

export function normalizeUsers(rows) {
  return rows.map(normalizeUser);
}
