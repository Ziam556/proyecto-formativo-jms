import { pool } from "../../config/db.js";

export const userRepository = {

  async create(userData) {

    const {
      userEmail,
      userEmailVerification,
      userEmailInstitutional,
      userPhone,
      userSecondaryPhone,
      userDocumentType,
      userDocumentNumber,
      userType,
      userAddress,
      userPassword,
      startDate,
      endDate,
      userGroup,
      userImage,
    } = userData;

    const query = `
      INSERT INTO public.users (
        user_email,
        user_email_verification,
        user_email_institutional,
        user_phone,
        user_secondary_phone,
        user_document_type,
        user_document_number,
        user_type,
        user_address,
        user_password,
        start_date,
        end_date,
        user_group,
        user_image
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING user_email;
    `;

    const values = [
      userEmail,              // $1
      userEmailVerification,  // $2
      userEmailInstitutional, // $3
      userPhone,              // $4
      userSecondaryPhone,     // $5
      userDocumentType,       // $6
      userDocumentNumber,     // $7
      userType,               // $8
      userAddress,            // $9
      userPassword,           // $10
      startDate,              // $11
      endDate,                // $12
      userGroup,              // $13
      userImage,              // $14
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
  },

};
