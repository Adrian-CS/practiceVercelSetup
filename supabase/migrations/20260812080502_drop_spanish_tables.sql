-- Remove the Spanish-named tables (documentos/responsables) now that the app
-- has moved to the English schema (documents/assignees).
drop table if exists "public"."documentos" cascade;
drop table if exists "public"."responsables" cascade;
