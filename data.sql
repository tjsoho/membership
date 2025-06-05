--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

INSERT INTO auth.audit_log_entries VALUES ('00000000-0000-0000-0000-000000000000', '7491fb40-0dff-4db0-873e-8209da6b19e3', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"toby@ai-guy.co","user_id":"7847e168-2085-4df4-ae23-9cdb407c2008","user_phone":""}}', '2025-05-14 11:43:52.117634+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', '7847e168-2085-4df4-ae23-9cdb407c2008', 'authenticated', 'authenticated', 'toby@ai-guy.co', '$2a$10$Mro.hFfpFtdZ6leycz69HOgDDYTXHb3rIXh2hCF2MlO6X6EpvmXQa', '2025-05-14 11:43:52.120621+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-05-14 11:43:51.968187+00', '2025-05-14 11:43:52.121587+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

INSERT INTO auth.identities VALUES ('7847e168-2085-4df4-ae23-9cdb407c2008', '7847e168-2085-4df4-ae23-9cdb407c2008', '{"sub": "7847e168-2085-4df4-ae23-9cdb407c2008", "email": "toby@ai-guy.co", "email_verified": false, "phone_verified": false}', 'email', '2025-05-14 11:43:52.112183+00', '2025-05-14 11:43:52.11225+00', '2025-05-14 11:43:52.11225+00', DEFAULT, '09d8299a-9ce7-4cef-b45f-bd1cf5046b3b');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

INSERT INTO auth.schema_migrations VALUES ('20171026211738');
INSERT INTO auth.schema_migrations VALUES ('20171026211808');
INSERT INTO auth.schema_migrations VALUES ('20171026211834');
INSERT INTO auth.schema_migrations VALUES ('20180103212743');
INSERT INTO auth.schema_migrations VALUES ('20180108183307');
INSERT INTO auth.schema_migrations VALUES ('20180119214651');
INSERT INTO auth.schema_migrations VALUES ('20180125194653');
INSERT INTO auth.schema_migrations VALUES ('00');
INSERT INTO auth.schema_migrations VALUES ('20210710035447');
INSERT INTO auth.schema_migrations VALUES ('20210722035447');
INSERT INTO auth.schema_migrations VALUES ('20210730183235');
INSERT INTO auth.schema_migrations VALUES ('20210909172000');
INSERT INTO auth.schema_migrations VALUES ('20210927181326');
INSERT INTO auth.schema_migrations VALUES ('20211122151130');
INSERT INTO auth.schema_migrations VALUES ('20211124214934');
INSERT INTO auth.schema_migrations VALUES ('20211202183645');
INSERT INTO auth.schema_migrations VALUES ('20220114185221');
INSERT INTO auth.schema_migrations VALUES ('20220114185340');
INSERT INTO auth.schema_migrations VALUES ('20220224000811');
INSERT INTO auth.schema_migrations VALUES ('20220323170000');
INSERT INTO auth.schema_migrations VALUES ('20220429102000');
INSERT INTO auth.schema_migrations VALUES ('20220531120530');
INSERT INTO auth.schema_migrations VALUES ('20220614074223');
INSERT INTO auth.schema_migrations VALUES ('20220811173540');
INSERT INTO auth.schema_migrations VALUES ('20221003041349');
INSERT INTO auth.schema_migrations VALUES ('20221003041400');
INSERT INTO auth.schema_migrations VALUES ('20221011041400');
INSERT INTO auth.schema_migrations VALUES ('20221020193600');
INSERT INTO auth.schema_migrations VALUES ('20221021073300');
INSERT INTO auth.schema_migrations VALUES ('20221021082433');
INSERT INTO auth.schema_migrations VALUES ('20221027105023');
INSERT INTO auth.schema_migrations VALUES ('20221114143122');
INSERT INTO auth.schema_migrations VALUES ('20221114143410');
INSERT INTO auth.schema_migrations VALUES ('20221125140132');
INSERT INTO auth.schema_migrations VALUES ('20221208132122');
INSERT INTO auth.schema_migrations VALUES ('20221215195500');
INSERT INTO auth.schema_migrations VALUES ('20221215195800');
INSERT INTO auth.schema_migrations VALUES ('20221215195900');
INSERT INTO auth.schema_migrations VALUES ('20230116124310');
INSERT INTO auth.schema_migrations VALUES ('20230116124412');
INSERT INTO auth.schema_migrations VALUES ('20230131181311');
INSERT INTO auth.schema_migrations VALUES ('20230322519590');
INSERT INTO auth.schema_migrations VALUES ('20230402418590');
INSERT INTO auth.schema_migrations VALUES ('20230411005111');
INSERT INTO auth.schema_migrations VALUES ('20230508135423');
INSERT INTO auth.schema_migrations VALUES ('20230523124323');
INSERT INTO auth.schema_migrations VALUES ('20230818113222');
INSERT INTO auth.schema_migrations VALUES ('20230914180801');
INSERT INTO auth.schema_migrations VALUES ('20231027141322');
INSERT INTO auth.schema_migrations VALUES ('20231114161723');
INSERT INTO auth.schema_migrations VALUES ('20231117164230');
INSERT INTO auth.schema_migrations VALUES ('20240115144230');
INSERT INTO auth.schema_migrations VALUES ('20240214120130');
INSERT INTO auth.schema_migrations VALUES ('20240306115329');
INSERT INTO auth.schema_migrations VALUES ('20240314092811');
INSERT INTO auth.schema_migrations VALUES ('20240427152123');
INSERT INTO auth.schema_migrations VALUES ('20240612123726');
INSERT INTO auth.schema_migrations VALUES ('20240729123726');
INSERT INTO auth.schema_migrations VALUES ('20240802193726');
INSERT INTO auth.schema_migrations VALUES ('20240806073726');
INSERT INTO auth.schema_migrations VALUES ('20241009103726');


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: -
--



