INSERT INTO public.users (user_email, user_password)
SELECT 'admin@admin.com', '$2b$10$r.zdnMIffDSCNO9dzWPjOO2JCTsxZQRSErcH07zc.al9uQLcxUSOu'
WHERE NOT EXISTS (
    SELECT 1 FROM public.users WHERE user_email = 'admin@admin.com'
);