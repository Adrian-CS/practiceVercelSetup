


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


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."assignees" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "email" "text"
);


ALTER TABLE "public"."assignees" OWNER TO "postgres";


ALTER TABLE "public"."assignees" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."assignees_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."documentos" (
    "id" bigint NOT NULL,
    "titulo" "text" NOT NULL,
    "cliente" "text",
    "fecha_limite" "date" NOT NULL,
    "estado" "text" DEFAULT 'pendiente'::"text" NOT NULL,
    "responsable_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "documentos_estado_check" CHECK (("estado" = ANY (ARRAY['pendiente'::"text", 'en_progreso'::"text", 'completado'::"text"])))
);


ALTER TABLE "public"."documentos" OWNER TO "postgres";


ALTER TABLE "public"."documentos" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."documentos_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "client" "text",
    "due_date" "date" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "assignee_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "documents_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'in_progress'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."documents" OWNER TO "postgres";


ALTER TABLE "public"."documents" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."documents_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."responsables" (
    "id" bigint NOT NULL,
    "nombre" "text" NOT NULL,
    "email" "text"
);


ALTER TABLE "public"."responsables" OWNER TO "postgres";


ALTER TABLE "public"."responsables" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."responsables_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."assignees"
    ADD CONSTRAINT "assignees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documentos"
    ADD CONSTRAINT "documentos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."responsables"
    ADD CONSTRAINT "responsables_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documentos"
    ADD CONSTRAINT "documentos_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "public"."responsables"("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "public"."assignees"("id");



ALTER TABLE "public"."assignees" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "auth_all_docs" ON "public"."documents" USING (("auth"."uid"() IS NOT NULL)) WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "auth_all_resp" ON "public"."assignees" USING (("auth"."uid"() IS NOT NULL)) WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "dev_all_docs" ON "public"."documentos" USING (true) WITH CHECK (true);



CREATE POLICY "dev_all_resp" ON "public"."responsables" USING (true) WITH CHECK (true);



ALTER TABLE "public"."documentos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."responsables" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





































































































































































GRANT ALL ON TABLE "public"."assignees" TO "anon";
GRANT ALL ON TABLE "public"."assignees" TO "authenticated";
GRANT ALL ON TABLE "public"."assignees" TO "service_role";



GRANT ALL ON SEQUENCE "public"."assignees_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."assignees_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."assignees_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."documentos" TO "anon";
GRANT ALL ON TABLE "public"."documentos" TO "authenticated";
GRANT ALL ON TABLE "public"."documentos" TO "service_role";



GRANT ALL ON SEQUENCE "public"."documentos_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."documentos_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."documentos_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."documents" TO "anon";
GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";



GRANT ALL ON SEQUENCE "public"."documents_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."documents_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."documents_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."responsables" TO "anon";
GRANT ALL ON TABLE "public"."responsables" TO "authenticated";
GRANT ALL ON TABLE "public"."responsables" TO "service_role";



GRANT ALL ON SEQUENCE "public"."responsables_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."responsables_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."responsables_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