--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Course" VALUES ('save-time-make-money', 'Save Time & Make Money', 'With One Piece Of Content.
Learn this super simple and easy to apply marketing strategy that will help you grow, save time and make money with ease.', 'https://kzljptxwgenuqbbzdbnd.supabase.co/storage/v1/object/public/course-images/course-1738092121542-969717365.jpg', 27, 'prod_RffgcyzA8mj9ys', '2024-12-06 11:21:39.031', '2025-01-28 19:22:06.793', '{"HIghlight for what you will learning hwre"}', '{"Point 1","Point 2","Point 3"}');


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: CourseAccess; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: PasswordResetToken; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Purchase; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: WorkspaceItem; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public._prisma_migrations VALUES ('c3b87049-9614-4df4-8a14-d4971a397059', '09af8c174c6823985bb07f282bc4b6039365a24d41b4107e61df50dfa4c8edc4', '2024-12-06 11:16:52.927941+00', '20241130051650_add_admin_field', NULL, NULL, '2024-12-06 11:16:52.589908+00', 1);
INSERT INTO public._prisma_migrations VALUES ('e9496215-3cf0-438c-83e5-b6de60b0e803', 'a80a747c475a16d39edc8b4671c1596be10d023c9dccd9a62a378fcf25db2894', '2024-12-06 11:16:57.784428+00', '20241206111657_add_workspace_items', NULL, NULL, '2024-12-06 11:16:57.576512+00', 1);
INSERT INTO public._prisma_migrations VALUES ('02eaf89c-61e8-466a-bad3-7e27e8a2a8a8', '10b6daf9cefdb75484e500fc50efec3fdeaa30d25f9d5257f8641a17f4c6b06d', '2024-12-16 10:06:45.618908+00', '20241216100531_add_purchase_source', NULL, NULL, '2024-12-16 10:06:45.459108+00', 1);
INSERT INTO public._prisma_migrations VALUES ('c10fe49b-71fa-4d2c-b819-12c0a23aea78', 'ef1785f038d02028ff80cd82c60d244552f264aebb64697d4798ca3d7106a3f4', '2025-01-12 16:24:52.851522+00', '20250112162451_add_highlights_field', NULL, NULL, '2025-01-12 16:24:52.034611+00', 1);


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

INSERT INTO realtime.schema_migrations VALUES (20211116024918, '2024-11-29 03:08:17');
INSERT INTO realtime.schema_migrations VALUES (20211116045059, '2024-11-29 03:08:18');
INSERT INTO realtime.schema_migrations VALUES (20211116050929, '2024-11-29 03:08:19');
INSERT INTO realtime.schema_migrations VALUES (20211116051442, '2024-11-29 03:08:20');
INSERT INTO realtime.schema_migrations VALUES (20211116212300, '2024-11-29 03:08:22');
INSERT INTO realtime.schema_migrations VALUES (20211116213355, '2024-11-29 03:08:22');
INSERT INTO realtime.schema_migrations VALUES (20211116213934, '2024-11-29 03:08:23');
INSERT INTO realtime.schema_migrations VALUES (20211116214523, '2024-11-29 03:08:25');
INSERT INTO realtime.schema_migrations VALUES (20211122062447, '2024-11-29 03:08:26');
INSERT INTO realtime.schema_migrations VALUES (20211124070109, '2024-11-29 03:08:27');
INSERT INTO realtime.schema_migrations VALUES (20211202204204, '2024-11-29 03:08:27');
INSERT INTO realtime.schema_migrations VALUES (20211202204605, '2024-11-29 03:08:28');
INSERT INTO realtime.schema_migrations VALUES (20211210212804, '2024-11-29 03:08:31');
INSERT INTO realtime.schema_migrations VALUES (20211228014915, '2024-11-29 03:08:32');
INSERT INTO realtime.schema_migrations VALUES (20220107221237, '2024-11-29 03:08:33');
INSERT INTO realtime.schema_migrations VALUES (20220228202821, '2024-11-29 03:08:34');
INSERT INTO realtime.schema_migrations VALUES (20220312004840, '2024-11-29 03:08:35');
INSERT INTO realtime.schema_migrations VALUES (20220603231003, '2024-11-29 03:08:37');
INSERT INTO realtime.schema_migrations VALUES (20220603232444, '2024-11-29 03:08:38');
INSERT INTO realtime.schema_migrations VALUES (20220615214548, '2024-11-29 03:08:39');
INSERT INTO realtime.schema_migrations VALUES (20220712093339, '2024-11-29 03:08:40');
INSERT INTO realtime.schema_migrations VALUES (20220908172859, '2024-11-29 03:08:41');
INSERT INTO realtime.schema_migrations VALUES (20220916233421, '2024-11-29 03:08:42');
INSERT INTO realtime.schema_migrations VALUES (20230119133233, '2024-11-29 03:08:42');
INSERT INTO realtime.schema_migrations VALUES (20230128025114, '2024-11-29 03:08:44');
INSERT INTO realtime.schema_migrations VALUES (20230128025212, '2024-11-29 03:08:45');
INSERT INTO realtime.schema_migrations VALUES (20230227211149, '2024-11-29 03:08:46');
INSERT INTO realtime.schema_migrations VALUES (20230228184745, '2024-11-29 03:08:47');
INSERT INTO realtime.schema_migrations VALUES (20230308225145, '2024-11-29 03:08:48');
INSERT INTO realtime.schema_migrations VALUES (20230328144023, '2024-11-29 03:08:48');
INSERT INTO realtime.schema_migrations VALUES (20231018144023, '2024-11-29 03:08:50');
INSERT INTO realtime.schema_migrations VALUES (20231204144023, '2024-11-29 03:08:51');
INSERT INTO realtime.schema_migrations VALUES (20231204144024, '2024-11-29 03:08:52');
INSERT INTO realtime.schema_migrations VALUES (20231204144025, '2024-11-29 03:08:53');
INSERT INTO realtime.schema_migrations VALUES (20240108234812, '2024-11-29 03:08:54');
INSERT INTO realtime.schema_migrations VALUES (20240109165339, '2024-11-29 03:08:55');
INSERT INTO realtime.schema_migrations VALUES (20240227174441, '2024-11-29 03:08:57');
INSERT INTO realtime.schema_migrations VALUES (20240311171622, '2024-11-29 03:08:58');
INSERT INTO realtime.schema_migrations VALUES (20240321100241, '2024-11-29 03:09:00');
INSERT INTO realtime.schema_migrations VALUES (20240401105812, '2024-11-29 03:09:03');
INSERT INTO realtime.schema_migrations VALUES (20240418121054, '2024-11-29 03:09:04');
INSERT INTO realtime.schema_migrations VALUES (20240523004032, '2024-11-29 03:09:07');
INSERT INTO realtime.schema_migrations VALUES (20240618124746, '2024-11-29 03:09:08');
INSERT INTO realtime.schema_migrations VALUES (20240801235015, '2024-11-29 03:09:09');
INSERT INTO realtime.schema_migrations VALUES (20240805133720, '2024-11-29 03:09:10');
INSERT INTO realtime.schema_migrations VALUES (20240827160934, '2024-11-29 03:09:11');
INSERT INTO realtime.schema_migrations VALUES (20240919163303, '2024-11-29 03:09:12');
INSERT INTO realtime.schema_migrations VALUES (20240919163305, '2024-11-29 03:09:13');
INSERT INTO realtime.schema_migrations VALUES (20241019105805, '2024-11-29 03:09:14');
INSERT INTO realtime.schema_migrations VALUES (20241030150047, '2024-11-29 03:09:18');
INSERT INTO realtime.schema_migrations VALUES (20241108114728, '2024-11-29 03:09:19');
INSERT INTO realtime.schema_migrations VALUES (20241121104152, '2024-11-29 03:09:20');
INSERT INTO realtime.schema_migrations VALUES (20241130184212, '2024-12-20 03:27:18');
INSERT INTO realtime.schema_migrations VALUES (20241220035512, '2025-01-09 06:22:05');
INSERT INTO realtime.schema_migrations VALUES (20241220123912, '2025-01-09 06:22:06');
INSERT INTO realtime.schema_migrations VALUES (20241224161212, '2025-01-09 06:22:07');
INSERT INTO realtime.schema_migrations VALUES (20250107150512, '2025-01-09 06:22:08');
INSERT INTO realtime.schema_migrations VALUES (20250110162412, '2025-01-28 17:46:38');
INSERT INTO realtime.schema_migrations VALUES (20250123174212, '2025-01-28 17:46:39');
INSERT INTO realtime.schema_migrations VALUES (20250128220012, '2025-02-04 05:03:44');
INSERT INTO realtime.schema_migrations VALUES (20250506224012, '2025-05-22 09:26:39');
INSERT INTO realtime.schema_migrations VALUES (20250523164012, '2025-06-05 04:36:48');


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

INSERT INTO storage.buckets VALUES ('course-images', 'course-images', NULL, '2025-01-28 18:01:01.888623+00', '2025-01-28 18:01:01.888623+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

INSERT INTO storage.migrations VALUES (0, 'create-migrations-table', 'e18db593bcde2aca2a408c4d1100f6abba2195df', '2024-11-29 03:07:07.111345');
INSERT INTO storage.migrations VALUES (1, 'initialmigration', '6ab16121fbaa08bbd11b712d05f358f9b555d777', '2024-11-29 03:07:07.141693');
INSERT INTO storage.migrations VALUES (2, 'storage-schema', '5c7968fd083fcea04050c1b7f6253c9771b99011', '2024-11-29 03:07:07.163438');
INSERT INTO storage.migrations VALUES (3, 'pathtoken-column', '2cb1b0004b817b29d5b0a971af16bafeede4b70d', '2024-11-29 03:07:07.233105');
INSERT INTO storage.migrations VALUES (4, 'add-migrations-rls', '427c5b63fe1c5937495d9c635c263ee7a5905058', '2024-11-29 03:07:07.367262');
INSERT INTO storage.migrations VALUES (5, 'add-size-functions', '79e081a1455b63666c1294a440f8ad4b1e6a7f84', '2024-11-29 03:07:07.519831');
INSERT INTO storage.migrations VALUES (6, 'change-column-name-in-get-size', 'f93f62afdf6613ee5e7e815b30d02dc990201044', '2024-11-29 03:07:07.59824');
INSERT INTO storage.migrations VALUES (7, 'add-rls-to-buckets', 'e7e7f86adbc51049f341dfe8d30256c1abca17aa', '2024-11-29 03:07:07.625678');
INSERT INTO storage.migrations VALUES (8, 'add-public-to-buckets', 'fd670db39ed65f9d08b01db09d6202503ca2bab3', '2024-11-29 03:07:07.647203');
INSERT INTO storage.migrations VALUES (9, 'fix-search-function', '3a0af29f42e35a4d101c259ed955b67e1bee6825', '2024-11-29 03:07:07.666552');
INSERT INTO storage.migrations VALUES (10, 'search-files-search-function', '68dc14822daad0ffac3746a502234f486182ef6e', '2024-11-29 03:07:07.688981');
INSERT INTO storage.migrations VALUES (11, 'add-trigger-to-auto-update-updated_at-column', '7425bdb14366d1739fa8a18c83100636d74dcaa2', '2024-11-29 03:07:07.70731');
INSERT INTO storage.migrations VALUES (12, 'add-automatic-avif-detection-flag', '8e92e1266eb29518b6a4c5313ab8f29dd0d08df9', '2024-11-29 03:07:07.726662');
INSERT INTO storage.migrations VALUES (13, 'add-bucket-custom-limits', 'cce962054138135cd9a8c4bcd531598684b25e7d', '2024-11-29 03:07:07.746407');
INSERT INTO storage.migrations VALUES (14, 'use-bytes-for-max-size', '941c41b346f9802b411f06f30e972ad4744dad27', '2024-11-29 03:07:07.768603');
INSERT INTO storage.migrations VALUES (15, 'add-can-insert-object-function', '934146bc38ead475f4ef4b555c524ee5d66799e5', '2024-11-29 03:07:07.810694');
INSERT INTO storage.migrations VALUES (16, 'add-version', '76debf38d3fd07dcfc747ca49096457d95b1221b', '2024-11-29 03:07:07.826511');
INSERT INTO storage.migrations VALUES (17, 'drop-owner-foreign-key', 'f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101', '2024-11-29 03:07:07.843267');
INSERT INTO storage.migrations VALUES (18, 'add_owner_id_column_deprecate_owner', 'e7a511b379110b08e2f214be852c35414749fe66', '2024-11-29 03:07:07.865861');
INSERT INTO storage.migrations VALUES (19, 'alter-default-value-objects-id', '02e5e22a78626187e00d173dc45f58fa66a4f043', '2024-11-29 03:07:07.884207');
INSERT INTO storage.migrations VALUES (20, 'list-objects-with-delimiter', 'cd694ae708e51ba82bf012bba00caf4f3b6393b7', '2024-11-29 03:07:07.900555');
INSERT INTO storage.migrations VALUES (21, 's3-multipart-uploads', '8c804d4a566c40cd1e4cc5b3725a664a9303657f', '2024-11-29 03:07:07.921922');
INSERT INTO storage.migrations VALUES (22, 's3-multipart-uploads-big-ints', '9737dc258d2397953c9953d9b86920b8be0cdb73', '2024-11-29 03:07:07.96532');
INSERT INTO storage.migrations VALUES (23, 'optimize-search-function', '9d7e604cddc4b56a5422dc68c9313f4a1b6f132c', '2024-11-29 03:07:08.005536');
INSERT INTO storage.migrations VALUES (24, 'operation-function', '8312e37c2bf9e76bbe841aa5fda889206d2bf8aa', '2024-11-29 03:07:08.021504');
INSERT INTO storage.migrations VALUES (26, 'objects-prefixes', 'ef3f7871121cdc47a65308e6702519e853422ae2', '2025-03-31 11:31:14.438366');
INSERT INTO storage.migrations VALUES (27, 'search-v2', '33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2', '2025-03-31 11:31:14.510426');
INSERT INTO storage.migrations VALUES (28, 'object-bucket-name-sorting', '8f385d71c72f7b9f6388e22f6e393e3b78bf8617', '2025-03-31 11:31:14.526895');
INSERT INTO storage.migrations VALUES (29, 'create-prefixes', '8416491709bbd2b9f849405d5a9584b4f78509fb', '2025-03-31 11:31:14.536386');
INSERT INTO storage.migrations VALUES (30, 'update-object-levels', 'f5899485e3c9d05891d177787d10c8cb47bae08a', '2025-03-31 11:31:14.543369');
INSERT INTO storage.migrations VALUES (31, 'objects-level-index', '33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8', '2025-03-31 11:31:14.555589');
INSERT INTO storage.migrations VALUES (32, 'backward-compatible-index-on-objects', '2d51eeb437a96868b36fcdfb1ddefdf13bef1647', '2025-03-31 11:31:14.583194');
INSERT INTO storage.migrations VALUES (33, 'backward-compatible-index-on-prefixes', 'fe473390e1b8c407434c0e470655945b110507bf', '2025-03-31 11:31:14.594401');
INSERT INTO storage.migrations VALUES (34, 'optimize-search-function-v1', '82b0e469a00e8ebce495e29bfa70a0797f7ebd2c', '2025-03-31 11:31:14.596983');
INSERT INTO storage.migrations VALUES (35, 'add-insert-trigger-prefixes', '63bb9fd05deb3dc5e9fa66c83e82b152f0caf589', '2025-03-31 11:31:14.605974');
INSERT INTO storage.migrations VALUES (25, 'custom-metadata', 'd974c6057c3db1c1f847afa0e291e6165693b990', '2024-11-29 03:07:08.0366');


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

INSERT INTO storage.objects VALUES ('2f77714e-526f-4b75-ab02-a5b6669bad4e', 'course-images', '.emptyFolderPlaceholder', NULL, '2025-01-28 19:13:11.339042+00', '2025-03-31 11:31:14.539264+00', '2025-01-28 19:13:11.339042+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-01-28T19:13:12.000Z", "contentLength": 0, "httpStatusCode": 200}', DEFAULT, '3d634115-4553-43d2-a317-4461732f60ea', NULL, '{}', 1);
INSERT INTO storage.objects VALUES ('eb2eb58d-e0e4-4990-bc4d-b5f04f64b6c1', 'course-images', 'course-1738092121542-969717365.jpg', NULL, '2025-01-28 19:22:03.006917+00', '2025-03-31 11:31:14.539264+00', '2025-01-28 19:22:03.006917+00', '{"eTag": "\"776dc75bb38af27231d69d5b2da48146\"", "size": 133725, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-01-28T19:22:03.000Z", "contentLength": 133725, "httpStatusCode": 200}', DEFAULT, 'c92c8030-4d45-41f8-9283-31a04dfa5286', NULL, '{}', 1);


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: -
--

SELECT pg_catalog.setval('pgsodium.key_key_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

